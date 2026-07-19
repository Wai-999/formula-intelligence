import './CompassMeter.css';

// The Model Selection Compass (research doc §4), rendered as three compact
// filled-bar meters per Module 3's spec ("not a separate heavy chart").
const AXES = [
  { key: 'interpretability', label: 'Interpretability', hint: 'High = easy to explain a single prediction' },
  { key: 'dataHunger', label: 'Data hunger', hint: 'High = needs years of history to work well' },
  { key: 'nonlinearity', label: 'Nonlinearity capture', hint: 'High = can learn complex, curved relationships' },
];

export default function CompassMeter({ compass }) {
  if (!compass) return null;
  return (
    <div className="compass-meter">
      {AXES.map((axis) => (
        <div className="compass-row" key={axis.key} title={axis.hint}>
          <span className="compass-label">{axis.label}</span>
          <span className="compass-bars">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={`compass-bar${i <= compass[axis.key] ? ' filled' : ''}`} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
