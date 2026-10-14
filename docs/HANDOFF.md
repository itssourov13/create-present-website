# Handoff

## Run locally

    npm ci
    npm test
    npm start

Open http://127.0.0.1:4179/preview; set PORT=4180 if needed.

## GitHub repository root
The standalone implementation directory is already the local repository root. A clean repository should contain site-template/, scripts/, api/, docs/, vercel.json, package.json and package-lock.json. Generated dist/ remains ignored. The baseline main branch is synchronized with origin/main, and origin points to https://github.com/itssourov13/create-present-website.git.

For a working branch, inspect and push the current branch when ready:

    git status --short --branch
    git log -1 --oneline
    git push -u origin HEAD

Do not push the enclosing forensic handoff or add its recovered forensic assets/manifests to this standalone repository.

## Vercel settings
The supplied URL https://cgw-itssourov13.vercel.app/ responded HTTP 200 during a read-only check but still served old contact links. Push/merge the updated branch and confirm Vercel builds the new commit. The committed vercel.json sets npm ci, npm run build, dist output, route handling and response security headers. No environment variables are needed for the static demo.

## Verified behavior
Local smoke tests validate routes, static assets, CSP/security headers, API fallback and method behavior, media range support and path containment. The default browser journey was exercised through opening the letter.

## Remaining limits
The app is a deploy-ready static reconstruction/demo, not the live production backend. Account login, persistent data, uploads, publishing and payments are not connected. Keep this limitation explicit in any public project description.
