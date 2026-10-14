const RESPONSE = {
  localDemo: true,
  error: "backend_unavailable",
  message: "The original private API was not recovered. This deployment does not contact production services."
};

export default function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Vary", "Accept-Encoding");

  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "GET, HEAD, OPTIONS");
    response.statusCode = 204;
    response.end();
    return;
  }

  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.setHeader("Allow", "GET, HEAD, OPTIONS");
    response.statusCode = 405;
    response.end(JSON.stringify({ ...RESPONSE, error: "method_not_allowed" }));
    return;
  }

  response.statusCode = 501;
  response.end(request.method === "HEAD" ? undefined : JSON.stringify(RESPONSE));
}
