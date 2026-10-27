// The app's information architecture (V4 brief §3; docs/v4/SIMPLIFICATION_PLAN.md),
// as plain data.
//
// Five destinations — Home, Learn, Practice, Apply, My Progress. V3.1 had
// seven (Knowledge Maps and Notebook were their own sections); V4 folds the
// maps into Learn, Python and case studies into Apply, and notes and
// settings into My Progress. Pages that existed before keep working through
// two tables below: LEGACY maps the two-mode app's { mode, tab } (and its
// #stats/x, #ml/x bookmarks) onto pages, and RENAMED maps V3.1 page ids.
//
// Page fields:
//   section  the destination it belongs to (null: outside the navigation)
//   param    the name of its one parameter, if it takes one
//   hidden   needs its parameter (a course, a lesson): never listed alone
//   nav      false: a real page, audited and searchable, but not a tab of
//            its own — it is reached from `parent`
//   parent   the tab shown as current, and the breadcrumb step above it
//
// No React here on purpose: the store, the router, tests and scripts import
// this module. Page components are attached in src/app/pageComponents.js.

export const SECTIONS = [
  { id: 'home', label: 'Home', icon: 'ti-home' },
  { id: 'learn', label: 'Learn', icon: 'ti-school' },
  { id: 'practice', label: 'Practice', icon: 'ti-target-arrow' },
  { id: 'apply', label: 'Apply', icon: 'ti-flask-2' },
  { id: 'progress', label: 'My Progress', shortLabel: 'Progress', icon: 'ti-chart-bar' },
];

// Order within a section is the order of its sub-navigation.
export const PAGES = [
  { id: 'home', section: 'home', title: 'Home' },

  { id: 'learn/courses', section: 'learn', title: 'Courses' },
  { id: 'learn/placement', section: 'learn', title: 'Placement' },
  { id: 'learn/ml', section: 'learn', title: 'ML pipeline' },
  { id: 'learn/maps', section: 'learn', title: 'Maps' },
  // Reached from Courses, never listed in the sub-navigation.
  { id: 'learn/course', section: 'learn', title: 'Course', param: 'courseId', hidden: true, parent: 'learn/courses' },
  { id: 'learn/lesson', section: 'learn', title: 'Lesson', param: 'lessonId', hidden: true, parent: 'learn/courses' },
  // Where "Finish study session" lands: what was saved, and where to go next.
  { id: 'learn/session', section: 'learn', title: 'Study session', hidden: true, parent: 'learn/courses' },
  // Behind Learn → Maps (and every lesson's "See connections").
  { id: 'learn/concepts', section: 'learn', title: 'Concept map', param: 'conceptId', nav: false, parent: 'learn/maps' },
  { id: 'learn/formulas', section: 'learn', title: 'Formula map', nav: false, parent: 'learn/maps' },
  { id: 'learn/models', section: 'learn', title: 'Model map', nav: false, parent: 'learn/maps' },
  { id: 'learn/careers', section: 'learn', title: 'Careers & applications', nav: false, parent: 'learn/maps' },
  { id: 'learn/paths', section: 'learn', title: 'Formula paths', nav: false, parent: 'learn/maps' },

  { id: 'practice/review', section: 'practice', title: 'Review' },
  { id: 'practice/formulas', section: 'practice', title: 'Formula drills', param: 'mode' },

  { id: 'apply/projects', section: 'apply', title: 'Projects' },
  { id: 'apply/cases', section: 'apply', title: 'Case studies' },
  { id: 'apply/exercises', section: 'apply', title: 'Code exercises' },
  { id: 'apply/lab', section: 'apply', title: 'Python lab' },
  { id: 'apply/library', section: 'apply', title: 'Python library', nav: false, parent: 'apply/lab' },

  { id: 'progress/overview', section: 'progress', title: 'Overview' },
  { id: 'progress/notebook', section: 'progress', title: 'Notebook', param: 'view' },
  { id: 'progress/errors', section: 'progress', title: 'Error log' },
  { id: 'progress/settings', section: 'progress', title: 'Settings' },

  // Outside the navigation: linked from Settings, lessons and projects.
  { id: 'sources', section: null, title: 'Sources & data provenance' },
];

// The two-mode app's tabs (and #stats/x, #ml/x bookmarks) → where each lives.
// A tab with params opens that view of a page with several (Formula drills).
const LEGACY = [
  { mode: 'stats', tab: 'map', page: 'learn/formulas' },
  { mode: 'stats', tab: 'path', page: 'learn/paths' },
  { mode: 'stats', tab: 'story', page: 'apply/cases' },
  { mode: 'stats', tab: 'flashcards', page: 'practice/formulas', params: { mode: 'flashcards' } },
  { mode: 'stats', tab: 'quiz', page: 'practice/formulas', params: { mode: 'quiz' } },
  { mode: 'stats', tab: 'practice', page: 'practice/formulas', params: { mode: 'problems' } },
  { mode: 'stats', tab: 'dashboard', page: 'progress/overview' },
  { mode: 'stats', tab: 'errors', page: 'progress/errors' },
  { mode: 'stats', tab: 'journal', page: 'progress/notebook', params: { view: 'journal' } },
  { mode: 'ml', tab: 'pipeline', page: 'learn/ml' },
  { mode: 'ml', tab: 'modelmap', page: 'learn/models' },
  { mode: 'ml', tab: 'python', page: 'apply/library' },
  { mode: 'ml', tab: 'pylab', page: 'apply/lab' },
  { mode: 'ml', tab: 'sources', page: 'sources' },
];

