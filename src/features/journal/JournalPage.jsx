import { useMemo, useRef, useState } from 'react';
import { nodes } from '../../data/index.js';
import { useJournalStore, calcStreak } from '../../store/useJournalStore.js';
import { useMasteryStore } from '../../store/useMasteryStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import './JournalPage.css';

const JNL_CH_COLORS = {
  2: '#60a5fa', 3: '#34d399', 4: '#f59e0b', 5: '#a78bfa', 6: '#22d3ee',
  7: '#fb923c', 8: '#f87171', 9: '#818cf8', 10: '#4ade80', 11: '#e879f9',
  12: '#38bdf8', 13: '#a3e635', 14: '#fbbf24',
};

const CELL_FILL = {
  gold: 'rgba(251,191,36,0.36)',
  green: 'rgba(52,211,153,0.34)',
  blue: 'rgba(96,165,250,0.26)',
  red: 'rgba(248,113,113,0.24)',
  none: 'rgba(255,255,255,0.02)',
};
const CELL_ICON = { gold: '●', green: '●', blue: '◐', red: '◯', none: '○' };
const CELL_ICON_COLOR = { gold: '#fbbf24', green: '#34d399', blue: '#60a5fa', red: '#f87171', none: '#3a3a5a' };

function confColor(conf) {
  if (conf <= 4) return { color: '#f87171', bg: 'rgba(251,113,133,.14)' };
  if (conf <= 7) return { color: '#fbbf24', bg: 'rgba(251,191,36,.1)' };
  return { color: '#34d399', bg: 'rgba(52,211,153,.1)' };
}

function StreakBar({ entries }) {
  const streak = calcStreak(entries);
  if (streak === 0) return <div className="jnl-streak-bar">Start your streak today — write your first entry below.</div>;
  if (streak === 1) return <div className="jnl-streak-bar"><b>1-day streak</b> — great start, come back tomorrow!</div>;
  if (streak >= 7) return <div className="jnl-streak-bar"><b>{streak}-day streak</b> — exceptional consistency!</div>;
  return <div className="jnl-streak-bar"><b>{streak} days</b> in a row</div>;
}

function EntryForm() {
  const saveEntry = useJournalStore((s) => s.saveEntry);
  const sessionNodesStudied = useUIStore((s) => s.sessionNodesStudied);

  const [ta1, setTa1] = useState('');
  const [ta2, setTa2] = useState('');
  const [ta3, setTa3] = useState('');
  const [conf, setConf] = useState(7);
  const [saveConfirm, setSaveConfirm] = useState('');

  const canSave = ta1.length >= 10 && ta2.length >= 10 && ta3.length >= 10;
  const cc = confColor(conf);

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  function handleSave() {
    if (!canSave) return;
    saveEntry({
      prompt1: ta1.trim(),
      prompt2: ta2.trim(),
      prompt3: ta3.trim(),
      confidence: conf,
      formulasStudied: Array.from(sessionNodesStudied),
    });
    setTa1('');
    setTa2('');
    setTa3('');
    setSaveConfirm('Saved. Keep this habit — 3 minutes of reflection beats 30 minutes of re-reading.');
  }

  return (
    <div className="jnl-entry-form">
      <div className="jnl-date-hdr">Session journal — {todayLabel}</div>

      <div className="jnl-prompt-lbl">What clicked today</div>
      <div className="jnl-prompt-sub">Which formula or connection became clearer in this session? What specifically changed in how you understand it?</div>
      <textarea
        className="jnl-ta"
        rows={3}
        spellCheck
        placeholder="Today I finally understood that…"
        value={ta1}
        onChange={(e) => { setTa1(e.target.value); setSaveConfirm(''); }}
      />

      <div className="jnl-prompt-lbl">What still feels fragile</div>
      <div className="jnl-prompt-sub">Which formula or concept still feels uncertain? What exactly is unclear?</div>
      <textarea
        className="jnl-ta"
        rows={3}
        spellCheck
        placeholder="I'm still unsure about…"
        value={ta2}
        onChange={(e) => { setTa2(e.target.value); setSaveConfirm(''); }}
      />

      <div className="jnl-prompt-lbl">One real problem I could now solve</div>
      <div className="jnl-prompt-sub">Describe a specific real-world situation where you could now apply what you studied.</div>
      <textarea
        className="jnl-ta"
        rows={3}
        spellCheck
        placeholder="I could now answer a question like…"
        value={ta3}
        onChange={(e) => { setTa3(e.target.value); setSaveConfirm(''); }}
      />

      <div className="jnl-slider-row">
        <div className="jnl-slider-lbl">
          <span>Confidence in today's formulas</span>
          <span id="jnl-conf-val" style={{ background: cc.bg, color: cc.color }}>{conf} / 10</span>
        </div>
        <input type="range" min={1} max={10} step={1} value={conf} onChange={(e) => setConf(parseInt(e.target.value, 10))} />
      </div>

      <button type="button" className="jnl-save-btn" disabled={!canSave} onClick={handleSave}>Save session entry</button>
      <div className="jnl-save-confirm">{saveConfirm}</div>
    </div>
  );
}

