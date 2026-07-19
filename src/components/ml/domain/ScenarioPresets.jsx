import { useT } from '../../../lib/mlContent.js';
import './ScenarioPresets.css';

function PresetButton({ scenario, onApply }) {
  const label = useT(scenario.label);
  return (
    <button type="button" className="sp-btn" onClick={() => onApply(scenario.state)}>
      {label}
    </button>
  );
}

// Generic scenario-preset button row, reused by every domain lab. Clicking
// a preset overwrites the whole driver state at once — a "what happens
// if..." shortcut rather than dragging every slider by hand.
export default function ScenarioPresets({ scenarios, onApply }) {
  return (
    <div className="sp-row">
      {scenarios.map((s) => (
        <PresetButton key={s.id} scenario={s} onApply={onApply} />
      ))}
    </div>
  );
}
