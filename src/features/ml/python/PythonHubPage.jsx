import { useEffect, useMemo, useRef, useState } from 'react';
import { PY_SECTIONS } from '../../../data/python/index.js';
import { useUIStore } from '../../../store/useUIStore.js';
import PyEntry from './PyEntry.jsx';
import '../mlPageShared.css';
import './PythonHubPage.css';

// Cross-links into this page (same linkedConcept mechanism the Bridge page
// this hub replaced used): payload.from → the entry to open and scroll to.
const LINKED_FROM_TO_ENTRY = {
  'stats-reg': 'reg', // Stats Map DetailPanel's regression node button
  'pipeline-estimation': 'linreg', // Pipeline's estimation demo button
};

export default function PythonHubPage() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);
  const entryRefs = useRef({});

  // Same pattern (and hard-won timing lessons) as the Bridge page this
  // replaces: the delay lets the pane's display:none → flex flip lay out
  // before scrollIntoView (a no-op on hidden containers), the clear runs
  // inside the timeout so it can't cancel this effect's own timer, and
  // behavior:'auto' because smooth-scroll rAF animation doesn't reliably
  // progress during a same-tick tab switch.
  useEffect(() => {
    if (linkedConcept?.tab !== 'python') return undefined;
    const target = LINKED_FROM_TO_ENTRY[linkedConcept.payload?.from];
    if (target) setOpenId(target);
    const timer = setTimeout(() => {
      if (target) entryRefs.current[target]?.scrollIntoView({ behavior: 'auto', block: 'start' });
      clearLinkedConcept();
    }, 80);
    return () => clearTimeout(timer);
  }, [linkedConcept, clearLinkedConcept]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return PY_SECTIONS;
    return PY_SECTIONS.map((sec) => ({
      ...sec,
      groups: sec.groups
        .map((g) => ({
          ...g,
          entries: g.entries.filter(
            (e) =>
              e.name.toLowerCase().includes(q) ||
              e.id.toLowerCase().includes(q) ||
              (e.formula || '').toLowerCase().includes(q) ||
              (e.tags || []).some((t) => t.toLowerCase().includes(q)) ||
              g.label.toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.entries.length > 0),
    })).filter((sec) => sec.groups.length > 0);
  }, [q]);

  const totalShown = filtered.reduce(
    (n, sec) => n + sec.groups.reduce((m, g) => m + g.entries.length, 0),
    0
  );

  function jumpTo(id) {
    setOpenId(id);
    setTimeout(() => {
      entryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  return (
    <div className="ml-page pyhub">
      <aside className="pyhub-nav">
        <div className="pyhub-search">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search formulas & models…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search formulas and models"
          />
        </div>
        <div className="pyhub-nav-scroll">
          {filtered.map((sec) => (
            <div className="pyhub-nav-section" key={sec.id}>
              <p className="pyhub-nav-sectitle">
                <i className={`ti ${sec.icon}`} aria-hidden="true" /> {sec.label}
              </p>
              {sec.groups.map((g) => (
                <div className="pyhub-nav-group" key={g.id}>
                  <p className="pyhub-nav-grouplbl">{g.label}</p>
                  {g.entries.map((e) => (
                    <button
                      type="button"
                      key={e.id}
                      className={`pyhub-nav-link ${openId === e.id ? 'active' : ''}`}
                      onClick={() => jumpTo(e.id)}
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
          {totalShown === 0 && <p className="pyhub-nav-empty">No matches for “{query}”.</p>}
        </div>
      </aside>

      <div className="pyhub-content">
        <div className="pyhub-hero">
          <i className="ti ti-brand-python pyhub-hero-icon" aria-hidden="true" />
          <div>
            <p className="pyhub-hero-title">Python Implementation Hub</p>
            <p className="pyhub-hero-sub">
              Every statistical formula and ML model in this app, as production-quality Python —
              with the professional reasoning behind when (and when not) to reach for each one.
            </p>
          </div>
          <span className="pyhub-hero-count">{totalShown} topics</span>
        </div>

        {filtered.map((sec) => (
          <section className="pyhub-section" key={sec.id}>
            <h2 className="pyhub-sectitle">
              <i className={`ti ${sec.icon}`} aria-hidden="true" /> {sec.label}
            </h2>
            {sec.groups.map((g) => (
              <div className="pyhub-group" key={g.id}>
                <h3 className="pyhub-grouptitle">{g.label}</h3>
                {g.entries.map((e) => (
                  <PyEntry
                    key={e.id}
                    entry={e}
                    open={openId === e.id}
                    onToggle={() => setOpenId(openId === e.id ? null : e.id)}
                    innerRef={(el) => { entryRefs.current[e.id] = el; }}
                  />
                ))}
              </div>
            ))}
          </section>
        ))}
        {totalShown === 0 && (
          <p className="pyhub-empty">Nothing matches “{query}” — try a formula name, model, or tag.</p>
        )}
      </div>
    </div>
  );
}
