/**
 * HymnTrails — Cloudflare Worker
 *
 * Sibling project to RabbiRabbit. Generates hymn/Psalm/song studies that
 * weave Scripture, doctrine, and music history together, closing every
 * study with a "Modern Echo" — a 20th/21st century song that resonates
 * with the same truth as the hymn or Psalm under study.
 *
 * DATA REUSE POLICY (per RabbiRabbit Technical Architecture Report §6.3):
 *   This Worker does NOT duplicate or rebuild RabbiRabbit's Bible text or
 *   cross-reference data. It fetches both directly, at request time, from:
 *     https://raw.githubusercontent.com/twrmail/RabbiRabbit/main/data/
 *   Cross-reference data is CC-BY OpenBible.info and is attributed as such
 *   in every study's closing material.
 *
 * NEW DATA owned by this project:
 *     https://raw.githubusercontent.com/twrmail/HymnTrails/main/data/hymns.json
 *   48 hymns/Psalm-settings spanning church history, each tagged with
 *   scripture anchor, doctrine, and a paired contemporary "modern echo" song.
 */

const RABBIRABBIT_BASE =
  "https://raw.githubusercontent.com/twrmail/RabbiRabbit/main/data";
const HYMNTRAILS_BASE =
  "https://raw.githubusercontent.com/twrmail/HymnTrails/main/data";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-haiku-4-5";

// Same 66-book 3-letter code map RabbiRabbit's xref data uses, needed here
// so this Worker can independently resolve a scripture anchor (e.g.
// "Psalm 23") into the right cross-reference file without guessing.
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

const TRANSLATION_FILES = {
  web: "web.json",
  kjv: "kjv.json",
  asv: "asv.json",
};

const LOADING_CONTEXT_TIMEOUT_MS = 8000;

// ─────────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────────

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// ─────────────────────────────────────────────────────────────────
// Reference parsing
// ─────────────────────────────────────────────────────────────────

/**
 * Parses a loose scripture reference like "Psalm 23", "Psalm 23:1-6",
 * or "John 3:16" into { book, code, chapter, verse|null }.
 * Returns null if it can't confidently resolve a book name.
 */
function parseScriptureRef(input) {
  if (!input) return null;
  const trimmed = input.trim();

  // Try to find a known book name at the start of the string, longest
  // match first so "1 Samuel" beats "Samuel" style ambiguity is avoided
  // (not actually ambiguous here, but defensive).
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
  // Canonicalize "Psalm" (singular, as commonly typed in references like
  // "Psalm 23") to "Psalms" (plural) — the actual book name used in
  // RabbiRabbit's translation data files. Verified against live data.
  const canonicalBook = matchedBook === "Psalm" ? "Psalms" : matchedBook;
  const m = rest.match(/^(\d+)(?::(\d+))?/);
  const chapter = m ? parseInt(m[1], 10) : null;
  const verse = m && m[2] ? parseInt(m[2], 10) : null;

  return { book: canonicalBook, code, chapter, verse };
}

// ─────────────────────────────────────────────────────────────────
// Data fetchers — each wrapped with a timeout and a soft failure mode,
// since the study should still generate (with a noted gap) rather than
// hard-fail if one source is briefly unreachable.
// ─────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url, ms = LOADING_CONTEXT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch full translation file from RabbiRabbit's repo (reused, not duplicated). */
async function fetchTranslation(translationKey) {
  const file = TRANSLATION_FILES[translationKey] || TRANSLATION_FILES.web;
  return fetchWithTimeout(`${RABBIRABBIT_BASE}/${file}`);
}

/** Pull the specific passage text out of a loaded translation file.
 *  NOTE: RabbiRabbit's translation JSON stores `books` as an ARRAY of
 *  {name, code, chapters}, and `chapters` as an ARRAY of {chapter, verses},
 *  with `verses` as an ARRAY of {verse, text} — not nested dictionaries.
 *  Verified directly against live data; do not assume otherwise. */
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

/** Fetch the per-book cross-reference file from RabbiRabbit's repo (reused). */
async function fetchCrossRefs(bookCode) {
  return fetchWithTimeout(`${RABBIRABBIT_BASE}/xref/${bookCode}.json`);
}

/** Filter a loaded cross-ref file down to entries for a specific chapter/verse,
 *  ranked by vote count, top N only — keeps the prompt focused and small. */
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

/** Fetch HymnTrails' own hymn/song database. */
async function fetchHymnsDatabase() {
  return fetchWithTimeout(`${HYMNTRAILS_BASE}/hymns.json`);
}

/** Find hymns in the database whose scripture_anchor matches/overlaps the
 *  requested passage, or whose title/theme matches a free-text hymn query. */
