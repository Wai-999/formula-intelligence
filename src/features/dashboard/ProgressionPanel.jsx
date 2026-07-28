import { useMemo } from 'react';
import { CHAPTERS, nodes } from '../../data/index.js';
import { useSRStore, getMasteryLevel } from '../../store/useSRStore.js';
import { useJournalStore, calcStreak } from '../../store/useJournalStore.js';
import { usePracticeStore } from '../../store/usePracticeStore.js';
import { useUnderstandingStore } from '../../store/useUnderstandingStore.js';
import { computeXp, computeBadges, levelProgress } from '../../lib/progression.js';
import './ProgressionPanel.css';

// Reads every input from the stores that already own it — this component
// records nothing itself. See src/lib/progression.js for why that matters.
export default function ProgressionPanel() {
  const srData = useSRStore((s) => s.srData);
  const quizStats = useSRStore((s) => s.quizStats);
  const journalEntries = useJournalStore((s) => s.entries);
  const practiceScore = usePracticeStore((s) => s.score);
  const layersByNode = useUnderstandingStore((s) => s.layersByNode);
  const domainsVisited = useUnderstandingStore((s) => s.domainsVisited);

  const stats = useMemo(() => {
    let mastered = 0;
    let reviewed = 0;
    for (const n of nodes) {
      const card = srData[n.id];
      if (!card || !card.reviews) continue;
      if (getMasteryLevel(card) === 3) mastered++;
      else reviewed++;
    }

    const chaptersComplete = CHAPTERS.filter((ch) => {
      const chNodes = nodes.filter((n) => n.ch === ch.id);
      return chNodes.length > 0
        && chNodes.every((n) => getMasteryLevel(srData[n.id] || { reviews: 0 }) === 3);
    }).length;

    const depthLayers = Object.values(layersByNode || {})
      .reduce((a, layers) => a + (layers?.length || 0), 0);

    const quizTotal = quizStats?.total || 0;
    return {
      mastered,
      reviewed,
      chaptersComplete,
      quizCorrect: quizStats?.correct || 0,
      quizTotal,
      quizAccuracy: quizTotal ? Math.round(((quizStats.correct || 0) / quizTotal) * 100) : 0,
      practiceCorrect: practiceScore?.correct || 0,
      journalEntries: journalEntries?.length || 0,
      journalStreak: calcStreak(journalEntries),
      depthLayers,
      domainsVisited: (domainsVisited || []).length,
    };
  }, [srData, quizStats, journalEntries, practiceScore, layersByNode, domainsVisited]);

  const { total, breakdown } = useMemo(() => computeXp(stats), [stats]);
  const progress = useMemo(() => levelProgress(total), [total]);
  const badges = useMemo(() => computeBadges(stats), [stats]);
  const earned = badges.filter((b) => b.earned);
  const earning = badges.filter((b) => !b.earned && b.have > 0)
    .sort((a, b) => b.pct - a.pct).slice(0, 4);

  const active = breakdown.filter((b) => b.xp > 0);

  return (
    <section className="prog">
      <div className="prog-head">
        <div className="prog-level">
          <span className="prog-level-num">{progress.level}</span>
          <span className="prog-level-lbl">Level</span>
        </div>
        <div className="prog-bar-wrap">
          <div className="prog-bar-top">
            <span className="prog-xp">{total.toLocaleString()} XP</span>
            {progress.neededForNext > 0 && (
              <span className="prog-next">{progress.neededForNext.toLocaleString()} XP to level {progress.level + 1}</span>
            )}
          </div>
          <div className="prog-bar" role="progressbar" aria-valuenow={progress.pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="prog-bar-fill" style={{ width: `${progress.pct}%` }} />
          </div>
          <p className="prog-note">
            Earned from work already recorded — nothing here is tracked separately.
          </p>
        </div>
      </div>

      {active.length > 0 ? (
        <div className="prog-breakdown">
          {active.map((b) => (
            <div className="prog-src" key={b.key}>
              <span className="prog-src-xp">+{b.xp.toLocaleString()}</span>
              <span className="prog-src-lbl">{b.label}</span>
              <span className="prog-src-count">{b.count} × {b.each}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="prog-empty">
          Review a formula, answer a quiz question, or explore a Depth Ladder layer to start earning XP.
        </p>
      )}

      <div className="prog-badges">
        <p className="prog-badges-title">
          Badges <span className="prog-badges-count">{earned.length} of {badges.length}</span>
        </p>
        <div className="prog-badge-grid">
          {earned.map((b) => (
            <div className="prog-badge earned" key={b.id} title={b.hint}>
              <i className={`ti ${b.icon}`} aria-hidden="true" />
              <span className="prog-badge-name">{b.name}</span>
            </div>
          ))}
          {earning.map((b) => (
            <div className="prog-badge locked" key={b.id} title={b.hint}>
              <i className={`ti ${b.icon}`} aria-hidden="true" />
              <span className="prog-badge-name">{b.name}</span>
              <span className="prog-badge-prog">{b.have}/{b.of}</span>
              <div className="prog-badge-bar"><div style={{ width: `${b.pct}%` }} /></div>
            </div>
          ))}
          {earned.length === 0 && earning.length === 0 && (
            <p className="prog-empty">No badges yet — the first one needs a single formula review.</p>
          )}
        </div>
      </div>
    </section>
  );
}
