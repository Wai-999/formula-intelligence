import { Suspense, lazy, useEffect, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { pageById, sectionById, pagesInSection, hashFor, isMLPage, tabOf } from '../../app/pages.js';
import { pageMeta, usePageMetaVersion } from '../../app/pageMeta.js';
import './PageHeader.css';

// ML-only, so it is loaded with the first ML page rather than with the shell.
const UnderstandingTrackerBadge = lazy(() => import('../ml/learning/UnderstandingTrackerBadge.jsx'));

/**
 * The one place a page's <h1> lives: breadcrumb, title, and the section's
 * own pages. Keeping it in the shell means every page — old or new — gets
 * the same orientation cues and exactly one top-level heading.
 */
export default function PageHeader() {
  const page = useUIStore((s) => s.page);
  const params = useUIStore((s) => s.pageParams);
  const focusMode = useUIStore((s) => s.focusMode);
  usePageMetaVersion((s) => s.version); // re-render when a title resolver registers
  const meta = pageMeta(page, params);
  const def = pageById[page];
  const siblings = def?.section && def.section !== 'home' ? pagesInSection(def.section) : [];
  const headingRef = useRef(null);
  const first = useRef(true);
  const key = hashFor(page, params);

  // After the learner navigates, move focus to the new page's heading so a
  // screen reader announces where they landed and Tab continues from the
  // top of the new content. Not on first load: focus starts at the top.
  useEffect(() => {
    document.title = page === 'home' ? 'Formula Intelligence' : `${meta.title} · Formula Intelligence`;
    if (first.current) { first.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
  }, [key, meta.title, page]);

  const isML = isMLPage(page);
  // A page reached from a tab (a map behind Maps, a lesson behind Courses)
  // shows that tab as where you are.
  const currentTab = tabOf(page);

  return (
    <div className="page-header">
      <div className="page-header-main">
        {meta.crumbs.length > 1 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              {meta.crumbs.map((c, i) => {
                const last = i === meta.crumbs.length - 1;
                const href = c.page ? hashFor(c.page, c.params) : null;
                const isHere = href === key;
                return (
                  <li key={`${c.label}-${i}`}>
                    {last || !href || isHere
                      ? <span aria-current={last ? 'page' : undefined}>{c.label}</span>
                      : <a href={href}>{c.label}</a>}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <h1 className="page-title" ref={headingRef} tabIndex={-1}>{meta.title}</h1>
      </div>
      {isML && (
        <div className="page-header-extras">
          <Suspense fallback={null}><UnderstandingTrackerBadge /></Suspense>
        </div>
      )}
      {siblings.length > 1 && !focusMode && (
        <nav className="section-nav" aria-label={`${sectionById[def.section].label} pages`}>
          <ul>
            {siblings.map((p) => {
              const active = p.id === currentTab;
              const exact = p.id === page;
              return (
                <li key={p.id}>
                  <a href={hashFor(p.id)} className={`section-nav-link${active ? ' active' : ''}`} aria-current={exact ? 'page' : active ? 'true' : undefined}>
                    {p.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
