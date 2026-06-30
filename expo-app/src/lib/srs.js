// Pure spaced-repetition logic — no UI, no platform APIs. Same algorithm the
// web app uses, now isolated and unit-testable. Mirrors test.js coverage.

export const MASTER_AT = 3; // correct answers before a word counts as "mastered"

export const SRS_INTERVALS = [
  30 * 1000,                 // box 0: 30 sec (just missed)
  10 * 60 * 1000,            // box 1: 10 min
  60 * 60 * 1000,            // box 2: 1 hour
  24 * 60 * 60 * 1000,       // box 3: 1 day
  3 * 24 * 60 * 60 * 1000,   // box 4: 3 days
  7 * 24 * 60 * 60 * 1000    // box 5: 1 week
];

export function srsCorrect(p, now = Date.now()) {
  p.box = Math.min((p.box || 0) + 1, 5);
  p.due = now + SRS_INTERVALS[p.box];
  p.ok = (p.ok || 0) + 1;
}
export function srsWrong(p, now = Date.now()) {
  p.box = 0;
  p.due = now + SRS_INTERVALS[0];
  p.miss = (p.miss || 0) + 1;
}
export function isDue(progress, key, now = Date.now()) {
  const p = progress[key];
  return !!(p && p.due !== undefined && p.due <= now);
}

// Build quiz items from a word list. Judge items are [sentence, isGood, expl];
// word items are [tagalog, english] and can be reversed into a second card.
export function quizItems(wordList, { reverse = false, judge = false } = {}) {
  if (judge) {
    return wordList.map(([tl, good, expl]) => ({ tl, good, expl, key: tl, rev: false, judge: true }));
  }
  const items = [];
  wordList.forEach(([tl, en]) => {
    items.push({ tl, en, key: tl, rev: false });
    if (reverse) items.push({ tl, en, key: "rev:" + tl, rev: true });
  });
  return items;
}

export function dueItems(items, progress, now = Date.now()) {
  return items.filter(it => isDue(progress, it.key, now));
}
export function dueCount(items, progress, now = Date.now()) {
  return dueItems(items, progress, now).length;
}

// pick the next item: due reviews first, then new words (respecting a daily cap), then practice-ahead
export function pickItem(items, progress, { newSeenToday = 0, newCap = 10, now = Date.now() } = {}) {
  if (!items.length) return null;
  const due = dueItems(items, progress, now);
  if (due.length) return due[Math.floor(Math.random() * due.length)];
  const activeUnmastered = items.filter(it => {
    const p = progress[it.key];
    return p && (p.ok || 0) < MASTER_AT;
  }).length;
  const unseen = items.filter(it => !progress[it.key]);
  if (unseen.length && newSeenToday < newCap && activeUnmastered < newCap) return unseen[0];
  const seen = items.filter(it => progress[it.key]);
  const pool = seen.length ? seen : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function masteryPct(wordList, progress) {
  if (!wordList.length) return 0;
  const learned = wordList.filter(([tl]) => (progress[tl] || {}).ok >= MASTER_AT).length;
  return Math.round(100 * learned / wordList.length);
}
