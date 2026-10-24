import { useRef } from 'react';

/**
 * Which pages stay mounted: the current one plus the few most recently seen.
 *
 * The two-mode shell kept every tab it had ever opened mounted for the rest
 * of the visit (useVisitedTabs). That preserved scroll position, a
 * half-finished quiz and a graph's pan/zoom — worth keeping — but with
 * twenty-odd pages and a lesson page per lesson it would grow without bound:
 * §13 asks not to mount every hidden page at once. A small LRU keeps the
 * benefit for the pages a learner is moving between, and anything that must
 * survive longer (progress, notes, drafts) already lives in a persisted
 * store rather than in component state.
 *
 * Returned in first-seen order, not recency order, so React never reorders
 * (and therefore never remounts) a page that is already mounted.
 */
export function useKeepAlive(key, limit = 5) {
  const recent = useRef([]);
  const list = recent.current;
  if (list[list.length - 1] !== key) {
    const next = list.filter((k) => k !== key);
    next.push(key);
    while (next.length > limit) next.shift();
    recent.current = next;
  }
  const order = useRef([]);
  const keep = new Set(recent.current);
  order.current = [...order.current.filter((k) => keep.has(k)), ...recent.current.filter((k) => !order.current.includes(k))];
  return order.current;
}
