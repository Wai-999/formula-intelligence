import { useCallback, useLayoutEffect, useRef, useState } from 'react';

// Shared by every wide-content SVG in ML mode (ForecastBandChart, Macro's
// InformationGapTimeline, and whatever Micro/Politics need next) that has a
// legibility-driven min-width wrapped in `overflow-x: auto`: correct per
// this project's design conventions for wide content, but with zero visual
// affordance on narrow viewports unless something reports "there's more to
// the right." Returns a ref to attach to the scrolling container and
// whether it currently has unscrolled content to the right.
//
// useLayoutEffect (not useEffect) so the first measurement happens
// synchronously against post-commit layout rather than a pre-layout
// snapshot. A short-delay re-check follows because dev-mode CSS (Vite
// injects stylesheets via JS) can still land after this fires; the
// ResizeObserver + resize listener keep it correct after that as the
// viewport or content changes. See BUILD_LOG.md Module 6 for how this was
// diagnosed — extracted here once Module 7 needed the identical pattern.
//
// Also re-measures on `visibilitychange`: a page mounted in a background
// tab has its rAF/ResizeObserver/setTimeout callbacks throttled by the
// browser (confirmed while testing Module 7 — a backgrounded tab's settle
// timer silently never fired), so a chart that first laid out while hidden
// needs an explicit nudge once the tab actually becomes visible, rather
// than staying stuck on a stale measurement indefinitely.
export function useHorizontalScrollHint() {
  const ref = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 4);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    update();
    const settleTimer = setTimeout(update, 150);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearTimeout(settleTimer);
      ro.disconnect();
      window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [update]);

  return { ref, canScrollRight, onScroll: update };
}
