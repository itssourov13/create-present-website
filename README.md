# CreateGiftWebsite — Standalone Reconstruction

A standalone, deploy-ready **static reconstruction/demo** assembled from the recovered public frontend experience. This repository includes its own runtime site bundle, build script, local server, Vercel configuration, demo-safe API fallback and verification suite. It does not depend on the parent forensic handoff or a sibling workspace.

> **Important scope:** this is a static reconstruction, not the original production service. The private backend, accounts, database, storage, OAuth, publishing and payment systems were not recovered. Those features remain deliberately disabled and are never proxied to the live production site.

## Quick start

Requirements: Node.js 22.x.

```bash
npm ci
npm test
npm start
```

Open:

- Homepage: http://127.0.0.1:4179/
- Occasion picker: http://127.0.0.1:4179/new
- Recovered interactive gift: http://127.0.0.1:4179/preview

Use `PORT=4180 npm start` to change the local port. The local server binds to `127.0.0.1` by default.

## GitHub and Vercel

**Use the contents of this directory as the repository root.** Do not use `claude-codex-handoff/` as the Vercel root when deploying this standalone option.

The Vercel project configuration is already included in `vercel.json`:

- Framework preset: Other / `null`
- Install command: `npm install --ignore-scripts`
- Build command: `npm run build`
- Output directory: `dist`
- Static route mappings, local API fallback and security headers are configured.
- Generated `dist/` and local `.vercel/` metadata are git-ignored.

To publish, create an empty GitHub repository, then from this directory initialize Git, create the initial commit and push your chosen default branch. Connect that repository to Vercel with its root set to the repository root. No environment variables or production API credentials are required for this static demo.

## Included routes

| Path | Behavior |
|---|---|
| `/` | Recovered homepage |
| `/new` | Captured occasion picker |
| `/preview` | Recovered interactive journey |
| `/create` | Birthday builder capture |
| `/create-anniversary` | Anniversary builder capture |
| `/create-proposal` | Proposal builder capture |
| `/create-apology` | Apology builder capture |
| `/create-custom` | Custom occasion capture |
| `/create-rakhi` | Rakhi builder capture |
| `/dashboard` | Dashboard capture shell |
| `/terms`, `/privacy`, `/refund` | Captured legal pages |
| `/created/:id` | Local placeholder; no real published record |
| `/j/:id` | Missing-record page with HTTP 404 |
| `/create-birthday` | HTTP 404, matching the observed current live route |
| `/api/*` | HTTP 501 JSON; no production backend proxy |
| Unknown paths | Custom HTTP 404 page |

The public browser journey was exercised locally through gift opening, PIN entry, intro, cake/candle, memories, balloon wishes, puzzle completion, scratch-card reveal and letter opening. Not every builder variant or gesture has exhaustive browser coverage.

## Repository layout

```text
.
├── README.md
├── vercel.json
├── package.json
├── package-lock.json
├── .gitignore
├── .gitattributes
├── api/
│   └── unavailable.js
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── CURRENT_STATE.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── TASK_STATE.md
│   ├── CHANGELOG.md
│   ├── HANDOFF.md
│   └── LOCAL_LIVE_PARITY.md
├── scripts/
│   ├── build.mjs
│   ├── server.mjs
│   └── smoke-test.mjs
├── site-template/          # self-contained static build input (~20 MB)
└── dist/                   # generated output; not committed
```

## Build and verification

```bash
npm run build
npm run lint
npm test
```

The build copies the prepared standalone bundle from `site-template/` into `dist/` and writes an implementation manifest. It uses Node built-ins only and does not fetch assets or inspect files outside this repository. `npm test` validates core routes/resources, response headers, the API boundary, MP3 byte ranges, path containment, allowed HTTP methods and Vercel config invariants.

## Security / deployment behavior

- The static pages run under a restrictive Content-Security-Policy; browser connections are limited to the same origin.
- Production analytics are removed or neutralized in the generated bundle.
- `/api/*` always returns a local-backend-unavailable response. No database, upload, OAuth, publishing or payment request is forwarded to production.
- The Vercel API function uses the same 501 contract; it does not use environment secrets or external network calls.
- Sensitive interface actions show an explanatory local-demo notice instead of attempting a real production transaction.
- Microphone candle interaction is permitted only in the same origin by Permissions-Policy; browser permission is still user-controlled.

## Evidence and fidelity limitations

The bundled site was reconstructed from recovered browser-delivered files and captured public pages. The standalone repository intentionally excludes the wider forensic evidence folders; their audit record remains in the parent workspace under `../docs/LOCAL_LIVE_PARITY.md`. The prepared `site-template/` contains the files needed to rebuild and deploy this public static demo.

Original uncompiled source maps, private APIs, private user records/uploads, real authentication and transactions were not available. Custom user-created journeys cannot be assumed to be fully represented by the default captured journey. See `docs/LOCAL_LIVE_PARITY.md` and `docs/TASK_STATE.md` before describing the project as a full production service.
