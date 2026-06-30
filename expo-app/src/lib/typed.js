// Pure typed-answer checking — exact, slash-variants, and 1-typo tolerance.

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
export function normAnswer(s) {
  return s.toLowerCase().trim().replace(/[.,!?'"]/g, "").replace(/\(.*?\)/g, "").replace(/^(a|an|the|to) /, "").trim();
}
export function checkTyped(input, target) {
  const given = normAnswer(input);
  if (!given) return false;
  const accepted = target.split("/").map(normAnswer).concat([normAnswer(target)]);
  return accepted.some(a => a === given || (a.length > 3 && levenshtein(a, given) <= 1));
}
