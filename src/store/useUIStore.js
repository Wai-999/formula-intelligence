import { create } from 'zustand';
import { ML_TABS } from './useMLUIStore.js';
import { useToastStore } from './useToastStore.js';

export const TABS = [
  { id: 'map', label: 'Map', icon: 'ti-topology-star-3', ready: true },
  { id: 'path', label: 'Learning Path', icon: 'ti-route', ready: true },
  { id: 'story', label: 'Story Walk', icon: 'ti-book-2', ready: true },
  { id: 'flashcards', label: 'Flashcards', icon: 'ti-cards', ready: true },
  { id: 'quiz', label: 'Quiz', icon: 'ti-help', ready: true },
  { id: 'dashboard', label: 'Dashboard', icon: 'ti-chart-bar', ready: true },
  { id: 'practice', label: 'Practice', icon: 'ti-target-arrow', ready: true },
  { id: 'errors', label: 'Error Log', icon: 'ti-alert-triangle', ready: true },
  { id: 'journal', label: 'Journal', icon: 'ti-notebook', ready: true },
];

export const DEFAULT_TAB = { stats: 'map', ml: 'pipeline' };

// Retired ML tabs and where their teaching lives now (docs/audits/
// FEATURE_INVENTORY.md §2). `lesson` opens an embedded lesson on the target
// page; `notice` explains the move once, instead of a silent redirect.
export const RETIRED_ML_TABS = {
  bridge: { tab: 'pipeline', notice: 'The Stats ↔ ML comparison page was retired; its comparisons now live in the ML lessons.' },
};

/**
 * Every tab id the app is asked to show — from the URL, a content link, a
 * saved state or a shortcut — goes through here. Previously an unknown id
 * was stored as-is and rendered a blank page with no error (production bug,
 * docs/audits/BASELINE_AUDIT.md §5: every old #ml/bridge bookmark).
 */
export function resolveTab(mode, tab) {
  if (mode === 'ml') {
    if (ML_TABS.some((t) => t.id === tab)) return { tab, lesson: null, notice: null };
    const retired = Object.hasOwn(RETIRED_ML_TABS, tab) ? RETIRED_ML_TABS[tab] : null;
    if (retired) return { tab: retired.tab, lesson: retired.lesson ?? null, notice: retired.notice ?? null };
    return { tab: DEFAULT_TAB.ml, lesson: null, notice: null };
  }
  if (TABS.some((t) => t.id === tab)) return { tab, lesson: null, notice: null };
  return { tab: DEFAULT_TAB.stats, lesson: null, notice: null };
}

// One notice per retired destination per session — a bookmark opened twice
// shouldn't nag twice.
const noticesShown = new Set();
function announce(notice) {
  if (!notice || noticesShown.has(notice)) return;
  noticesShown.add(notice);
  useToastStore.getState().addToast(notice, 'info', 7000);
}

export const useUIStore = create((set, get) => ({
  activeTab: 'map',
  selectedNodeId: null,
  breadcrumbFrom: null,
  searchQuery: '',
  chapterFilter: null,
  sessionNodesStudied: new Set(),
  traceChain: null, // { targetId, token } — token forces re-trigger on repeat clicks

  // Mode switcher (Stats | ML). mlActiveTab mirrors activeTab so each mode
  // remembers its own last-open tab independently across a switch.
  mode: 'stats',
  mlActiveTab: 'pipeline',
  // Embedded lesson to open on the active ML page (set when a retired tab
  // resolves to a lesson that now lives inside another page). Consumed and
  // cleared by the page that hosts it.
  mlLesson: null,

  setMode(mode) {
    // selectedNodeId/traceChain are Stats-graph-specific ids that don't map
    // onto the ML graph's id space, so they're cleared on switch rather than
    // carried over — "reset gracefully where it doesn't make sense to keep".
    set({ mode, selectedNodeId: null, traceChain: null, breadcrumbFrom: null });
  },

  setMLActiveTab(tab) {
    const r = resolveTab('ml', tab);
    set({ mlActiveTab: r.tab, ...(r.lesson ? { mlLesson: r.lesson } : {}) });
    announce(r.notice);
  },

  clearMLLesson() {
    set({ mlLesson: null });
  },

  // Shared cross-mode/cross-domain link slice (Module 9's geopolitical-risk
  // → Gold cross-link, Module 10's Stats↔ML bridge). A "linked concept" is a
  // small { mode, tab, payload } descriptor; consumers read it once on mount
  // and clear it, mirroring the existing breadcrumbFrom/viewOnMap pattern.
  linkedConcept: null,

  navigateToLinkedConcept(mode, tab, payload) {
    const r = resolveTab(mode, tab);
    set({ mode, linkedConcept: { tab: r.tab, payload } });
    if (mode === 'ml') set({ mlActiveTab: r.tab, ...(r.lesson ? { mlLesson: r.lesson } : {}) });
    else set({ activeTab: r.tab });
    announce(r.notice);
  },

  clearLinkedConcept() {
    set({ linkedConcept: null });
  },

  setActiveTab(tab) {
    set({ activeTab: resolveTab('stats', tab).tab });
  },

  traceFullChain(targetId) {
    set((s) => ({ traceChain: { targetId, token: (s.traceChain?.token || 0) + 1 } }));
  },

  clearTraceChain() {
    set({ traceChain: null });
  },

  trackVisit(nodeId) {
    if (!nodeId) return;
    const next = new Set(get().sessionNodesStudied);
    next.add(nodeId);
    set({ sessionNodesStudied: next });
  },

  selectNode(nodeId) {
    set({ selectedNodeId: nodeId });
    if (nodeId) get().trackVisit(nodeId);
  },

  viewOnMap(nodeId, fromTab) {
    set({ activeTab: 'map', selectedNodeId: nodeId, breadcrumbFrom: fromTab });
    get().trackVisit(nodeId);
  },

  clearBreadcrumb() {
    set({ breadcrumbFrom: null });
  },

  setSearchQuery(q) {
    set({ searchQuery: q });
  },

  setChapterFilter(chId) {
    set((s) => ({ chapterFilter: s.chapterFilter === chId ? null : chId }));
  },
}));
