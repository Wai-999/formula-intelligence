import { lazy, Suspense } from 'react';
import { ViewSwitch, ViewPage } from '../../components/layout/ViewSwitch.jsx';

// Three ways to drill the 94 Bluman formulas, which used to be three tabs
// (Review, Quiz, Problems) side by side with the new curriculum's practice.
// One page now; each mode is unchanged and keeps its own saved progress.
const VIEWS = [
  { id: 'flashcards', label: 'Flashcards', icon: 'ti-cards', hint: 'Recall each formula, then rate yourself; cards come back on a spaced schedule.' },
  { id: 'quiz', label: 'Quiz', icon: 'ti-help', hint: 'Mixed questions about what each formula is for.' },
  { id: 'problems', label: 'Problems', icon: 'ti-target-arrow', hint: 'Choose the formula, solve it step by step, then interpret the result.' },
];

const MODES = {
  flashcards: lazy(() => import('../flashcards/FlashcardsPage.jsx')),
  quiz: lazy(() => import('../quiz/QuizPage.jsx')),
  problems: lazy(() => import('./PracticePage.jsx')),
};

export default function FormulaDrillsPage({ mode }) {
  const current = MODES[mode] ? mode : 'flashcards';
  const Mode = MODES[current];
  return (
    <ViewPage switcher={<ViewSwitch label="Drill type" page="practice/formulas" param="mode" views={VIEWS} current={current} />}>
      <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
        <Mode />
      </Suspense>
    </ViewPage>
  );
}
