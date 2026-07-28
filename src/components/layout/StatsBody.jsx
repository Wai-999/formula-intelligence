import { Suspense, lazy } from 'react';
import IconRail from './IconRail.jsx';
import ErrorBoundary from '../error/ErrorBoundary.jsx';
import { useUIStore, TABS } from '../../store/useUIStore.js';
import { useVisitedTabs } from '../../hooks/useVisitedTabs.js';
import ComingSoonPage from '../../features/ComingSoonPage.jsx';

// Lazily loaded, matching ML mode. Two of these pages carry very large data
// modules (storylines ~151KB, practice problems ~138KB) that were landing in
// the main bundle purely because this file imported them eagerly.
const MapPage = lazy(() => import('../../features/map/MapPage.jsx'));
const DashboardPage = lazy(() => import('../../features/dashboard/DashboardPage.jsx'));
const FlashcardsPage = lazy(() => import('../../features/flashcards/FlashcardsPage.jsx'));
const QuizPage = lazy(() => import('../../features/quiz/QuizPage.jsx'));
const PracticePage = lazy(() => import('../../features/practice/PracticePage.jsx'));
const ErrorLogPage = lazy(() => import('../../features/errors/ErrorLogPage.jsx'));
const LearningPathPage = lazy(() => import('../../features/path/LearningPathPage.jsx'));
const StoryWalkPage = lazy(() => import('../../features/storywalk/StoryWalkPage.jsx'));
const JournalPage = lazy(() => import('../../features/journal/JournalPage.jsx'));

const FEATURES = {
  map: MapPage,
  path: LearningPathPage,
  story: StoryWalkPage,
  dashboard: DashboardPage,
  flashcards: FlashcardsPage,
  quiz: QuizPage,
  practice: PracticePage,
  errors: ErrorLogPage,
  journal: JournalPage,
};

function StatsLoading() {
  return <div className="ml-loading">Loading…</div>;
}

export default function StatsBody() {
  const activeTab = useUIStore((s) => s.activeTab);
  const tabMeta = TABS.find((t) => t.id === activeTab);
  const isImplemented = activeTab in FEATURES;
  // Keep-alive, but only for tabs actually opened — see useVisitedTabs.
  const visited = useVisitedTabs(activeTab);

  return (
    <>
      <IconRail />
      <main className="app-main">
        {Object.entries(FEATURES)
          .filter(([id]) => visited.has(id))
          .map(([id, Feature]) => (
            <div key={id} className="app-tab-keepalive" style={{ display: activeTab === id ? 'flex' : 'none' }}>
              {/* One boundary per pane, not one around the whole map: every
                  visited tab stays mounted, so an un-isolated throw in a
                  hidden tab would blank the visible one too. */}
              <ErrorBoundary label={TABS.find((t) => t.id === id)?.label || id}>
                <Suspense fallback={<StatsLoading />}>
                  <Feature />
                </Suspense>
              </ErrorBoundary>
            </div>
          ))}
        {!isImplemented && <ComingSoonPage tab={tabMeta} />}
      </main>
    </>
  );
}
