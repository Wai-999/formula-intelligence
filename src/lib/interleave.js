// Interleaved practice (§12 learning science; owner decision D2).
//
// Mixed practice used to be a header badge asking cross-domain questions
// about the Gold/Macro/Micro/Politics labs. Those labs were retired, so the
// interleaving is re-sourced here from the lessons a learner has opened:
// questions alternate between subjects, so each one starts with "which idea
// is this?" — the discrimination that blocked practice never asks for.

/**
 * Build one interleaved set.
 *
 * pools: [{ key, items }] — one pool per subject (or any grouping).
 * lastAnswered(itemId) → timestamp of the latest answer, 0 if never.
 *
 * Within a pool the least recently answered item comes first (never
 * answered before anything). Across pools it is round-robin, starting with
 * the pool whose next item is stalest, and never takes two in a row from
 * the same pool while another pool still has items. Deterministic: the same
 * inputs give the same set.
 */
export function interleave(pools, { size = 6, lastAnswered = () => 0 } = {}) {
  const queues = pools
    .map((p) => ({
      key: p.key,
      items: [...p.items].sort((a, b) => lastAnswered(a.id) - lastAnswered(b.id) || a.id.localeCompare(b.id)),
    }))
    .filter((q) => q.items.length);
  const out = [];
  let prev = null;
  while (out.length < size && queues.some((q) => q.items.length)) {
    const open = queues.filter((q) => q.items.length);
    const choices = open.length > 1 ? open.filter((q) => q.key !== prev) : open;
    choices.sort((a, b) => lastAnswered(a.items[0].id) - lastAnswered(b.items[0].id) || a.key.localeCompare(b.key));
    const q = choices[0];
    out.push({ key: q.key, item: q.items.shift() });
    prev = q.key;
  }
  return out;
}

/** How many times the set switches pool — the measure of interleaving. */
export function switches(set) {
  let n = 0;
  for (let i = 1; i < set.length; i += 1) if (set[i].key !== set[i - 1].key) n += 1;
  return n;
}
