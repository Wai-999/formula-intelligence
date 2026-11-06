// The five priority lessons of the 80/20 upgrade
// (docs/learning-8020/PRIORITY_SCORECARD.md): one per area of the Ohlone
// Data Science preparation, chosen for how much later material builds on
// them. Each meets the professor teaching contract
// (docs/learning-8020/TEACHING_RUBRIC.md), checked by
// src/data/curriculum/__tests__/professorContract.test.js.

export const PRIORITY_LESSONS = [
  { id: 'a2-composition', area: 'Algebra and precalculus', why: 'Composition is what the chain rule differentiates and what inverses undo; every unit conversion is one.' },
  { id: 'c1-chain-rule', area: 'Calculus I', why: 'Every later derivative rule, related rates and gradient descent use it.' },
  { id: 'cpp-loops-trace', area: 'C++ fundamentals', why: 'Loops and tracing come first in CS-102 and under every data structure after it.' },
  { id: 'st-sampling-clt', area: 'Statistics', why: 'Confidence intervals, tests and A/B comparisons all rest on the sampling distribution of a mean.' },
  { id: 'la-dot-product', area: 'Linear algebra', why: 'Projections, matrix products, similarity search and every linear model are dot products.' },
];

// Prerequisite lessons written in phase 5 (docs/learning-8020/PHASE5_PREREQUISITES.md),
// chosen by how many written lessons build on them and by placement items
// with no lesson behind them. They meet the same contract from the start.
export const PHASE5_LESSONS = [
  { id: 'a1-functions', area: 'Algebra and precalculus', why: '16 written lessons build on functions, including composite functions and limits; placement items dx.f1 and dx.f2 test notation.' },
  { id: 'c1-power-rules', area: 'Calculus I', why: 'The chain rule lesson used the power rule without teaching it; placement items dx.c7 and dx.c9 test it; and it was the gap a learner finishing Calculus I met first.' },
];

// Lessons written in phase 6 (docs/learning-8020/PHASE6_LESSONS.md): the most
// depended-on topics left without a lesson, and the thinnest course on the
// route, each written to the same contract.
export const PHASE6_LESSONS = [
  { id: 'pa-exponents', area: 'Mathematics foundations', why: '15 written lessons build on exponents and roots (exponentials, polynomials, norms, big-O, the standard error); placement items dx.a11–a13 test them.' },
  { id: 'ps-center-spread', area: 'Statistics', why: 'Six written lessons build on describing data, including the sampling-distribution priority lesson, which had no bridge to fall back on; placement items dx.s1 and dx.s2 test it.' },
];

/** Every lesson held to the professor contract. */
export const CONTRACT_LESSONS = [...PRIORITY_LESSONS, ...PHASE5_LESSONS, ...PHASE6_LESSONS];
