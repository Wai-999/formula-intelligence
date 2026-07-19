import { useUIStore } from '../../store/useUIStore.js';
import { ML_TABS } from '../../store/useMLUIStore.js';
import './IconRail.css';

// Reuses IconRail.css's classes verbatim (same rail width, button size,
// hover/active treatment) so the two rails read as the same component with
// a different tab list — not a different app. See BUILD_LOG.md Module 1.
export default function MLIconRail() {
  const mlActiveTab = useUIStore((s) => s.mlActiveTab);
  const setMLActiveTab = useUIStore((s) => s.setMLActiveTab);

  return (
    <nav className="icon-rail" aria-label="ML sections">
      {ML_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`icon-rail-btn${mlActiveTab === tab.id ? ' active' : ''}`}
          title={tab.label}
          aria-label={tab.label}
          aria-current={mlActiveTab === tab.id ? 'page' : undefined}
          onClick={() => setMLActiveTab(tab.id)}
        >
          <i className={`ti ${tab.icon}`} aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
