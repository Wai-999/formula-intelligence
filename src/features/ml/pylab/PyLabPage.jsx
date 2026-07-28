import { useEffect, useRef, useState } from 'react';
import { usePyLabStore } from '../../../store/usePyLabStore.js';
import { runPython } from '../../../lib/pyodideRunner.js';
import { RUNTIME_NOTE } from '../../../data/python/runnability.js';
import { useUIStore } from '../../../store/useUIStore.js';
import '../mlPageShared.css';
import './PyLabPage.css';

// The Hub made 110 samples runnable but read-only; this is where a learner
// writes their own. It is the smaller, genuinely useful core of the backlog's
// "Dashboard Builder / Project Studio" — see MASTER_PRD §5.6 for why that
// scope was narrowed rather than attempted whole.
//
// The editor is a plain textarea with tab handling rather than CodeMirror or
// Monaco. Those are 200KB–2MB dependencies for syntax colouring in a box
// people will mostly paste into and tweak; the project's standing bias is to
// not take a dependency until the absence hurts.
export default function PyLabPage() {
  const notebooks = usePyLabStore((s) => s.notebooks);
  const activeId = usePyLabStore((s) => s.activeId);
  const setCode = usePyLabStore((s) => s.setCode);
  const create = usePyLabStore((s) => s.create);
  const select = usePyLabStore((s) => s.select);
  const remove = usePyLabStore((s) => s.remove);
  const rename = usePyLabStore((s) => s.rename);
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);

  const [run, setRun] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const areaRef = useRef(null);

  const active = notebooks.find((n) => n.id === activeId) || notebooks[0];

  // Output belongs to the notebook that produced it. Without this, switching
  // notebooks leaves the previous run's result on screen — so a notebook that
  // was never executed appears to have just failed, which is worse than
  // showing nothing.
  useEffect(() => { setRun(null); }, [activeId]);

  // "Open in Lab" from a Hub entry arrives here as a linked concept.
  useEffect(() => {
    if (linkedConcept?.tab !== 'pylab') return;
    const { name, code } = linkedConcept.payload || {};
    if (code) create(name || 'From the Hub', code);
    clearLinkedConcept();
  }, [linkedConcept, create, clearLinkedConcept]);

  async function execute() {
    setRun({ state: 'running', progress: 'Starting…' });
    const result = await runPython(active.code, {
      onProgress: (progress) => setRun((r) => (r?.state === 'running' ? { ...r, progress } : r)),
    });
    setRun({ state: 'done', ...result });
  }

  // Tab must indent rather than leave the editor — in a Python box, losing
  // the tab key to focus navigation makes the editor unusable.
  function onKeyDown(e) {
    if ((e.key === 'Enter' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); execute(); return; }
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const next = `${value.slice(0, a)}    ${value.slice(b)}`;
    setCode(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = a + 4; });
  }

  if (!active) return null;

  return (
    <div className="ml-page pylab">
      <aside className="pylab-nav">
        <button type="button" className="pylab-new" onClick={() => create('Untitled')}>
          <i className="ti ti-plus" aria-hidden="true" /> New notebook
        </button>
        <div className="pylab-list">
          {notebooks.map((n) => (
            <div key={n.id} className={`pylab-item${n.id === activeId ? ' active' : ''}`}>
              <button type="button" className="pylab-item-btn" onClick={() => select(n.id)}>
                <i className="ti ti-file-code" aria-hidden="true" />
                <span className="pylab-item-name">{n.name}</span>
              </button>
              <button
                type="button" className="pylab-item-del" aria-label={`Delete ${n.name}`}
                onClick={() => remove(n.id)}
              >
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <p className="pylab-note">
          <i className="ti ti-device-floppy" aria-hidden="true" />
          Saved in this browser only. {RUNTIME_NOTE}
        </p>
      </aside>

      <div className="pylab-main">
        <div className="pylab-head">
          {renaming ? (
            <input
              className="pylab-title-input" defaultValue={active.name} autoFocus
              onBlur={(e) => { rename(active.id, e.target.value); setRenaming(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            />
          ) : (
            <button type="button" className="pylab-title" onClick={() => setRenaming(true)} title="Rename">
              {active.name} <i className="ti ti-pencil" aria-hidden="true" />
            </button>
          )}
          <span className="pylab-hint">⌘/Ctrl + Enter to run</span>
          <button
            type="button" className="pylab-run" onClick={execute}
            disabled={run?.state === 'running'}
          >
            <i className={`ti ${run?.state === 'running' ? 'ti-loader-2 pylab-spin' : 'ti-player-play'}`} aria-hidden="true" />
            {run?.state === 'running' ? 'Running…' : 'Run'}
          </button>
        </div>

        <textarea
          ref={areaRef}
          className="pylab-editor"
          value={active.code}
          spellCheck={false}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Python code editor"
        />

        {run?.state === 'running' && (
          <div className="pylab-out pylab-out-running">
            <i className="ti ti-loader-2 pylab-spin" aria-hidden="true" /> {run.progress}
          </div>
        )}

        {run?.state === 'done' && (
          <div className={`pylab-out${run.ok ? '' : ' pylab-out-error'}`}>
            <div className="pylab-out-head">
              <i className={`ti ${run.ok ? 'ti-check' : 'ti-alert-triangle'}`} aria-hidden="true" />
              {run.ok ? `Output (${run.ms} ms)` : 'Error'}
            </div>
            {(run.output?.trim() || !run.ok) && (
              <pre className="pylab-out-body">{run.ok ? run.output : run.error}</pre>
            )}
            {run.figures?.length > 0 && (
              <div className="pylab-figs">
                {run.figures.map((src, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <img key={i} src={src} alt={`Figure ${i + 1}`} className="pylab-fig" />
                ))}
              </div>
            )}
            {run.ok && !run.output?.trim() && !run.figures?.length && (
              <p className="pylab-out-empty">Ran cleanly, but nothing was printed or plotted.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
