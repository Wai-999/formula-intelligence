import { useState } from 'react';
import { LabFrame, Slider, Plot } from './LabKit.jsx';
import { fmt, pathOf } from './plot.js';
import { toRadians, piFraction, circlePoint } from './growth.js';

// Radians and the unit circle (V5 Phase 2B: Precalculus → Calculus I).
// Walk an angle around a circle of radius 1: the arc walked IS the angle in
// radians, and the point reached is (cos θ, sin θ). Below, the same angle
// on the sine and cosine graphs — the circle unrolled.

const SPECIAL = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

export default function UnitCircleLab() {
  const [deg, setDeg] = useState(150);
  const th = toRadians(deg);
  const [cx, cy] = circlePoint(th);

  const readout = `θ = ${deg}° = ${piFraction(deg)} ≈ ${fmt(th, 3)} radians — the length of the arc walked on a circle of radius 1. `
    + `The point reached is (cos θ, sin θ) = (${fmt(cx, 3)}, ${fmt(cy, 3)}); cos²θ + sin²θ = ${fmt(cx * cx + cy * cy, 6)}.`;

  // A short arc from angle 0 to θ, drawn as a polyline in plot coordinates.
  const arc = (sx, sy, r) => {
    const n = Math.max(2, Math.round(deg / 3));
    let d = '';
    for (let i = 0; i <= n; i += 1) {
      const a = (th * i) / n;
      d += `${i ? 'L' : 'M'}${sx(r * Math.cos(a)).toFixed(2)},${sy(r * Math.sin(a)).toFixed(2)}`;
    }
    return d;
  };

  const circle = (
    <Plot x={[-1.3, 1.3]} y={[-1.3, 1.3]} square width={300} xLabel="x = cos θ" yLabel="y = sin θ">
      {({ sx, sy, w }) => (
        <g>
          <path className="lab-ghost" d={pathOf((x) => Math.sqrt(Math.max(0, 1 - x * x)), -1, 1, sx, sy)} />
          <path className="lab-ghost" d={pathOf((x) => -Math.sqrt(Math.max(0, 1 - x * x)), -1, 1, sx, sy)} />
          {deg > 0 && <path className="lab-curve" d={arc(sx, sy, 1)} />}
          <line className="lab-curve-2" x1={sx(0)} y1={sy(0)} x2={sx(cx)} y2={sy(cy)} />
          <line className="lab-curve-3" x1={sx(cx)} y1={sy(0)} x2={sx(cx)} y2={sy(cy)} />
          <line className="lab-curve-3" x1={sx(0)} y1={sy(cy)} x2={sx(cx)} y2={sy(cy)} />
          <circle className="lab-point" cx={sx(cx)} cy={sy(cy)} r="5" />
          <text className="lab-label" x={Math.min(Math.max(sx(cx), 75), w - 60)} y={sy(cy) + (cy >= 0 ? -12 : 22)} textAnchor="middle">({fmt(cx, 2)}, {fmt(cy, 2)})</text>
        </g>
      )}
    </Plot>
  );

  const waves = (
    <Plot x={[0, 2 * Math.PI]} y={[-1.2, 1.2]} height={200} xLabel="θ (radians)" yLabel="sin θ, cos θ">
      {({ sx, sy }) => (
        <g>
          <path className="lab-curve" d={pathOf(Math.sin, 0, 2 * Math.PI, sx, sy)} />
          <path className="lab-curve-2" d={pathOf(Math.cos, 0, 2 * Math.PI, sx, sy)} />
          <line className="lab-ghost" x1={sx(th)} x2={sx(th)} y1={sy(-1.2)} y2={sy(1.2)} />
          <circle className="lab-point" cx={sx(th)} cy={sy(cy)} r="4" />
          <rect className="lab-point-2" x={sx(th) - 4} y={sy(cx) - 4} width="8" height="8" />
          <text className="lab-label-muted" x={sx(0.1)} y={sy(1.08)}>solid: sin θ · dashed: cos θ</text>
        </g>
      )}
    </Plot>
  );

  return (
    <LabFrame
      title="The unit circle, and the circle unrolled"
      intro="Move the angle. The thick arc is θ in radians; the point’s coordinates are cos θ and sin θ. The graph below unrolls the circle: the same angle on the sine (circle marker) and cosine (square marker) curves."
      presets={[{ id: '30', label: '30°' }, { id: '90', label: 'A right angle' }, { id: '150', label: '150°' }, { id: '180', label: 'Half a turn' }, { id: '57', label: 'About one radian (57°)' }]}
      activePreset={String(deg)}
      onPreset={(id) => setDeg(Number(id))}
      onReset={() => setDeg(150)}
      figure={<div className="chain-figs"><div>{circle}</div><div>{waves}</div></div>}
      readout={readout}
      controls={(
        <>
          <Slider label="Angle θ" value={deg} min={0} max={360} step={1} format={(v) => `${v}° = ${fmt(toRadians(v), 3)} rad`} onChange={setDeg} />
          <dl className="lab-stat">
            <dt>Radians</dt><dd>{piFraction(deg)} ≈ {fmt(th, 4)}</dd>
            <dt>cos θ</dt><dd>{fmt(cx, 4)}</dd>
            <dt>sin θ</dt><dd>{fmt(cy, 4)}</dd>
            <dt>Arc length (radius 1)</dt><dd>{fmt(th, 4)}</dd>
          </dl>
        </>
      )}
      table={{
        caption: 'Special angles: degrees, radians, cosine and sine',
        columns: ['Degrees', 'Radians', 'cos θ', 'sin θ'],
        rows: SPECIAL.map((d) => { const [c, s] = circlePoint(toRadians(d)); return [d, `${piFraction(d)} ≈ ${fmt(toRadians(d), 3)}`, fmt(c, 4), fmt(s, 4)]; }),
      }}
      annotations={[
        'One radian is the angle whose arc equals the radius: about 57.3°. A full turn is 2π ≈ 6.283 radians.',
        'Sine and cosine repeat every 2π: the graph below is one full turn of the circle above.',
      ]}
      constraints={[
        'Angles are measured anticlockwise from the positive x-axis, as in mathematics and in programming libraries.',
      ]}
    />
  );
}
