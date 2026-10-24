import { Suspense, lazy } from 'react';
import MLIconRail from './MLIconRail.jsx';
import ErrorBoundary from '../error/ErrorBoundary.jsx';
import { useUIStore } from '../../store/useUIStore.js';
import { ML_TABS } from '../../store/useMLUIStore.js';
import { useVisitedTabs } from '../../hooks/useVisitedTabs.js';
import LevelLangToggle from '../ml/LevelLangToggle.jsx';
import UnderstandingTrackerBadge from '../ml/learning/UnderstandingTrackerBadge.jsx';
import EntryMisconceptionBanner from '../ml/learning/EntryMisconceptionBanner.jsx';
import { useT } from '../../lib/mlContent.js';
import './MLBody.css';

// Lazy-loaded so Stats mode's bundle doesn't grow for users who never open
// ML mode (Phase 1 §2 — "code-splittable" without adding a router).
const PipelinePage = lazy(() => import('../../features/ml/pipeline/PipelinePage.jsx'));
const ModelMapPage = lazy(() => import('../../features/ml/modelmap/ModelMapPage.jsx'));
const PythonHubPage = lazy(() => import('../../features/ml/python/PythonHubPage.jsx'));
const PyLabPage = lazy(() => import('../../features/ml/pylab/PyLabPage.jsx'));
const SourcesPage = lazy(() => import('../../features/ml/sources/SourcesPage.jsx'));

// Mixed-Review interleaving is unmounted, not deleted: its questions were
// built entirely on the retired domain labs (every one requires two lab
// visits), so it could only ever ask about pages that no longer exist. To be
// re-sourced across the new lessons (docs/UPGRADE_PROGRESS.md, decision D2).
const FEATURES = {
  pipeline: PipelinePage,
  modelmap: ModelMapPage,
  python: PythonHubPage,
  pylab: PyLabPage,
  sources: SourcesPage,
};

function MLLoading() {
  return <div className="ml-loading">Loading…</div>;
}

export default function MLBody() {
  const mlActiveTab = useUIStore((s) => s.mlActiveTab);
  const tabMeta = ML_TABS.find((t) => t.id === mlActiveTab);
  const visited = useVisitedTabs(mlActiveTab);
  const tabTitle = useT(tabMeta?.title);

  return (
    <>
      <MLIconRail />
      <main className="app-main ml-main">
        <div className="ml-main-header">
          <span className="ml-main-title">{tabTitle}</span>
          <div className="ml-main-header-controls">
            <UnderstandingTrackerBadge />
            <LevelLangToggle />
          </div>
        </div>
        <div className="ml-main-content">
          {Object.entries(FEATURES)
            .filter(([id]) => visited.has(id))
            .map(([id, Feature]) => (
            <div key={id} className="app-tab-keepalive" style={{ display: mlActiveTab === id ? 'flex' : 'none' }}>
              {/* Boundary OUTSIDE Suspense so it also catches lazy-chunk
                  load failures (a failed dynamic import throws on render),
                  not just errors inside the loaded page. */}
              <ErrorBoundary label={ML_TABS.find((t) => t.id === id)?.label || id}>
                <Suspense fallback={<MLLoading />}>
                  <Feature />
                </Suspense>
              </ErrorBoundary>
            </div>
          ))}
        </div>
      </main>
      <EntryMisconceptionBanner />
    </>
  );
}
