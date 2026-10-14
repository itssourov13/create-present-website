import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile, readdir, stat } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const manifest = JSON.parse(await readFile(path.join(DIST, "implementation-manifest.json"), "utf8"));
const vercel = JSON.parse(await readFile(path.join(ROOT, "vercel.json"), "utf8"));

assert.equal(manifest.routes.length, 14);
assert.match(manifest.mode, /standalone static reconstruction/);
assert.equal(manifest.sourceRoot, "site-template/");
assert.equal(vercel.outputDirectory, "dist");
assert.equal(vercel.buildCommand, "npm run build");
assert.ok(vercel.routes.some((route) => route.src === "^/api(?:/.*)?$" && route.dest === "/api/unavailable.js"));
assert.ok(vercel.routes.some((route) => route.src === "^/create-birthday/?$" && route.status === 404));
assert.ok(vercel.headers.some((rule) => rule.headers?.some((header) => header.key === "Content-Security-Policy")));
assert.ok(!("rewrites" in vercel), "the deployment uses an explicit, ordered route table");

for (const relative of [
  "index.html", "new/index.html", "preview/index.html", "create/index.html",
  "create-anniversary/index.html", "create-proposal/index.html", "create-apology/index.html",
  "create-custom/index.html", "create-rakhi/index.html", "create-birthday/index.html",
  "dashboard/index.html", "terms/index.html", "privacy/index.html", "refund/index.html",
  "created/index.html", "j/index.html", "404.html", "local-demo.js",
  "local-disabled-analytics.js", "_next/static/chunks/3ox-l-8b88rzc.js",
  "_next/static/chunks/2_p-ejallkmfs.js",
  "_next/static/chunks/3klunzeywsa48.css",
  "_next/static/media/03bda585a99c6450-s.p.32sris142tqlb.woff2",
  "giftweblogoo.png", "memory1.png", "memory2.png", "memory3.png", "memory4.png",
  "puzzle.png", "rakhi-memory1.svg", "rakhi-memory2.svg", "rakhi-memory3.svg",
  "rakhi-memory4.svg", "song.mp3", "raksha_bandhan.mp3"
]) {
  await stat(path.join(DIST, relative));
}