function findRelevantHymns(hymnsData, params) {
  const hymns = hymnsData.hymns || [];
  const { primaryInput, studyType } = params;
  const needle = (primaryInput || "").toLowerCase();

  if (studyType === "hymn") {
    // primaryInput is a hymn title (or close to it) — find best title match
    const exact = hymns.filter((h) => h.title.toLowerCase().includes(needle));
    if (exact.length) return exact.slice(0, 3);
    // fall back to doctrine tag match
    return hymns
      .filter((h) => h.doctrine_tags.some((t) => t.toLowerCase().includes(needle)))
      .slice(0, 3);
  }

  // passage / topical / word study — match by scripture_anchor overlap or
  // doctrine tag overlap with the free-text input
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
// Prompt assembly
// ─────────────────────────────────────────────────────────────────

const STUDY_TYPE_INSTRUCTIONS = {
  hymn: "Center the study on the named hymn or song itself: its origin story, " +
        "the scriptural and doctrinal content of its lyrics, and how it has " +
        "functioned in the life of the church.",
  passage: "Center the study on the scripture passage, then bring in hymns and " +
           "Psalm-settings that have historically been paired with or drawn " +
           "from this text.",
  doctrine: "Center the study on the named doctrine, tracing it through " +
            "scripture and then through how hymn-writers across church " +
            "history have given that doctrine singable form.",
  topical: "Center the study on the named theme, weaving together scripture, " +
           "hymnody, and the historical circumstances under which key hymns " +
           "addressing this theme were written.",
};

function buildSystemPrompt() {
  return `You are the generation engine behind HymnTrails, a sibling project to \
RabbiRabbit. HymnTrails produces scholarly, ecumenical studies that weave \
Scripture, doctrine, and the history of congregational song together — \
showing how hymns and Psalm-settings across church history have given \
theological truth a singable form.

Your voice is warm, precise, historically grounded, and ecumenical — you \
present church history fairly across Protestant, Catholic, and Orthodox \
streams without favoring one. You ground every theological claim in \
Scripture and, where relevant, in the specific historical circumstances \
under which a hymn was written (the writer's grief, conversion, exile, or \
ordinary pastoral occasion). You do not invent biographical details — use \
only what is given to you in the supplied hymn data, or what is broadly \
and reliably attested public knowledge about a hymn's history.

STRUCTURE every study with these sections, in this order:
1. Opening — the scripture anchor and its historical/doctrinal context
2. The Hymn's Story — how and why it was written, by whom, under what circumstance
3. Doctrine in Song — the specific theological claims the hymn text makes, tied to the scripture given
4. Cross-Trail — at least one genuine cross-reference connection (from the verified data provided), explored briefly
5. Discussion Questions — three to five questions suited to the requested audience
6. MODERN ECHO (always last, always present) — recommend ONE contemporary \
(20th or 21st century) song that resonates with the same theological truth \
as the hymn or Psalm under study. Use the modern_echo data provided when \
available; if the study's primary subject is a Psalm or passage without a \
single matched hymn, choose the most theologically fitting contemporary \
song from the supplied hymn data's modern_echo fields, or, if none fit \
closely, suggest a different specific contemporary song you are confident \
exists and explain the connection in 2-3 sentences. This section must \
always end the study, clearly labeled "🎵 MODERN ECHO".

COPYRIGHT DISCIPLINE: When quoting hymn lyrics, quote no more than the \
public-domain excerpt provided, and never more than 2-3 lines at a time. \
For hymns marked non-public-domain in the supplied data, do not reproduce \
lyrics beyond the short excerpt given — instead describe the song's content \
and point the reader to the supplied lyrics_link for the full text.

ATTRIBUTION: Cross-reference data is sourced from the Treasury of Scripture \
Knowledge via OpenBible.info (CC-BY) — note this once, briefly, near the \
Cross-Trail section.

The Berean Standard governs this entire tool: every study is a starting \
point, not a final word. Close with a brief invitation to verify references \
against the reader's own Bible and hymnal.`;
}

function buildUserPrompt(params, context) {
  const {
    studyType, primaryInput, audience, translation, notes,
  } = params;
  const { passageText, passageRef, crossRefs, relevantHymns } = context;

  let prompt = `Study type: ${studyType}\n`;
  prompt += `Primary subject: ${primaryInput}\n`;
  prompt += `Audience: ${audience}\n`;
  prompt += `Translation: ${translation.toUpperCase()}\n`;
  if (notes) prompt += `Additional notes from requester: ${notes}\n`;
  prompt += `\nInstruction for this study type: ${STUDY_TYPE_INSTRUCTIONS[studyType] || STUDY_TYPE_INSTRUCTIONS.passage}\n`;

  if (passageRef && passageText) {
    prompt += `\n--- SCRIPTURE TEXT (${translation.toUpperCase()}, verified from source) ---\n`;
    prompt += `${passageRef}: ${passageText}\n`;
  }

  if (crossRefs && crossRefs.length) {
    prompt += `\n--- VERIFIED CROSS-REFERENCES (Treasury of Scripture Knowledge via OpenBible.info, CC-BY) ---\n`;
    prompt += crossRefs.join("\n") + "\n";
  }

  if (relevantHymns && relevantHymns.length) {
    prompt += `\n--- HYMN/SONG DATA (verified from HymnTrails database) ---\n`;
    for (const h of relevantHymns) {
      prompt += `\nTitle: ${h.title}\n`;
      prompt += `Author: ${h.author} (${h.year})\n`;
      prompt += `Scripture anchor: ${h.scripture_anchor}\n`;
      prompt += `Doctrine tags: ${h.doctrine_tags.join(", ")}\n`;
      prompt += `Historical notes: ${h.notes}\n`;
      if (h.public_domain && h.full_text) {
        prompt += `Text (public domain, quotable in full): ${h.full_text}\n`;
      } else if (h.excerpt) {
        prompt += `Excerpt only (NOT public domain — do not extend this quote): "${h.excerpt}"\n`;
        prompt += `Full lyrics link to offer the reader: ${h.lyrics_link}\n`;
      }
      if (h.modern_echo) {
        prompt += `Modern Echo for this hymn: "${h.modern_echo.title}" by ${h.modern_echo.artist} (${h.modern_echo.year}) — ${h.modern_echo.connection}\n`;
      }
    }
  } else {
    prompt += `\n--- No exact hymn match found in database. Choose the most theologically fitting Modern Echo using your own knowledge, clearly noting it is a suggestion rather than verified data. ---\n`;
  }

  prompt += `\nGenerate the complete study now, following the structure given in your instructions, ending with the MODERN ECHO section.`;

  return prompt;
}

// ─────────────────────────────────────────────────────────────────
// Main request handler
// ─────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    let params;
    try {
      params = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    if (!params.primaryInput || !params.primaryInput.trim()) {
      return new Response(JSON.stringify({ error: "primaryInput is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const translation = params.translation || "web";
    const studyType = params.studyType || "passage";

    // ── Gather context in parallel ──────────────────────────────
    let passageRef = null, passageText = null, crossRefs = [], relevantHymns = [];

    try {
      const hymnsDataPromise = fetchHymnsDatabase();

      // Try to resolve a scripture reference from the primary input
      // (works whether the user typed a passage directly, or a hymn
      // whose scripture_anchor we'll resolve after loading hymn data).
      let ref = parseScriptureRef(params.primaryInput);

      const hymnsData = await hymnsDataPromise;
      relevantHymns = findRelevantHymns(hymnsData, params);

      // If no direct ref was parsed from user input but we matched a
      // hymn, use ITS scripture anchor as the passage to look up.
      if (!ref && relevantHymns.length) {
        ref = parseScriptureRef(relevantHymns[0].scripture_anchor);
      }

      if (ref && ref.code && ref.chapter) {
        const [translationData, xrefData] = await Promise.all([
          fetchTranslation(translation).catch(() => null),
          fetchCrossRefs(ref.code).catch(() => null),
        ]);

        if (translationData) {
          passageText = extractPassage(
            translationData, ref.book, ref.chapter, ref.verse, null
          );
          passageRef = ref.verse
            ? `${ref.book} ${ref.chapter}:${ref.verse}`
            : `${ref.book} ${ref.chapter}`;
        }
        if (xrefData) {
          crossRefs = topCrossRefs(xrefData, ref.chapter, ref.verse);
        }
      }
    } catch (err) {
      // Soft-fail: proceed without this context rather than blocking
      // generation entirely. Claude will note gaps appropriately.
      console.error("Context gathering error:", err.message);
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(params, {
      passageText, passageRef, crossRefs, relevantHymns,
    });

    // ── Call Anthropic, streaming ───────────────────────────────
    const anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 4000,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `Anthropic API error (${anthropicRes.status}): ${errText}` }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    // Transform Anthropic's SSE stream into plain text, same pattern
    // as RabbiRabbit's Worker.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = anthropicRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop(); // keep incomplete line for next chunk

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              if (
                json.type === "content_block_delta" &&
                json.delta &&
                json.delta.type === "text_delta"
              ) {
                controller.enqueue(new TextEncoder().encode(json.delta.text));
              }
            } catch {
              // ignore malformed SSE chunks
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...corsHeaders(),
      },
    });
  },
};
