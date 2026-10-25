import { create } from 'zustand';
import { ML_TABS } from './useMLUIStore.js';
import { useToastStore } from './useToastStore.js';
import { ML_LESSONS } from '../data/ml/lessons.js';
import { pageById, pageForLegacy, legacyOf, DEFAULT_PAGE } from '../app/pages.js';
import { loadJSON, saveJSON } from '../lib/storage.js';
import { STORAGE_KEYS } from '../data/storageKeys.js';

const navPrefs = loadJSON(STORAGE_KEYS.navPrefs, { collapsed: false });

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
const LAB_NOTICE = (name) => `The ${name} forecasting lab was retired when ML mode was reorganised into lessons. You're on the ML Pipeline instead.`;
export const RETIRED_ML_TABS = {
  bridge: { tab: 'pipeline', notice: 'The Stats ↔ ML comparison page was retired; its comparisons now live in the ML lessons.' },
  gold: { tab: 'pipeline', notice: LAB_NOTICE('Gold') },
  macro: { tab: 'pipeline', notice: LAB_NOTICE('Macro (GDP nowcasting)') },
  micro: { tab: 'pipeline', notice: LAB_NOTICE('Micro (retail demand)') },
  politics: { tab: 'pipeline', notice: LAB_NOTICE('Politics') },
  // Rehomed, not retired: these open their lesson on the host page.
  ...Object.fromEntries(ML_LESSONS.map((l) => [l.retiredTab, {
    tab: l.host,
    lesson: l.id,
    notice: `This tab became the lesson "${l.title}" — opened for you below.`,
  }])),
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

// Map an old { mode, tab } onto the page that now hosts it, keeping the
// legacy fields in step so nothing that still reads them is surprised.
function legacyPatch(mode, tab) {
  const tabField = mode === 'ml' ? { mlActiveTab: tab } : { activeTab: tab };
  const target = pageForLegacy(mode, tab) ?? { page: DEFAULT_PAGE, params: {} };
  return { mode, ...tabField, page: target.page, pageParams: target.params };
}

export const useUIStore = create((set, get) => ({
  // The page the shell shows (src/app/pages.js) and its parameters, e.g.
  // { lessonId } for 'learn/lesson'. This is the source of truth for
  // navigation since the V3.1 information architecture (§3).
  page: DEFAULT_PAGE,
  pageParams: {},

  // Shell chrome. Focus mode hides the navigation while studying (§10
  // "distraction-free focus mode"); it is per-visit on purpose, so nobody
  // returns days later to an app with its navigation mysteriously missing.
  focusMode: false,
  searchOpen: false,
  navCollapsed: navPrefs.collapsed === true,

  toggleFocusMode() {
    set((s) => ({ focusMode: !s.focusMode }));
  },
  setSearchOpen(open) {
    set({ searchOpen: open });
  },
  toggleNavCollapsed() {
    const collapsed = !get().navCollapsed;
    saveJSON(STORAGE_KEYS.navPrefs, { collapsed });
    set({ navCollapsed: collapsed });
  },

  activeTab: 'map',
  selectedNodeId: null,
  breadcrumbFrom: null,
  searchQuery: '',
  chapterFilter: null,
  sessionNodesStudied: new Set(),
  traceChain: null, // { targetId, token } — token forces re-trigger on repeat clicks

  // Legacy view state. Before V3.1 the app had two modes (Stats | ML), each
  // with its own tab. Pages and cross-links still call the old setters
  // below; each now also moves `page`, so every existing link keeps working.
  mode: 'stats',
  mlActiveTab: 'pipeline',
  // Embedded lesson to open on the active ML page (set when a retired tab
  // resolves to a lesson that now lives inside another page). Consumed and
  // cleared by the page that hosts it.
  mlLesson: null,

  /** Navigate to a page of the new information architecture. */
  goTo(pageId, params = {}) {
    const page = pageById[pageId] ? pageId : DEFAULT_PAGE;
    const legacy = legacyOf(page, params);
    set({
      page,
      pageParams: params,
      ...(legacy ? (legacy.mode === 'ml' ? { mode: 'ml', mlActiveTab: legacy.tab } : { mode: 'stats', activeTab: legacy.tab }) : {}),
    });
  },

  setMode(mode) {
    // selectedNodeId/traceChain are Stats-graph-specific ids that don't map
    // onto the ML graph's id space, so they're cleared on switch rather than
    // carried over — "reset gracefully where it doesn't make sense to keep".
    const tab = mode === 'ml' ? get().mlActiveTab : get().activeTab;
    set({ ...legacyPatch(mode, tab), selectedNodeId: null, traceChain: null, breadcrumbFrom: null });
  },

  setMLActiveTab(tab) {
    const r = resolveTab('ml', tab);
    set({ ...legacyPatch('ml', r.tab), ...(r.lesson ? { mlLesson: r.lesson } : {}) });
    announce(r.notice);
  },

  clearMLLesson() {
    set({ mlLesson: null });
  },

  openMLLesson(lessonId) {
    const lesson = ML_LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return;
    set({ ...legacyPatch('ml', lesson.host), mlLesson: lesson.id, selectedNodeId: null, traceChain: null, breadcrumbFrom: null });
  },

  // Shared cross-page link slice (e.g. a Stats formula → its Python Hub
  // entry). A "linked concept" is a small { tab, payload } descriptor;
  // consumers read it once on mount and clear it, mirroring the existing
  // breadcrumbFrom/viewOnMap pattern.
  linkedConcept: null,

  navigateToLinkedConcept(mode, tab, payload) {
    const r = resolveTab(mode, tab);
    set({ ...legacyPatch(mode, r.tab), linkedConcept: { tab: r.tab, payload }, ...(r.lesson ? { mlLesson: r.lesson } : {}) });
    announce(r.notice);
  },

  clearLinkedConcept() {
    set({ linkedConcept: null });
  },

  setActiveTab(tab) {
    set(legacyPatch('stats', resolveTab('stats', tab).tab));
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
    set({ ...legacyPatch('stats', 'map'), selectedNodeId: nodeId, breadcrumbFrom: fromTab });
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
