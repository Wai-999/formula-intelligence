// The app's information architecture (Master Prompt V3.1 §3), as plain data.
//
// Seven primary sections — Home, Learn, Knowledge Maps, Practice, Projects,
// Progress, Notebook — each with a small set of pages. This replaced the
// two-mode shell (Stats | ML, each with its own tab rail), so every page
// that existed before is listed here with `legacy`: the { mode, tab } it
// used to be. The store maps old setters onto pages through it, which is
// why no existing cross-link had to change, and the router maps old
// #stats/x and #ml/x bookmarks the same way.
//
// No React here on purpose: the store, the router, tests and scripts import
// this module. Page components are attached in src/app/pageComponents.js.

export const SECTIONS = [
  { id: 'home', label: 'Home', icon: 'ti-home' },
  { id: 'learn', label: 'Learn', icon: 'ti-school' },
  { id: 'maps', label: 'Knowledge Maps', shortLabel: 'Maps', icon: 'ti-topology-star-3' },
  { id: 'practice', label: 'Practice', icon: 'ti-target-arrow' },
  { id: 'projects', label: 'Projects', icon: 'ti-flask-2' },
  { id: 'progress', label: 'Progress', icon: 'ti-chart-bar' },
  { id: 'notebook', label: 'Notebook', icon: 'ti-notebook' },
];

// Order within a section is the order of its sub-navigation.
export const PAGES = [
  { id: 'home', section: 'home', title: 'Home' },

  { id: 'learn/courses', section: 'learn', title: 'Courses' },
  { id: 'learn/paths', section: 'learn', title: 'Learning paths', legacy: { mode: 'stats', tab: 'path' } },
  { id: 'learn/stories', section: 'learn', title: 'Case studies', legacy: { mode: 'stats', tab: 'story' } },
  { id: 'learn/ml', section: 'learn', title: 'ML pipeline', legacy: { mode: 'ml', tab: 'pipeline' } },
  // Reached from a course, never listed in the sub-navigation.
  { id: 'learn/course', section: 'learn', title: 'Course', param: 'courseId', hidden: true },
  { id: 'learn/lesson', section: 'learn', title: 'Lesson', param: 'lessonId', hidden: true },

  { id: 'maps/concepts', section: 'maps', title: 'Concept map', param: 'conceptId' },
  { id: 'maps/formulas', section: 'maps', title: 'Formula map', legacy: { mode: 'stats', tab: 'map' } },
  { id: 'maps/models', section: 'maps', title: 'Model map', legacy: { mode: 'ml', tab: 'modelmap' } },
  { id: 'maps/knowledge', section: 'maps', title: 'Careers & applications' },

  { id: 'practice/review', section: 'practice', title: 'Review', legacy: { mode: 'stats', tab: 'flashcards' } },
  { id: 'practice/mixed', section: 'practice', title: 'Mixed practice' },
  { id: 'practice/quiz', section: 'practice', title: 'Quiz', legacy: { mode: 'stats', tab: 'quiz' } },
  { id: 'practice/problems', section: 'practice', title: 'Problems', legacy: { mode: 'stats', tab: 'practice' } },
  { id: 'practice/code', section: 'practice', title: 'Code exercises' },
  { id: 'practice/python', section: 'practice', title: 'Python library', legacy: { mode: 'ml', tab: 'python' } },

  { id: 'projects/list', section: 'projects', title: 'Projects' },
  { id: 'projects/lab', section: 'projects', title: 'Python lab', legacy: { mode: 'ml', tab: 'pylab' } },

  { id: 'progress/overview', section: 'progress', title: 'Overview', legacy: { mode: 'stats', tab: 'dashboard' } },
  { id: 'progress/diagnostic', section: 'progress', title: 'Diagnostic' },
  { id: 'progress/errors', section: 'progress', title: 'Error log', legacy: { mode: 'stats', tab: 'errors' } },

  { id: 'notebook/journal', section: 'notebook', title: 'Journal', legacy: { mode: 'stats', tab: 'journal' } },
  { id: 'notebook/notes', section: 'notebook', title: 'Lesson notes' },

  // Outside the primary navigation: reached from the header and the More menu.
  { id: 'settings', section: null, title: 'Settings' },
  { id: 'sources', section: null, title: 'Sources & data provenance', legacy: { mode: 'ml', tab: 'sources' } },
];

export const DEFAULT_PAGE = 'home';

export const pageById = Object.fromEntries(PAGES.map((p) => [p.id, p]));
export const sectionById = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

export function pagesInSection(sectionId) {
  return PAGES.filter((p) => p.section === sectionId && !p.hidden);
}

/** The page a section opens on: its first listed page. */
export function sectionHome(sectionId) {
  return pagesInSection(sectionId)[0]?.id ?? DEFAULT_PAGE;
}

const LEGACY_TO_PAGE = {
  stats: Object.fromEntries(PAGES.filter((p) => p.legacy?.mode === 'stats').map((p) => [p.legacy.tab, p.id])),
  ml: Object.fromEntries(PAGES.filter((p) => p.legacy?.mode === 'ml').map((p) => [p.legacy.tab, p.id])),
};

/** The page an old { mode, tab } now lives on, or null. */
export function pageForLegacy(mode, tab) {
  return LEGACY_TO_PAGE[mode]?.[tab] ?? null;
}

/** Location hash for a page: "#maps/formulas", "#learn/lesson/alg1-slope". */
export function hashFor(pageId, params = {}) {
  const page = pageById[pageId];
  if (!page) return `#${DEFAULT_PAGE}`;
  const value = page.param ? params[page.param] : null;
  return value ? `#${page.id}/${encodeURIComponent(value)}` : `#${page.id}`;
}

/**
 * Parse a location hash. Returns { kind: 'page', page, params } for this
 * app's format, { kind: 'legacy', mode, tab } for an old #stats/x or #ml/x
 * bookmark, or null for anything unrecognised.
 */
export function parseHash(hash) {
  const raw = decodeURIComponent(String(hash || '').replace(/^#\/?/, ''));
  if (!raw) return null;
  const parts = raw.split('/');
  if (parts[0] === 'stats' || parts[0] === 'ml') return { kind: 'legacy', mode: parts[0], tab: parts[1] || null };
  if (pageById[raw]) return { kind: 'page', page: raw, params: {} };
  const base = `${parts[0]}/${parts[1]}`;
  const page = pageById[base];
  if (page?.param && parts.length >= 3) {
    return { kind: 'page', page: base, params: { [page.param]: parts.slice(2).join('/') } };
  }
  if (sectionById[parts[0]] && parts.length === 1) return { kind: 'page', page: sectionHome(parts[0]), params: {} };
  return null;
}
