import IconRail from './IconRail.jsx';
import { useUIStore, TABS } from '../../store/useUIStore.js';
import MapPage from '../../features/map/MapPage.jsx';
import DashboardPage from '../../features/dashboard/DashboardPage.jsx';
import FlashcardsPage from '../../features/flashcards/FlashcardsPage.jsx';
import QuizPage from '../../features/quiz/QuizPage.jsx';
import PracticePage from '../../features/practice/PracticePage.jsx';
import ErrorLogPage from '../../features/errors/ErrorLogPage.jsx';
import LearningPathPage from '../../features/path/LearningPathPage.jsx';
import StoryWalkPage from '../../features/storywalk/StoryWalkPage.jsx';
import JournalPage from '../../features/journal/JournalPage.jsx';
import ComingSoonPage from '../../features/ComingSoonPage.jsx';

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

// Extracted verbatim from AppShell.jsx when ML mode was added — identical
// markup/behavior, just relocated so AppShell can switch between this and
// MLBody. Stats mode's keep-alive-mount behavior is unchanged.
export default function StatsBody() {
  const activeTab = useUIStore((s) => s.activeTab);
  const tabMeta = TABS.find((t) => t.id === activeTab);
  const isImplemented = activeTab in FEATURES;

  return (
    <>
      <IconRail />
      <main className="app-main">
        {Object.entries(FEATURES).map(([id, Feature]) => (
          <div key={id} className="app-tab-keepalive" style={{ display: activeTab === id ? 'flex' : 'none' }}>
            <Feature />
          </div>
        ))}
        {!isImplemented && <ComingSoonPage tab={tabMeta} />}
      </main>
    </>
  );
}
