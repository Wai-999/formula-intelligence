import { lazy } from 'react';

// Page id (src/app/pages.js) → lazily loaded component. Every page is its own
// chunk, so the first paint downloads the shell and the page you asked for,
// never the other twenty-odd: storylines (~151 KB) and practice problems
// (~138 KB) used to land in the main bundle because they were imported
// eagerly, and Pyodide must never be in it at all (§13).
export const PAGE_COMPONENTS = {
  home: lazy(() => import('../features/home/HomePage.jsx')),

  'learn/courses': lazy(() => import('../features/learn/CoursesPage.jsx')),
  'learn/course': lazy(() => import('../features/learn/CoursePage.jsx')),
  'learn/lesson': lazy(() => import('../features/learn/LessonPage.jsx')),
  'learn/paths': lazy(() => import('../features/path/LearningPathPage.jsx')),
  'learn/stories': lazy(() => import('../features/storywalk/StoryWalkPage.jsx')),
  'learn/ml': lazy(() => import('../features/ml/pipeline/PipelinePage.jsx')),

  'maps/concepts': lazy(() => import('../features/maps/ConceptMapPage.jsx')),
  'maps/formulas': lazy(() => import('../features/map/MapPage.jsx')),
  'maps/models': lazy(() => import('../features/ml/modelmap/ModelMapPage.jsx')),
  'maps/knowledge': lazy(() => import('../features/maps/KnowledgeMapPage.jsx')),

  'practice/review': lazy(() => import('../features/flashcards/FlashcardsPage.jsx')),
  'practice/mixed': lazy(() => import('../features/practice/MixedPracticePage.jsx')),
  'practice/quiz': lazy(() => import('../features/quiz/QuizPage.jsx')),
  'practice/problems': lazy(() => import('../features/practice/PracticePage.jsx')),
  'practice/code': lazy(() => import('../features/practice/CodeExercisesPage.jsx')),
  'practice/python': lazy(() => import('../features/ml/python/PythonHubPage.jsx')),

  'projects/list': lazy(() => import('../features/projects/ProjectsPage.jsx')),
  'projects/lab': lazy(() => import('../features/ml/pylab/PyLabPage.jsx')),

  'progress/overview': lazy(() => import('../features/dashboard/DashboardPage.jsx')),
  'progress/diagnostic': lazy(() => import('../features/diagnostic/DiagnosticPage.jsx')),
  'progress/errors': lazy(() => import('../features/errors/ErrorLogPage.jsx')),

  'notebook/journal': lazy(() => import('../features/journal/JournalPage.jsx')),
  'notebook/notes': lazy(() => import('../features/notebook/NotesPage.jsx')),

  settings: lazy(() => import('../features/settings/SettingsPage.jsx')),
  sources: lazy(() => import('../features/ml/sources/SourcesPage.jsx')),
};
