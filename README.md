# HymnTrails

Hymn-rooted Bible study tool. Sibling project to **RabbiRabbit**.

Every study pairs a hymn, Psalm-setting, scripture passage, doctrine, or
theme with its scripture anchor, a genuine cross-reference, discussion
questions, and a closing **🎵 Modern Echo** — a contemporary (20th/21st
century) song that carries the same theological truth forward.

## Status

Logic-complete and verified against live data. **Not yet deployed.**
See `docs/HymnTrails-Technical-Architecture-Report.docx` for full details,
including the exact remaining steps (§7.4) before this goes live.

## Structure

```
HymnTrails/
├── data/
│   ├── build_hymns.py      Generates hymns.json
│   └── hymns.json          48 hymns/Psalm-settings, scripture + doctrine + Modern Echo
├── worker/
│   ├── hymntrails-worker.js     Cloudflare Worker (orchestration + AI call)
│   ├── test-worker-logic.js     Test harness, run against LIVE data
│   └── package.json             Scoped to CommonJS (separate from the React app's ESM)
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css                Design tokens (navy/gold/parchment palette)
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Disclaimer.jsx
│   │   ├── StudyForm.jsx
│   │   ├── StudyOutput.jsx      Renders the Modern Echo in its own gold card
│   │   └── FontSizeToggle.jsx
│   └── lib/
│       └── generateStudy.js     Calls the Worker, streams the response
├── docs/
│   ├── build_report.js
│   └── HymnTrails-Technical-Architecture-Report.docx
├── index.html
├── package.json
└── vite.config.js
```

## Data reuse policy

Scripture text and cross-references are **fetched live** from RabbiRabbit's
existing public repository — never duplicated:
`https://raw.githubusercontent.com/twrmail/RabbiRabbit/main/data/`

Cross-reference data is CC-BY OpenBible.info and must be attributed as such
in any public-facing output (the Worker's system prompt already enforces this).

## Running locally

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
```

To test the Worker's logic against real, live data without deploying or
needing an Anthropic API key:

```bash
cd worker
node test-worker-logic.js
```

## Before going live

1. Create the `twrmail/HymnTrails` GitHub repo, push this code + `hymns.json`
2. Deploy `worker/hymntrails-worker.js` to Cloudflare, set `ANTHROPIC_API_KEY` as an encrypted secret
3. Deploy the React app to Netlify, connected to the new repo
4. Update `WORKER_URL` in `src/lib/generateStudy.js` to the real deployed Worker address
5. Spot-check the 7 `lyrics_link` URLs in an ordinary browser (hymnary.org / gettymusic.com returned HTTP 403 to this sandbox — likely bot protection, not broken links, but unverified)
6. Pastoral review of the system prompt and hymn historical notes before any public use

MIT License (code and original hymn curation). Scripture and cross-reference
data retain their original public domain / CC-BY status.
