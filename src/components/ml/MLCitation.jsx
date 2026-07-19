import { UI_ILLUSTRATIVE_DATA, UI_SOURCE_LBL } from '../../data/ml/uiStrings.js';
import { useT } from '../../lib/mlContent.js';
import './MLCitation.css';

// Reused across every ML module per Section F.5 — any real-world figure in
// the UI traces back to docs/research/ML-Research-Reference.md. `synthetic`
// swaps the citation icon/wording for the "illustrative data" label
// mandated for generated series (Section C.4).
export default function MLCitation({ section, synthetic = false }) {
  const illustrativeData = useT(UI_ILLUSTRATIVE_DATA);
  const sourceLbl = useT(UI_SOURCE_LBL);

  if (synthetic) {
    return (
      <span className="ml-citation ml-citation-synthetic">
        <i className="ti ti-flask" aria-hidden="true" />
        {illustrativeData}
      </span>
    );
  }
  return (
    <span className="ml-citation">
      <i className="ti ti-file-text" aria-hidden="true" />
      {sourceLbl}: ML-Research-Reference.md{section ? ` §${section}` : ''}
    </span>
  );
}
