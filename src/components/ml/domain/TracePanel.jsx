import { useT } from '../../../lib/mlContent.js';
import './TracePanel.css';

function TraceRow({ driver, contribution, maxAbs, unit }) {
  const label = useT(driver.label);
  const positive = contribution >= 0;
  const width = (Math.abs(contribution) / maxAbs) * 100;
  return (
    <div className="tp-row">
      <span className="tp-label">{label}</span>
      <div className="tp-bar-track">
        <div className={`tp-bar-fill ${positive ? 'tp-pos' : 'tp-neg'}`} style={{ width: `${width}%`, marginLeft: positive ? '50%' : `${50 - width}%` }} />
        <div className="tp-bar-mid" />
      </div>
      <span className={`tp-value ${positive ? 'tp-pos-text' : 'tp-neg-text'}`}>
        {positive ? '+' : ''}{unit}{Math.round(contribution).toLocaleString()}
      </span>
    </div>
  );
}

// Generic "why did this move?" trace panel, reused by every domain lab.
// `contributions` is driverContributions() output; `driversByKey` maps
// driver key -> driver def (for bilingual labels).
export default function TracePanel({ contributions, driversByKey, unit = '$' }) {
  if (!contributions.length) {
    return <p className="tp-empty">All drivers are at baseline — move one above to see its effect traced here.</p>;
  }
  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.contribution)));
  return (
    <div className="tp-list">
      {contributions.map((c) => (
        <TraceRow key={c.key} driver={driversByKey[c.key]} contribution={c.contribution} maxAbs={maxAbs} unit={unit} />
      ))}
    </div>
  );
}
