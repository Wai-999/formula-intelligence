import { create } from 'zustand';
import { pageById, sectionById, sectionHome } from './pages.js';

// Resolvers for pages whose title depends on their parameter (a course, a
// lesson). Registered by the module that owns the data, so the shell never
// imports curriculum content itself — only the small index each resolver
// needs.
const resolvers = {};

// Bumped on every registration so the page header re-renders: resolvers are
// registered when the module owning the data loads (the curriculum index
// loads with the course and lesson pages), which can be after the header
// first rendered the generic title.
export const usePageMetaVersion = create(() => ({ version: 0 }));

export function registerPageMeta(pageId, resolve) {
  resolvers[pageId] = resolve;
  usePageMetaVersion.setState((s) => ({ version: s.version + 1 }));
}

/**
 * The visible title and breadcrumb trail for a page instance.
 * crumbs: [{ label, page, params }] — every entry but the last is a link.
 */
export function pageMeta(pageId, params = {}) {
  const page = pageById[pageId];
  if (!page) return { title: 'Page not found', crumbs: [] };
  const section = page.section ? sectionById[page.section] : null;
  const base = section && section.id !== 'home'
    ? [{ label: section.label, page: sectionHome(section.id), params: {} }]
    : [];
  // A page behind a tab gets that tab as a step ("Learn / Maps / Concept
  // map"), unless the tab is where the section link already goes.
  const parent = page.parent && pageById[page.parent];
  if (parent && parent.id !== sectionHome(section?.id)) base.push({ label: parent.title, page: parent.id, params: {} });
  const custom = resolvers[pageId]?.(params);
  if (custom) {
    return { title: custom.title, crumbs: [...base, ...(custom.crumbs ?? []), { label: custom.title }] };
  }
  return { title: page.title, crumbs: [...base, { label: page.title }] };
}
