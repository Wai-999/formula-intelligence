import { useMemo, useState } from 'react';
import { nodeById, chapterColorMap } from '../../data/index.js';
import { mlNodeById } from '../../data/ml/models.js';
import { ML_TABS } from '../../store/useMLUIStore.js';
import { LEARNING_TRACKS, trackProgress, stageProgress } from '../../data/learningTracks.js';
import { useSRStore, getMasteryLevel } from '../../store/useSRStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { useUnderstandingStore } from '../../store/useUnderstandingStore.js';
import './TracksPanel.css';

// Persona tracks sit above the existing prerequisite-chain tool rather than
// replacing it: they answer "where do I start for my role?", the chain
// answers "what must I know before formula X?". Both are useful; only the
// second can be computed, which is why the first is authored data.
export default function TracksPanel() {
  const [openTrack, setOpenTrack] = useState(null);
  const srData = useSRStore((s) => s.srData);
  const viewOnMap = useUIStore((s) => s.viewOnMap);
  const setMLActiveTab = useUIStore((s) => s.setMLActiveTab);
  const setMode = useUIStore((s) => s.setMode);
  const selectModel = useMLUIStore((s) => s.selectModel);
  const layersByNode = useUnderstandingStore((s) => s.layersByNode);

  // Each item kind is measured by the signal that actually exists for it:
  // formulas have spaced-repetition cards, ML models have Depth Ladder
  // engagement. Both are data the app already records elsewhere, so a track
  // can never claim progress the rest of the app disagrees with.
  const isDone = useMemo(() => (item) => {
    if (item.kind === 'formula') return getMasteryLevel(srData[item.id] || { reviews: 0 }) === 3;
    if (item.kind === 'model') return (layersByNode?.[item.id]?.length || 0) >= 2;
    return false;
  }, [srData, layersByNode]);

  const track = LEARNING_TRACKS.find((t) => t.id === openTrack);

  function openItem(item) {
    if (item.kind === 'formula') { viewOnMap(item.id); return; }
    if (item.kind === 'model') {
      // Model Map has no linkedConcept consumer, so set its selection
      // directly — the detail panel reads selectedModelId from this store.
      setMode('ml');
      setMLActiveTab('modelmap');
      selectModel(item.id);
      return;
    }
    setMode('ml');
    setMLActiveTab(item.id);
  }

  function itemLabel(item) {
    if (item.kind === 'formula') return nodeById[item.id]?.name || item.id;
    if (item.kind === 'model') return mlNodeById[item.id]?.name || item.id;
    return ML_TABS.find((t) => t.id === item.id)?.label || item.id;
  }

  function itemMeta(item) {
    if (item.kind === 'formula') {
      const n = nodeById[item.id];
      return { tag: n ? `Ch ${n.ch}` : '', color: n ? chapterColorMap[n.ch] : null, icon: 'ti-math-function' };
    }
    if (item.kind === 'model') return { tag: 'ML model', color: '#a78bfa', icon: 'ti-binary-tree' };
    return { tag: 'Module', color: '#22d3ee', icon: 'ti-layout-grid' };
  }

  return (
    <section className="tracks">
      <div className="tracks-head">
        <h3 className="tracks-title"><i className="ti ti-route-2" aria-hidden="true" /> Learning tracks</h3>
        <p className="tracks-sub">
          Curated routes for a specific goal. The prerequisite finder below answers
          “what comes before X?”; these answer “where do I start, and what can I skip?”
        </p>
      </div>

      <div className="tracks-grid">
        {LEARNING_TRACKS.map((t) => {
          const p = trackProgress(t, isDone);
          const active = openTrack === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`track-card${active ? ' active' : ''}`}
              onClick={() => setOpenTrack(active ? null : t.id)}
              aria-expanded={active}
            >
              <i className={`ti ${t.icon} track-icon`} aria-hidden="true" />
              <span className="track-name">{t.name}</span>
              <span className="track-audience">{t.audience}</span>
              <span className="track-bar"><span style={{ width: `${p.pct}%` }} /></span>
              <span className="track-prog">{p.done} / {p.total} mastered</span>
            </button>
          );
        })}
      </div>

      {track && (
        <div className="track-detail">
          <p className="track-blurb">{track.blurb}</p>
          {track.stages.map((stage, si) => {
            const sp = stageProgress(stage, isDone);
            return (
              <div className="track-stage" key={stage.title}>
                <div className="track-stage-head">
                  <span className="track-stage-num">{si + 1}</span>
                  <div>
                    <p className="track-stage-title">{stage.title}</p>
                    <p className="track-stage-goal">{stage.goal}</p>
                  </div>
                  <span className="track-stage-prog">{sp.done}/{sp.total}</span>
                </div>
                <div className="track-items">
                  {stage.items.map((item) => {
                    const meta = itemMeta(item);
                    const done = item.kind !== 'module' && isDone(item);
                    return (
                      <button
                        key={`${item.kind}-${item.id}`}
                        type="button"
                        className={`track-item${done ? ' done' : ''}`}
                        onClick={() => openItem(item)}
                      >
                        <i className={`ti ${done ? 'ti-circle-check' : meta.icon}`} aria-hidden="true"
                           style={{ color: done ? 'var(--success)' : meta.color }} />
                        <span className="track-item-name">{itemLabel(item)}</span>
                        <span className="track-item-tag" style={{ color: meta.color }}>{meta.tag}</span>
                        <span className="track-item-why">{item.why}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
