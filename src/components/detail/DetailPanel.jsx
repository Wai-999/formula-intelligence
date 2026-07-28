import { useMemo } from 'react';
import { nodeById, links, chapterColorMap } from '../../data/index.js';
import { BRIDGE_TEXT } from '../../data/bridgeText.js';
import { INVENTORS } from '../../data/inventors.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useMasteryStore } from '../../store/useMasteryStore.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { PY_ENTRY_BY_ID } from '../../data/python/index.js';
import './DetailPanel.css';

const STATE_LABEL = {
  gold: 'Mastered',
  green: 'Strong recall',
  blue: 'In progress',
  red: 'Needs review',
  none: 'Not started',
};

export default function DetailPanel() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const selectNode = useUIStore((s) => s.selectNode);
  const traceFullChain = useUIStore((s) => s.traceFullChain);
  const navigateToLinkedConcept = useUIStore((s) => s.navigateToLinkedConcept);
  const getNodeState = useMasteryStore((s) => s.getNodeState);
  const level = useMLUIStore((s) => s.level);

  const node = selectedNodeId ? nodeById[selectedNodeId] : null;
  // Researcher depth doesn't re-author this panel's content — it surfaces
  // the rigorous material already written for this exact formula id in the
  // Python Hub corpus (assumptions, when NOT to use it, variable glossary,
  // failure modes). Same ids by design, so the join is free and the two
  // surfaces can never drift out of sync the way parallel copies would.
  const deep = level === 'researcher' && node ? PY_ENTRY_BY_ID[node.id] : null;

  const { prereqs, dependents } = useMemo(() => {
    if (!node) return { prereqs: [], dependents: [] };
    const prereqs = links.filter((l) => l.t === node.id).map((l) => nodeById[l.s]).filter(Boolean);
    const dependents = links.filter((l) => l.s === node.id).map((l) => nodeById[l.t]).filter(Boolean);
    return { prereqs, dependents };
  }, [node]);

  const state = node ? getNodeState(node.id).state : 'none';
  const chColor = node ? chapterColorMap[node.ch] : null;

  return (
    <aside className={`detail-panel${node ? ' open' : ''}`}>
      {node && (
        <>
          <button type="button" className="detail-close" onClick={() => selectNode(null)} aria-label="Close detail panel">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
          <p className="detail-name">{node.name}</p>
          <span className="detail-chapter-badge" style={{ background: `${chColor}22`, color: chColor }}>
            Ch {node.ch}
          </span>
          <div className="detail-formula">{node.formula}</div>

          <p className="detail-lbl">Description</p>
          <p className="detail-desc">{node.desc}</p>

          <p className="detail-lbl">Used for</p>
          <p className="detail-desc">{node.use}</p>

          {deep && (
            <div className="detail-deep">
              <p className="detail-deep-flag">
                <i className="ti ti-microscope" aria-hidden="true" /> Researcher depth
              </p>

              {deep.overview && (
                <>
                  <p className="detail-lbl">Why it exists</p>
                  <p className="detail-desc">{deep.overview}</p>
                </>
              )}

              {deep.variables?.length > 0 && (
                <>
                  <p className="detail-lbl">Notation</p>
                  <table className="detail-vars">
                    <tbody>
                      {deep.variables.map(([sym, meaning]) => (
                        <tr key={sym}>
                          <td className="detail-var-sym">{sym}</td>
                          <td className="detail-var-meaning">{meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {deep.thinking?.assumptions?.length > 0 && (
                <>
                  <p className="detail-lbl">Assumptions</p>
                  <ul className="detail-deep-list">
                    {deep.thinking.assumptions.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </>
              )}

              {deep.thinking?.notWhen?.length > 0 && (
                <>
                  <p className="detail-lbl">Do not use when</p>
                  <ul className="detail-deep-list detail-deep-warn">
                    {deep.thinking.notWhen.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </>
              )}

              {deep.mistakes?.length > 0 && (
                <>
                  <p className="detail-lbl">Common mistakes</p>
                  <ul className="detail-deep-list detail-deep-warn">
                    {deep.mistakes.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                </>
              )}

              <button
                type="button"
                className="detail-bridge-btn"
                onClick={() => navigateToLinkedConcept('ml', 'python', { entryId: node.id })}
              >
                <i className="ti ti-brand-python" aria-hidden="true" />
                Full Python implementation & scenario
              </button>
            </div>
          )}

          {node.id === 'reg' && (
            <button
              type="button"
              className="detail-bridge-btn"
              onClick={() => navigateToLinkedConcept('ml', 'python', { from: 'stats-reg' })}
            >
              <i className="ti ti-brand-python" aria-hidden="true" />
              See the Python implementation (Python Hub)
            </button>
          )}

          {BRIDGE_TEXT[node.id] && (
            <>
              <p className="detail-lbl">Real-world usage</p>
              <p className="detail-usage">{BRIDGE_TEXT[node.id]}</p>
            </>
          )}

          {prereqs.length > 0 && (
            <>
              <p className="detail-lbl">Prerequisites</p>
              {prereqs.map((p) => (
                <button key={p.id} type="button" className="detail-conn" onClick={() => selectNode(p.id)}>
                  <span className="detail-conn-dot" style={{ background: chapterColorMap[p.ch] }} />
                  <span>{p.name}</span>
                </button>
              ))}
              <button type="button" className="detail-trace-btn" onClick={() => traceFullChain(node.id)}>
                <i className="ti ti-route" aria-hidden="true" />
                Trace full chain
              </button>
            </>
          )}

          {dependents.length > 0 && (
            <>
              <p className="detail-lbl">Leads to</p>
              {dependents.map((d) => (
                <button key={d.id} type="button" className="detail-conn" onClick={() => selectNode(d.id)}>
                  <span className="detail-conn-dot" style={{ background: chapterColorMap[d.ch] }} />
                  <span>{d.name}</span>
                </button>
              ))}
            </>
          )}

          {INVENTORS[node.id] && (
            <>
              <p className="detail-lbl">Invented by</p>
              <div className="detail-inventor">
                <p className="detail-inventor-name">
                  {INVENTORS[node.id].name}
                  {INVENTORS[node.id].year && <span className="detail-inventor-year"> · {INVENTORS[node.id].year}</span>}
                </p>
                {INVENTORS[node.id].note && <p className="detail-inventor-note">{INVENTORS[node.id].note}</p>}
              </div>
            </>
          )}

          <div className="detail-mastery-row">
            <span className={`detail-mastery-pill state-${state}`}>{STATE_LABEL[state]}</span>
          </div>
        </>
      )}
    </aside>
  );
}
