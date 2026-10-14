# Changelog

## 2026-10-14 — Standalone GitHub/Vercel preparation
- Converted the implementation into an independent static build with all required runtime resources under site-template/.
- Removed build-time dependency on the parent forensic package and sibling workspace.
- Added Vercel build/output configuration, security headers, dynamic route rules and a demo-safe API fallback.
- Added custom not-found handling, lockfile, git attributes/ignore rules and a standalone README.
- Expanded smoke tests to validate Vercel configuration, API handler contracts and not-found behavior.
- Synchronized standalone docs with the verified current state.
- No Git repository was initialized, no remote configured, and nothing pushed or deployed.
