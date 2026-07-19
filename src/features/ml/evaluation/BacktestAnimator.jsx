import { useEffect, useRef, useState } from 'react';
import { BACKTEST_INTRO } from '../../../data/ml/evaluation.js';
import { useT } from '../../../lib/mlContent.js';
import MLCitation from '../../../components/ml/MLCitation.jsx';

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
      <p className="ml-section-title">Walk-Forward vs. Naive Split</p>
      <p className="ml-section-sub">{intro}</p>

      <TimelineRow label="Naive random split" sublabel="fixed — notice train (blue) cells appearing after test (amber) cells" roleOf={naiveRole} />
      <TimelineRow label="Walk-forward backtest" sublabel={`origin t=${origin} — train up to origin, test the next ${TEST_WINDOW} steps, then roll forward`} roleOf={wfRole} />

      <div className="bt-controls">
        <button type="button" className="pg-regen-btn" onClick={() => setPlaying((p) => !p)}>
          <i className={`ti ${playing ? 'ti-player-pause' : 'ti-player-play'}`} aria-hidden="true" />
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range" min={MIN_TRAIN} max={N - TEST_WINDOW} value={origin}
          onChange={(e) => { setPlaying(false); setOrigin(Number(e.target.value)); }}
          className="pg-slider bt-scrub"
        />
        <button type="button" className="pg-regen-btn" onClick={() => { setPlaying(false); setOrigin(MIN_TRAIN); }}>
          <i className="ti ti-rewind-backward-10" aria-hidden="true" /> Reset
        </button>
      </div>

      <div className="bt-legend">
        <span><i className="bt-dot bt-dot-train" /> train</span>
        <span><i className="bt-dot bt-dot-test" /> test</span>
        <span><i className="bt-dot bt-dot-unused" /> not yet used</span>
      </div>
      <div className="ml-citation-row"><MLCitation section="1" /></div>
    </div>
  );
}
