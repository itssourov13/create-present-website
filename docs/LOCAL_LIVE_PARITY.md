# Local vs Live Parity Record

Audit date: 2026-10-14 (Asia/Dhaka). Target origin: https://www.creategiftwebsite.com.

This is the concise parity record carried into the standalone bundle. The full forensic captures remain in the parent claude-codex-handoff/reference/ and were intentionally excluded from this standalone repository.

## Confirmed live comparisons
- Homepage HTML capture: 84,109 bytes, SHA-256 4c21487f7b14afda432fd2f4ce8bc3b159f8828dfdb75ca3fc4468b20f3c338b; fresh live response matched saved capture.
- /preview HTML capture: 26,009 bytes, SHA-256 fddf726f0dd86a4981ba024c2fcddea30b540ae4c22855c64759e5dec5f8eb2f; fresh live response matched saved capture.
- /new capture: 30,271 bytes, SHA-256 bcad6627570b3f7a6f94f6ebbb27967d2d4e80f4eb74c0e2196d77cd6274474a.
- Ten captured routes were freshly requested and matched saved HTML: /create, /create-anniversary, /create-proposal, /create-apology, /create-custom, /create-rakhi, /dashboard, /terms, /privacy and /refund.
- Current live /create-birthday returns 404; the birthday builder is /create.
- Parent collection found 56 observed paths resolved, 0 unresolved and downloaded 15 assets missing from the curated handoff.
- The reconstructed default journey rendered desktop and mobile opening states and was exercised through PIN unlock, cake/candle, memories, all six balloon wishes, puzzle completion, scratch-card reveal and opened letter. No external tracking request or first-party HTTP 4xx/5xx was observed in the exercised path.

## Standalone route coverage

| Route | Expected local/deploy behavior |
|---|---|
| /, /new, /preview | Captured pages, HTTP 200 |
| /create, /create-anniversary, /create-proposal, /create-apology, /create-custom, /create-rakhi | Captured builder pages, HTTP 200 |
| /dashboard, /terms, /privacy, /refund | Captured pages, HTTP 200 |
| /create-birthday | Captured 404 content/status |
| /created/:id | Local explanatory placeholder, not a real saved/published gift |
| /j/:id | Missing record, HTTP 404 |
| /api/* | HTTP 501 JSON; no production backend |
| Unknown route | Custom 404 page |

## Standalone packaging notes
The committed site-template/ contains assets required to build/run without the parent workspace. The build resolves 66 observed HTML/CSS asset paths and the default journey includes 11 relevant image/audio assets. Generated pages neutralize external tracker requests and the CSP denies outbound browser connections.

## Non-parity and limitations
This package excludes raw captures, original forensic source bundles and private service implementation to stay focused on the runnable reconstruction. Private source maps, APIs, user data/uploads, OAuth and payment services were not recovered. The deployed package is a static reconstruction/demo; dynamic records cannot become real production records. Microphone blowing and the complete Rakhi drag/tie/sweets journey were not exhaustively browser-tested.
