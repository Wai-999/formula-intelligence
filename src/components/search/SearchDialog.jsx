import { useEffect, useMemo, useRef, useState } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { openTarget } from '../../lib/openTarget.js';
import './SearchDialog.css';

let indexPromise = null;
function loadIndex() {
  indexPromise ??= import('../../lib/searchIndex.js').then((m) => ({ ...m, index: m.buildIndex() }));
  return indexPromise;
}


/**
 * Cmd/Ctrl+K search over lessons, courses, concepts, formulas, models and
 * pages. A combobox + listbox, so arrow keys move through results while
 * typing continues in the field and a screen reader hears each one.
 */
export default function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState('');
  const [lib, setLib] = useState(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;
    let live = true;
    loadIndex().then((m) => { if (live) setLib(m); });
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      live = false;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  // Grouped by kind, groups ordered by their best result, so the list reads
  // "Lessons…, Formulas…" instead of alternating kinds row by row.
  const groups = useMemo(() => {
    if (!lib) return [];
    const byKind = new Map();
    for (const r of lib.search(lib.index, query)) {
      if (!byKind.has(r.kind)) byKind.set(r.kind, []);
      byKind.get(r.kind).push(r);
    }
    return [...byKind.entries()].map(([kind, items]) => ({ kind, label: lib.KIND_LABEL[kind], items }));
  }, [lib, query]);
  const results = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  const close = () => { setOpen(false); setQuery(''); };
  const choose = (r) => { close(); openTarget(r.target); };

  function onKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter' && results[active]) { e.preventDefault(); choose(results[active]); return; }
    if (e.key === 'Tab') {
      // Keep focus inside the dialog: the field and the close button.
      const focusables = e.currentTarget.querySelectorAll('input, button');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  let n = -1;
  const activeId = results[active] ? `search-opt-${active}` : undefined;

  return (
    <div className="search-scrim" role="presentation" onClick={close}>
      <div
        className="search-card"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="search-field">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search lessons, formulas, models and pages"
            placeholder="Search lessons, formulas, models, pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="search-close" onClick={close} aria-label="Close search">
            <kbd>Esc</kbd>
          </button>
        </div>

        <div id="search-results" className="search-results" role="listbox" aria-label="Results">
          {groups.map((g) => (
            <div key={g.kind} role="group" aria-labelledby={`search-grp-${g.kind}`} className="search-group">
              <div id={`search-grp-${g.kind}`} role="presentation" className="search-kind">{g.label}</div>
              {g.items.map((r) => {
                n += 1;
                const i = n;
                return (
                  <div
                    key={r.id}
                    id={`search-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    className={`search-option${i === active ? ' active' : ''}`}
                    onMouseMove={() => setActive(i)}
                    onClick={() => choose(r)}
                  >
                    <span className="search-title">{r.title}</span>
                    {r.subtitle && <span className="search-sub">{r.subtitle}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <p className="search-status" role="status">
          {!lib && 'Loading the index…'}
          {lib && query && results.length === 0 && `Nothing matches “${query}”. Try fewer or different words.`}
          {lib && query && results.length > 0 && `${results.length} result${results.length === 1 ? '' : 's'}. Use the arrow keys, then Enter.`}
          {lib && !query && 'Type to search. Every word must match.'}
        </p>
      </div>
    </div>
  );
}
