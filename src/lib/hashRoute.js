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

/** Call once on app mount. Restores mode/tab from the URL, then keeps the URL in sync going forward. */
export function initHashSync() {
  const parsed = parseHash();
  if (parsed) {
    const { setMode, setActiveTab, setMLActiveTab } = useUIStore.getState();
    setMode(parsed.mode);
    if (parsed.tab && parsed.mode === 'ml') setMLActiveTab(parsed.tab);
    else if (parsed.tab && parsed.mode === 'stats') setActiveTab(parsed.tab);
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
    const { setMode, setActiveTab, setMLActiveTab } = useUIStore.getState();
    setMode(next.mode);
    if (next.tab && next.mode === 'ml') setMLActiveTab(next.tab);
    else if (next.tab && next.mode === 'stats') setActiveTab(next.tab);
  };
  window.addEventListener('hashchange', onHashChange);

  return () => {
    unsubscribe();
    window.removeEventListener('hashchange', onHashChange);
  };
}
