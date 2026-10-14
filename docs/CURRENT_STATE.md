# Current State

Audit date: 2026-10-14 (Asia/Dhaka).

## Standalone status
- This directory is self-contained and suitable to use as a separate GitHub repository root.
- npm ci works with the committed lockfile; no third-party npm packages are required.
- npm test builds the static bundle, syntax-checks project JS, validates vercel.json and the API handler contract, and runs local route/resource/security checks.
- Build copies the standalone site-template/ into dist/; it has no parent-workspace path dependencies and performs no network fetch.
- Prepared site template is about 20 MB; current generated output is about 19.36 MiB with 14 route mappings, 66 referenced HTML/CSS asset paths and 11 default journey media assets.
- Vercel deployment config specifies npm ci, npm run build and output directory dist.
- /api/* is deliberately unavailable (HTTP 501); OAuth, persistent storage, uploads, publish and payment integrations are not connected.

## Live audit carried into this package
The parent forensic workspace rechecked the homepage and /preview captures by SHA-256 and compared ten additional captured routes against fresh live responses. It also captured /new and found no unresolved ordinary static asset paths in the inventoried default pages. The source evidence folders themselves are not included in this standalone repository; see LOCAL_LIVE_PARITY.md for the audit record.

## Git/deploy status
- No remote Git repository has been configured and no push has been performed.
- Vercel has not been linked to an account or deployed from this workspace.
- The static build/configuration and local smoke checks are prepared; the actual GitHub connection and hosted deployment remain user actions.

## Limits
The full private backend, source maps, user records and arbitrary user-uploaded journeys were not recovered. Microphone candle blowing and all Rakhi gestures are not exhaustively covered by browser automation. Describe this as a deploy-ready static reconstruction/demo, not a replacement for the live production service.
