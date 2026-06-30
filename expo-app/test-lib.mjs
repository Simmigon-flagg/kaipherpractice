// Logic tests for the Expo app's shared lib (ESM, no JSX) — run: node test-lib.mjs
import { srsCorrect, srsWrong, isDue, quizItems, pickItem, dueCount, masteryPct, SRS_INTERVALS } from "./src/lib/srs.js";
import { checkTyped, levenshtein, normAnswer } from "./src/lib/typed.js";
import { WORD_CATEGORIES } from "./src/data/words.js";
import { JUDGE_CATEGORIES } from "./src/data/judge.js";

let pass = 0, fail = 0; const fails = [];
const ok = (c, m) => c ? pass++ : (fail++, fails.push(m));
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);

// SRS
(() => {
  const now = 1_000_000_000_000;
  const p = {}; srsCorrect(p, now);
  eq(p.box, 1, "srsCorrect -> box 1"); eq(p.due, now + SRS_INTERVALS[1], "srsCorrect due = +10min"); eq(p.ok, 1, "ok incremented");
  for (let i = 0; i < 9; i++) srsCorrect(p, now); eq(p.box, 5, "box caps at 5");
  const q = { box: 3, ok: 5, miss: 0 }; srsWrong(q, now); eq(q.box, 0, "wrong resets box"); eq(q.miss, 1, "miss incremented");
  const prog = { a: { due: now - 1 }, b: { due: now + 1 } };
  ok(isDue(prog, "a", now), "isDue past"); ok(!isDue(prog, "b", now), "isDue future"); ok(!isDue(prog, "z", now), "isDue unknown");
})();

// quizItems + due
(() => {
  const wl = [["aso", "dog"], ["pusa", "cat"]];
  eq(quizItems(wl).length, 2, "quizItems no reverse");
  eq(quizItems(wl, { reverse: true }).length, 4, "quizItems reverse doubles");
  const j = quizItems([["Kumakain ang aso.", true, "x"]], { judge: true });
  ok(j[0].judge === true && j[0].good === true, "judge item shape");
  const now = 2_000_000_000_000;
  const prog = { aso: { due: now - 1 }, pusa: { due: now + 9 } };
  eq(dueCount(quizItems(wl), prog, now), 1, "dueCount counts past-due only");
})();

// pickItem respects new-word cap
(() => {
  const items = quizItems([["a", "1"], ["b", "2"], ["c", "3"]]);
  const got = pickItem(items, {}, { newSeenToday: 99, newCap: 10 }); // cap hit, nothing seen -> practice-ahead returns something
  ok(got !== null, "pickItem still returns under cap when nothing due");
  const first = pickItem(items, {}, { newSeenToday: 0, newCap: 10 });
  eq(first.key, "a", "pickItem introduces new words in order");
})();

// typed
(() => {
  eq(levenshtein("dog", "dig"), 1, "levenshtein sub");
  eq(normAnswer("  The Dog! "), "dog", "normAnswer strips article+punct");
  ok(checkTyped("dog", "sun / day / dog"), "typed slash-variant"); ok(checkTyped("hapy", "happy"), "typed 1-typo");
  ok(!checkTyped("cat", "dog"), "typed reject wrong"); ok(!checkTyped("", "dog"), "typed reject empty");
})();

// data still valid after ESM conversion
(() => {
  let words = 0, bad = 0;
  Object.values(WORD_CATEGORIES).forEach(c => c.words.forEach(w => { words++; if (w.length !== 2 || typeof w[0] !== "string") bad++; }));
  eq(bad, 0, "words deck: valid pairs"); ok(words > 100, `words deck non-empty (${words})`);
  let good = 0, no = 0;
  Object.values(JUDGE_CATEGORIES).forEach(c => c.words.forEach(([s, g, e]) => { typeof g === "boolean" && (g ? good++ : no++); }));
  ok(good > 0 && no > 0, `judge deck balanced (${good} yes / ${no} no)`);
})();

console.log(`\n  ${pass} passed, ${fail} failed\n`);
if (fail) { fails.forEach(f => console.log("  ✗ " + f)); process.exit(1); } else console.log("  ✓ all green\n");
