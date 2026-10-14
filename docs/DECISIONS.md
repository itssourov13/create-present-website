# Decisions

## D-001 — Standalone repository boundary
The contents of this implementation directory are the intended GitHub repository root. Do not push the enclosing forensic handoff as the public production repository.

## D-002 — Vendor required frontend assets
The prepared site-template/ bundle keeps all required HTML, JS, CSS, font, image and audio inputs inside the repo so clean clone builds are independent of forensic folders.

## D-003 — Static reconstruction, not backend replacement
Private APIs, account data, storage, OAuth, publish and payments were not recovered. The app returns explicit unavailable behavior instead of proxying requests or pretending writes succeeded.

## D-004 — Preserve live route behavior
The observed /create-birthday response is a 404; /create is the birthday builder. A /j/:id path without a real saved record also remains not found.

## D-005 — Edge headers and explicit routes
Vercel config carries security headers and ordered route mapping to preserve not-found status codes and keep API traffic isolated.

## D-006 — Keep push/deploy under user control
The local Git repository is initialized on `main` and `origin` points to `https://github.com/itssourov13/create-present-website.git`. Commits remain local until the user pushes them. No Vercel project has been linked and no deployment has been created from this workspace.