function PrevEntries({ entries }) {
  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), []);
  const [openIdx, setOpenIdx] = useState(null);

  if (!entries.length) {
    return <p className="jnl-prev-empty">No previous entries yet.</p>;
  }

  return (
    <div>
      {entries.slice(0, 90).map((e, i) => {
        const conf = e.confidence || 5;
        const cc = confColor(conf);
        const isOpen = openIdx === i;
        return (
          <div className="jnl-entry-row" key={e.date + i}>
            <div className="jnl-entry-summary" onClick={() => setOpenIdx(isOpen ? null : i)}>
              <span className="jnl-entry-date">{e.date}</span>
              <span className="jnl-entry-conf" style={{ background: cc.bg, color: cc.color }}>{conf}/10</span>
              <span className="jnl-entry-p1">{(e.prompt1 || '').slice(0, 22)}</span>
              <span className="jnl-entry-chevron">▼</span>
            </div>
            <div className={`jnl-entry-body${isOpen ? ' open' : ''}`}>
              <div className="jnl-entry-section">
                <div className="jnl-entry-section-lbl">What clicked</div>
                <div className="jnl-entry-section-txt">{e.prompt1}</div>
              </div>
              <div className="jnl-entry-section">
                <div className="jnl-entry-section-lbl">Still fragile</div>
                <div className="jnl-entry-section-txt">{e.prompt2}</div>
              </div>
              <div className="jnl-entry-section">
                <div className="jnl-entry-section-lbl">Real problem I could solve</div>
                <div className="jnl-entry-section-txt">{e.prompt3}</div>
              </div>
              {e.formulasStudied && e.formulasStudied.length > 0 && (
                <div className="jnl-entry-section">
                  <div className="jnl-entry-section-lbl">Formulas studied</div>
                  <div className="jnl-entry-section-txt jnl-entry-formulas">
                    {e.formulasStudied.map((id) => nodeById[id]?.name || id).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KnowledgeStateMap() {
  const getNodeState = useMasteryStore((s) => s.getNodeState);
  const recallData = useMasteryStore((s) => s.recallData);
  const targetDate = useJournalStore((s) => s.targetDate);
  const setTargetDate = useJournalStore((s) => s.setTargetDate);
  const viewOnMap = useUIStore((s) => s.viewOnMap);
  const tipRef = useRef(null);
  const [showTargetInput, setShowTargetInput] = useState(false);

  const byChapter = useMemo(() => {
    const map = {};
    nodes.forEach((n) => {
      if (!map[n.ch]) map[n.ch] = [];
      map[n.ch].push(n);
    });
    return map;
  }, []);

  const { masteredCount, total, mastPct } = useMemo(() => {
    let mastered = 0;
    nodes.forEach((n) => {
      const s = getNodeState(n.id);
      if (s.state === 'gold' || s.state === 'green') mastered++;
    });
    const t = nodes.length;
    return { masteredCount: mastered, total: t, mastPct: t > 0 ? Math.round((mastered / t) * 100) : 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNodeState, recallData]);

  function showTip(e, node, state) {
    const tip = tipRef.current;
    if (!tip) return;
    tip.innerHTML = `<b>${node.name}</b><br>Last recalled: ${state.lastRecall || 'Never'}<br>Streak: ${state.streak}`;
    tip.style.display = 'block';
    const r = e.currentTarget.getBoundingClientRect();
    const tipW = 200, tipH = 70;
    let left = r.left, top = r.bottom + 4;
    if (left + tipW > window.innerWidth) left = window.innerWidth - tipW - 8;
    if (top + tipH > window.innerHeight) top = r.top - tipH - 4;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }

  function hideTip() {
    if (tipRef.current) tipRef.current.style.display = 'none';
  }

  let urgencyMsg = null;
  if (targetDate) {
    const daysLeft = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0 && daysLeft <= 7 && mastPct < 50) {
      const needed = Math.ceil((Math.ceil(total * 0.8) - masteredCount) / daysLeft);
      urgencyMsg = `${daysLeft} day${daysLeft > 1 ? 's' : ''} left. You need ~${Math.max(1, needed)} formula${needed > 1 ? 's' : ''}/day to reach 80%.`;
    }
  }
  const targetDisplay = targetDate ? `Target: 80% by ${targetDate}` : 'No target date set';

  return (
    <div id="jnl-map-area">
      <h2>Knowledge state map</h2>
      <p className="jnl-legend">
        Your mastery at a glance — click any cell to study it on the Map.{' '}
        <span style={{ color: '#fbbf24' }}>●gold</span>=Feynman verified &nbsp;
        <span style={{ color: '#34d399' }}>●green</span>=Recall×3+ &nbsp;
        <span style={{ color: '#60a5fa' }}>◐blue</span>=Partial &nbsp;
        <span style={{ color: '#f87171' }}>◯red</span>=Needs review
      </p>

      <div id="jnl-grid">
        {Object.keys(byChapter).map(Number).sort((a, b) => a - b).map((ch) => {
          const nds = byChapter[ch];
          const chColor = JNL_CH_COLORS[ch] || '#6b7280';
          const touchedCount = nds.filter((n) => getNodeState(n.id).state !== 'none').length;
          return (
            <div className="jnl-ch-row" key={ch}>
              <div className="jnl-ch-lbl" style={{ color: chColor }}>
                Ch {ch}<br /><span className="jnl-ch-count">{touchedCount}/{nds.length}</span>
              </div>
              <div className="jnl-ch-cells">
                {nds.map((n) => {
                  const s = getNodeState(n.id);
                  return (
                    <div
                      className="jnl-cell"
                      key={n.id}
                      style={{ background: CELL_FILL[s.state] }}
                      onClick={() => viewOnMap(n.id, 'journal')}
                      onMouseEnter={(e) => showTip(e, n, s)}
                      onMouseLeave={hideTip}
                    >
                      <span className="jnl-cell-nm">{(n.name || n.id).slice(0, 8)}</span>
                      <span className="jnl-cell-icon" style={{ color: CELL_ICON_COLOR[s.state] }}>{CELL_ICON[s.state]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div id="jnl-map-footer">
        <div className="jnl-footer-row">
          <span className="jnl-mastery-label">Mastered: <b>{masteredCount} / {total}</b> formulas ({mastPct}%)</span>
          <div className="jnl-master-bar-track"><div className="jnl-master-bar-fill" style={{ width: `${mastPct}%` }} /></div>
        </div>
        <div className="jnl-target-row">
          <span>{targetDisplay}</span>
          <button type="button" id="jnl-target-btn" onClick={() => setShowTargetInput((v) => !v)}>Set date</button>
          {showTargetInput && (
            <input
              type="date"
              value={targetDate}
              autoFocus
              onChange={(e) => { setTargetDate(e.target.value); setShowTargetInput(false); }}
            />
          )}
        </div>
        {urgencyMsg && <div id="jnl-urgency-msg">{urgencyMsg}</div>}
      </div>

      <div className="jnl-tip" ref={tipRef} />
    </div>
  );
}

export default function JournalPage() {
  const entries = useJournalStore((s) => s.entries);

  return (
    <div className="jnl-page">
      <div className="jnl-left">
        <StreakBar entries={entries} />
        <div className="jnl-left-scroll">
          <EntryForm />
          <div className="jnl-prev-hdr">Previous entries</div>
          <PrevEntries entries={entries} />
        </div>
      </div>
      <div className="jnl-right">
        <KnowledgeStateMap />
      </div>
    </div>
  );
}
