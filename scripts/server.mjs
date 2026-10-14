import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 4179);
const mime = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".mp3": "audio/mpeg",
  ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain; charset=utf-8"
};
const csp = [
  "default-src 'self' data: blob:", "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "font-src 'self' data:",
  "media-src 'self' data: blob:", "connect-src 'self' data: blob:", "frame-src 'self' blob:",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'"
].join("; ");

function sendText(res, status, content, extra = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store", ...extra
  });
  res.end(content);
}
function sendLocalApi(res) {
  const body = JSON.stringify({
    localDemo: true,
    error: "backend_unavailable",
    message: "The original private API was not recovered. This route does not contact production services."
  });
  res.writeHead(501, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": String(Buffer.byteLength(body)),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": csp
  });
  res.end(body);
}
function resolveRequest(pathname, query) {
  if (pathname === "/_next/image") {
    const imageUrl = query.get("url") || "";
    if (!imageUrl.startsWith("/") || imageUrl.startsWith("//")) return { error: 400 };
    pathname = imageUrl;
  }
  if (pathname === "/created" || pathname.startsWith("/created/")) {
    return { file: path.join(DIST, "created/index.html"), status: 200 };
  }
  if (pathname === "/j" || pathname.startsWith("/j/")) {
    return { file: path.join(DIST, "j/index.html"), status: 404 };
  }
  if (pathname === "/create-birthday" || pathname === "/create-birthday/") {
    return { file: path.join(DIST, "create-birthday/index.html"), status: 404 };
  }
  let rel;
  if (pathname === "/" || pathname === "") rel = "index.html";
  else {
    rel = pathname.replace(/^\/+/, "");
    if (rel.endsWith("/")) rel += "index.html";
    else if (!path.posix.extname(rel)) rel += "/index.html";
  }
  const file = path.resolve(DIST, rel);
  if (file !== DIST && !file.startsWith(DIST + path.sep)) return { error: 403 };
  return { file, status: 200 };
}
const server = http.createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method || "")) {
    res.setHeader("Allow", "GET, HEAD");
    sendText(res, 405, "Method not allowed");
    return;
  }
  let url;
  try { url = new URL(req.url || "/", "http://" + HOST + ":" + PORT); }
  catch { sendText(res, 400, "Bad request"); return; }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { sendText(res, 400, "Bad URL encoding"); return; }
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    sendLocalApi(res);
    return;
  }
  const route = resolveRequest(pathname, url.searchParams);
  if (route.error) { sendText(res, route.error, "Invalid local resource URL"); return; }
  let file = route.file;
  let responseStatus = route.status ?? 200;
  if (!file || (file !== DIST && !file.startsWith(DIST + path.sep))) {
    sendText(res, 403, "Forbidden");
    return;
  }
  let info;
  try {
    info = await stat(file);
    if (!info.isFile()) throw new Error("not a file");
  } catch {
    file = path.join(DIST, "404.html");
    responseStatus = 404;
    try {
      info = await stat(file);
      if (!info.isFile()) throw new Error("404 template is not a file");
    } catch {
      sendText(res, 404, "Not found");
      return;
    }
  }
  const headers = {
    "Content-Type": mime[path.extname(file).toLowerCase()] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": csp,
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(self), browsing-topics=(), payment=()",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Accept-Ranges": "bytes",
    "Cache-Control": file.includes(path.sep + "_next" + path.sep)
      ? "public, max-age=31536000, immutable"
      : "no-store"
  };
  let start = 0;
  let end = info.size - 1;
  let status = responseStatus;
  const range = req.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      res.writeHead(416, { "Content-Range": "bytes */" + info.size });
      res.end();
      return;
    }
    if (!match[1]) {
      const suffix = Number(match[2]);
      if (!Number.isSafeInteger(suffix) || suffix <= 0) {
        res.writeHead(416, { "Content-Range": "bytes */" + info.size });
        res.end();
        return;
      }
      start = Math.max(0, info.size - suffix);
    } else {
      start = Number(match[1]);
      end = match[2] ? Number(match[2]) : info.size - 1;
    }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= info.size) {
      res.writeHead(416, { "Content-Range": "bytes */" + info.size });
      res.end();
      return;
    }
    end = Math.min(end, info.size - 1);
    status = 206;
    headers["Content-Range"] = "bytes " + start + "-" + end + "/" + info.size;
    headers["Cache-Control"] = "no-store";
  }
  headers["Content-Length"] = String(end - start + 1);
  res.writeHead(status, headers);
  if (req.method === "HEAD") { res.end(); return; }
  const stream = createReadStream(file, { start, end });
  stream.on("error", () => {
    if (!res.headersSent) sendText(res, 500, "Read error");
    else res.destroy();
  });
  stream.pipe(res);
});
server.listen(PORT, HOST, () => {
  console.log("CreateGiftWebsite local reconstruction: http://" + HOST + ":" + PORT + "/");
  console.log("Preview: http://" + HOST + ":" + PORT + "/preview");
  console.log("Mode: static local demo; external connections and production API are blocked.");
});
