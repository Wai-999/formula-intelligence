import { useMemo, useState } from 'react';
import { CHAPTERS, chapterColorMap } from '../../data/index.js';
import { useErrorLogStore } from '../../store/useErrorLogStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import './ErrorLogPage.css';

const ERROR_TYPES = [
  { key: 'arithmetic', label: 'Arithmetic slip', sub: 'I knew but miscalculated', color: '#60a5fa' },
  { key: 'concept', label: 'Concept gap', sub: "I didn't understand why", color: '#f87171' },
  { key: 'formula', label: 'Wrong formula', sub: 'I picked the wrong one', color: '#fbbf24' },
  { key: 'setup', label: 'Setup error', sub: 'I misread the scenario', color: '#a78bfa' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ErrorPatterns({ log }) {
  const nodeCounts = {};
  log.forEach((e) => { nodeCounts[e.nodeName] = (nodeCounts[e.nodeName] || 0) + 1; });
  const topNodes = Object.entries(nodeCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const typed = log.filter((e) => e.errorType);
  const counts = { arithmetic: 0, formula: 0, concept: 0, setup: 0 };
  typed.forEach((e) => { if (counts[e.errorType] !== undefined) counts[e.errorType]++; });
  const typedTotal = typed.length || 1;

  const advice = [];
  if (counts.arithmetic / typedTotal > 0.4) advice.push('Most errors are arithmetic slips — slow down on each computation step and check intermediate results.');
  if (counts.concept / typedTotal > 0.3) advice.push('Concept gaps detected — revisit Derivation Mode for the top error formulas.');
  if (counts.formula / typedTotal > 0.3) advice.push('Wrong formula selection — use the Learning Path to see what distinguishes related formulas.');
  if (counts.setup / typedTotal > 0.3) advice.push('Setup errors — re-read each scenario carefully before identifying the formula to apply.');
  if (!advice.length && typed.length > 0) advice.push('No dominant error pattern yet — keep practicing to see trends emerge here.');

  return (
    <div className="err-pattern-box">
      <div className="err-pattern-title">Your error patterns</div>
      <div className="err-pattern-most">
        Most errors: {topNodes.map(([name, count]) => <b key={name}>{name} ({count}) </b>)}
      </div>
      {typed.length > 0 ? (
        <>
          {ERROR_TYPES.map((t) => {
            const n = counts[t.key];
            const pct = Math.round((n / typedTotal) * 100);
            return (
              <div className="err-bar-row" key={t.key}>
                <span className="err-bar-lbl">{t.label}</span>
                <div className="err-bar-track"><div className="err-bar-fill" style={{ width: `${pct}%`, background: t.color }} /></div>
                <span className="err-bar-count">{n} ({pct}%)</span>
              </div>
            );
          })}
          <div className="err-advice">
            {advice.map((a, i) => <div className="err-advice-item" key={i}>→ {a}</div>)}
          </div>
        </>
      ) : (
        <div className="err-pattern-hint">Classify your errors using the cards below — patterns will appear here.</div>
      )}
    </div>
  );
}

function ErrorCard({ entry }) {
  const setErrorType = useErrorLogStore((s) => s.setErrorType);
  const setNote = useErrorLogStore((s) => s.setNote);
  const resolve = useErrorLogStore((s) => s.resolve);
  const viewOnMap = useUIStore((s) => s.viewOnMap);
  const [noteDraft, setNoteDraft] = useState(entry.note || '');
  const chColor = chapterColorMap[entry.chapter] || '#6b7280';

  return (
    <div className={`err-card${entry.resolved ? ' resolved' : ''}`}>
      <div className="err-card-hdr">
        <span className="err-node-nm">{entry.nodeName}</span>
        <span className="err-ch-tag" style={{ background: `${chColor}22`, color: chColor }}>Ch {entry.chapter}</span>
        <span className="err-date-tag">{formatDate(entry.date)}</span>
      </div>
      <div className="err-scenario">{entry.scenario}</div>
      <div className="err-answers">
        <span className="err-my-ans">My answer: <b>{entry.myAnswer}</b></span>
        <span className="err-ok-ans">Correct: <b>{entry.correctAnswer}</b></span>
      </div>
      <div className="err-type-lbl">What type of error was this?</div>
      <div className="err-type-grid">
        {ERROR_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`err-type-opt${entry.errorType === t.key ? ' selected' : ''}`}
            onClick={() => setErrorType(entry.id, t.key)}
          >
            <span className={`err-radio${entry.errorType === t.key ? ' checked' : ''}`} />
            <span><b>{t.label}</b> — {t.sub}</span>
          </button>
        ))}
      </div>
      <input
        className="err-note-inp"
        type="text"
        placeholder="My note (optional)…"
        value={noteDraft}
        onChange={(e) => setNoteDraft(e.target.value)}
        onBlur={() => setNote(entry.id, noteDraft)}
      />
      <div className="err-actions">
        <button type="button" className={`err-resolve-btn${entry.resolved ? ' done' : ''}`} onClick={() => resolve(entry.id)}>
          {entry.resolved ? 'Resolved' : 'Mark resolved'}
        </button>
        <button type="button" className="err-map-btn" onClick={() => viewOnMap(entry.nodeId, 'errors')}>
          View on map →
        </button>
      </div>
    </div>
  );
}

export default function ErrorLogPage() {
  const errorLog = useErrorLogStore((s) => s.errorLog);
  const clearAll = useErrorLogStore((s) => s.clearAll);
  const [filterResolved, setFilterResolved] = useState('all');
  const [filterCh, setFilterCh] = useState('all');

  const unresolvedCount = useMemo(() => errorLog.filter((e) => !e.resolved).length, [errorLog]);

  const sorted = useMemo(() => {
    let filtered = errorLog.slice();
    if (filterResolved === 'unresolved') filtered = filtered.filter((e) => !e.resolved);
    if (filterCh !== 'all') filtered = filtered.filter((e) => String(e.chapter) === filterCh);
    return filtered.sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return b.date.localeCompare(a.date);
    });
  }, [errorLog, filterResolved, filterCh]);

  function handleClearAll() {
    if (!window.confirm('Clear all error log entries? This cannot be undone.')) return;
    clearAll();
  }

  return (
    <div className="err-page">
      <div className="err-controls">
        <span className="err-stat">Total: <b>{errorLog.length}</b></span>
        <span className="err-stat-sep">|</span>
        <span className="err-stat">Unresolved: <b style={{ color: '#f87171' }}>{unresolvedCount}</b></span>
        <select className="err-filter-sel" value={filterResolved} onChange={(e) => setFilterResolved(e.target.value)}>
          <option value="all">All errors</option>
          <option value="unresolved">Unresolved only</option>
        </select>
        <select className="err-filter-sel" value={filterCh} onChange={(e) => setFilterCh(e.target.value)}>
          <option value="all">All chapters</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        {errorLog.length > 0 && (
          <button type="button" className="err-clear-btn" onClick={handleClearAll}>Clear all</button>
        )}
      </div>

      <div className="err-main">
        {errorLog.length === 0 ? (
          <div className="err-empty">No errors logged yet.<br /><br />Wrong answers in <b>Practice</b> and <b>Quiz</b> will appear here automatically.</div>
        ) : (
          <>
            <ErrorPatterns log={errorLog} />
            {sorted.length === 0 ? (
              <div className="err-empty err-empty-filtered">No errors match the current filter.</div>
            ) : (
              sorted.map((e) => <ErrorCard key={e.id} entry={e} />)
            )}
          </>
        )}
      </div>
    </div>
  );
}
