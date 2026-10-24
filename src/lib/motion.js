/**
 * True when motion should be minimised: the OS asks for it, or the learner
 * chose "Reduce motion" in Settings (which sets data-motion on <html>). The
 * stylesheet honours both through one rule in index.css; script-driven
 * animation (count-ups, confetti, graph tweens) asks here.
 */
export function prefersReducedMotion() {
  if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-motion') === 'reduce') return true;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
