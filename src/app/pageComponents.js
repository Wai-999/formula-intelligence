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
  'learn/placement': lazy(() => import('../features/diagnostic/DiagnosticPage.jsx')),
  'learn/ml': lazy(() => import('../features/ml/pipeline/PipelinePage.jsx')),
  'learn/maps': lazy(() => import('../features/maps/MapsHubPage.jsx')),
  'learn/concepts': lazy(() => import('../features/maps/ConceptMapPage.jsx')),
  'learn/formulas': lazy(() => import('../features/map/MapPage.jsx')),
  'learn/models': lazy(() => import('../features/ml/modelmap/ModelMapPage.jsx')),
  'learn/careers': lazy(() => import('../features/maps/KnowledgeMapPage.jsx')),
  'learn/paths': lazy(() => import('../features/path/LearningPathPage.jsx')),

  'practice/review': lazy(() => import('../features/practice/ReviewPage.jsx')),
  'practice/formulas': lazy(() => import('../features/practice/FormulaDrillsPage.jsx')),

  'apply/projects': lazy(() => import('../features/projects/ProjectsPage.jsx')),
  'apply/cases': lazy(() => import('../features/storywalk/StoryWalkPage.jsx')),
  'apply/exercises': lazy(() => import('../features/practice/CodeExercisesPage.jsx')),
  'apply/lab': lazy(() => import('../features/ml/pylab/PyLabPage.jsx')),
  'apply/library': lazy(() => import('../features/ml/python/PythonHubPage.jsx')),

  'progress/overview': lazy(() => import('../features/progress/ProgressOverviewPage.jsx')),
  'progress/notebook': lazy(() => import('../features/notebook/NotebookPage.jsx')),
  'progress/errors': lazy(() => import('../features/errors/ErrorLogPage.jsx')),
  'progress/settings': lazy(() => import('../features/settings/SettingsPage.jsx')),

  sources: lazy(() => import('../features/ml/sources/SourcesPage.jsx')),
};
