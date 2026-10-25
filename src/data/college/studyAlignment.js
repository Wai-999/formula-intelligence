import { unitById, courseById } from '../curriculum/catalog.js';

// Which of this site's study units support each Ohlone course
// (relation 'selfStudySupports'). This is OUR mapping of the catalog's topic
// list onto our own curriculum — a study aid, not an official statement.
// It never means the course is satisfied, waived or credited. Every topic
// of every course appears, with [] where the site teaches nothing for it.
//
//   readiness   site courses that build the prerequisite skills
//   topics      { [catalog topic, as in ./ohloneCourses.js]: [site unit ids] }

const S = (code, readiness, topics) => ({ code, relation: 'selfStudySupports', readiness, topics });

export const STUDY_ALIGNMENT = [
  S('CS-102', ['algebra-1'], {
    'Problem solving in C++': ['cpp-toolchain', 'cpp-types-io', 'cpp-control'],
    'Structured procedural programming': ['cpp-functions', 'cpp-files'],
    'An introduction to object-oriented programming': ['oop-classes'],
  }),
  S('CS-108', ['algebra-1'], {
    'Programming fundamentals': ['py-basics', 'py-collections'],
    'Computational analysis': ['py-numpy', 'ds-complexity'],
    'Statistics for data-driven problems': ['ps-descriptive', 'ps-sampling', 'ps-inference'],
    'Simulation and modelling tools': ['ps-sampling', 'ml-validation'],
    'Asking and answering questions with real data from several fields': ['ml-data', 'py-stack'],
  }),
  S('CS-113', ['cpp-fundamentals', 'algebra-2'], {
    'Functions, relations and sets': ['dm-sets', 'a2-inverse-composite'],
    'Basic logic': ['dm-logic'],
    'Proof techniques': ['dm-proof', 'dm-induction'],
    Counting: ['dm-counting', 'ps-probability'],
    'Graphs and trees': ['dm-graphs'],
    'Discrete probability': ['dm-counting', 'ps-probability'],
  }),
  S('CS-116', ['cpp-fundamentals'], {
    'Input/output streams': ['cpp-types-io'],
    Classes: ['oop-classes', 'oop-lifetime'],
    'Inheritance and polymorphism': ['oop-inheritance'],
    'Function and operator overloading': ['oop-operators'],
    'Function and class templates': ['oop-templates'],
    'Exception handling': ['oop-templates'],
  }),
  S('CS-118', ['cpp-fundamentals'], {
    'Number systems': [],
    'Machine architecture and instructions': [],
    'Memory addressing': [],
    'Subroutines and system calls': [],
    'File input/output': [],
  }),
  S('CS-124', ['cpp-oop'], {
    'Stacks and queues': ['ds-linear'],
    Lists: ['ds-linear'],
    Trees: ['ds-trees'],
    'Hash tables': ['ds-hash'],
    Recursion: ['ds-complexity', 'dm-induction'],
    'Searching and sorting': ['ds-search-sort'],
    'Implementation in an object-oriented language such as C++': ['oop-classes'],
  }),
  S('CS-142', ['algebra-1'], {
    'Basic Python constructs': ['py-basics', 'py-collections'],
    'Standard libraries': ['py-stack'],
    'Writing application programs': ['py-craft'],
  }),
  S('CS-150', ['python-ds'], {
    'Elementary data structures': ['ds-linear', 'ds-trees'],
    'Object-oriented design': ['oop-classes'],
    'Searching, sorting and graph algorithms': ['ds-search-sort', 'ds-graphs'],
    'Data analysis projects in Python': ['py-stack', 'ml-data'],
  }),
  S('MATH-100', ['algebra-2'], {
    'Polynomial and rational functions': ['a2-poly-rational'],
    'Exponential and logarithmic functions': ['a2-exp-log'],
    'Trigonometric functions': ['pc-unit-circle', 'pc-trig'],
  }),
  S('MATH-101A', ['algebra-2', 'precalculus'], {
    'Review of functions and graphs': ['a2-inverse-composite', 'a2-transformations', 'pc-functions'],
    'Analytic geometry': ['pc-geometry', 'pc-vectors'],
    'Limits and continuity': ['pc-limits', 'c1-limits'],
    'Derivatives of algebraic, trigonometric, exponential, logarithmic and inverse trigonometric functions': ['c1-derivative', 'c1-rules'],
    'Applications of the derivative': ['c1-applications', 'c1-derivative'],
    'Introduction to integration and the definite integral': ['c2-integrals'],
  }),
  S('MATH-101B', ['calculus-1'], {
    'Techniques of integration': ['c2-integrals'],
    'Applications of integration': ['c2-integrals'],
    'Infinite series': ['c2-series'],
    Conics: ['pc-geometry'],
    'Parametric equations and polar coordinates': ['c2-param-polar', 'pc-param-polar'],
  }),
  S('MATH-101C', ['calculus-2', 'linear-algebra'], {
    'Vector analysis': ['la-vectors', 'c3-integrals'],
    'Functions of several variables and partial derivatives': ['c3-partials'],
    'Multiple integration': ['c3-integrals'],
    'Integration of vector-valued functions': ['c3-integrals'],
  }),
  S('MATH-103', ['calculus-1', 'algebra-2'], {
    'Vector spaces': ['la-spaces'],
    'Matrices and determinants': ['la-matrices'],
    'Linear transformations': ['la-matrices'],
    Eigenvectors: ['la-eigen'],
    'Solving systems of equations': ['la-systems'],
  }),
  S('MATH-104', ['calculus-2'], {
    'Ordinary differential equations': ['c3-ode'],
    'Existence of solutions': [],
    'Series solutions': [],
    'Laplace transforms': [],
    'Linear systems': ['c3-ode'],
  }),
  S('STAT-C1000', ['algebra-1'], {
    'Descriptive statistics': ['ps-descriptive'],
    'Probability and sampling distributions': ['ps-probability', 'ps-distributions', 'ps-sampling'],
    'Statistical inference': ['ps-inference'],
    'Correlation and linear regression': ['ps-regression', 'a1-linear-rel'],
    'ANOVA, chi-squared and t-tests': ['ps-inference', 'ps-regression'],
    'Statistical software': ['py-stack'],
  }),
];

export const studyAlignmentFor = Object.fromEntries(STUDY_ALIGNMENT.map((s) => [s.code, s]));

/**
 * How much of an Ohlone course's catalog topic list this site teaches:
 *   taught    a mapped unit has at least one written lesson
 *   outline   mapped units exist, but no lesson is written yet
 *   none      nothing on the site covers it
 * Returns { topics: [{ topic, units, lessons, status }], taught, total }.
 */
export function studyCoverage(code) {
  const s = studyAlignmentFor[code];
  if (!s) return { topics: [], taught: 0, total: 0 };
  const topics = Object.entries(s.topics).map(([topic, units]) => {
    const lessons = units.flatMap((u) => unitById[u]?.lessons ?? []);
    return { topic, units, lessons: [...new Set(lessons)], status: lessons.length ? 'taught' : units.length ? 'outline' : 'none' };
  });
  return { topics, taught: topics.filter((t) => t.status === 'taught').length, total: topics.length };
}

/** Site courses a learner would use to study for an Ohlone course, in order: readiness first, then the courses its units belong to. */
export function studyCoursesFor(code) {
  const s = studyAlignmentFor[code];
  if (!s) return [];
  const fromUnits = Object.values(s.topics).flat().map((u) => unitById[u]?.course).filter(Boolean);
  return [...new Set(fromUnits)].filter((c) => courseById[c]);
}

