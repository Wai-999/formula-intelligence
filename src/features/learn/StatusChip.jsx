// Authoring status, stated plainly: a course is never shown as complete
// because its outline exists (§17).
export default function StatusChip({ status, authored }) {
  if (status === 'authored') return <span className="studio-chip studio-chip-ok"><i className="ti ti-circle-check" aria-hidden="true" /> {authored} lessons written</span>;
  if (status === 'partial') return <span className="studio-chip studio-chip-accent"><i className="ti ti-circle-half-2" aria-hidden="true" /> {authored} {authored === 1 ? 'lesson' : 'lessons'} written · rest outlined</span>;
  return <span className="studio-chip"><i className="ti ti-circle-dashed" aria-hidden="true" /> Outline only — lessons not written yet</span>;
}
