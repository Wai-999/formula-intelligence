import { useUIStore, TABS } from '../../store/useUIStore.js';
import { useErrorLogStore } from '../../store/useErrorLogStore.js';
import './IconRail.css';

export default function IconRail() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const unresolvedErrors = useErrorLogStore((s) => s.errorLog.filter((e) => !e.resolved).length);

  return (
    <nav className="icon-rail" aria-label="Sections">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`icon-rail-btn${activeTab === tab.id ? ' active' : ''}`}
          title={tab.label}
          aria-label={tab.label}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => setActiveTab(tab.id)}
        >
          <i className={`ti ${tab.icon}`} aria-hidden="true" />
          {tab.id === 'errors' && unresolvedErrors > 0 && (
            <span className="icon-rail-badge">{unresolvedErrors > 99 ? '99+' : unresolvedErrors}</span>
          )}
          {!tab.ready && <span className="icon-rail-dot" aria-hidden="true" />}
        </button>
      ))}
    </nav>
  );
}