// V3.1 page ids → V4 (docs/v4/SIMPLIFICATION_PLAN.md, "Address and state
// migration"). The old id's parameter, if any, carries over.
export const RENAMED = {
  'maps/concepts': { page: 'learn/concepts' },
  'maps/formulas': { page: 'learn/formulas' },
  'maps/models': { page: 'learn/models' },
  'maps/knowledge': { page: 'learn/careers' },
  'learn/stories': { page: 'apply/cases' },
  'practice/mixed': { page: 'practice/review' },
  'practice/quiz': { page: 'practice/formulas', params: { mode: 'quiz' } },
  'practice/problems': { page: 'practice/formulas', params: { mode: 'problems' } },
  'practice/code': { page: 'apply/exercises' },
  'practice/python': { page: 'apply/library' },
  'projects/list': { page: 'apply/projects' },
  'projects/lab': { page: 'apply/lab' },
  'progress/diagnostic': { page: 'learn/placement' },
  'notebook/notes': { page: 'progress/notebook', params: { view: 'notes' } },
  'notebook/journal': { page: 'progress/notebook', params: { view: 'journal' } },
  settings: { page: 'progress/settings' },
};
// Old section names, for a bare "#maps" or "#projects".
const RENAMED_SECTIONS = { maps: 'learn/maps', projects: 'apply/projects', notebook: 'progress/notebook' };

export const DEFAULT_PAGE = 'home';

export const pageById = Object.fromEntries(PAGES.map((p) => [p.id, p]));
export const sectionById = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

/** The tabs of a section's sub-navigation, in order. */
export function pagesInSection(sectionId) {
  return PAGES.filter((p) => p.section === sectionId && !p.hidden && p.nav !== false);
}

/** The page a section opens on: its first tab. */
export function sectionHome(sectionId) {
  return pagesInSection(sectionId)[0]?.id ?? DEFAULT_PAGE;
}

/** The tab that is current while `pageId` is shown: itself, or its parent. */
export function tabOf(pageId) {
  const page = pageById[pageId];
  return page?.parent ?? pageId;
}

/** Where an old { mode, tab } now lives: { page, params }, or null. */
export function pageForLegacy(mode, tab) {
  const hit = LEGACY.find((l) => l.mode === mode && l.tab === tab);
  return hit ? { page: hit.page, params: hit.params ?? {} } : null;
}

/** The old { mode, tab } a page instance stands for (legacy components still read it), or null. */
export function legacyOf(pageId, params = {}) {
  return LEGACY.find((l) => l.page === pageId && Object.entries(l.params ?? {}).every(([k, v]) => params[k] === v))
    ?? LEGACY.find((l) => l.page === pageId && !l.params)
    ?? null;
}

/** Pages that host the former ML mode's content (its depth badge and intro banner). */
export function isMLPage(pageId) {
  return LEGACY.some((l) => l.mode === 'ml' && l.page === pageId);
}

/** Location hash for a page: "#learn/formulas", "#learn/lesson/a1-slope". */
export function hashFor(pageId, params = {}) {
  const page = pageById[pageId];
  if (!page) return `#${DEFAULT_PAGE}`;
  const value = page.param ? params[page.param] : null;
  return value ? `#${page.id}/${encodeURIComponent(value)}` : `#${page.id}`;
}

/**
 * Parse a location hash. Returns { kind: 'page', page, params } for this
 * app's format (V3.1 ids included, through RENAMED), { kind: 'legacy',
 * mode, tab } for an old #stats/x or #ml/x bookmark, or null for anything
 * unrecognised.
 */
export function parseHash(hash) {
  const raw = decodeURIComponent(String(hash || '').replace(/^#\/?/, ''));
  if (!raw) return null;
  const parts = raw.split('/');
  if (parts[0] === 'stats' || parts[0] === 'ml') return { kind: 'legacy', mode: parts[0], tab: parts[1] || null };
  const renamed = (id, value) => {
    const r = RENAMED[id];
    const target = pageById[r.page];
    const params = { ...(r.params ?? {}) };
    if (value != null && target.param) params[target.param] = value;
    return { kind: 'page', page: r.page, params };
  };
  if (pageById[raw]) return { kind: 'page', page: raw, params: {} };
  if (Object.hasOwn(RENAMED, raw)) return renamed(raw, null);
  const base = `${parts[0]}/${parts[1]}`;
  const rest = parts.length >= 3 ? parts.slice(2).join('/') : null;
  const page = pageById[base];
  if (page?.param && rest != null) return { kind: 'page', page: base, params: { [page.param]: rest } };
  if (Object.hasOwn(RENAMED, base) && rest != null) return renamed(base, rest);
  if (parts.length === 1) {
    if (sectionById[parts[0]]) return { kind: 'page', page: sectionHome(parts[0]), params: {} };
    if (Object.hasOwn(RENAMED_SECTIONS, parts[0])) return { kind: 'page', page: RENAMED_SECTIONS[parts[0]], params: {} };
  }
  return null;
}
