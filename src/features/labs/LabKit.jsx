import { useId, useState } from 'react';
import { linear, ticks, fmt } from './plot.js';
import './labs.css';

/**
 * The frame every visual lab shares (§7: "adjustable inputs, reset,
 * deterministic examples, constraints, annotations, and accessible
 * fallback").
 *
 *  - presets: deterministic worked examples, one click each
 *  - controls: labelled native inputs (keyboard and screen-reader operable)
 *  - figure: the SVG; decorative to assistive tech, because…
 *  - readout: a sentence describing the current state, announced on change
 *  - table: the same state as numbers, for anyone who can't or won't read
 *    the picture — the lab is fully usable with the figure hidden
 *  - constraints/annotations: what the lab limits and what to notice
 */
export function LabFrame({ title, intro, presets, activePreset, onPreset, onReset, controls, figure, readout, table, constraints, annotations }) {
  const [showTable, setShowTable] = useState(false);
  const id = useId();
  return (
    <section className="lab" aria-labelledby={`${id}-t`}>
      <div className="lab-head">
        <h3 className="lab-title" id={`${id}-t`}><i className="ti ti-flask" aria-hidden="true" /> {title}</h3>
        <div className="lab-head-actions">
          <button type="button" className="lab-btn" aria-pressed={showTable} onClick={() => setShowTable((v) => !v)}>
            <i className="ti ti-table" aria-hidden="true" /> {showTable ? 'Hide numbers' : 'Show as numbers'}
          </button>
          <button type="button" className="lab-btn" onClick={onReset}><i className="ti ti-refresh" aria-hidden="true" /> Reset</button>
        </div>
      </div>
      {intro && <p className="lab-intro">{intro}</p>}
      {presets?.length > 0 && (
        <div className="lab-presets" role="group" aria-label="Examples">
          <span className="lab-presets-label">Examples:</span>
          {presets.map((p) => (
            <button key={p.id} type="button" className="lab-chip" aria-pressed={activePreset === p.id} onClick={() => onPreset(p.id)}>{p.label}</button>
          ))}
        </div>
      )}
      <div className="lab-body">
        <figure className="lab-figure">
          <div className="lab-svg-wrap" aria-hidden="true">{figure}</div>
          <figcaption className="lab-readout" aria-live="polite">{readout}</figcaption>
        </figure>
        <div className="lab-controls">{controls}</div>
      </div>
      {showTable && table && (
        <div className="studio-table-wrap lab-table">
          <table className="studio-table">
            <caption className="lab-caption">{table.caption}</caption>
            <thead><tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>{r.map((v, j) => (j === 0 ? <th key={j} scope="row">{v}</th> : <td key={j}>{v}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(annotations?.length > 0 || constraints?.length > 0) && (
        <div className="lab-notes">
          {annotations?.length > 0 && (
            <div>
              <p className="lab-notes-title">Notice</p>
              <ul>{annotations.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
          )}
          {constraints?.length > 0 && (
            <div>
              <p className="lab-notes-title">Limits of this lab</p>
              <ul>{constraints.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** A labelled range input with its current value shown and announced. */
export function Slider({ label, value, min, max, step = 0.1, onChange, format = (v) => fmt(v, 2), hint }) {
  const id = useId();
  return (
    <div className="lab-slider">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id}>{format(value)}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${label} ${format(value)}`}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}

/** A small set of mutually exclusive options. */
export function Segmented({ label, options, value, onChange }) {
  return (
    <fieldset className="lab-seg">
      <legend>{label}</legend>
      <div className="lab-seg-row">
        {options.map((o) => (
          <label key={o.value} className={value === o.value ? 'on' : ''}>
            <input type="radio" name={label} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Axes, grid and tick labels for a 2D plot. Children receive the scales.
 * The SVG scales with its container (viewBox), so labs never overflow.
 */
export function Plot({ x: [x0, x1], y: [y0, y1], width = 420, height = 300, xLabel = 'x', yLabel = 'y', children, square = false, pad = 34 }) {
  let w = width;
  let h = height;
  if (square) {
    const k = (x1 - x0) / (y1 - y0);
    h = Math.round((w - pad * 2) / k + pad * 2);
  }
  const sx = linear(x0, x1, pad, w - pad / 2);
  const sy = linear(y0, y1, h - pad, pad / 2);
  const xt = ticks(x0, x1);
  const yt = ticks(y0, y1);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="lab-svg" preserveAspectRatio="xMidYMid meet">
      <g className="lab-grid">
        {xt.map((t) => <line key={`gx${t}`} x1={sx(t)} x2={sx(t)} y1={sy(y0)} y2={sy(y1)} />)}
        {yt.map((t) => <line key={`gy${t}`} x1={sx(x0)} x2={sx(x1)} y1={sy(t)} y2={sy(t)} />)}
      </g>
      <g className="lab-axis">
        {y0 <= 0 && y1 >= 0 && <line x1={sx(x0)} x2={sx(x1)} y1={sy(0)} y2={sy(0)} />}
        {x0 <= 0 && x1 >= 0 && <line x1={sx(0)} x2={sx(0)} y1={sy(y0)} y2={sy(y1)} />}
      </g>
      <g className="lab-ticks">
        {xt.map((t) => <text key={`tx${t}`} x={sx(t)} y={h - pad + 15} textAnchor="middle">{fmt(t, 2)}</text>)}
        {yt.map((t) => <text key={`ty${t}`} x={pad - 6} y={sy(t) + 4} textAnchor="end">{fmt(t, 2)}</text>)}
      </g>
      <text className="lab-axis-label" x={w - pad / 2} y={h - pad - 6} textAnchor="end">{xLabel}</text>
      <text className="lab-axis-label" x={pad + 6} y={pad / 2 + 10}>{yLabel}</text>
      {children({ sx, sy, w, h, pad })}
    </svg>
  );
}
