import { useUIStore } from '../store/useUIStore.js';
import { parseHash, hashFor } from '../app/pages.js';

/**
 * Dependency-free hash routing (no router is installed — see BUILD_LOG.md
 * Phase 1 §2; GitHub Pages has no server rewrites, so hash URLs are what
 * make every page linkable and bookmarkable).
 *
 * Format since the V3.1 information architecture: "#maps/formulas",
 * "#learn/lesson/alg1-slope". Bookmarks from the two-mode app ("#stats/map",
 * "#ml/gold") still work: they go through the store's legacy setters, which
 * resolve retired tabs and map every old tab onto its new page.
 */
function currentHash() {
  const { page, pageParams } = useUIStore.getState();
  return hashFor(page, pageParams);
}

// push for navigation the learner made (so Back returns to where they were),
// replace for corrections of an address that resolved somewhere else.
function writeHash(next, { push = false } = {}) {
  if (window.location.hash === next) return;
  if (push) window.history.pushState(null, '', next);
  else window.history.replaceState(null, '', next);
}

// True while a URL is being applied to the store. State changes made then are
// corrections of that URL, so they must REPLACE it: pushing would put the
// corrected address on top of the old one, and Back would land on the old
// one, redirect, and push again — a loop the learner can't escape.
let applying = false;

/**
 * Apply a location to the store, then write the RESOLVED location back:
 * without the write-back an unknown or retired address stays in the address
 * bar even though the app corrected itself (the subscription below only
 * fires when state changes).
 */
function applyLocation(hash) {
  applying = true;
  try {
    applyParsed(hash);
  } finally {
    applying = false;
  }
  writeHash(currentHash());
}

function applyParsed(hash) {
  const parsed = parseHash(hash);
  const ui = useUIStore.getState();
  if (parsed?.kind === 'legacy') {
    if (parsed.mode === 'ml') ui.setMLActiveTab(parsed.tab);
    else ui.setActiveTab(parsed.tab);
  } else if (parsed?.kind === 'page') {
    ui.goTo(parsed.page, parsed.params);
  } else if (hash && hash !== '#') {
    ui.goTo('home');
  }
}

/**
 * Apply the URL to the store before the first render. Without this the app
 * rendered Home first and then "navigated" to the bookmarked page, and the
 * page header moved focus to its heading as it does after navigation — so
 * a keyboard user's first Tab skipped past the skip link.
 */
export function applyInitialLocation() {
  applyLocation(window.location.hash);
}

/** Call once on app mount. Restores the page from the URL, then keeps the URL in sync. */
export function initHashSync() {
  applyLocation(window.location.hash);

  const unsubscribe = useUIStore.subscribe((state, prev) => {
    if (state.page !== prev.page || state.pageParams !== prev.pageParams) writeHash(currentHash(), { push: !applying });
  });

  const onHashChange = () => applyLocation(window.location.hash);
  window.addEventListener('hashchange', onHashChange);

  return () => {
    unsubscribe();
    window.removeEventListener('hashchange', onHashChange);
  };
}
