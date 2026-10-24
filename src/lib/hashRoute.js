import { useUIStore } from '../store/useUIStore.js';

/**
 * Dependency-free hash sync, e.g. "#ml/gold" or "#stats/map". No router is
 * installed in this app (see BUILD_LOG.md Phase 1 §2) and the existing 9
 * Stats tabs have no URL sync at all today, so this is additive: it makes ML
 * mode linkable/bookmarkable/shareable without introducing a router
 * dependency or changing Stats mode's existing behavior beyond opting it
 * into the same hash format.
 */
function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [mode, tab] = raw.split('/');
  if (mode === 'ml' || mode === 'stats') return { mode, tab: tab || null };
  return null;
}

function writeHash(mode, tab) {
  const next = `#${mode}/${tab}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next);
  }
}

/**
 * Apply a parsed URL through the store's validated setters, then write the
 * RESOLVED location back. Without the write-back an unknown or retired id
 * (e.g. an old #ml/bridge bookmark) stays in the address bar even though the
 * store corrected itself — the subscription below only fires on a change.
 */
function applyParsed({ mode, tab }) {
  const { setMode, setActiveTab, setMLActiveTab } = useUIStore.getState();
  setMode(mode);
  if (tab && mode === 'ml') setMLActiveTab(tab);
  else if (tab && mode === 'stats') setActiveTab(tab);
  const state = useUIStore.getState();
  writeHash(state.mode, state.mode === 'ml' ? state.mlActiveTab : state.activeTab);
}

/** Call once on app mount. Restores mode/tab from the URL, then keeps the URL in sync going forward. */
export function initHashSync() {
  const parsed = parseHash();
  if (parsed) {
    applyParsed(parsed);
  } else {
    const { mode, activeTab, mlActiveTab } = useUIStore.getState();
    writeHash(mode, mode === 'ml' ? mlActiveTab : activeTab);
  }

  const unsubscribe = useUIStore.subscribe((state, prevState) => {
    if (state.mode !== prevState.mode || state.activeTab !== prevState.activeTab || state.mlActiveTab !== prevState.mlActiveTab) {
      writeHash(state.mode, state.mode === 'ml' ? state.mlActiveTab : state.activeTab);
    }
  });

  const onHashChange = () => {
    const next = parseHash();
    if (!next) return;
    applyParsed(next);
  };
  window.addEventListener('hashchange', onHashChange);

  return () => {
    unsubscribe();
    window.removeEventListener('hashchange', onHashChange);
  };
}
