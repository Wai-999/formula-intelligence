import { useMemo } from 'react';
import { CHAPTERS, nodes } from '../../data/index.js';
import { useSRStore, getMasteryLevel } from '../../store/useSRStore.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import './DashboardPage.css';

function KpiCard({ label, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-val">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const srData = useSRStore((s) => s.srData);
  const quizStats = useSRStore((s) => s.quizStats);
  const sessions = useSRStore((s) => s.sessions);

  const { mastered, due } = useMemo(() => {
    let masteredCount = 0;
    let dueCount = 0;
    const now = Date.now();
    for (const n of nodes) {
      const card = srData[n.id] || { reviews: 0, due: 0, rating: 0, interval: 1 };
      if (getMasteryLevel(card) === 3) masteredCount++;
      if (card.reviews === 0 || card.due <= now) dueCount++;
    }
    return { mastered: masteredCount, due: dueCount };
  }, [srData]);

  const accuracy = quizStats.total > 0 ? Math.round((quizStats.correct / quizStats.total) * 100) : null;

  const totalDisplay = useCountUp(nodes.length);
  const masteredDisplay = useCountUp(mastered);
  const dueDisplay = useCountUp(due);
  const accDisplay = useCountUp(accuracy ?? 0, { suffix: '%' });

  const chapterRows = useMemo(
    () =>
      CHAPTERS.map((ch) => {
        const chNodes = nodes.filter((n) => n.ch === ch.id);
        const chMastered = chNodes.filter((n) => getMasteryLevel(srData[n.id] || { reviews: 0 }) === 3).length;
        const pct = chNodes.length ? Math.round((chMastered / chNodes.length) * 100) : 0;
        return { ...ch, pct };
      }),
    [srData]
  );

  const recentSessions = sessions.slice().reverse().slice(0, 8);

  return (
    <div className="dash-page">
      <h2>Mastery dashboard</h2>

      <div className="dash-summary">
        <KpiCard label="Total formulas" value={totalDisplay} />
        <KpiCard label="Mastered" value={masteredDisplay} />
        <KpiCard label="Due for review" value={dueDisplay} />
        <KpiCard label="Quiz accuracy" value={accuracy === null ? '—' : accDisplay} />
      </div>

      <div>
        <h2>Chapter progress</h2>
        <div className="ch-mastery">
          {chapterRows.map((ch) => (
            <div className="ch-row" key={ch.id}>
              <div className="ch-row-header">
                <span className="ch-row-name">{ch.name}</span>
                <span className="ch-row-pct" style={{ color: ch.color }}>{ch.pct}%</span>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${ch.pct}%`, background: ch.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="session-history">
        <h3>Recent sessions</h3>
        {recentSessions.length === 0 ? (
          <div className="session-empty">No sessions yet.</div>
        ) : (
          recentSessions.map((s, i) => (
            <div className="sess-row" key={i}>
              <span>{s.date}</span>
              <span>{s.reviewed} reviewed</span>
              <span className="sess-easy">{s.easy} easy</span>
              <span className="sess-hard">{s.hard} hard</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
