const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, TableOfContents,
} = require('docx');
const fs = require('fs');

const NAVY = "1F2A44";
const GOLD = "B8923F";
const INK = "2A2620";
const INK_LIGHT = "6B6458";
const BORDER = "DDD4C2";

const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
const cellBorders = { top: border, bottom: border, left: border, right: border };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0 },
    children: [new TextRun({
      text, bold: opts.bold, italics: opts.italics,
      size: opts.size ?? 22, color: opts.color ?? INK, font: "Arial",
    })],
    alignment: opts.align,
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 22, color: INK, font: "Arial" })],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}

function tableCell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width ?? 2340, type: WidthType.DXA },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({
        text, bold: opts.bold, size: 20, font: "Arial",
        color: opts.bold ? "FFFFFF" : INK,
      })],
    })],
  });
}

function dataTable(headers, rows, widths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => tableCell(h, { bold: true, shade: NAVY, width: widths[i] })),
  });
  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((cell, i) => tableCell(cell, {
        width: widths[i],
        shade: ri % 2 === 1 ? "F6ECD8" : undefined,
      })),
    })
  );
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...bodyRows],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 100, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
    children: [],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: INK } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "HymnTrails — Technical Architecture Report", size: 16, color: INK_LIGHT, font: "Arial" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 16, color: INK_LIGHT, font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: INK_LIGHT, font: "Arial" }),
            new TextRun({ text: " of ", size: 16, color: INK_LIGHT, font: "Arial" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: INK_LIGHT, font: "Arial" }),
          ],
        })],
      }),
    },
    children: [

      // ───────────── Title Page ─────────────
      p("🎵  HYMN · SCRIPTURE · MODERN ECHO  🎵", { align: AlignmentType.CENTER, color: GOLD, bold: true, size: 22, after: 600 }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "HymnTrails", bold: true, size: 64, color: NAVY, font: "Arial" })],
      }),
      p("Technical Architecture & Data Sources Report", { align: AlignmentType.CENTER, italics: true, size: 26, color: INK_LIGHT, after: 500 }),
      p(
        "This document describes how HymnTrails works end to end — every service, data source, and connection involved in producing a single study, from user input to finished output. It is written to be handed to another developer, collaborator, or AI assistant so that work already accomplished can be reused accurately rather than rebuilt.",
        { align: AlignmentType.CENTER, size: 21, after: 400 }
      ),
      p("Prepared for internal reference and project handoff", { align: AlignmentType.CENTER, italics: true, size: 19, color: INK_LIGHT, after: 200 }),
      p("Sibling project to RabbiRabbit", { align: AlignmentType.CENTER, italics: true, size: 19, color: INK_LIGHT, after: 800 }),

      new Paragraph({ children: [], pageBreakBefore: true }),

      // ───────────── TOC ─────────────
      h1("Contents"),
      new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }),

      new Paragraph({ children: [], pageBreakBefore: true }),

      // ───────────── 1. What It Is ─────────────
      h1("1. What HymnTrails Is"),
      p("HymnTrails is a web application that generates structured, ecumenical studies weaving Scripture, doctrine, and the history of congregational song together. A user selects a study type (Hymn Study, Passage + Hymns, Doctrine in Song, or Topical Study), enters a subject — a hymn title, a passage, a doctrine, or a theme — and the tool produces a complete study in real time: the hymn's origin story, the theological claims its lyrics make, a genuine cross-reference connection, discussion questions, and a closing recommendation called a Modern Echo."),
      p("The Modern Echo is HymnTrails' signature feature and the reason the project exists as its own tool rather than a mode inside RabbiRabbit. Every single study, regardless of study type, ends by naming one contemporary (20th- or 21st-century) song that resonates with the same theological truth as the hymn or Psalm under study — explicitly connecting, for example, Martin Luther's \"A Mighty Fortress\" to Bethel Music's \"No Longer Slaves\" by way of their shared movement from naming a real threat to declaring fearless identity in God."),
      p("Like a study, this section is not pre-written. Each one is generated live by an AI model (Claude, by Anthropic), grounded in a layered foundation of public domain Scripture translations, a verified cross-reference dataset, and an original hymn/song database purpose-built for this project. The architecture exists specifically to keep that generation fast, accurate, and free to run indefinitely."),
      p("The system is built from five connected services, two of which are reused directly from RabbiRabbit rather than rebuilt:"),
      bullet("GitHub (RabbiRabbit repo, reused) — supplies the public domain Scripture translations and the verified cross-reference dataset"),
      bullet("GitHub (HymnTrails repo, new) — stores the project's own code and its original 48-entry hymn/song database"),
      bullet("Netlify — hosts the public-facing web application"),
      bullet("Cloudflare Workers — runs the server-side logic that gathers source material and talks to the AI"),
      bullet("Anthropic API (Claude) — generates the actual study text, streamed in real time"),
      p("Each is detailed below, followed by a full inventory of every data source the tool draws upon.", { after: 200 }),

      // ───────────── 2. Request Flow ─────────────
      h1("2. How a Study Gets Made — Request Flow"),
      p("The sequence below describes exactly what happens between a user clicking \"Generate Hymn Study\" and the finished study appearing on screen."),
      bullet("Browser (Netlify-hosted React app) — user fills out the study form and clicks Generate.", "bullets"),
      bullet("Request sent to the HymnTrails Cloudflare Worker — POST with body { studyType, primaryInput, audience, translation, notes }"),
      bullet("Worker attempts to resolve a scripture reference from the input — e.g. \"Psalm 23\" → { book: Psalms, code: PSA, chapter: 23 }"),
      bullet("Worker fetches its own hymn database (data/hymns.json) and matches relevant entries by title, scripture anchor, or doctrine tag"),
      bullet("If no scripture reference was typed directly, the Worker falls back to the matched hymn's own scripture_anchor field to resolve one"),
      bullet("Worker fetches, in parallel, the resolved passage's text and its ranked cross-references — both from RabbiRabbit's existing GitHub data, reused via raw.githubusercontent.com, never duplicated"),
      bullet("Worker assembles one prompt combining the user's parameters, the passage text, the top cross-references, and the matched hymn data (including each hymn's pre-paired Modern Echo, when one is matched)"),
      bullet("Worker sends the prompt to Anthropic's API — POST https://api.anthropic.com/v1/messages (model: claude-haiku-4-5, streaming)"),
      bullet("Claude generates the study, streamed token by token, following a fixed six-part structure that always ends with a clearly labeled 🎵 MODERN ECHO section"),
      bullet("Worker re-streams that text straight back to the browser, transformed from Anthropic's SSE format to plain text"),
      bullet("Browser renders the study live; the StudyOutput component detects the Modern Echo marker and renders it in a distinct gold-bordered card, separate from the main body text"),
      p("Every step of context-gathering and generation happens inside Cloudflare's infrastructure, not Netlify's. This keeps the Anthropic API key encrypted on Cloudflare's servers — never sent to or visible in the browser, and never stored in any GitHub repository.", { after: 200 }),

      // ───────────── 3. Connected Services ─────────────
      h1("3. The Connected Services"),

      h2("3.1  GitHub — Two Repositories: One Reused, One New"),
      p("HymnTrails depends on two GitHub repositories with distinct roles."),
      p("RabbiRabbit/ (existing, reused without modification)", { bold: true, after: 80 }),
      p("https://github.com/twrmail/RabbiRabbit — supplies the Scripture translations (data/web.json, kjv.json, asv.json) and the cross-reference dataset (data/cross-refs.json and the per-book split under data/xref/). HymnTrails fetches these files directly via raw.githubusercontent.com at request time. Nothing from this repository is copied, cached, or rebuilt — it remains the single source of truth for Bible text and cross-references across both projects."),
      p("HymnTrails/ (new, project-specific)", { bold: true, after: 80 }),
      p("A new repository holding this project's own React source code and its original hymn/song database, structured as:"),
      bullet("data/hymns.json — 48 hymns and Psalm-settings, each with scripture anchor, doctrine tags, historical notes, lyric text or excerpt, and a paired Modern Echo (55.8 KB)"),
      bullet("src/ — React application source (components, logic)"),
      bullet("worker/ — the Cloudflare Worker source and its Node.js test harness"),
      bullet("README.md, package.json, vite.config.js, .gitignore"),
      p("At the time of this report, the HymnTrails repository has not yet been created on GitHub — the Worker's HYMNTRAILS_BASE constant points to the intended URL (https://raw.githubusercontent.com/twrmail/HymnTrails/main/data), and this report's data figures are drawn from the local, fully-built copy of hymns.json pending that push.", { italics: true }),

      h2("3.2  Netlify — Application Hosting (Planned)"),
      p("Following RabbiRabbit's pattern, Netlify is the intended host for the compiled React front end, connected directly to the HymnTrails GitHub repository so that any commit to the main branch triggers an automatic rebuild and redeploy. No live Netlify deployment exists yet for this project; the React application has been built and verified to compile and serve correctly in this development environment (see Section 5), and is ready to deploy once the GitHub repository is created."),

      h2("3.3  Cloudflare Workers — Application Logic & Orchestration (Built, Not Yet Deployed)"),
      p("The Worker is a single JavaScript file (worker/hymntrails-worker.js, 481 lines) intended to run on Cloudflare's edge network exactly as RabbiRabbit's does. For every study request it:"),
      bullet("Parses the requested input for a scripture reference, falling back to a matched hymn's own anchor if none is given directly"),
      bullet("Fetches the relevant Scripture passage and its ranked cross-references from RabbiRabbit's existing GitHub data"),
      bullet("Fetches HymnTrails' own hymn database and matches relevant entries"),
      bullet("Assembles all of the above into a single structured prompt, including explicit copyright-discipline instructions for lyric quoting"),
      bullet("Calls the Anthropic API with that prompt, streaming enabled"),
      bullet("Re-streams Anthropic's response back to the browser in real time, converting it from Server-Sent Events format to plain text as it goes"),
      p("The Worker's pure logic functions — reference parsing, passage extraction, cross-reference ranking, and hymn matching — have been tested directly against RabbiRabbit's live, real data (not mocked data) via a Node.js test harness. All 8 tests pass, including a full pipeline simulation (\"A Mighty Fortress\" → Psalm 46 → live verse text → live cross-references → correctly paired Modern Echo). See Section 5 for the complete test inventory."),
      p("As of this report, the Worker has not yet been deployed to actual Cloudflare infrastructure, and no Anthropic API key has been configured as a Cloudflare secret. The Worker's logic is complete and verified; deployment is the remaining step.", { italics: true }),

      h2("3.4  Anthropic API — Claude (Study Generation)"),
      p("Endpoint: https://api.anthropic.com/v1/messages", { bold: true, after: 40 }),
      p("Model in use: claude-haiku-4-5", { bold: true, after: 200 }),
      p("Claude is the model that writes each study. It receives the assembled prompt from the Cloudflare Worker — the user's parameters, the verified passage text, the ranked cross-references, and the matched hymn data (including any pre-paired Modern Echo) — and generates the finished study text, streamed token by token back through the Worker to the browser."),
      p("Claude's system prompt enforces a fixed six-part structure for every study: Opening, The Hymn's Story, Doctrine in Song, Cross-Trail, Discussion Questions, and — always last, always present — the Modern Echo. It also enforces copyright discipline (no more than 2–3 lines of any hymn lyric at a time, and never beyond the public-domain excerpt supplied for non-public-domain hymns) and requires attribution of cross-reference data to the Treasury of Scripture Knowledge via OpenBible.info."),
      p("When no hymn in the database closely matches a given passage or topic, the system prompt instructs Claude to choose a different, real contemporary song from its own knowledge for the Modern Echo, while clearly noting that this particular suggestion is unverified rather than drawn from the curated database — preserving the tool's honesty about what is sourced data versus model judgment."),
      p("Billing for this service is usage-based, charged per token of text sent and received. Following RabbiRabbit's observed cost profile, approximate cost per study generated is expected to remain under one US cent.", { after: 200 }),

      h2("3.5  Data Reused From RabbiRabbit (No External Live Services Added)"),
      p("Unlike RabbiRabbit, HymnTrails does not introduce any new third-party live data services. It reuses RabbiRabbit's existing GitHub-hosted Scripture and cross-reference data, and supplies its own hymn/song data from a locally curated, self-hosted JSON file rather than querying an external hymnal API. This keeps the project's dependency surface small: the only services it relies on beyond its own repository are GitHub (for both repositories' raw file access), Cloudflare, Netlify, and Anthropic.", { after: 200 }),

      // ───────────── 4. Data Source Inventory ─────────────
      h1("4. Complete Inventory of Data Sources"),

      h2("4.1  Scripture Translations (reused from RabbiRabbit)"),
      dataTable(
        ["Translation", "Year", "Stored At", "License"],
        [
          ["World English Bible (WEB) — default", "2020", "RabbiRabbit GitHub: data/web.json", "Public Domain"],
          ["King James Version (KJV)", "1769", "RabbiRabbit GitHub: data/kjv.json", "Public Domain"],
          ["American Standard Version (ASV)", "1901", "RabbiRabbit GitHub: data/asv.json", "Public Domain"],
        ],
        [3200, 1400, 3200, 1560]
      ),

      new Paragraph({ spacing: { after: 240 }, children: [] }),

      h2("4.2  Cross-Reference Dataset (reused from RabbiRabbit)"),
      dataTable(
        ["Dataset", "Entries", "Stored At", "License"],
        [
          ["OpenBible.info Cross-References", "255,675", "RabbiRabbit GitHub: data/xref/*.json", "CC-BY"],
        ],
        [3200, 1400, 3200, 1560]
      ),
      p("This dataset originates from Christian publisher R.A. Torrey's 19th-century Treasury of Scripture Knowledge, later digitized and crowd-validated by OpenBible.info. Each entry links a source verse to a related verse and carries a vote count reflecting how many contributors affirmed the connection's scholarly validity. HymnTrails uses this vote count to select the strongest, most defensible connection for each study's Cross-Trail section, exactly as RabbiRabbit does for its rabbit trail.", { after: 240 }),

      h2("4.3  Hymn & Song Database (new, original to HymnTrails)"),
      p("data/hymns.json — 48 entries, 55.8 KB, MIT License (original curation; underlying hymn texts are independently public domain or excerpted under fair-use-scale quotation)."),
      p("Lyric policy: 41 entries are confirmed public domain (written before 1929) and store full lyric text. The remaining 7 entries are 20th- and 21st-century songs where copyright may apply; these store only a short excerpt (under 15 words) plus a lyrics_link to the full text at a licensed source (hymnary.org or the publisher's own site, e.g. gettymusic.com).", { after: 160 }),
      p("Era coverage:", { bold: true, after: 100 }),
      dataTable(
        ["Era / Category", "Count"],
        [
          ["19th Century Hymnody", "14"],
          ["Spiritual", "5"],
          ["Methodist Revival", "4"],
          ["20th Century Hymnody", "4"],
          ["Early English Hymnody", "3"],
          ["Reformation Psalter", "2"],
          ["18th Century Hymnody", "2"],
          ["20th Century Gospel", "2"],
          ["All other categories (Reformation, Medieval, Advent, Trinity/Doxology, Contemporary Worship, Scripture Song, and others)", "12"],
        ],
        [6800, 2560]
      ),
      p("Each entry carries: id, title, author, year, public_domain flag, era, scripture_anchor, doctrine_tags, historical notes, lyric text (full_text or excerpt + lyrics_link per the policy above), and a modern_echo object (title, artist, year, and a stated theological connection).", { after: 240 }),

      h2("4.4  Lyric Link Verification Notice"),
      p("The lyrics_link URLs pointing to hymnary.org and gettymusic.com could not be verified as currently reachable from this development environment — both domains, along with genius.com, returned HTTP 403 to all outbound requests regardless of user-agent, consistent with bot-protection blocking datacenter IP ranges rather than the links themselves being broken. These links should be spot-checked manually by a human reviewer in an ordinary browser before the tool is published.", { italics: true, after: 200 }),

      // ───────────── 5. Build & Verification Notes ─────────────
      h1("5. Build & Verification Notes"),
      p("This section documents what has actually been tested, and how, so that no claim in this report rests on assumption rather than verification — the same discipline RabbiRabbit's data layer was held to before this project began."),

      h2("5.1  Hymn Database Validation"),
      bullet("48 total entries, zero duplicate IDs, zero missing required fields"),
      bullet("41 public-domain entries carry full_text; 7 non-public-domain entries carry excerpt + lyrics_link, with zero excerpts at or above the 15-word limit"),
      bullet("Zero malformed lyrics_link values after correcting one broken fallback pattern found during review"),

      h2("5.2  Worker Logic Validation (against live, real data — not mocks)"),
      p("A Node.js test harness (worker/test-worker-logic.js) exercises every pure function in the Worker directly against RabbiRabbit's live GitHub data and the local hymn database. All 8 tests pass:"),
      bullet("Scripture reference parsing across 6 inputs, including correct rejection of an invalid book name"),
      bullet("Live fetch and extraction of Psalm 23 text from RabbiRabbit's real web.json"),
      bullet("Live fetch of Psalm 23's cross-references, correctly ranked by vote count (Philippians 4:19 highest at 46 votes)"),
      bullet("Hymn matching by exact title (\"Amazing Grace\")"),
      bullet("Hymn matching by passage (Psalm 23 → 4 relevant hymns)"),
      bullet("Hymn matching by doctrine/topic (\"grace\" → 4 relevant hymns)"),
      bullet("A full pipeline simulation: \"A Mighty Fortress\" resolves to Psalm 46, fetches real verse text and real cross-references, and correctly pairs its Modern Echo (\"No Longer Slaves,\" Bethel Music)"),
      bullet("Graceful fallback to zero results for nonsense input, rather than an error"),
      p("One real bug was found and fixed during this process: the passage-extraction function initially assumed a dictionary-based book/chapter/verse structure, when RabbiRabbit's actual data is array-based. Both the Worker and its test harness were corrected, and a direct diff confirmed their core logic remained identical afterward.", { after: 160 }),
      p("A second, unrelated issue was found and fixed while assembling this report: adding a package.json with \"type\": \"module\" for the React application caused Node to treat the Worker's CommonJS test script as an ES module, breaking it. This was resolved by giving the worker/ directory its own nested package.json scoped to \"type\": \"commonjs\", and the full 8-test suite was re-run afterward to confirm no regression.", { after: 240 }),

      h2("5.3  React Application Build Validation"),
      p("The full Vite + React project (package.json, vite.config.js, index.html, src/main.jsx, src/index.css, and all five components) was built and verified end to end in this development environment:"),
      bullet("npm install completed cleanly (62 packages)"),
      bullet("npm run build completed with zero errors across all 37 transformed modules"),
      bullet("The production bundle was served via npm run preview and confirmed to respond correctly over HTTP, including the expected page title and meta description"),
      bullet("The compiled JavaScript bundle was confirmed to contain the Modern Echo splitting logic and its associated UI strings, verifying the signature feature survived the build process intact"),
      p("No automated test exists for the React components' rendered visual output specifically (no headless browser was available in this environment to capture a screenshot); only the build, bundling, and serving pipeline were verified. A visual review in an actual browser is recommended before publishing.", { italics: true, after: 200 }),

      // ───────────── 6. Security, Privacy & Cost ─────────────
      h1("6. Security, Privacy & Cost Notes"),

      h2("6.1  API Key Handling"),
      p("Following RabbiRabbit's established pattern, the Anthropic API key for HymnTrails should be stored exclusively as an encrypted environment secret within the Cloudflare Worker's configuration — never committed to GitHub, never transmitted to or stored in the browser, and not recoverable through inspection of the client-side application. The Worker source code already reads this key from env.ANTHROPIC_API_KEY rather than hardcoding it, ready for this configuration once deployed."),
      p("A deliberate architectural choice carried over from RabbiRabbit: HymnTrails uses its own separate Cloudflare Worker and is intended to use its own separate Anthropic API key, rather than sharing RabbiRabbit's. This means the two tools can fail, be rate-limited, or be redeployed independently of one another.", { after: 200 }),

      h2("6.2  What Each Visitor Costs (Projected)"),
      bullet("Loading the app (Netlify, once deployed): negligible bandwidth, well within free-tier limits at any realistic traffic level"),
      bullet("Browsing without generating a study: zero cost beyond bandwidth"),
      bullet("Generating one study: expected to be roughly comparable to RabbiRabbit's observed cost of about $0.01 in Anthropic API usage per study, given the same model and a similarly sized prompt; no cost on Netlify or Cloudflare's free tiers"),
      p("These figures are projected by analogy to RabbiRabbit's live operating cost profile, since HymnTrails has not yet generated a study against a real, billed Anthropic API call.", { italics: true, after: 200 }),

      h2("6.3  Repository Visibility"),
      p("As with RabbiRabbit, the intended HymnTrails GitHub repository should be public. This is intentional and low-risk: it will contain only the original hymn/song database (data not subject to restrictive licensing beyond the excerpt-and-link policy already applied), application source code, and no credentials, API keys, or personal data at any point.", { after: 200 }),

      // ───────────── 7. Reuse Guidance ─────────────
      h1("7. Guidance for Reusing This Work"),
      p("This section is written specifically for handing off to another developer, collaborator, or AI assistant building a related or branching project that wishes to reuse HymnTrails' — or, transitively, RabbiRabbit's — existing data layers rather than rebuild them."),

      h2("7.1  What Is Safe to Reuse Directly"),
      bullet("All three Bible translation files and the cross-reference dataset, exactly as documented in RabbiRabbit's own report — public domain Scripture, CC-BY cross-references requiring attribution to OpenBible.info"),
      bullet("HymnTrails' own hymn/song database (data/hymns.json) — original curation; respect the per-entry public_domain flag and never extend a non-public-domain excerpt beyond what is stored"),
      bullet("The general architecture pattern (Netlify + Cloudflare Worker + Anthropic), already replicated once from RabbiRabbit to HymnTrails and reusable again for a future sibling project under a new Worker and new repository"),

      h2("7.2  Verifying the Data Before Reuse"),
      p("Before assuming any file's contents, fetch it directly and inspect it — do not rely on assumptions about repository state from a prior conversation or cached context. This is the same discipline that caught a genuine discrepancy in RabbiRabbit's data layer earlier in this project's history, and the same discipline that caught the array-vs-dictionary structural assumption corrected in this Worker's passage-extraction logic (Section 5.2)."),
      p("At the time of this report, hymns.json is fully built and validated locally but has not yet been pushed to a live GitHub repository — a future assistant should confirm its presence at the URL below before assuming it is reachable:"),
      p("https://raw.githubusercontent.com/twrmail/HymnTrails/main/data/hymns.json", { italics: true, color: NAVY, after: 200 }),

      h2("7.3  Recommended Handoff Instruction"),
      p("For a new project intending to reuse HymnTrails' data layer, the correct instruction is:"),
      p(
        "\"Do not regenerate or repackage the Scripture, cross-reference, or hymn data. Fetch them directly from the existing public URLs under https://raw.githubusercontent.com/twrmail/RabbiRabbit/main/data/ and https://raw.githubusercontent.com/twrmail/HymnTrails/main/data/, and build the new tool's logic on top of them. Attribute cross-reference data to OpenBible.info (CC-BY), and respect each hymn entry's public_domain flag when quoting lyrics.\"",
        { italics: true, after: 300 }
      ),

      h2("7.4  Remaining Work Before This Project Is Production-Ready"),
      bullet("Create the twrmail/HymnTrails GitHub repository and push the existing, validated source code and hymn database"),
      bullet("Deploy the Worker to Cloudflare and configure its own encrypted ANTHROPIC_API_KEY secret"),
      bullet("Deploy the React application to Netlify, connected to the new GitHub repository for auto-rebuild on commit"),
      bullet("Update the placeholder WORKER_URL in src/lib/generateStudy.js to the real deployed Worker address"),
      bullet("Manually spot-check the 7 lyrics_link URLs in an ordinary browser (see Section 4.4)"),
      bullet("Conduct a visual review of the rendered application in an actual browser, since this environment could only verify the build and serve pipeline, not rendered appearance"),
      bullet("Pastoral review of the system prompt's theological framing and the hymn database's historical notes before any public-facing use, consistent with this project family's standing principle that AI is a drafting assistant only", "bullets"),

      divider(),
      p("End of report.", { align: AlignmentType.CENTER, italics: true, color: INK_LIGHT, size: 19 }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/HymnTrails/docs/HymnTrails-Technical-Architecture-Report.docx", buffer);
  console.log("Report written.");
});
