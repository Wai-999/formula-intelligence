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
