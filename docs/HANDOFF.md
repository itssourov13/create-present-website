# Handoff

## Run locally

    npm ci
    npm test
    npm start

Open http://127.0.0.1:4179/preview; set PORT=4180 if needed.

## GitHub repository root
The standalone implementation directory is already the local repository root. A clean repository should contain site-template/, scripts/, api/, docs/, vercel.json, package.json and package-lock.json. Generated dist/ remains ignored. The local branch is `main` and `origin` points to `https://github.com/itssourov13/create-present-website.git`.

The local commits are prepared but have not been pushed. From this directory, inspect and push them when ready:

    git status --short --branch
    git log -1 --oneline
    git push -u origin main

Do not push the enclosing forensic handoff or add its recovered forensic assets/manifests to this standalone repository.

## Vercel settings
Import the GitHub repository with its root directory set to the repository root. The committed vercel.json sets npm ci, npm run build, dist output, route handling and response security headers. No environment variables are needed for the static demo.

## Verified behavior
Local smoke tests validate routes, static assets, CSP/security headers, API fallback and method behavior, media range support and path containment. The default browser journey was exercised through opening the letter.

## Remaining limits
The app is a deploy-ready static reconstruction/demo, not the live production backend. Account login, persistent data, uploads, publishing and payments are not connected. Keep this limitation explicit in any public project description.
