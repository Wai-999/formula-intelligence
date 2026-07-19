import { COMPASS_AXES } from '../../data/ml/models.js';
import { useT } from '../../lib/mlContent.js';
import './CompassMeter.css';

// The Model Selection Compass (research doc §4), rendered as three compact
// filled-bar meters per Module 3's spec ("not a separate heavy chart").
function CompassRow({ axis, value }) {
  const label = useT(axis.label);
  const hint = useT(axis.hint);
  return (
    <div className="compass-row" title={hint}>
      <span className="compass-label">{label}</span>
      <span className="compass-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`compass-bar${i <= value ? ' filled' : ''}`} />
        ))}
      </span>
    </div>
  );
}

export default function CompassMeter({ compass }) {
  if (!compass) return null;
  return (
    <div className="compass-meter">
      {COMPASS_AXES.map((axis) => (
        <CompassRow key={axis.key} axis={axis} value={compass[axis.key]} />
      ))}
    </div>
  );
}
