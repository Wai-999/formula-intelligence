import { useState } from 'react';
import { useUnderstandingStore } from '../../../store/useUnderstandingStore.js';
import { useMLUIStore } from '../../../store/useMLUIStore.js';
import {
  DEPTH_LADDER_SPARK_SUB, DEPTH_LADDER_MECHANISM_SUB, DEPTH_LADDER_FORMALISM_SUB, DEPTH_LADDER_FRONTIER_SUB,
  UI_JUMPED_TO_ADVANCED,
} from '../../../data/ml/uiStrings.js';
import { useT, resolveT } from '../../../lib/mlContent.js';
import './DepthLadder.css';

const LAYERS = [
  { key: 'spark', label: 'Spark', sub: DEPTH_LADDER_SPARK_SUB, icon: 'ti-bulb' },
  { key: 'mechanism', label: 'Mechanism', sub: DEPTH_LADDER_MECHANISM_SUB, icon: 'ti-settings-2' },
  { key: 'formalism', label: 'Formalism', sub: DEPTH_LADDER_FORMALISM_SUB, icon: 'ti-math-function' },
  { key: 'criticalFrontier', label: 'Critical Frontier', sub: DEPTH_LADDER_FRONTIER_SUB, icon: 'ti-telescope' },
];

// The Depth Ladder shell (docs/research/ML-Mode-Pedagogy-Research.md §4.1),
// reused by every explorable node/stage/driver in ML mode. Four fully-built
// layers are required (D.1) — this component only handles navigation and
// engagement tracking; the actual layer content is authored per node in
// each module's data file and passed in as the four props below.
export default function DepthLadder({ nodeId, spark, mechanism, formalism, criticalFrontier }) {
  const isPastCompetent = useUnderstandingStore((s) => s.isPastCompetent);
  const alreadyVisited = useUnderstandingStore((s) => (s.layersByNode[nodeId] || []).length > 0);
  const markLayerEngaged = useUnderstandingStore((s) => s.markLayerEngaged);
  const level = useMLUIStore((s) => s.level);
  const lang = useMLUIStore((s) => s.lang);
  const jumpedAhead = isPastCompetent() && !alreadyVisited;
  const [active, setActive] = useState(jumpedAhead ? 'formalism' : 'spark');
  const jumpedNote = useT(UI_JUMPED_TO_ADVANCED);

  function selectLayer(key) {
    setActive(key);
    markLayerEngaged(nodeId, key);
  }

  const content = { spark, mechanism, formalism, criticalFrontier }[active];

  return (
    <div className="depth-ladder">
      <div className="depth-ladder-tabs" role="tablist" aria-label="Depth Ladder">
        {LAYERS.map((l) => {
          const subText = resolveT(l.sub, level, lang);
          return (
            <button
              key={l.key} type="button" role="tab" aria-selected={active === l.key}
              className={`depth-ladder-tab${active === l.key ? ' active' : ''}`}
              onClick={() => selectLayer(l.key)}
            >
              <i className={`ti ${l.icon}`} aria-hidden="true" />
              <span className="depth-ladder-tab-label">{l.label}</span>
              <span className="depth-ladder-tab-sub">{subText}</span>
            </button>
          );
        })}
      </div>
      {jumpedAhead && active === 'formalism' && (
        <p className="depth-ladder-jumped-note"><i className="ti ti-arrow-up-right" aria-hidden="true" /> {jumpedNote}</p>
      )}
      <div className="depth-ladder-content">{content}</div>
    </div>
  );
}
