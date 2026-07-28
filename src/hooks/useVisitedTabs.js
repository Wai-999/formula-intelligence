import { useEffect, useRef, useState } from 'react';

/**
 * Tracks which tabs have ever been opened.
 *
 * Both mode bodies keep every visited tab mounted so its state (scroll
 * position, a half-finished quiz, a graph's pan/zoom) survives switching
 * away and back. What they used to do additionally was mount ALL tabs
 * immediately, which meant a first paint constructed nine or eleven pages
 * — and, with lazy chunks, downloaded every one of them — for a user who
 * had asked to see one.
 *
 * Mounting on first visit keeps the whole benefit of keep-alive (nothing
 * is ever destroyed once seen) and drops the cost of pages never opened.
 */
export function useVisitedTabs(activeTab) {
  const [visited, setVisited] = useState(() => new Set([activeTab]));
  // A ref avoids adding `visited` to the dependency list, which would make
  // the effect re-run on every change it causes.
  const seen = useRef(visited);

  useEffect(() => {
    if (seen.current.has(activeTab)) return;
    const next = new Set(seen.current);
    next.add(activeTab);
    seen.current = next;
    setVisited(next);
  }, [activeTab]);

  return visited;
}
