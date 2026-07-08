/**
 * Levenshtein Distance Algorithm
 *
 * Computes the minimum number of single-character edits (insertions, deletions,
 * or substitutions) required to change one string into the other.
 *
 * Uses the classic dynamic-programming matrix approach with O(m·n) time and
 * O(min(m,n)) space (we only keep two rows at a time).
 */
export function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;

  // Edge cases
  if (la === 0) return lb;
  if (lb === 0) return la;

  // Ensure `b` is the shorter string for space optimisation
  if (la < lb) return levenshtein(b, a);

  // Previous and current row of distances
  let prev = Array.from({ length: lb + 1 }, (_, i) => i);
  let curr = new Array<number>(lb + 1);

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost  // substitution
      );
    }
    [prev, curr] = [curr, prev]; // swap rows
  }

  return prev[lb];
}

/**
 * Normalised similarity score between 0 and 1.
 * 1 = identical, 0 = completely different.
 */
export function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Fuzzy match helper.
 * Returns true when the query is "close enough" to the target.
 *
 * The threshold adapts to query length:
 *   - queries ≤3 chars: must be substring or distance ≤1
 *   - queries ≤6 chars: distance ≤2
 *   - queries >6 chars: distance ≤3
 */
export function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact substring is always a match
  if (t.includes(q) || q.includes(t)) return true;

  // Word-level matching: if any word in target starts with query
  const words = t.split(/[\s\-_]+/);
  if (words.some((w) => w.startsWith(q))) return true;

  // Levenshtein distance threshold
  const dist = levenshtein(q, t);
  if (q.length <= 3) return dist <= 1;
  if (q.length <= 6) return dist <= 2;
  return dist <= 3;
}

/**
 * Rank candidates by similarity to a query.
 * Returns items sorted from best match to worst, filtered by minimum score.
 */
export function rankBySimilarity<T>(
  query: string,
  items: T[],
  getText: (item: T) => string,
  minScore = 0.3
): T[] {
  const q = query.toLowerCase();
  return items
    .map((item) => ({ item, score: similarity(q, getText(item).toLowerCase()) }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
