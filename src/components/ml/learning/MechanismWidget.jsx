import { useState } from 'react';
import { useT } from '../../../lib/mlContent.js';
import './MechanismWidget.css';

// One generic, parameterized "move a slider, watch a computed output react
// live" widget, reused across every model that doesn't already have a real
// interactive counterpart elsewhere in ML mode (see BUILD_LOG.md's Phase 1
// note on mechanism.kind). `compute` is the one piece of real per-model
// content — a small function capturing that model's actual core mechanism,
// not a generic filler animation.
export default function MechanismWidget({
  paramLabel, paramMin, paramMax, paramDefault, paramStep = 0.1, paramDecimals = 1,
  compute, outputLabel, outputDecimals = 2, outputSuffix = '',
}) {
  const [value, setValue] = useState(paramDefault);
  const label = useT(paramLabel);
  const outLabel = useT(outputLabel);
  const output = compute(value);

  return (
    <div className="mechanism-widget">
      <div className="mechanism-widget-row">
        <span className="ml-lbl">{label}: {value.toFixed(paramDecimals)}</span>
        <input
          type="range" min={paramMin} max={paramMax} step={paramStep} value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="pg-slider"
        />
      </div>
      <div className="mechanism-widget-output">
        <span className="ml-lbl">{outLabel}</span>
        <span className="mechanism-widget-output-value">{output.toFixed(outputDecimals)}{outputSuffix}</span>
      </div>
    </div>
  );
}
