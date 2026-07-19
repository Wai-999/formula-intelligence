import { UI_TRACE_EMPTY } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import './TracePanel.css';

function formatContribution(contribution, unit, unitPosition, decimals) {
  const positive = contribution >= 0;
  const sign = positive ? '+' : '-';
  const num = decimals > 0
    ? Math.abs(contribution).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(Math.abs(contribution)).toLocaleString();
  return unitPosition === 'suffix' ? `${sign}${num}${unit}` : `${sign}${unit}${num}`;
}

function TraceRow({ driver, contribution, maxAbs, unit, unitPosition, decimals }) {
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
        {formatContribution(contribution, unit, unitPosition, decimals)}
      </span>
    </div>
  );
}

// Generic "why did this move?" trace panel, reused by every domain lab.
// `contributions` is driverContributions() output; `driversByKey` maps
// driver key -> driver def (for bilingual labels). unit/unitPosition/
// decimals default to Gold's original whole-dollar-prefix formatting;
// Macro passes decimals>0 + a suffix unit since whole-point rounding would
// collapse its percentage-point-scale contributions to 0 or 1 for everything.
export default function TracePanel({
  contributions, driversByKey, unit = '$', unitPosition = 'prefix', decimals = 0,
}) {
  const emptyText = useT(UI_TRACE_EMPTY);
  if (!contributions.length) {
    return <p className="tp-empty">{emptyText}</p>;
  }
  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.contribution)));
  return (
    <div className="tp-list">
      {contributions.map((c) => (
        <TraceRow
          key={c.key} driver={driversByKey[c.key]} contribution={c.contribution} maxAbs={maxAbs}
          unit={unit} unitPosition={unitPosition} decimals={decimals}
        />
      ))}
    </div>
  );
}
