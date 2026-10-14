# Task State

## Completed
- [x] Package prepared static output under site-template/.
- [x] Remove build-time references to parent recovered source, parent route captures and sibling workspace media.
- [x] Replace the forensic asset collector with a no-network standalone build.
- [x] Add vercel.json, static security headers, ordered routes and Vercel API fallback.
- [x] Add api/unavailable.js with 501 / 405 / OPTIONS behavior; no production network calls.
- [x] Add custom 404 page, .gitignore, .gitattributes, package.json and reproducible lockfile.
- [x] Add standalone docs and retain parity audit record.
- [x] Run build from the standalone folder and verify required template resources.
- [x] Run npm ci, npm run lint and npm test successfully.
- [x] Verify /preview, /new, builder, legal and dynamic placeholder routes in local smoke tests.
- [x] Validate Vercel configuration as JSON and check expected route/header/API contracts.
- [x] Keep the main forensic recovered-src/ and original reference/ evidence folders unchanged.

## Manual deployment still required
- [ ] Create an empty GitHub repository and push the contents of this directory as its root.
- [ ] Connect that repository to Vercel; root directory should be repository root.
- [ ] Confirm a hosted preview deployment and inspect Vercel build/routing logs.
- [ ] Smoke test hosted /, /new, /preview, /created/demo, /j/TESTID, /api/health and an unknown path.

## Known test coverage gaps
- Full OAuth/account/database/upload/publish/payment behavior is outside this static reconstruction.
- Browser automation exercised the default birthday journey through its opened letter, not every other occasion's full gesture sequence.
