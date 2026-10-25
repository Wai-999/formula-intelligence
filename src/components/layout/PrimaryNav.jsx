import { useUIStore } from '../../store/useUIStore.js';
import { SECTIONS, pageById, sectionHome, hashFor } from '../../app/pages.js';
import './PrimaryNav.css';

/**
 * The five destinations (V4 §3), as real links so they can be opened in a
 * new tab, bookmarked and read out as links. One component serves two
 * layouts, chosen purely by CSS: a labelled sidebar from 1024 px (which the
 * learner can collapse to icons) and a compact labelled rail from 768 px.
 * Below 768 px the bottom bar takes over (BottomNav.jsx).
 */
export default function PrimaryNav() {
  const page = useUIStore((s) => s.page);
  const collapsed = useUIStore((s) => s.navCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleNavCollapsed);
  const currentSection = pageById[page]?.section ?? null;

  return (
    <nav className={`primary-nav${collapsed ? ' collapsed' : ''}`} aria-label="Primary">
      <ul className="primary-nav-list">
        {SECTIONS.map((s, i) => {
          const active = s.id === currentSection;
          return (
            <li key={s.id}>
              <a
                href={hashFor(sectionHome(s.id))}
                className={`primary-nav-link${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? `${s.label} (${i + 1})` : undefined}
              >
                <i className={`ti ${s.icon}`} aria-hidden="true" />
                <span className="primary-nav-label">{s.label}</span>
                <span className="primary-nav-short" aria-hidden="true">{s.shortLabel ?? s.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="primary-nav-collapse"
        onClick={toggleCollapsed}
        aria-pressed={collapsed}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      >
        <i className={`ti ${collapsed ? 'ti-layout-sidebar-left-expand' : 'ti-layout-sidebar-left-collapse'}`} aria-hidden="true" />
      </button>
    </nav>
  );
}
