import { MISCONCEPTIONS } from '../../../data/ml/misconceptions.js';
import { UI_MISCONCEPTION_LBL, UI_ACTUALLY_LBL } from '../../../data/ml/uiStrings.js';
import { useT } from '../../../lib/mlContent.js';
import './MisconceptionCallout.css';

// Refutation-text UI (docs/research/ML-Mode-Pedagogy-Research.md §1, "Refutation
// Text") for the six named misconceptions + the unlabeled "less biased than
// humans" one — state the belief plainly, then correct it. Kept collegial
// per the mission's own guardrail (Section I): a genuine correction, framed
// as something reasonable to have assumed, not a gotcha.
export default function MisconceptionCallout({ misconceptionId }) {
  const entry = MISCONCEPTIONS[misconceptionId];
  const misconceptionLbl = useT(UI_MISCONCEPTION_LBL);
  const actuallyLbl = useT(UI_ACTUALLY_LBL);
  const belief = useT(entry?.belief);
  const truth = useT(entry?.truth);

  if (!entry) return null;

  return (
    <div className="misconception-callout">
      <p className="misconception-lbl"><i className="ti ti-message-question" aria-hidden="true" /> {misconceptionLbl}</p>
      <p className="misconception-belief">{belief}</p>
      <p className="misconception-actually-lbl"><i className="ti ti-arrow-right" aria-hidden="true" /> {actuallyLbl}</p>
      <p className="misconception-truth">{truth}</p>
    </div>
  );
}
