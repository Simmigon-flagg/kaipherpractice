// Kaipher Practice — logic test suite.  Run headless:  node test.js
// Tests the REAL functions by extracting their source from practice-app.js
// (the DOM/WebAudio parts can't run in Node, so we cover the pure logic:
// SRS scheduling, due detection, quizItems, typed-answer checking) plus
// data-integrity checks on the three word decks.

const fs = require("fs");
const path = require("path");
const DIR = __dirname;
const read = f => fs.readFileSync(path.join(DIR, f), "utf8");

// ---------- tiny assert harness ----------
let pass = 0, fail = 0;
const fails = [];
function ok(cond, msg) { if (cond) pass++; else { fail++; fails.push(msg); } }
function eq(a, b, msg) { ok(JSON.stringify(a) === JSON.stringify(b), msg + ` (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`); }
function near(a, b, tol, msg) { ok(Math.abs(a - b) <= tol, msg + ` (got ${a}, want ~${b})`); }

// ---------- extract the real logic from practice-app.js ----------
const app = read("practice-app.js");
function slice(fromMarker, toMarker) {
  const i = app.indexOf(fromMarker);
  const j = app.indexOf(toMarker, i);
  if (i < 0 || j < 0) throw new Error("could not locate source block: " + fromMarker);
  return app.slice(i, j);
}
// Block 1: SRS_INTERVALS, quizItems, isDueKey, dueCount, srsCorrect, srsWrong, dueItems
const srsBlock = slice("const SRS_INTERVALS = [", "function troubleWords");
// Block 2: typed-answer checking (levenshtein, normAnswer, checkTypedLocal)
const typedBlock = slice("function levenshtein(a, b)", "async function haikuJudge");

// sandbox globals the SRS block references (it reads `progress` and `reverseOn` as globals)
globalThis.progress = {};
globalThis.REVERSE = true;
globalThis.reverseOn = () => globalThis.REVERSE;
globalThis.inJudge = () => false; // SRS/typed tests run on word decks, not the judge deck
const setProgress = p => { globalThis.progress = p; };

// build the real functions via Function() (runs at global scope) and return them
const srs = new Function(srsBlock + "\nreturn {SRS_INTERVALS,quizItems,isDueKey,dueCount,srsCorrect,srsWrong,dueItems};")();
const { SRS_INTERVALS, quizItems, isDueKey, dueCount, srsCorrect, srsWrong, dueItems } = srs;
const typed = new Function(typedBlock + "\nreturn {levenshtein,normAnswer,checkTypedLocal};")();
const { levenshtein, normAnswer, checkTypedLocal } = typed;

// =====================================================================
// SRS scheduling
// =====================================================================
(() => {
  const now = Date.now();
  const p = {};
  srsCorrect(p);
  eq(p.box, 1, "srsCorrect: first correct -> box 1");
  near(p.due, now + SRS_INTERVALS[1], 1000, "srsCorrect: due ~ now + box1 interval (10min)");

  // climb to the cap
  for (let i = 0; i < 10; i++) srsCorrect(p);
  eq(p.box, 5, "srsCorrect: box caps at 5");
  near(p.due, Date.now() + SRS_INTERVALS[5], 1000, "srsCorrect: capped due ~ +1 week");

  const q = { box: 4, ok: 9, miss: 0 };
  srsWrong(q);
  eq(q.box, 0, "srsWrong: resets box to 0");
  near(q.due, Date.now() + SRS_INTERVALS[0], 1000, "srsWrong: due ~ now + 30s");
})();

// =====================================================================
// due detection
// =====================================================================
(() => {
  const now = Date.now();
  setProgress({
    overdue: { box: 1, due: now - 5000 },
    future:  { box: 1, due: now + 60000 },
    nodue:   { box: 0 }   // never scheduled
  });
  ok(isDueKey("overdue"), "isDueKey: past due -> true");
  ok(!isDueKey("future"), "isDueKey: future due -> false");
  ok(!isDueKey("nodue"), "isDueKey: no due field -> false");
  ok(!isDueKey("missing"), "isDueKey: unknown key -> false");
})();

// =====================================================================
// quizItems (forward + reverse)
// =====================================================================
(() => {
  const wl = [["aso", "dog"], ["pusa", "cat"]];
  REVERSE = false;
  let items = quizItems(wl);
  eq(items.length, 2, "quizItems: reverse off -> 1 item per word");
  ok(items.every(it => it.rev === false), "quizItems: reverse off -> no reverse items");

  REVERSE = true;
  items = quizItems(wl);
  eq(items.length, 4, "quizItems: reverse on -> 2 items per word");
  ok(items.some(it => it.key === "rev:aso" && it.rev === true), "quizItems: reverse key prefixed with rev:");

  // dueCount uses quizItems + isDueKey
  const now = Date.now();
  setProgress({ aso: { due: now - 1 }, "rev:aso": { due: now + 99999 }, pusa: { due: now - 1 } });
  eq(dueCount(wl), 2, "dueCount: counts only past-due items (aso fwd + pusa fwd)");
})();

