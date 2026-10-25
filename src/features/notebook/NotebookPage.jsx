import { lazy, Suspense } from 'react';
import { ViewSwitch, ViewPage } from '../../components/layout/ViewSwitch.jsx';

// What you have written down, in one place under My Progress (V4 §3): notes
// taken beside lessons, and the reflection journal.
const VIEWS = [
  { id: 'notes', label: 'Lesson notes', icon: 'ti-notes' },
  { id: 'journal', label: 'Journal', icon: 'ti-notebook' },
];

const VIEW_PAGES = {
  notes: lazy(() => import('./NotesPage.jsx')),
  journal: lazy(() => import('../journal/JournalPage.jsx')),
};

export default function NotebookPage({ view }) {
  const current = VIEW_PAGES[view] ? view : 'notes';
  const View = VIEW_PAGES[current];
  return (
    <ViewPage switcher={<ViewSwitch label="Notebook" page="progress/notebook" param="view" views={VIEWS} current={current} />}>
      <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
        <View />
      </Suspense>
    </ViewPage>
  );
}
