import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = path.join(ROOT, "site-template");
const DIST = path.join(ROOT, "dist");

const ROUTES = [
  { route: "/", file: "index.html", expectedStatus: 200 },
  { route: "/new", file: "new/index.html", expectedStatus: 200 },
  { route: "/preview", file: "preview/index.html", expectedStatus: 200 },
  { route: "/create", file: "create/index.html", expectedStatus: 200 },
  { route: "/create-anniversary", file: "create-anniversary/index.html", expectedStatus: 200 },
  { route: "/create-proposal", file: "create-proposal/index.html", expectedStatus: 200 },
  { route: "/create-apology", file: "create-apology/index.html", expectedStatus: 200 },
  { route: "/create-custom", file: "create-custom/index.html", expectedStatus: 200 },
  { route: "/create-rakhi", file: "create-rakhi/index.html", expectedStatus: 200 },
  { route: "/create-birthday", file: "create-birthday/index.html", expectedStatus: 404 },
  { route: "/dashboard", file: "dashboard/index.html", expectedStatus: 200 },
  { route: "/terms", file: "terms/index.html", expectedStatus: 200 },
  { route: "/privacy", file: "privacy/index.html", expectedStatus: 200 },
  { route: "/refund", file: "refund/index.html", expectedStatus: 200 }
];

async function listFiles(directory) {
  const result = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(absolute));
    else if (entry.isFile()) result.push(absolute);
  }
  return result;
}

async function requireFile(filePath, label) {
  try {
    const info = await stat(filePath);
    if (!info.isFile() || info.size === 0) throw new Error("not a non-empty file");
  } catch (error) {
    throw new Error(`Required ${label} is missing or empty: ${filePath}`, { cause: error });
  }
}

await requireFile(path.join(TEMPLATE, "index.html"), "homepage template");
await requireFile(path.join(TEMPLATE, "new/index.html"), "occasion-picker template");
await requireFile(path.join(TEMPLATE, "preview/index.html"), "preview template");
await requireFile(path.join(TEMPLATE, "local-demo.js"), "local safety guard");
await requireFile(path.join(TEMPLATE, "local-disabled-analytics.js"), "analytics no-op");
await requireFile(path.join(TEMPLATE, "404.html"), "custom 404 page");

for (const route of ROUTES) {
  await requireFile(path.join(TEMPLATE, route.file), `route ${route.route}`);
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await cp(TEMPLATE, DIST, { recursive: true, errorOnExist: false });

const routeManifest = ROUTES.map(({ route, file, expectedStatus }) => ({
  route,
  file,
  expectedStatus
}));
const files = await listFiles(DIST);
const manifest = {
  builtAt: new Date().toISOString(),
  mode: "standalone static reconstruction; no production API connectivity",
  sourceRoot: "site-template/",
  routeCount: routeManifest.length,
  routes: routeManifest,
  fileCount: files.length,
  totalBytes: 0,
  apiPolicy: "Vercel /api/* handler returns 501; does not proxy to production",
  externalConnections: "blocked by Content-Security-Policy",
  originalForensicEvidenceIncluded: false
};
let totalBytes = 0;
for (const file of files) totalBytes += (await stat(file)).size;
manifest.totalBytes = totalBytes;
await writeFile(
  path.join(DIST, "implementation-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log("Standalone static site built from site-template/.");
console.log(`  Routes: ${routeManifest.length}`);
console.log(`  Files: ${files.length + 1}`);
console.log(`  Output size: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
console.log("  Production API/OAuth/publishing/payments: disabled");
console.log("  Parent forensic folders required: no");
