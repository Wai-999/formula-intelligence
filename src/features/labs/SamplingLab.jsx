import { useMemo, useRef, useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, rng, normal } from './plot.js';

// Sampling distributions (required lab). Draw many samples of size n from a
// population, keep each sample's mean, and compare the histogram of means
// with the normal curve the CLT predicts: centre μ, spread σ/√n.
// Draws come from a seeded generator, so "Restart" replays the same samples.

const POPS = {
  waits: { label: 'Clinic waits (skewed)', mu: 12, sigma: 12, draw: (r) => -12 * Math.log(1 - r()), range: [0, 40], unit: 'min' },
  uniform: { label: 'Uniform 0–10', mu: 5, sigma: 10 / Math.sqrt(12), draw: (r) => 10 * r(), range: [0, 10], unit: '' },
  bimodal: { label: 'Two humps', mu: 5, sigma: Math.sqrt(10), draw: (r) => (r() < 0.5 ? 2 : 8) + normal(r), range: [-1, 11], unit: '' },
};

const BINS = 24;

export default function SamplingLab() {
  const [pop, setPop] = useState('waits');
  const [n, setN] = useState(5);
  const [means, setMeans] = useState([]);
  const gen = useRef(rng(1));
  const P = POPS[pop];
  const se = P.sigma / Math.sqrt(n);

  const restart = (nextPop = pop) => { gen.current = rng(Object.keys(POPS).indexOf(nextPop) + 1); setMeans([]); };
  const draw = (count) => {
    const out = [];
    for (let k = 0; k < count; k++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += P.draw(gen.current);
      out.push(s / n);
    }
    setMeans((m) => [...m, ...out].slice(-20000));
  };

  const lo = P.mu - 4.2 * se;
  const hi = P.mu + 4.2 * se;
  const width = (hi - lo) / BINS;
  const counts = useMemo(() => {
    const c = new Array(BINS).fill(0);
    for (const m of means) {
      const b = Math.floor((m - lo) / width);
      if (b >= 0 && b < BINS) c[b] += 1;
    }
    return c;
  }, [means, lo, width]);
  const mean = means.length ? means.reduce((a, b) => a + b, 0) / means.length : NaN;
  const sd = means.length > 1 ? Math.sqrt(means.reduce((a, b) => a + (b - mean) ** 2, 0) / (means.length - 1)) : NaN;
  const density = (x) => Math.exp(-(((x - P.mu) / se) ** 2) / 2) / (se * Math.sqrt(2 * Math.PI));
  const ymax = Math.max(density(P.mu) * 1.25, ...counts.map((c) => (means.length ? c / (means.length * width) : 0)));

  const readout = means.length
    ? `${means.length} samples of size ${n} from “${P.label}”. Mean of the sample means ${fmt(mean, 3)} (population μ = ${fmt(P.mu, 3)}); their standard deviation ${fmt(sd, 3)} (predicted σ/√n = ${fmt(se, 3)}).`
    : `No samples yet. Population “${P.label}”: μ = ${fmt(P.mu, 3)}, σ = ${fmt(P.sigma, 3)}. With n = ${n} the CLT predicts sample means centred at μ with spread σ/√n = ${fmt(se, 3)}.`;

  return (
    <LabFrame
      title="Sampling distribution of the mean"
      intro="Pick a population — even a lopsided one — and a sample size. Draw samples and watch the histogram of their means. Then increase n."
      presets={Object.entries(POPS).map(([id, x]) => ({ id, label: x.label }))}
      activePreset={pop}
      onPreset={(id) => { setPop(id); restart(id); }}
      onReset={() => { setPop('waits'); setN(5); restart('waits'); }}
      figure={(
        <Plot x={[lo, hi]} y={[0, ymax]} xLabel={`sample mean${P.unit ? ` (${P.unit})` : ''}`} yLabel="density">
          {({ sx, sy }) => {
            let d = '';
            for (let i = 0; i <= 200; i++) {
              const x = lo + ((hi - lo) * i) / 200;
              d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(density(x)).toFixed(1)}`;
            }
            return (
              <g>
                {means.length > 0 && counts.map((c, i) => {
                  const h = c / (means.length * width);
                  return <rect key={i} className="lab-fill" x={sx(lo + i * width)} y={sy(h)} width={Math.max(0, sx(lo + (i + 1) * width) - sx(lo + i * width) - 1)} height={sy(0) - sy(h)} />;
                })}
                <path className="lab-curve-2" d={d} />
                <line className="lab-ghost" x1={sx(P.mu)} x2={sx(P.mu)} y1={sy(0)} y2={sy(ymax)} />
              </g>
            );
          }}
        </Plot>
      )}
      readout={readout}
      controls={(
        <>
          <Slider label="Sample size n" value={n} min={1} max={100} step={1} format={(v) => fmt(v, 0)} onChange={(v) => { setN(v); restart(); }} hint="Changing n starts a fresh set of samples." />
          <div className="studio-row" role="group" aria-label="Draw samples">
            <button type="button" className="lab-btn" onClick={() => draw(1)}>Draw 1 sample</button>
            <button type="button" className="lab-btn" onClick={() => draw(100)}>Draw 100</button>
            <button type="button" className="lab-btn" onClick={() => draw(1000)}>Draw 1,000</button>
            <button type="button" className="lab-btn" onClick={() => restart()}>Restart</button>
          </div>
          <dl className="lab-stat">
            <dt>Samples drawn</dt><dd>{means.length}</dd>
            <dt>SD of means</dt><dd>{fmt(sd, 3)}</dd>
            <dt>σ/√n</dt><dd>{fmt(se, 3)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: 'Histogram of the sample means (bin ranges and counts)',
        columns: ['From', 'To', 'Count'],
        rows: counts.map((c, i) => [fmt(lo + i * width, 2), fmt(lo + (i + 1) * width, 2), c]),
      }}
      annotations={['Quadrupling n halves the spread of the means: σ/√(4n) = ½·σ/√n.', 'With the skewed population and n = 1 or 2 the histogram is still lopsided; by n ≈ 30 it is close to the curve.']}
      constraints={['Draws are pseudo-random from a fixed seed (reproducible, not truly random).', 'Keeps at most the latest 20,000 means.']}
    />
  );
}
