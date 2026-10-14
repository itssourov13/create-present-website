# Project Context

## Purpose
This standalone repository packages a faithful static reconstruction of CreateGiftWebsite's recovered public frontend, with /preview as the main interactive fidelity target. Keep the captured design, route intent and existing browser code; avoid a redesign or architecture migration.

## Repository boundary
This folder is the repository root for GitHub and Vercel. It must build without the parent claude-codex-handoff, its recovered-src/, parent reference/, or any sibling workspace.

## Included assets
- site-template/ contains the self-contained prepared HTML, JS, CSS, fonts, icons, images, audio and route pages.
- scripts/build.mjs copies that package to generated dist/.
- api/unavailable.js deliberately returns a local-backend-unavailable response; no production service is proxied.
- docs/LOCAL_LIVE_PARITY.md records the wider live-vs-capture audit performed before packaging.

## Scope
The homepage, occasion chooser, gift preview, captured occasion builders, dashboard shell and legal pages are shipped. Dynamic records and private backend-dependent functions are not reconstructed as real production services.

## Fidelity priorities
1. Preserve /preview and the default birthday journey.
2. Preserve route captures and their existing first-party asset references.
3. Keep the current observed /create-birthday 404 behavior.
4. Make missing records/API actions explicit rather than simulating successful production writes.
