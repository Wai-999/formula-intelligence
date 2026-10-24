import { item, num, choice, multi, dot } from '../lessonKit.js';

export default {
  intuition: {
    question: 'Wind blows at $(2, 3)$ m/s across a runway that points along $(4, 1)$. How much of the wind blows along the runway — a headwind or tailwind — and how much across it, as a crosswind?',
    body: [
      'Split the wind into two perpendicular pieces: one **along** the runway direction and one **across** it. The along-piece is the **projection** of the wind onto the runway direction — the shadow it casts on that line when light shines straight down onto it.',
      'Projection is the closest point on a line to a given point. That one idea powers least-squares regression, where the fitted values are the projection of the data onto the space of possible predictions.',
    ],
  },

  glossary: [
    { term: '$\\operatorname{proj}_{\\mathbf v}\\mathbf u$', meaning: 'The projection of $\\mathbf u$ onto the line through $\\mathbf v$: a vector along $\\mathbf v$.' },
    { term: '$c = \\dfrac{\\mathbf u\\cdot\\mathbf v}{\\mathbf v\\cdot\\mathbf v}$', meaning: 'How many copies of $\\mathbf v$ the projection is; negative means it points opposite to $\\mathbf v$.' },
    { term: '$\\dfrac{\\mathbf u\\cdot\\mathbf v}{\\lVert\\mathbf v\\rVert}$', meaning: 'The scalar projection: the signed length of the shadow.' },
    { term: '$\\mathbf u - \\operatorname{proj}_{\\mathbf v}\\mathbf u$', meaning: 'The remainder, perpendicular to $\\mathbf v$.' },
  ],

  priorCheck: [
    item({ id: 'la-proj.pre1', competency: 'la.dot-product', difficulty: 1, prompt: 'Compute $(2, 1)\\cdot(3, 4)$.', answer: num(10), compute: () => 6 + 4, solution: '$6 + 4 = 10$.', remedy: 'la-dot-product' }),
    item({ id: 'la-proj.pre2', competency: 'la.vector-ops', difficulty: 1, prompt: 'What is $\\lVert(1, 1)\\rVert$? (Three decimal places.)', answer: num(Math.SQRT2, 0.0006), compute: () => Math.SQRT2, solution: '$\\sqrt{2} \\approx 1.414$.', remedy: 'la-dot-product' }),
  ],

  visualization: {
    lab: 'vectors-dot',
    config: { mode: 'projection' },
    intro: 'Start with “Wind on a runway”. Drag u and watch p slide along the dashed line while u − p stays perpendicular to it. Then make v longer: p does not move.',
    textAlternative: 'The lab draws u, v, the line through v, the projection p and the remainder u − p. A sentence gives u·v, v·v, the multiplier c, both pieces and the check that (u − p)·v = 0; the table lists them.',
  },

  derivation: {
    intro: 'We want the point $\\mathbf p$ on the line through $\\mathbf v$ that is closest to $\\mathbf u$. Two steps: find it, then prove nothing is closer.',
    steps: [
      { say: 'Every point on the line is $c\\,\\mathbf v$ for some number $c$. Ask for the remainder to be perpendicular to the line:', math: '(\\mathbf u - c\\,\\mathbf v)\\cdot\\mathbf v = 0' },
      { say: 'The dot product distributes, so $\\mathbf u\\cdot\\mathbf v - c\\,(\\mathbf v\\cdot\\mathbf v) = 0$. Solving for $c$ (allowed because $\\mathbf v \\ne \\mathbf 0$ makes $\\mathbf v\\cdot\\mathbf v > 0$):', math: 'c = \\frac{\\mathbf u\\cdot\\mathbf v}{\\mathbf v\\cdot\\mathbf v}, \\qquad \\operatorname{proj}_{\\mathbf v}\\mathbf u = \\frac{\\mathbf u\\cdot\\mathbf v}{\\mathbf v\\cdot\\mathbf v}\\,\\mathbf v' },
      { say: 'Why is this the closest point? For any other point $t\\,\\mathbf v$, the vector $\\mathbf u - t\\mathbf v$ is the remainder $\\mathbf u - \\mathbf p$ plus $(c - t)\\mathbf v$, and those two are perpendicular. By Pythagoras:', math: '\\lVert \\mathbf u - t\\mathbf v \\rVert^2 = \\lVert \\mathbf u - \\mathbf p \\rVert^2 + (c - t)^2 \\lVert\\mathbf v\\rVert^2 \\;\\ge\\; \\lVert \\mathbf u - \\mathbf p \\rVert^2' },
      { say: 'Equality only when $t = c$. And replacing $\\mathbf v$ by $k\\mathbf v$ ($k \\ne 0$) multiplies the top of $c$ by $k$ and the bottom by $k^2$, so $c\\,\\mathbf v$ is unchanged: the projection depends only on the line.' },
    ],
    assumptions: ['The line passes through the origin (projection onto a line through another point needs a shift first).'],
    domain: ['$\\mathbf v \\ne \\mathbf 0$. Projecting onto the zero vector is undefined: there is no line.'],
  },

  examples: [
    {
      title: 'Wind on the runway',
      problem: 'Project $\\mathbf u = (2, 3)$ onto $\\mathbf v = (4, 1)$ and find the crosswind.',
      steps: ['$\\mathbf u\\cdot\\mathbf v = 8 + 3 = 11$ and $\\mathbf v\\cdot\\mathbf v = 17$, so $c = 11/17$.', '$\\mathbf p = \\tfrac{11}{17}(4, 1) = (\\tfrac{44}{17}, \\tfrac{11}{17}) \\approx (2.588, 0.647)$.', 'Crosswind $\\mathbf u - \\mathbf p = (-\\tfrac{10}{17}, \\tfrac{40}{17}) \\approx (-0.588, 2.353)$. Check: $(-\\tfrac{10}{17})(4) + (\\tfrac{40}{17})(1) = 0$. ✓'],
      answer: 'Along the runway $\\approx (2.588, 0.647)$ m/s; across it $\\approx (-0.588, 2.353)$ m/s.',
      check: { value: 44 / 17, compute: () => ((2 * 4 + 3 * 1) / 17) * 4 },
    },
    {
      title: 'A shadow on the ground',
      problem: 'Project $(3, 4)$ onto the x-axis direction $(1, 0)$.',
      steps: ['$c = 3/1 = 3$, so $\\mathbf p = (3, 0)$.', 'Remainder $(0, 4)$: straight up, perpendicular to the ground.'],
      answer: '$(3, 0)$ — projection onto an axis keeps that coordinate and zeroes the others.',
      check: { value: 3, compute: () => dot([3, 4], [1, 0]) / dot([1, 0], [1, 0]) },
    },
  ],

  counterexample: {
    title: 'Projection is not symmetric',
    body: [
      'Projecting $\\mathbf v = (4, 1)$ onto $\\mathbf u = (2, 3)$ gives $\\tfrac{11}{13}(2, 3) \\approx (1.692, 2.538)$ — a different vector on a different line from $\\operatorname{proj}_{\\mathbf v}\\mathbf u \\approx (2.588, 0.647)$. “The projection of u onto v” and “of v onto u” are different questions.',
    ],
  },

  predict: {
    prompt: 'If you replace $\\mathbf v$ with $2\\mathbf v$ (same direction, twice as long), what happens to $\\operatorname{proj}_{\\mathbf v}\\mathbf u$?',
    choices: ['It doubles', 'It halves', 'It does not change', 'It becomes zero'],
    answer: 2,
    reveal: '$c$ halves while $\\mathbf v$ doubles, so $c\\,\\mathbf v$ is unchanged. The projection lands on the same line at the same point. Try it in the lab.',
    misconception: {
      belief: 'A longer v gives a longer projection.',
      correction: 'Projection is onto a **line**, and a line does not care how long the vector describing it is. Only the direction of $\\mathbf v$ matters.',
    },
  },

  practice: [
    item({ id: 'la-proj.p1', competency: 'la.projection', difficulty: 1, level: 'scaffolded', prompt: 'For $\\mathbf u = (6, 2)$ and $\\mathbf v = (3, 0)$, compute $c = \\dfrac{\\mathbf u\\cdot\\mathbf v}{\\mathbf v\\cdot\\mathbf v}$.', answer: num(2), compute: () => 18 / 9, hints: ['$\\mathbf u\\cdot\\mathbf v = 18$ and $\\mathbf v\\cdot\\mathbf v = 9$.'], solution: '$18/9 = 2$.' }),
    item({ id: 'la-proj.p2', competency: 'la.projection', difficulty: 1, level: 'scaffolded', prompt: 'Using $c = 2$ from the previous item, what is $\\operatorname{proj}_{\\mathbf v}\\mathbf u = c\\,\\mathbf v$?', answer: multi([6, 0], ['first component', 'second component']), solution: '$2(3, 0) = (6, 0)$.' }),
    item({ id: 'la-proj.p3', competency: 'la.projection', difficulty: 2, level: 'independent', prompt: 'Project $(1, 3)$ onto $(1, 1)$.', answer: multi([2, 2], ['first component', 'second component']), hints: ['$c = 4/2$.'], solution: '$c = (1 + 3)/2 = 2$, so $\\mathbf p = (2, 2)$.' }),
    item({ id: 'la-proj.p4', competency: 'la.projection', difficulty: 2, level: 'independent', prompt: 'For the same vectors, what is the remainder $\\mathbf u - \\mathbf p$?', answer: multi([-1, 1], ['first component', 'second component']), solution: '$(1, 3) - (2, 2) = (-1, 1)$, and indeed $(-1, 1)\\cdot(1, 1) = 0$.' }),
    item({ id: 'la-proj.p5', competency: 'la.projection', difficulty: 2, level: 'independent', prompt: 'What is the scalar projection of $(3, 4)$ onto $(0, 2)$?', answer: num(4), compute: () => 8 / 2, hints: ['$\\mathbf u\\cdot\\mathbf v / \\lVert\\mathbf v\\rVert$.'], solution: '$8/2 = 4$: the y-component, as expected for a vertical direction.' }),
    item({ id: 'la-proj.p6', competency: 'la.projection', difficulty: 3, level: 'transfer', prompt: 'A rope pulls with force $(6, 8)$ N on a sled that can only slide along the ground direction $(1, 0)$. What force component (in N) acts along the ground?', answer: num(6), compute: () => dot([6, 8], [1, 0]) / Math.hypot(1, 0), solution: 'Scalar projection $= (6, 8)\\cdot(1, 0)/1 = 6$ N.' }),
    item({
      id: 'la-proj.p7', competency: 'la.projection', difficulty: 3, level: 'transfer',
      prompt: 'In least-squares regression the fitted values $\\hat{\\mathbf y}$ are the projection of the data $\\mathbf y$ onto the space spanned by the columns of the design matrix $X$. What must be true of the residual vector $\\mathbf y - \\hat{\\mathbf y}$?',
      answer: choice(['It is parallel to every column of X', 'It is perpendicular to every column of X', 'It has the same length as y', 'It is zero for any good model'], 1),
      feedback: { 0: 'Parallel would mean the model could still explain it.', 3: 'Residuals are zero only if the data fit exactly — rare, and suspicious.' },
      solution: 'Just as $\\mathbf u - \\mathbf p \\perp \\mathbf v$, the residual is perpendicular to everything the model can produce: $X^\\top(\\mathbf y - \\hat{\\mathbf y}) = \\mathbf 0$ — the normal equations.',
    }),
  ],

  checkpoint: [
    item({ id: 'la-proj.c1', competency: 'la.projection', difficulty: 1, prompt: 'For $\\mathbf u = (2, 4)$ and $\\mathbf v = (1, 2)$, compute $c = \\dfrac{\\mathbf u\\cdot\\mathbf v}{\\mathbf v\\cdot\\mathbf v}$.', answer: num(2), compute: () => 10 / 5, solution: '$10/5 = 2$: $\\mathbf u = 2\\mathbf v$ already lies on the line.', feedbackCorrect: 'Right.', feedbackIncorrect: '$\\mathbf u\\cdot\\mathbf v = 2 + 8$ and $\\mathbf v\\cdot\\mathbf v = 1 + 4$.' }),
    item({ id: 'la-proj.c2', competency: 'la.projection', difficulty: 2, prompt: 'Project $(4, 2)$ onto $(1, 3)$.', answer: multi([1, 3], ['first component', 'second component']), solution: '$c = (4 + 6)/(1 + 9) = 1$, so $\\mathbf p = (1, 3)$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Compute $c$ first, then multiply $\\mathbf v$ by it.' }),
    item({ id: 'la-proj.c3', competency: 'la.projection', difficulty: 3, prompt: 'Wind $(5, 5)$ m/s crosses a runway along $(1, 0)$. What is the size of the crosswind (the part perpendicular to the runway), in m/s?', answer: num(5), compute: () => Math.hypot(5 - 5, 5 - 0), solution: 'Projection $(5, 0)$; remainder $(0, 5)$, length 5 m/s.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Find the projection, subtract it from the wind, then take the length.' }),
  ],

  python: {
    intro: 'A projection function, applied to the runway example. Comparing with a tolerance avoids pretending floating-point arithmetic is exact.',
    code: `import numpy as np

def project(u, v):
    v = np.asarray(v, dtype=float)
    return (np.dot(u, v) / np.dot(v, v)) * v

u = np.array([2.0, 3.0])   # wind (m/s)
v = np.array([4.0, 1.0])   # runway direction
p = project(u, v)
r = u - p
print(np.round(p, 4), np.round(r, 4))
print(abs(float(np.dot(r, v))) < 1e-12)
print(np.allclose(project(u, 2 * v), p))`,
    output: '[2.5882 0.6471] [-0.5882  2.3529]\nTrue\nTrue',
    explain: 'The second line checks the remainder is perpendicular to v; the third, that a longer v gives the same projection.',
  },

  reading: [
    { title: 'The Dot Product (§2.3) — Projections', source: 'OpenStax, Calculus Volume 3', url: 'https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product', note: 'Vector and scalar projections, with worked physics applications.' },
    { title: 'Lecture 15: Projections onto subspaces', source: 'MIT OpenCourseWare 18.06, Gilbert Strang', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-15-projections-onto-subspaces/', note: 'From one line to whole subspaces, and on to least squares.' },
  ],
};
