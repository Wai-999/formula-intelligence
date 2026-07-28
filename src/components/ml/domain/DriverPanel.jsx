import { useT } from '../../../lib/mlContent.js';
import './DriverPanel.css';

function DriverRow({ driver, value, onChange, min, max }) {
  const label = useT(driver.label);
  const relation = useT(driver.relation);
  return (
    <div className="dp-row">
      <div className="dp-row-head">
        <span className="dp-driver-label">{label}</span>
        <span className="dp-driver-value">{value > 0 ? '+' : ''}{value.toFixed(1)}</span>
      </div>
      <input
        type="range" min={min} max={max} step="0.1" value={value}
        onChange={(e) => onChange(driver.key, Number(e.target.value))}
        className="pg-slider dp-slider"
        // The visible label sits in a sibling span, which a screen reader
        // never associates with the control; the relation text is what
        // actually explains which direction the slider moves the forecast.
        aria-label={`${label} — ${relation}`}
        aria-valuetext={`${value > 0 ? '+' : ''}${value.toFixed(1)} standard deviations`}
      />
      <p className="dp-relation">{relation}</p>
    </div>
  );
}

// Generic 5-ish-slider driver panel reused by every domain lab (Gold/Macro/
// Micro/Politics). `drivers` is an array of {key,label,relation}; `state`/
// `onChange` follow the controlled-component pattern.
export default function DriverPanel({ drivers, state, onChange, min = -2, max = 2 }) {
  return (
    <div className="dp-grid">
      {drivers.map((d) => (
        <DriverRow key={d.key} driver={d} value={state[d.key] ?? 0} onChange={onChange} min={min} max={max} />
      ))}
    </div>
  );
}