// =====================================================================
// typed-answer checking
// =====================================================================
(() => {
  eq(levenshtein("dog", "dog"), 0, "levenshtein: identical -> 0");
  eq(levenshtein("dog", "dig"), 1, "levenshtein: one substitution -> 1");
  eq(levenshtein("cat", "cart"), 1, "levenshtein: one insertion -> 1");

  eq(normAnswer("  The Dog! "), "dog", "normAnswer: lowercases, trims, strips 'the' + punctuation");
  eq(normAnswer("sun (the star)"), "sun", "normAnswer: strips parenthetical");

  ok(checkTypedLocal("dog", "dog"), "typed: exact match accepted");
  ok(checkTypedLocal("dog", "sun / day / dog"), "typed: matches one slash-variant");
  ok(checkTypedLocal("hapy", "happy"), "typed: 1-typo accepted (hapy~happy)");
  ok(checkTypedLocal("the dog", "dog"), "typed: leading article ignored");
  ok(!checkTypedLocal("cat", "dog"), "typed: wrong answer rejected");
  ok(!checkTypedLocal("", "dog"), "typed: empty rejected");
  ok(!checkTypedLocal("xy", "ok"), "typed: short words need exact (no fuzzy on <=3 chars)");
})();

// =====================================================================
// data integrity — the three decks
// =====================================================================
function loadDeck(file, varName) {
  return new Function(read(file) + "; return " + varName + ";")();
}
function checkDeck(name, cats) {
  let total = 0; const seen = {}; let dups = 0; let bad = 0;
  for (const [cat, c] of Object.entries(cats)) {
    ok(typeof c.emoji === "string" && c.emoji.length > 0, `${name}/${cat}: has emoji`);
    ok(Array.isArray(c.words), `${name}/${cat}: words is array`);
    for (const w of c.words) {
      total++;
      if (!Array.isArray(w) || w.length !== 2 || typeof w[0] !== "string" || typeof w[1] !== "string" || !w[0] || !w[1]) bad++;
      else { if (seen[w[0]]) dups++; seen[w[0]] = true; }
    }
  }
  eq(bad, 0, `${name}: every entry is a valid [tagalog, english] pair`);
  eq(dups, 0, `${name}: no duplicate Tagalog keys within deck`);
  ok(total > 0, `${name}: deck is non-empty (${total} items)`);
  return { total, keys: Object.keys(seen) };
}
const W = checkDeck("Words", loadDeck("practicetag.js", "WORD_CATEGORIES"));
const S = checkDeck("Sentences", loadDeck("practicesentences.js", "SENTENCE_CATEGORIES"));
const C = checkDeck("Conjugation", loadDeck("practiceconjugation.js", "CONJUGATION_CATEGORIES"));

// judge deck has a different shape: [sentence, boolean, explanation]
(() => {
  const J = loadDeck("practicejudge.js", "JUDGE_CATEGORIES");
  let total = 0, bad = 0, good = 0, notGood = 0; const seen = {}; let dups = 0;
  for (const [cat, c] of Object.entries(J)) {
    ok(typeof c.emoji === "string" && c.emoji.length > 0, `Judge/${cat}: has emoji`);
    for (const it of c.words) {
      total++;
      if (!Array.isArray(it) || it.length !== 3 ||
          typeof it[0] !== "string" || typeof it[1] !== "boolean" || typeof it[2] !== "string" ||
          !it[0] || !it[2]) bad++;
      else { it[1] ? good++ : notGood++; if (seen[it[0]]) dups++; seen[it[0]] = true; }
    }
  }
  eq(bad, 0, "Judge: every item is [sentence:string, isGood:boolean, explanation:string]");
  eq(dups, 0, "Judge: no duplicate sentences");
  ok(good > 0 && notGood > 0, `Judge: has both yes and no items (${good} yes / ${notGood} no)`);
  ok(Math.abs(good - notGood) <= total * 0.35, "Judge: yes/no roughly balanced (not guessable)");
})();

// sentence/conjugation keys must not collide (they share one SRS progress map)
const sSet = new Set(S.keys);
const collide = C.keys.filter(k => sSet.has(k));
eq(collide.length, 0, "no Tagalog-key collisions between Sentences and Conjugation decks");

// phrases.js references should be real Tagalog words
const PH = new Function(read("phrases.js") + "; return PHRASES;")();
const wSet = new Set(W.keys);
const orphanPhrases = Object.keys(PH).filter(k => !wSet.has(k));
ok(orphanPhrases.length === 0, "every phrase key maps to a real word in the Words deck" +
  (orphanPhrases.length ? " — orphans: " + orphanPhrases.slice(0, 5).join(", ") : ""));

// =====================================================================
// report
// =====================================================================
console.log(`\n  ${pass} passed, ${fail} failed  (decks: ${W.total} words, ${S.total} sentences, ${C.total} conj)\n`);
if (fail) { fails.forEach(f => console.log("  ✗ " + f)); process.exit(1); }
else console.log("  ✓ all green\n");
