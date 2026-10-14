# Architecture

## Build flow
site-template/ is the complete, self-contained static input bundle. npm run build removes and recreates dist/, copies the template and writes an implementation manifest. The build uses Node built-ins only, reads no parent paths and has no build-time network dependency.

## Runtime
- scripts/server.mjs serves dist/ locally with correct MIME types, range support, local-only API behavior, headers and a custom 404.
- Vercel serves the same static dist/ bundle.
- api/unavailable.js is a serverless fallback for every /api/* route and never connects to a production backend.
- scripts/smoke-test.mjs tests route status/content, resource availability, configuration contracts, API method handling, CSP, media byte ranges and path traversal protections.

## Vercel routing
vercel.json maps dynamic /created/:id URLs to the local placeholder, /j/:id to a 404 state, /create-birthday to the captured 404 state, /api/* to the unavailable handler, and unmatched paths to 404.html. The filesystem handling step is intentionally ordered before the final catch-all so committed static assets can still resolve. Vercel's current configuration reference marks the legacy `handle: "filesystem"` route property as deprecated; it remains in this route table to preserve its existing ordered-routing behavior and should be revalidated against the hosted preview before any routing migration. See https://vercel.com/docs/project-configuration/vercel-json. Security headers are attached at the deployment edge.

## Security boundaries
The CSP permits only same-origin network requests (plus data/blob resources), disables framing, and blocks external analytics connections. No production key or private backend configuration is needed. UI actions requiring authentication, upload, publish, delete or payment are guarded as local-demo actions.

## Source evidence boundary
Original forensic bundles and route captures remain in the parent handoff, outside this standalone repository. The self-contained bundle includes only the prepared runtime pages/assets required for build and deployment. Do not reintroduce references to sibling or parent directories in build scripts.
