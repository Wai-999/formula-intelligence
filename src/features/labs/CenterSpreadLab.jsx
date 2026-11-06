import { useState } from 'react';
import { LabFrame, Slider, Segmented } from './LabKit.jsx';
import { fmt, linear, ticks } from './plot.js';
import { mean, summarize } from './describe.js';

// Center and spread (phase 6 of the 80/20 upgrade, ps-center-spread): a dot
// plot whose largest value can be moved far out. The mean and the standard
// deviation follow it; the median and the interquartile range barely move.

const PRESETS = [
  { id: 'bus', label: 'Bus route B, 7 trips (minutes)', values: [15, 22, 26, 30, 33, 38, 55], unit: 'minutes', max: 120 },
  { id: 'clinic', label: 'Clinic visits (minutes)', values: [9, 11, 12, 12, 13, 14, 15, 16, 18, 40], unit: 'minutes', max: 80 },
  { id: 'salaries', label: 'Salaries ($ thousands)', values: [60, 62, 65, 68, 70, 72, 75, 300], unit: 'thousand dollars', max: 400 },
];

const W = 440;
const AXIS = 176;

export default function CenterSpreadLab({ preset: initial = 'bus' }) {
  const start = PRESETS.find((p) => p.id === initial) ?? PRESETS[0];
  const [preset, setPreset] = useState(start.id);
  const p = PRESETS.find((x) => x.id === preset);
  const rest = p.values.slice(0, -1);
  const [last, setLast] = useState(start.values.at(-1));
  const [show, setShow] = useState('both');
  const values = [...rest, last];
  const s = summarize(values);
  const hi = Math.max(p.max, last);
  const sx = linear(0, hi, 24, W - 16);

  // Equal values stack upwards, one dot above the other.
  const seen = {};
  const dots = values.map((v, i) => {
    seen[v] = (seen[v] ?? 0) + 1;
    return { v, k: seen[v] - 1, moving: i === values.length - 1 };
  });
  const showMean = show !== 'median';
  const showMedian = show !== 'mean';

  const gap = s.mean - s.median;
  const readout = `Mean ${fmt(s.mean, 1)}, median ${fmt(s.median, 1)} ${p.unit}. `
    + `Standard deviation ${fmt(s.sd, 1)}, interquartile range ${fmt(s.iqr, 1)}. `
    + `The largest value is ${fmt(last, 0)}: the mean is ${fmt(Math.abs(gap), 1)} ${gap >= 0 ? 'above' : 'below'} the median.`;

  const figure = (
    <svg viewBox={`0 0 ${W} 210`} className="lab-svg" style={{ color: 'var(--text-muted)' }}>
      {showMean && (
        <g>
          <rect className="lab-fill" x={sx(Math.max(0, s.mean - s.sd))} y={22} width={sx(s.mean + s.sd) - sx(Math.max(0, s.mean - s.sd))} height={16} />
          <text className="lab-label-muted" x={sx(s.mean)} y={16} textAnchor="middle">mean ± 1 SD</text>
          <line className="lab-curve" x1={sx(s.mean)} x2={sx(s.mean)} y1={22} y2={AXIS} />
          <text className="lab-label" x={sx(s.mean) + 4} y={AXIS - 62}>mean {fmt(s.mean, 1)}</text>
        </g>
      )}
      {showMedian && (
        <g>
          <rect className="lab-fill-2" x={sx(s.q1)} y={46} width={Math.max(1, sx(s.q3) - sx(s.q1))} height={16} />
          <text className="lab-label-muted" x={sx(s.q1)} y={76}>middle half (IQR)</text>
          <line className="lab-curve-2" x1={sx(s.median)} x2={sx(s.median)} y1={46} y2={AXIS} />
          <text className="lab-label" x={sx(s.median) + 4} y={AXIS - 40}>median {fmt(s.median, 1)}</text>
        </g>
      )}
      <line x1={sx(0)} x2={sx(hi)} y1={AXIS} y2={AXIS} stroke="currentColor" strokeWidth="1.5" />
      {ticks(0, hi).map((t) => (
        <g key={t}>
          <line x1={sx(t)} x2={sx(t)} y1={AXIS} y2={AXIS + 5} stroke="currentColor" />
          <text className="lab-label-muted" x={sx(t)} y={AXIS + 18} textAnchor="middle">{fmt(t, 0)}</text>
        </g>
      ))}
      {dots.map((d, i) => (
        <circle key={i} className={d.moving ? 'lab-point-2' : 'lab-point'} cx={sx(d.v)} cy={AXIS - 8 - d.k * 13} r={6} />
      ))}
    </svg>
  );

  const m = mean(values);
  const rows = [...values].sort((a, b) => a - b).map((v) => [fmt(v, 1), fmt(v - m, 2), fmt((v - m) ** 2, 2)]);

  return (
    <LabFrame
      title="Center and spread"
      intro="Move the largest value (the highlighted dot) far out. Watch which summaries follow it and which stay put."
      presets={PRESETS}
      activePreset={preset}
      onPreset={(id) => { const n = PRESETS.find((x) => x.id === id); setPreset(id); setLast(n.values.at(-1)); }}
      onReset={() => { setPreset(start.id); setLast(start.values.at(-1)); setShow('both'); }}
      figure={figure}
      readout={readout}
      controls={(
        <>
          <Slider label={`Largest value (${p.unit})`} value={last} min={Math.max(...rest)} max={p.max} step={1} format={(v) => fmt(v, 0)} onChange={setLast} />
          <Segmented label="Show" options={[{ value: 'both', label: 'Both' }, { value: 'mean', label: 'Mean and SD' }, { value: 'median', label: 'Median and IQR' }]} value={show} onChange={setShow} />
          <dl className="lab-stat">
            <dt>Mean</dt><dd>{fmt(s.mean, 2)}</dd>
            <dt>Median</dt><dd>{fmt(s.median, 2)}</dd>
            <dt>Standard deviation</dt><dd>{fmt(s.sd, 2)}</dd>
            <dt>Q1, Q3</dt><dd>{fmt(s.q1, 2)}, {fmt(s.q3, 2)}</dd>
            <dt>IQR</dt><dd>{fmt(s.iqr, 2)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: `The ${s.n} values, sorted, with each one’s deviation from the mean (${fmt(m, 2)})`,
        columns: [`Value (${p.unit})`, 'Deviation from the mean', 'Squared deviation'],
        rows,
      }}
      annotations={[
        'The deviations always add to zero; the squared deviations do not. Their sum, divided by n − 1, is the variance, and its square root the standard deviation.',
        'The upper band is the mean ± one standard deviation; the lower band is the middle half of the data, from Q1 to Q3.',
      ]}
      constraints={[
        'Quartiles use the median of each half, leaving out the middle value when the count is odd. Software that interpolates (NumPy, spreadsheet QUARTILE functions) can give slightly different quartiles.',
        'Only the largest value moves; the others are fixed by the example.',
        'With very few values the quartiles sit next to the ends, so the IQR moves too: with 5 values, Q3 is the middle of the top two.',
      ]}
    />
  );
}
