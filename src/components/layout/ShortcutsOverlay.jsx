import { useEffect, useRef } from 'react';
import { SHORTCUTS } from '../../lib/shortcuts.js';
import './ShortcutsOverlay.css';

// Generated from the same table the handler reads, so the documented
// shortcuts and the working ones cannot drift apart.
export default function ShortcutsOverlay({ open, onClose }) {
  const closeRef = useRef(null);

  // Move focus into the dialog when it opens, so a keyboard user is not
  // left with focus behind the overlay.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const groups = SHORTCUTS.reduce((acc, s) => {
    (acc[s.group] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="sc-backdrop" onClick={onClose} role="presentation">
      <div
        className="sc-card"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sc-head">
          <p className="sc-title"><i className="ti ti-keyboard" aria-hidden="true" /> Keyboard shortcuts</p>
          <button type="button" className="sc-close" onClick={onClose} ref={closeRef} aria-label="Close shortcuts">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {Object.entries(groups).map(([group, list]) => (
          <div className="sc-group" key={group}>
            <p className="sc-group-title">{group}</p>
            {list.map((s) => (
              <div className="sc-row" key={s.label}>
                <span className="sc-keys">
                  {s.keys.map((k) => (k === '–'
                    ? <span className="sc-dash" key={k}>–</span>
                    : <kbd key={k}>{k}</kbd>))}
                </span>
                <span className="sc-label">{s.label}</span>
              </div>
            ))}
          </div>
        ))}

        <p className="sc-foot">Shortcuts pause while you are typing in a field.</p>
      </div>
    </div>
  );
}
