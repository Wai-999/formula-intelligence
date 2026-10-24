import { useEffect, useRef, useState } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { SECTIONS, pageById, sectionHome, hashFor } from '../../app/pages.js';
import DepthToggle from './DepthToggle.jsx';
import './BottomNav.css';

// Phones get the four sections a learner reaches for most, plus More (§3:
// "a small prioritized navigation set and an accessible More menu").
const PRIMARY = ['home', 'learn', 'maps', 'practice'];
const MORE_SECTIONS = SECTIONS.filter((s) => !PRIMARY.includes(s.id));
const MORE_PAGES = [
  { page: 'settings', label: 'Settings', icon: 'ti-settings' },
  { page: 'sources', label: 'Sources & data', icon: 'ti-license' },
];

export default function BottomNav({ onShowShortcuts }) {
  const page = useUIStore((s) => s.page);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const moreRef = useRef(null);
  const currentSection = pageById[page]?.section ?? null;
  const moreActive = !PRIMARY.includes(currentSection);

  // Navigating from the sheet closes it.
  useEffect(() => { setOpen(false); }, [page]);

  useEffect(() => {
    if (!open) return undefined;
    sheetRef.current?.querySelector('a, button')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        moreRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  return (
    <>
      {open && (
        <div className="more-scrim" role="presentation" onClick={() => setOpen(false)}>
          <div
            id="more-sheet"
            className="more-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="More"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="more-list">
              {MORE_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={hashFor(sectionHome(s.id))} className="more-link" aria-current={s.id === currentSection ? 'page' : undefined}>
                    <i className={`ti ${s.icon}`} aria-hidden="true" /> {s.label}
                  </a>
                </li>
              ))}
              {MORE_PAGES.map((p) => (
                <li key={p.page}>
                  <a href={hashFor(p.page)} className="more-link" aria-current={p.page === page ? 'page' : undefined}>
                    <i className={`ti ${p.icon}`} aria-hidden="true" /> {p.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" className="more-link" onClick={() => { setOpen(false); setSearchOpen(true); }}>
                  <i className="ti ti-search" aria-hidden="true" /> Search
                </button>
              </li>
              <li>
                <button type="button" className="more-link" onClick={() => { setOpen(false); onShowShortcuts(); }}>
                  <i className="ti ti-keyboard" aria-hidden="true" /> Keyboard shortcuts
                </button>
              </li>
            </ul>
            <div className="more-depth">
              <span className="more-depth-label" id="more-depth-label">Explanation depth</span>
              <DepthToggle labelledBy="more-depth-label" />
            </div>
          </div>
        </div>
      )}
      <nav className="bottom-nav" aria-label="Primary">
        <ul className="bottom-nav-list">
          {PRIMARY.map((id) => {
            const s = SECTIONS.find((x) => x.id === id);
            const active = id === currentSection;
            return (
              <li key={id}>
                <a href={hashFor(sectionHome(id))} className={`bottom-nav-link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
                  <i className={`ti ${s.icon}`} aria-hidden="true" />
                  <span>{s.shortLabel ?? s.label}</span>
                </a>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              ref={moreRef}
              className={`bottom-nav-link${moreActive ? ' active' : ''}`}
              aria-expanded={open}
              aria-controls="more-sheet"
              aria-haspopup="dialog"
              onClick={() => setOpen((o) => !o)}
            >
              <i className="ti ti-dots" aria-hidden="true" />
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
