import { useMemo } from 'react';
import { CHAPTERS, nodes } from '../../data/index.js';
import { useUIStore, TABS } from '../../store/useUIStore.js';
import { useMasteryStore } from '../../store/useMasteryStore.js';
import './NavSidebar.css';

export default function NavSidebar() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const chapterFilter = useUIStore((s) => s.chapterFilter);
  const setChapterFilter = useUIStore((s) => s.setChapterFilter);
  const breadcrumbFrom = useUIStore((s) => s.breadcrumbFrom);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const clearBreadcrumb = useUIStore((s) => s.clearBreadcrumb);
  const recallData = useMasteryStore((s) => s.recallData);
  const getNodeState = useMasteryStore((s) => s.getNodeState);

  const breadcrumbLabel = breadcrumbFrom ? TABS.find((t) => t.id === breadcrumbFrom)?.label : null;

  function handleBreadcrumbClick() {
    setActiveTab(breadcrumbFrom);
    clearBreadcrumb();
  }

  const chapterCounts = useMemo(() => {
    const counts = {};
    for (const n of nodes) counts[n.ch] = (counts[n.ch] || 0) + 1;
    return counts;
  }, []);

  const masteryCounts = useMemo(() => {
    let mastered = 0;
    let needsReview = 0;
    for (const n of nodes) {
      const { state } = getNodeState(n.id);
      if (state === 'gold' || state === 'green') mastered++;
      if (state === 'red') needsReview++;
    }
    return { mastered, needsReview };
    // recallData is read indirectly through getNodeState's closure over the
    // store; it must stay a dependency so counts refresh after mastery changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNodeState, recallData]);

  return (
    <aside className="nav-sidebar">
      {breadcrumbLabel && (
        <button type="button" className="nav-breadcrumb" onClick={handleBreadcrumbClick}>
          <i className="ti ti-arrow-left" aria-hidden="true" />
          Back to {breadcrumbLabel}
        </button>
      )}
      <div className="nav-sidebar-head">
        <p className="nav-sidebar-title">Formula map</p>
        <p className="nav-sidebar-sub">{nodes.length} nodes · {CHAPTERS.length} chapters</p>
      </div>

      <div className="nav-search">
        <i className="ti ti-search" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search formulas…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="nav-search-clear"
            aria-label="Clear search"
            onClick={() => setSearchQuery('')}
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="nav-section-label">Chapters</div>
      <div className="nav-chapter-list">
        {CHAPTERS.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className={`nav-chapter-item${chapterFilter === ch.id ? ' active' : ''}`}
            onClick={() => setChapterFilter(ch.id)}
          >
            <span className="nav-dot" style={{ background: ch.color }} />
            <span className="nav-chapter-name">{ch.name}</span>
            <span className="nav-badge">{chapterCounts[ch.id] || 0}</span>
          </button>
        ))}
      </div>

      <div className="nav-section-label">Mastery</div>
      <div className="nav-mastery-list">
        <div className="nav-mastery-item">
          <span className="nav-dot" style={{ background: '#fbbf24' }} />
          <span className="nav-chapter-name">Mastered</span>
          <span className="nav-badge">{masteryCounts.mastered}</span>
        </div>
        <div className="nav-mastery-item">
          <span className="nav-dot" style={{ background: '#f87171' }} />
          <span className="nav-chapter-name">Needs review</span>
          <span className="nav-badge">{masteryCounts.needsReview}</span>
        </div>
      </div>
    </aside>
  );
}
