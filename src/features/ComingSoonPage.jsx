import './ComingSoonPage.css';

export default function ComingSoonPage({ tab }) {
  return (
    <div className="coming-soon">
      <i className={`ti ${tab?.icon ?? 'ti-tools'}`} aria-hidden="true" />
      <p className="coming-soon-title">{tab?.label ?? 'This tab'} — not yet migrated</p>
      <p className="coming-soon-sub">
        Still lives in the original Formula_Intelligence_v2.html. Porting to React is next in the queue.
      </p>
    </div>
  );
}
