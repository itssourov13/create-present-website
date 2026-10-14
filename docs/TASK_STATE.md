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
- [x] Restore the captured 2_p-ejallkmfs.js chunk required by site-template/j/index.html.
- [x] Add smoke-test coverage for missing local static asset references in HTML/CSS and serve the restored chunk as JavaScript.
- [x] Align publication/deployment docs with the already initialized local main branch, configured remote, and npm ci command.
- [x] Keep the main forensic recovered-src/ and original reference/ evidence folders unchanged.

## Publication and hosted verification still required
- [x] Initialize the local repository on `main` and configure `origin` for `itssourov13/create-present-website`.
- [x] Create the local initial standalone commit and verify a clean worktree.
- [x] Confirm the baseline main commit is synchronized with origin/main before creating this feature branch.
- [x] Replace captured social profile, contact email, WhatsApp phone, footer credit, structured website URL and homepage canonical with the supplied values.
- [x] Extend smoke tests to check owner links on captured routes and fail if old personal/live-site values remain in the generated bundle.
- [ ] User pushes `feat/personal-social-links` and merges it into `main`.
- [ ] Deploy the merged commit to the supplied Vercel project and inspect build logs.
- [ ] Smoke test the hosted personal links plus /, /new, /preview, /created/demo, /j/TESTID, /api/health and an unknown path.

## Known test coverage gaps
- Full OAuth/account/database/upload/publish/payment behavior is outside this static reconstruction.
- Browser automation exercised the default birthday journey through its opened letter, not every other occasion's full gesture sequence.
