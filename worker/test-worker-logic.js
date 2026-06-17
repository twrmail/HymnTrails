// Test harness for hymntrails-worker.js logic — exercises the pure
// functions (parsing, extraction, filtering) against REAL data fetched
// from the live repos, without needing a Cloudflare deploy or an
// Anthropic API key. This validates the data-handling logic that the
// actual Worker will run in production.

const RABBIRABBIT_BASE =
  "https://raw.githubusercontent.com/twrmail/RabbiRabbit/main/data";

// hymns.json is read locally since it hasn't been pushed to a
// HymnTrails GitHub repo yet — this is the file we just built.
const fs = require("fs");
const HYMNS_LOCAL_PATH = "/home/claude/HymnTrails/data/hymns.json";

const BOOK_CODE = {
  "Genesis": "GEN", "Exodus": "EXO", "Leviticus": "LEV", "Numbers": "NUM",
  "Deuteronomy": "DEU", "Joshua": "JOS", "Judges": "JDG", "Ruth": "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Kings": "1KI", "2 Kings": "2KI",
  "1 Chronicles": "1CH", "2 Chronicles": "2CH", "Ezra": "EZR", "Nehemiah": "NEH",
  "Esther": "EST", "Job": "JOB", "Psalms": "PSA", "Psalm": "PSA", "Proverbs": "PRO",
  "Ecclesiastes": "ECC", "Song of Solomon": "SNG", "Isaiah": "ISA", "Jeremiah": "JER",
  "Lamentations": "LAM", "Ezekiel": "EZK", "Daniel": "DAN", "Hosea": "HOS",
  "Joel": "JOL", "Amos": "AMO", "Obadiah": "OBA", "Jonah": "JON", "Micah": "MIC",
  "Nahum": "NAH", "Habakkuk": "HAB", "Zephaniah": "ZEP", "Haggai": "HAG",
  "Zechariah": "ZEC", "Malachi": "MAL", "Matthew": "MAT", "Mark": "MRK",
  "Luke": "LUK", "John": "JHN", "Acts": "ACT", "Romans": "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", "Galatians": "GAL",
  "Ephesians": "EPH", "Philippians": "PHP", "Colossians": "COL",
  "1 Thessalonians": "1TH", "2 Thessalonians": "2TH", "1 Timothy": "1TI",
  "2 Timothy": "2TI", "Titus": "TIT", "Philemon": "PHM", "Hebrews": "HEB",
  "James": "JAS", "1 Peter": "1PE", "2 Peter": "2PE", "1 John": "1JN",
  "2 John": "2JN", "3 John": "3JN", "Jude": "JUD", "Revelation": "REV",
};

function parseScriptureRef(input) {
  if (!input) return null;
  const trimmed = input.trim();
  const bookNames = Object.keys(BOOK_CODE).sort((a, b) => b.length - a.length);
  let matchedBook = null;
  let rest = "";
  for (const name of bookNames) {
    if (trimmed.toLowerCase().startsWith(name.toLowerCase())) {
      matchedBook = name;
      rest = trimmed.slice(name.length).trim();
      break;
    }
  }
  if (!matchedBook) return null;
  const code = BOOK_CODE[matchedBook];
  // Canonicalize "Psalm" (singular, common in references like "Psalm 23")
  // to "Psalms" (plural), which is the actual book name used in the
  // RabbiRabbit translation data files.
  const canonicalBook = matchedBook === "Psalm" ? "Psalms" : matchedBook;
  const m = rest.match(/^(\d+)(?::(\d+))?/);
  const chapter = m ? parseInt(m[1], 10) : null;
  const verse = m && m[2] ? parseInt(m[2], 10) : null;
  return { book: canonicalBook, code, chapter, verse };
}

function extractPassage(translationData, bookName, chapter, verseStart, verseEnd) {
  const book = translationData.books.find((b) => b.name === bookName);
  if (!book) return null;
  const chapterObj = book.chapters.find((c) => c.chapter === chapter);
  if (!chapterObj) return null;

  let verses = chapterObj.verses;
  if (verseStart != null) {
    const end = verseEnd || verseStart;
    verses = verses.filter((v) => v.verse >= verseStart && v.verse <= end);
  }
  return verses.map((v) => `${v.verse}. ${v.text}`).join(" ");
}

function topCrossRefs(xrefData, chapter, verse, n = 6) {
  if (!xrefData || !xrefData.refs) return [];
  const matches = xrefData.refs.filter(
    (r) => r.fc === chapter && (verse == null || r.fv === verse)
  );
  return matches
    .sort((a, b) => b.v - a.v)
    .slice(0, n)
    .map((r) => `${r.tb} ${r.tc}:${r.tv} (votes: ${r.v})`);
}

