# Handoff

## Run locally

    npm ci
    npm test
    npm start

Open http://127.0.0.1:4179/preview; set PORT=4180 if needed.

## GitHub repository root
Publish the contents of this implementation directory, not the parent claude-codex-handoff folder. A clean repository should contain site-template/, scripts/, api/, docs/, vercel.json, package.json and package-lock.json. Generated dist/ remains ignored.

Suggested first publication commands, after creating an empty repository and substituting its remote URL:

    git init
    git add .
    git status --short
    git commit -m "Prepare standalone reconstruction for Vercel"
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
    git push -u origin main

Do not copy the angle-bracket placeholder literally. Review git status before committing; do not add the enclosing handoff's recovered forensic assets or manifests to this repository.

## Vercel settings
Import the GitHub repository with its root directory set to the repository root. The committed vercel.json sets npm ci, npm run build, dist output, route handling and response security headers. No environment variables are needed for the static demo.

## Verified behavior
Local smoke tests validate routes, static assets, CSP/security headers, API fallback and method behavior, media range support and path containment. The default browser journey was exercised through opening the letter.

## Remaining limits
The app is a deploy-ready static reconstruction/demo, not the live production backend. Account login, persistent data, uploads, publishing and payments are not connected. Keep this limitation explicit in any public project description.
