// The real curriculum, indexed once for the learning-path engine
// (src/lib/learningPath.js). Pages import CURRICULUM from here and ask the
// engine; none of them decides "what next" on its own.
import { COURSES } from './catalog.js';
import { LESSONS } from './lessons/index.js';
import { CONCEPTS } from './concepts.js';
import { PROJECTS } from '../projects/index.js';
import { PATHS, DEFAULT_PATH, OUTLINE_ALTERNATIVES } from './pathways.js';
import { makeCurriculum } from '../../lib/learningPath.js';

export const CURRICULUM = makeCurriculum({
  courses: COURSES,
  lessons: LESSONS,
  paths: PATHS,
  defaultPath: DEFAULT_PATH,
  projects: PROJECTS,
  concepts: CONCEPTS,
  alternatives: OUTLINE_ALTERNATIVES,
});
