import { create } from 'zustand';

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

  setMode(mode) {
    // selectedNodeId/traceChain are Stats-graph-specific ids that don't map
    // onto the ML graph's id space, so they're cleared on switch rather than
    // carried over — "reset gracefully where it doesn't make sense to keep".
    set({ mode, selectedNodeId: null, traceChain: null, breadcrumbFrom: null });
  },

  setMLActiveTab(tab) {
    set({ mlActiveTab: tab });
  },

  // Shared cross-mode/cross-domain link slice (Module 9's geopolitical-risk
  // → Gold cross-link, Module 10's Stats↔ML bridge). A "linked concept" is a
  // small { mode, tab, payload } descriptor; consumers read it once on mount
  // and clear it, mirroring the existing breadcrumbFrom/viewOnMap pattern.
  linkedConcept: null,

  navigateToLinkedConcept(mode, tab, payload) {
    set({ mode, linkedConcept: { tab, payload } });
    if (mode === 'ml') set({ mlActiveTab: tab });
    else set({ activeTab: tab });
  },

  clearLinkedConcept() {
    set({ linkedConcept: null });
  },

  setActiveTab(tab) {
    set({ activeTab: tab });
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
