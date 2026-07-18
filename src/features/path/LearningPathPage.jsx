import { useMemo, useState } from 'react';
import { CHAPTERS, nodeById, chapterColorMap, nodes, links } from '../../data/index.js';
import { PREREQ_CHAINS, getPrereqChain } from '../../data/prereqChains.js';
import { BRIDGE_TEXT } from '../../data/bridgeText.js';
import { useLearningPathStore } from '../../store/useLearningPathStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import MiniPrereqGraph from './MiniPrereqGraph.jsx';
import './LearningPathPage.css';

const STATUS_LABEL = { ns: 'Not started', ip: 'In progress', ma: 'Mastered' };

function resolveChain(targetId) {
  const raw = getPrereqChain(targetId);
  return raw[raw.length - 1] === targetId ? raw.slice(0, -1) : raw;
}

export default function LearningPathPage() {
  const getState = useLearningPathStore((s) => s.getState);
  const setState = useLearningPathStore((s) => s.setState);
  const viewOnMap = useUIStore((s) => s.viewOnMap);
  const addToast = useToastStore((s) => s.addToast);

  const [targetId, setTargetId] = useState('');
  const [focusId, setFocusId] = useState('');

  const chain = useMemo(() => (targetId ? resolveChain(targetId) : []), [targetId]);
  const chainData = PREREQ_CHAINS[targetId];
  const target = targetId ? nodeById[targetId] : null;
  const allDone = chain.length > 0 && chain.every((id) => getState(id) === 'ma');
  const hasNoChain = Boolean(targetId) && chain.length === 0;

  // A foundational formula (no prerequisites) still deserves a page — show
  // what it directly unlocks instead of a dead end.
  const dependents = useMemo(() => {
    if (!hasNoChain) return [];
    return links.filter((l) => l.s === targetId).map((l) => nodeById[l.t]).filter(Boolean);
  }, [hasNoChain, targetId]);

  const byChapter = useMemo(() => {
    const map = {};
    nodes.forEach((n) => {
      if (!map[n.ch]) map[n.ch] = [];
      map[n.ch].push(n);
    });
    return map;
  }, []);

  function handleTargetChange(val) {
    setTargetId(val);
    setFocusId('');
  }

  function focusStep(id) {
    setFocusId(id);
  }

  function studyStep(id) {
    setState(id, 'ip');
    setFocusId(id);
    viewOnMap(id, 'path');
  }

  function markMastered(id) {
    setState(id, 'ma');
    addToast('Marked as mastered!', 'success');
  }

  // With no prerequisite chain to click through, default the detail panel to
  // the target formula itself rather than leaving it empty.
  const displayFocusId = focusId || (hasNoChain ? targetId : '');
  const focusNode = displayFocusId ? nodeById[displayFocusId] : null;
  const focusCh = focusNode ? CHAPTERS.find((c) => c.id === focusNode.ch) : null;
  const bridge = displayFocusId ? BRIDGE_TEXT[displayFocusId] || `Used in ${focusNode?.use || ''}` : '';
  const nextId = displayFocusId && !hasNoChain ? chain[chain.indexOf(displayFocusId) + 1] || targetId : null;
  const nextNode = nextId ? nodeById[nextId] : null;
  const connectsText = nextId ? chainData?.why?.[nextId] || BRIDGE_TEXT[nextId] || `Connects to ${nextNode?.name || 'target'}.` : '';
  const focusMastered = displayFocusId && getState(displayFocusId) === 'ma';

  return (
    <div className="lp-page">
      <div className="lp-left">
        <div className="lp-selector">
          <label htmlFor="lp-target-select">Choose your target formula</label>
          <select id="lp-target-select" value={targetId} onChange={(e) => handleTargetChange(e.target.value)}>
            <option value="">— Select a formula to reach —</option>
            {CHAPTERS.map((c) => {
              const group = byChapter[c.id];
              if (!group?.length) return null;
              return (
                <optgroup key={c.id} label={c.name}>
                  {group.map((n) => (
                    <option key={n.id} value={n.id}>{n.name} — {n.short}</option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        <div className="lp-steps">
          {!targetId ? (
            <div className="lp-empty-state">
              <i className="ti ti-route lpe-icon" aria-hidden="true" />
              <p>Select a target formula above to see its prerequisite learning path.</p>
            </div>
          ) : hasNoChain ? (
            <>
              <div className="lp-path-label">Foundational formula</div>
              <div
                className={`lp-step-card${getState(targetId) === 'ip' ? ' lp-inprog' : ''}${getState(targetId) === 'ma' ? ' lp-mastered' : ''} lp-focused`}
                onClick={() => focusStep(targetId)}
              >
                <div className="lp-step-num">
                  No prerequisites
                  <span className="lp-step-dot" style={{ background: chapterColorMap[target?.ch] || '#888' }} />
                </div>
                <div className="lp-step-name">{target?.name}</div>
                <div className="lp-step-formula">{target?.short}</div>
                <div className="lp-step-why">
                  {(BRIDGE_TEXT[targetId] || 'This formula doesn\'t build on anything else in the map — it\'s a starting point in its own right.').slice(0, 160)}
                </div>
                <div className="lp-step-footer">
                  <span className={`lp-status ${getState(targetId)}`}>{STATUS_LABEL[getState(targetId)]}</span>
                  <button type="button" className="lp-study-btn" onClick={(e) => { e.stopPropagation(); studyStep(targetId); }}>
                    Study this
                  </button>
                </div>
              </div>

              {dependents.length > 0 && (
                <>
                  <div className="lp-connector" />
                  <div className="lp-path-label">What it unlocks</div>
                  {dependents.map((d) => (
                    <button key={d.id} type="button" className="lp-dependent-row" onClick={() => handleTargetChange(d.id)}>
                      <span className="lp-step-dot" style={{ background: chapterColorMap[d.ch] || '#888' }} />
                      <span className="lp-dependent-name">{d.name}</span>
                      <i className="ti ti-arrow-right" aria-hidden="true" />
                    </button>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              <div className="lp-path-label">Your learning path</div>
              {chain.map((id, i) => {
                const n = nodeById[id];
                if (!n) return null;
                const state = getState(id);
                const ch = CHAPTERS.find((c) => c.id === n.ch);
                const whyText = chainData?.why?.[id] || BRIDGE_TEXT[id] || 'Needed to build toward the target formula.';
                const whyTrunc = whyText.length > 120 ? `${whyText.slice(0, 120)}…` : whyText;
                return (
                  <div key={id}>
                    {i > 0 && <div className="lp-connector" />}
                    <div
                      className={`lp-step-card${state === 'ip' ? ' lp-inprog' : ''}${state === 'ma' ? ' lp-mastered' : ''}${focusId === id ? ' lp-focused' : ''}`}
                      onClick={() => focusStep(id)}
                    >
                      <div className="lp-step-num">
                        Step {i + 1}
                        <span className="lp-step-dot" style={{ background: ch?.color || '#888' }} />
                      </div>
                      <div className="lp-step-name">{n.name}</div>
                      <div className="lp-step-formula">{n.short}</div>
                      <div className="lp-step-why">{whyTrunc}</div>
                      <div className="lp-step-footer">
                        <span className={`lp-status ${state}`}>{STATUS_LABEL[state]}</span>
                        <button type="button" className="lp-study-btn" onClick={(e) => { e.stopPropagation(); studyStep(id); }}>
                          Study this
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="lp-connector" />
              <div className={`lp-target-card${allDone ? ' all-done' : ''}`}>
                <i className="ti ti-target-arrow lp-target-icon" aria-hidden="true" />
                <div className="lp-target-name">{target?.name || targetId}</div>
                <div className="lp-target-formula">{target?.short || target?.formula || ''}</div>
                <div className="lp-target-unlock">{allDone ? 'All prerequisites mastered!' : 'Unlocks when all steps above are mastered'}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="lp-right">
        {chain.length > 0 && (
          <MiniPrereqGraph chain={chain} targetId={targetId} focusId={focusId} onFocusNode={focusStep} />
        )}
        <div className="lp-detail">
          {!focusNode ? (
            <div className="lp-empty-state">
              <i className="ti ti-hand-click lpe-icon" aria-hidden="true" />
              <p>Click a step card or graph node to see its real-world bridge explanation.</p>
            </div>
          ) : (
            <>
              <div className="lp-detail-name">{focusNode.name}</div>
              <div className="lp-detail-ch" style={{ color: focusCh?.color || '#888' }}>{focusCh?.name}</div>
              <div className="lp-detail-formula">{focusNode.formula}</div>
              <div className="lp-bridge">
                <div className="lp-bridge-lbl">Real-world bridge</div>
                <div className="lp-bridge-text">{bridge}</div>
              </div>
              {nextNode && nextId !== displayFocusId && (
                <div className="lp-connects">
                  <div className="lp-connects-lbl">Connects to next →</div>
                  <div className="lp-connects-name">{nextNode.name}</div>
                  <div className="lp-connects-txt">{connectsText.slice(0, 180)}</div>
                </div>
              )}
              <button type="button" className={`lp-mastery-btn${focusMastered ? ' done' : ''}`} disabled={focusMastered} onClick={() => markMastered(displayFocusId)}>
                {focusMastered ? 'Already mastered' : 'Mark as mastered'}
              </button>
              <button type="button" className="lp-view-map-btn" onClick={() => viewOnMap(displayFocusId, 'path')}>
                View on map →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