function findRelevantHymns(hymnsData, params) {
  const hymns = hymnsData.hymns || [];
  const { primaryInput, studyType } = params;
  const needle = (primaryInput || "").toLowerCase();

  if (studyType === "hymn") {
    const exact = hymns.filter((h) => h.title.toLowerCase().includes(needle));
    if (exact.length) return exact.slice(0, 3);
    return hymns
      .filter((h) => h.doctrine_tags.some((t) => t.toLowerCase().includes(needle)))
      .slice(0, 3);
  }

  const byAnchor = hymns.filter((h) =>
    h.scripture_anchor.toLowerCase().includes(needle.split(" ")[0]?.toLowerCase() || "")
  );
  if (byAnchor.length) return byAnchor.slice(0, 4);

  const byDoctrine = hymns.filter((h) =>
    h.doctrine_tags.some((t) => needle.includes(t.toLowerCase()) || t.toLowerCase().includes(needle))
  );
  return byDoctrine.slice(0, 4);
}

// ─────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== TEST 1: parseScriptureRef ===");
  const refTests = ["Psalm 23", "Psalm 23:1", "John 3:16", "1 Samuel 7:12", "Romans 8", "not a real book"];
  for (const t of refTests) {
    console.log(`  "${t}" ->`, JSON.stringify(parseScriptureRef(t)));
  }

  console.log("\n=== TEST 2: fetch real WEB translation + extract Psalm 23 ===");
  const webRes = await fetch(`${RABBIRABBIT_BASE}/web.json`);
  const webData = await webRes.json();
  const psalm23 = extractPassage(webData, "Psalms", 23, null, null);
  console.log("  Psalm 23 (WEB):", psalm23.slice(0, 200) + "...");

  console.log("\n=== TEST 3: fetch real cross-refs for Psalm 23:1 ===");
  const xrefRes = await fetch(`${RABBIRABBIT_BASE}/xref/PSA.json`);
  const xrefData = await xrefRes.json();
  const refs = topCrossRefs(xrefData, 23, 1);
  console.log("  Psalm 23:1 top cross-refs:", refs);

  console.log("\n=== TEST 4: load local hymns.json + match by hymn title ===");
  const hymnsData = JSON.parse(fs.readFileSync(HYMNS_LOCAL_PATH, "utf-8"));
  const byTitle = findRelevantHymns(hymnsData, { primaryInput: "Amazing Grace", studyType: "hymn" });
  console.log("  Match for 'Amazing Grace':", byTitle.map(h => h.title));

  console.log("\n=== TEST 5: match hymns by passage (Psalm 23) ===");
  const byPassage = findRelevantHymns(hymnsData, { primaryInput: "Psalm 23", studyType: "passage" });
  console.log("  Match for 'Psalm 23':", byPassage.map(h => h.title));

  console.log("\n=== TEST 6: match hymns by doctrine/topic (grace) ===");
  const byTopic = findRelevantHymns(hymnsData, { primaryInput: "grace", studyType: "topical" });
  console.log("  Match for 'grace':", byTopic.map(h => h.title));

  console.log("\n=== TEST 7: full pipeline simulation for a hymn study ===");
  const matched = findRelevantHymns(hymnsData, { primaryInput: "A Mighty Fortress", studyType: "hymn" });
  console.log("  Matched hymn:", matched[0]?.title);
  if (matched[0]) {
    const ref = parseScriptureRef(matched[0].scripture_anchor);
    console.log("  Resolved scripture anchor:", ref);
    if (ref && ref.chapter) {
      const passage = extractPassage(webData, ref.book, ref.chapter, ref.verse, null);
      console.log("  Passage text (first 150 chars):", passage?.slice(0, 150));
      const fortressXref = await fetch(`${RABBIRABBIT_BASE}/xref/${ref.code}.json`).then(r => r.json());
      const fortressRefs = topCrossRefs(fortressXref, ref.chapter, ref.verse);
      console.log("  Cross-refs:", fortressRefs);
    }
    console.log("  Modern Echo:", matched[0].modern_echo);
  }

  console.log("\n=== TEST 8: case with NO direct match (should fall through gracefully) ===");
  const noMatch = findRelevantHymns(hymnsData, { primaryInput: "xyzzy nonsense topic", studyType: "topical" });
  console.log("  Match for nonsense input:", noMatch.length, "results (expect 0)");

  console.log("\n✅ All logic paths exercised against live data.");
}

main().catch(err => {
  console.error("TEST FAILURE:", err);
  process.exit(1);
});
