import { useUIStore } from '../../store/useUIStore.js';
import { SECTIONS, pageById, sectionHome, hashFor } from '../../app/pages.js';
import './BottomNav.css';

// Phones get all five destinations (V4 §3: "five top-level destinations
// maximum"), so there is no "More" menu to hunt through: search sits in the
// header, settings under My Progress.
export default function BottomNav() {
  const page = useUIStore((s) => s.page);
  const currentSection = pageById[page]?.section ?? null;

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ul className="bottom-nav-list">
        {SECTIONS.map((s) => {
          const active = s.id === currentSection;
          return (
            <li key={s.id}>
              <a href={hashFor(sectionHome(s.id))} className={`bottom-nav-link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
                <i className={`ti ${s.icon}`} aria-hidden="true" />
                <span>{s.shortLabel ?? s.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
