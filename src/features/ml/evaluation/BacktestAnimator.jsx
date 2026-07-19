import { useEffect, useRef, useState } from 'react';
import {
  BACKTEST_INTRO, EV_WALKFORWARD_TITLE, EV_NAIVE_SPLIT_LBL, EV_NAIVE_SPLIT_SUB, EV_WALKFORWARD_LBL,
  EV_WF_SUB_TEMPLATE, EV_PLAY_BTN, EV_PAUSE_BTN, EV_RESET_BTN, EV_TRAIN_LEGEND, EV_TEST_LEGEND, EV_UNUSED_LEGEND,
  EV_BACKTEST_PREDICT_Q, EV_BACKTEST_PREDICT_NAIVE, EV_BACKTEST_PREDICT_WF, EV_BACKTEST_PREDICT_EXPLAIN,
} from '../../../data/ml/evaluation.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import PredictGate from '../../../components/ml/learning/PredictGate.jsx';

const NODE_ID = 'evaluation-metrics';

const N = 30;
const TEST_WINDOW = 4;
const MIN_TRAIN = 8;

function mulberry(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fixed random train/test assignment across the WHOLE series — deliberately
// ignores time order, so it can (and does) assign later timesteps to train
// and earlier ones to test, the exact leakage walk-forward avoids.
const NAIVE_TRAIN = (() => {
  const rng = mulberry(99);
  return Array.from({ length: N }, () => rng() < 0.7);
})();

function TimelineRow({ label, roleOf, sublabel }) {
  return (
    <div className="bt-row">
      <div className="bt-row-labels">
        <span className="bt-row-label">{label}</span>
        <span className="bt-row-sublabel">{sublabel}</span>
      </div>
      <div className="bt-track">
        {Array.from({ length: N }, (_, i) => (
          <span key={i} className={`bt-cell bt-cell-${roleOf(i)}`} title={`t=${i}`} />
        ))}
      </div>
    </div>
  );
}

export default function BacktestAnimator() {
  const [origin, setOrigin] = useState(MIN_TRAIN);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);
  const intro = useT(BACKTEST_INTRO);
  const title = useT(EV_WALKFORWARD_TITLE);
  const naiveSplitLbl = useT(EV_NAIVE_SPLIT_LBL);
  const naiveSplitSub = useT(EV_NAIVE_SPLIT_SUB);
  const walkForwardLbl = useT(EV_WALKFORWARD_LBL);
  const wfSubTemplate = useT(EV_WF_SUB_TEMPLATE);
  const playBtn = useT(EV_PLAY_BTN);
  const pauseBtn = useT(EV_PAUSE_BTN);
  const resetBtn = useT(EV_RESET_BTN);
  const trainLegend = useT(EV_TRAIN_LEGEND);
  const testLegend = useT(EV_TEST_LEGEND);
  const unusedLegend = useT(EV_UNUSED_LEGEND);
  const wfSublabel = wfSubTemplate.replace('{origin}', origin).replace('{steps}', TEST_WINDOW);

  useEffect(() => {
    if (!playing) return undefined;
    timerRef.current = setInterval(() => {
      setOrigin((o) => {
        const next = o + 1;
        if (next > N - TEST_WINDOW) {
          setPlaying(false);
          return MIN_TRAIN;
        }
        return next;
      });
    }, 550);
    return () => clearInterval(timerRef.current);
  }, [playing]);

  const naiveRole = (i) => (NAIVE_TRAIN[i] ? 'train' : 'test');
  const wfRole = (i) => (i <= origin ? 'train' : i <= origin + TEST_WINDOW ? 'test' : 'unused');

  return (
    <div className="ml-section">
      <p className="ml-section-title">{title}</p>
      <p className="ml-section-sub">{intro}</p>

      <PredictGate
        predictId="evaluation-backtest" nodeId={NODE_ID} layer="mechanism"
        question={EV_BACKTEST_PREDICT_Q}
        options={[EV_BACKTEST_PREDICT_NAIVE, EV_BACKTEST_PREDICT_WF]}
        correctIndex={1}
        explain={EV_BACKTEST_PREDICT_EXPLAIN}
      >
        <TimelineRow label={naiveSplitLbl} sublabel={naiveSplitSub} roleOf={naiveRole} />
        <TimelineRow label={walkForwardLbl} sublabel={wfSublabel} roleOf={wfRole} />

        <div className="bt-controls">
          <button type="button" className="pg-regen-btn" onClick={() => setPlaying((p) => !p)}>
            <i className={`ti ${playing ? 'ti-player-pause' : 'ti-player-play'}`} aria-hidden="true" />
            {playing ? pauseBtn : playBtn}
          </button>
          <input
            type="range" min={MIN_TRAIN} max={N - TEST_WINDOW} value={origin}
            onChange={(e) => { setPlaying(false); setOrigin(Number(e.target.value)); }}
            className="pg-slider bt-scrub"
          />
          <button type="button" className="pg-regen-btn" onClick={() => { setPlaying(false); setOrigin(MIN_TRAIN); }}>
            <i className="ti ti-rewind-backward-10" aria-hidden="true" /> {resetBtn}
          </button>
        </div>

        <div className="bt-legend">
          <span><i className="bt-dot bt-dot-train" /> {trainLegend}</span>
          <span><i className="bt-dot bt-dot-test" /> {testLegend}</span>
          <span><i className="bt-dot bt-dot-unused" /> {unusedLegend}</span>
        </div>
      </PredictGate>
      <div className="ml-citation-row"><MLCitation section="1" /></div>
    </div>
  );
}