// Check every local static asset URL embedded in HTML/CSS so the deployed bundle
// cannot silently omit a referenced chunk, stylesheet, font, image, or media file.
async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}
const staticAssetExtension = /\.(?:m?js|css|woff2?|ttf|otf|png|jpe?g|webp|avif|svg|ico|mp3|mp4|webm|webmanifest|json)$/i;
const templateFiles = await collectFiles(path.join(ROOT, "site-template"));
const localAssetReferences = new Set();
for (const file of templateFiles) {
  if (!/\.(?:html|css)$/i.test(file)) continue;
  const source = await readFile(file, "utf8");
  const references = [
    ...source.matchAll(/(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi)
  ].map((match) => match[1]);
  if (file.endsWith(".css")) {
    references.push(...[...source.matchAll(/url\(\s*["']?([^)"'\s]+)["']?\s*\)/gi)].map((match) => match[1]));
  }
  for (const reference of references) {
    if (!reference.startsWith("/") || reference.startsWith("//")) continue;
    const pathname = reference.split(/[?#]/, 1)[0];
    if (!staticAssetExtension.test(pathname)) continue;
    localAssetReferences.add(pathname);
    try {
      await stat(path.join(DIST, pathname.replace(/^\/+/, "")));
    } catch {
      assert.fail("Missing local static asset " + pathname + ", referenced by " + path.relative(ROOT, file));
    }
  }
}
assert.ok(localAssetReferences.has("/_next/static/chunks/2_p-ejallkmfs.js"));

const previewHtml = await readFile(path.join(DIST, "preview/index.html"), "utf8");
assert.match(previewHtml, /A surprise awaits you/);
assert.match(previewHtml, /local-demo\.js/);
assert.doesNotMatch(previewHtml, /googletagmanager\.com\/gtag\/js|connect\.facebook\.net\/signals/);
const newHtml = await readFile(path.join(DIST, "new/index.html"), "utf8");
assert.match(newHtml, /Choose an occasion/);
assert.match(newHtml, /3ox-l-8b88rzc\.js/);
const rootHtml = await readFile(path.join(DIST, "index.html"), "utf8");
assert.match(rootHtml, /Build a.*magical|gift they.ll never forget|CreateGiftWebsite/i);
assert.match(rootHtml, /href="https:\/\/instagram\.com\/md\.sourov\.mondol630"/);
assert.match(rootHtml, /href="https:\/\/youtube\.com\/@heart_hacker1313"/);
assert.match(rootHtml, /href="mailto:sourovmondolb@gmail\.com"/);
assert.match(rootHtml, /href="https:\/\/wa\.me\/8801877060324/);

// Guard the explicitly configured owner contacts/URLs across both visible HTML
// and embedded client hydration payloads so stale live-site details cannot return.
const expectedPersonalLinks = [
  ["index.html", "https://instagram.com/md.sourov.mondol630"],
  ["index.html", "https://youtube.com/@heart_hacker1313"],
  ["index.html", "mailto:sourovmondolb@gmail.com"],
  ["index.html", "https://wa.me/8801877060324"],
  ["index.html", "Sourov. All rights reserved."],
  ["index.html", 'href="https://cgw-itssourov13.vercel.app/"'],
  ["privacy/index.html", "mailto:sourovmondolb@gmail.com"],
  ["terms/index.html", "mailto:sourovmondolb@gmail.com"],
  ["refund/index.html", "mailto:sourovmondolb@gmail.com"],
  ["_next/static/chunks/0nspch0e5y8m_.js", '"8801877060324"']
];
for (const [relative, expected] of expectedPersonalLinks) {
  const contents = await readFile(path.join(DIST, relative), "utf8");
  assert.ok(contents.includes(expected), relative + " must include configured personal URL/contact: " + expected);
}
const socialMetadataRoutes = [
  "index.html", "new/index.html", "preview/index.html", "create/index.html",
  "create-anniversary/index.html", "create-proposal/index.html", "create-apology/index.html",
  "create-custom/index.html", "create-rakhi/index.html", "create-birthday/index.html",
  "dashboard/index.html", "j/index.html", "terms/index.html", "privacy/index.html", "refund/index.html"
];
for (const route of socialMetadataRoutes) {
  const contents = await readFile(path.join(DIST, route), "utf8");
  assert.ok(contents.includes("https://instagram.com/md.sourov.mondol630"), route + " Instagram structured metadata");
  assert.ok(contents.includes("https://youtube.com/@heart_hacker1313"), route + " YouTube structured metadata");
  assert.ok(contents.includes("https://cgw-itssourov13.vercel.app"), route + " website structured metadata");
}
const stalePersonalMarkers = [
  "instagram.com/adibiwebtech",
  "youtube.com/channel/UCIrkEEfeno5jdWxhPU_-xhQ",
  "adibiwebtech@gmail.com",
  "919328337531",
  "Adibi Webtech",
  "creategiftwebsite.com"
];
for (const file of templateFiles) {
  if (!/\.(?:html|js|css|json|webmanifest|txt)$/i.test(file)) continue;
  const relative = path.relative(path.join(ROOT, "site-template"), file);
  const contents = await readFile(path.join(DIST, relative), "utf8");
  for (const stale of stalePersonalMarkers) {
    assert.ok(!contents.toLowerCase().includes(stale.toLowerCase()),
      "Stale personal/live-site value " + stale + " remains in " + path.relative(ROOT, file));
  }
}
console.log("PASS: supplied social/contact details and deployment URL verified; stale live-site contact values absent.");

const vercelApi = (await import("../api/unavailable.js")).default;
function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    end(body) { this.body = body; }
  };
}
const apiResponse = mockResponse();
vercelApi({ method: "GET" }, apiResponse);
assert.equal(apiResponse.statusCode, 501);
assert.equal(apiResponse.headers["cache-control"], "no-store");
assert.equal(JSON.parse(apiResponse.body).localDemo, true);
const apiHead = mockResponse();
vercelApi({ method: "HEAD" }, apiHead);
assert.equal(apiHead.statusCode, 501);
assert.equal(apiHead.body, undefined);
const apiPost = mockResponse();
vercelApi({ method: "POST" }, apiPost);
assert.equal(apiPost.statusCode, 405);
const apiOptions = mockResponse();
vercelApi({ method: "OPTIONS" }, apiOptions);
assert.equal(apiOptions.statusCode, 204);

async function getFreePort() {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const port = listener.address().port;
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  return port;
}

const port = await getFreePort();
const origin = "http://127.0.0.1:" + port;
const server = spawn(process.execPath, [path.join(ROOT, "scripts/server.mjs")], {
  cwd: ROOT,
  env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
  stdio: "ignore"
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 35; attempt += 1) {
    try {
      const response = await fetch(origin + "/preview");
      if (response.status === 200) { ready = true; break; }
    } catch { /* server-start race */ }
    await delay(100);
  }
  assert.ok(ready, "local static server failed to start");

  const routes = [
    ["/", 200, /CreateGiftWebsite|gift/i],
    ["/new", 200, /Choose an occasion/],
    ["/preview", 200, /A surprise awaits you/],
    ["/preview/", 200, /A surprise awaits you/],
    ["/create", 200, /CreateGiftWebsite/],
    ["/create-anniversary", 200, /CreateGiftWebsite/],
    ["/create-proposal", 200, /CreateGiftWebsite/],
    ["/create-apology", 200, /CreateGiftWebsite/],
    ["/create-custom", 200, /CreateGiftWebsite/],
    ["/create-rakhi", 200, /CreateGiftWebsite/],
    ["/create-birthday", 404, /404/],
    ["/dashboard", 200, /My gifts/],
    ["/terms", 200, /Terms of Service/],
    ["/privacy", 200, /Privacy Policy/],
    ["/refund", 200, /Refund/],
    ["/created/demo", 200, /not in the local capture|LOCAL DEMO/],
    ["/j/TESTID", 404, /Not found|does not exist|not available/],
    ["/definitely-not-a-real-page", 404, /Page not found|not available/]
  ];
  for (const [route, expectedStatus, expectedBody] of routes) {
    const response = await fetch(origin + route, { redirect: "manual" });
    assert.equal(response.status, expectedStatus, route + " status");
    const body = await response.text();
    assert.match(body, expectedBody, route + " content");
    assert.match(response.headers.get("content-security-policy") || "", /connect-src 'self'/, route + " CSP");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }

  for (const [route, contentType] of [
    ["/_next/static/chunks/3ox-l-8b88rzc.js", /javascript/],
    ["/_next/static/chunks/2_p-ejallkmfs.js", /javascript/],
    ["/_next/static/chunks/3klunzeywsa48.css", /text\/css/],
    ["/_next/static/media/03bda585a99c6450-s.p.32sris142tqlb.woff2", /font\/woff2/],
    ["/giftweblogoo.png", /image\/png/],
    ["/memory1.png", /image\/png/],
    ["/rakhi-memory1.svg", /image\/svg\+xml/],
    ["/song.mp3", /audio\/mpeg/],
    ["/local-demo.js", /javascript/]
  ]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") || "", contentType, route + " MIME type");
  }

  const rangeResponse = await fetch(origin + "/song.mp3", { headers: { Range: "bytes=0-15" } });
  assert.equal(rangeResponse.status, 206);
  assert.equal((await rangeResponse.arrayBuffer()).byteLength, 16);
  assert.match(rangeResponse.headers.get("content-range") || "", /^bytes 0-15\/\d+$/);

  const api = await fetch(origin + "/api/journeys");
  assert.equal(api.status, 501);
  assert.equal((await api.json()).localDemo, true);

  const traversal = await fetch(origin + "/%2e%2e%2fREADME.md");
  assert.equal(traversal.status, 403);
  const method = await fetch(origin + "/preview", { method: "POST" });
  assert.equal(method.status, 405);
} finally {
  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), delay(1500)]);
  if (server.exitCode === null) server.kill("SIGKILL");
}
console.log("PASS: standalone build manifest, Vercel config and serverless API contract.");
console.log("PASS: all public routes, route status handling, and static 404 fallback.");
console.log("PASS: " + localAssetReferences.size + " distinct local HTML/CSS asset references resolve; fonts, images/audio, and content types verified.");
console.log("PASS: CSP/security headers, demo-safe API responses, range support and path containment.");
console.log("NOTE: Hosted Vercel build/routing still requires a user-initiated push and preview deployment.");
