import { UI_ILLUSTRATIVE_DATA, UI_SOURCE_LBL } from '../../data/ml/uiStrings.js';
import { useT } from '../../lib/mlContent.js';
import { useUIStore } from '../../store/useUIStore.js';
import './MLCitation.css';

// Reused across every ML module per Section F.5 — any real-world figure in
// the UI traces back to docs/research/ML-Research-Reference.md. `synthetic`
// swaps the citation icon/wording for the "illustrative data" label
// mandated for generated series (Section C.4).
//
// The sourced variant is a BUTTON, not static text: the document it names
// now ships inside the app (Sources tab), so a citation that merely printed
// a filename was asking the reader to go find a file they had no way to
// open. Clicking jumps to the cited section itself. The synthetic variant
// stays inert — there is no source to open, which is precisely its point.
export default function MLCitation({ section, synthetic = false }) {
  const illustrativeData = useT(UI_ILLUSTRATIVE_DATA);
  const sourceLbl = useT(UI_SOURCE_LBL);
  const navigateToLinkedConcept = useUIStore((s) => s.navigateToLinkedConcept);

  if (synthetic) {
    return (
      <span className="ml-citation ml-citation-synthetic">
        <i className="ti ti-flask" aria-hidden="true" />
        {illustrativeData}
      </span>
    );
  }
  return (
    <button
      type="button"
      className="ml-citation ml-citation-link"
      onClick={() => navigateToLinkedConcept('ml', 'sources', { section })}
      title="Open this section of the research reference"
    >
      <i className="ti ti-file-text" aria-hidden="true" />
      {sourceLbl}: ML-Research-Reference.md{section ? ` \u00a7${section}` : ''}
    </button>
  );
}
