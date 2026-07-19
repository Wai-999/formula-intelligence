import './MLCitation.css';

// Reused across every ML module per Section F.5 — any real-world figure in
// the UI traces back to docs/research/ML-Research-Reference.md. `synthetic`
// swaps the citation icon/wording for the "illustrative data" label
// mandated for generated series (Section C.4).
export default function MLCitation({ section, synthetic = false }) {
  if (synthetic) {
    return (
      <span className="ml-citation ml-citation-synthetic">
        <i className="ti ti-flask" aria-hidden="true" />
        Illustrative data, calibrated to real-world patterns
      </span>
    );
  }
  return (
    <span className="ml-citation">
      <i className="ti ti-file-text" aria-hidden="true" />
      Source: ML-Research-Reference.md{section ? ` §${section}` : ''}
    </span>
  );
}
