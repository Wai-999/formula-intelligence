import { item, num, choice, multi, dot } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A film app scores your taste on two axes: how much you like action and how much you like romance. You are $(4, 1)$; a friend is $(3, 2)$; a stranger is $(2, -3)$. Which one number says how aligned two tastes are?',
    body: [
      'A **vector** is an ordered list of numbers — here, a point you can also draw as an arrow from the origin. Vectors add component by component and scale by multiplying every component.',
      'The **dot product** multiplies matching components and adds: $(4, 1)\\cdot(3, 2) = 12 + 2 = 14$. With the stranger it is $8 - 3 = 5$; with $(-1, 4)$ it would be $0$. Large and positive means “pointing the same way”, zero means “at right angles”, negative means “opposed”. Recommendation systems and search engines rank by exactly this kind of number.',
    ],
  },

  glossary: [
    { term: '$\\mathbf u = (u_1, u_2)$', meaning: 'A vector with components $u_1, u_2$. Everything here works the same with $n$ components.' },
    { term: '$\\mathbf u + \\mathbf v$, $c\\,\\mathbf u$', meaning: 'Add componentwise; multiply every component by the number $c$.' },
    { term: '$\\lVert \\mathbf u \\rVert = \\sqrt{u_1^2 + u_2^2}$', meaning: 'The length (norm) of $\\mathbf u$ — Pythagoras.' },
    { term: '$\\mathbf u \\cdot \\mathbf v = u_1 v_1 + u_2 v_2$', meaning: 'The dot product: a single number, not a vector.' },
    { term: '$\\theta$', meaning: 'The angle between the two arrows, from $0°$ to $180°$.' },
  ],

  priorCheck: [
    item({ id: 'la-dot.pre1', competency: 'la.vector-ops', difficulty: 1, prompt: 'Add the vectors $(2, -1) + (1, 3)$.', answer: multi([3, 2], ['first component', 'second component']), solution: 'Componentwise: $(2 + 1, -1 + 3) = (3, 2)$.' }),
    item({ id: 'la-dot.pre2', competency: 'la.vector-ops', difficulty: 1, prompt: 'How long is the vector $(3, 4)$?', answer: num(5), compute: () => Math.hypot(3, 4), solution: '$\\sqrt{9 + 16} = 5$ — a 3–4–5 right triangle.' }),
  ],

  visualization: {
    lab: 'vectors-dot',
    config: { mode: 'dot' },
    intro: 'Start with “Similar tastes”. Drag v around u and watch the sign of u·v change exactly when the angle passes 90°.',
    textAlternative: 'The lab draws u, v and u + v as arrows with the completed parallelogram. A sentence gives both vectors, their sum, the dot product computed term by term, both lengths and the angle; the table repeats them.',
  },

  derivation: {
    intro: 'The definition is pure arithmetic. Why does it measure an angle? Compare two ways of writing the length of $\\mathbf u - \\mathbf v$. (Step 2 uses the law of cosines from trigonometry; if you have not met cosine yet, read the result as “the sign of $\\mathbf u\\cdot\\mathbf v$ tells acute, right or obtuse”.)',
    steps: [
      { say: 'From the components: expanding the squares,', math: '\\lVert \\mathbf u - \\mathbf v \\rVert^2 = (u_1 - v_1)^2 + (u_2 - v_2)^2 = \\lVert \\mathbf u \\rVert^2 + \\lVert \\mathbf v \\rVert^2 - 2(u_1v_1 + u_2v_2)' },
      { say: 'From the triangle with sides $\\mathbf u$, $\\mathbf v$ and $\\mathbf u - \\mathbf v$, the law of cosines gives', math: '\\lVert \\mathbf u - \\mathbf v \\rVert^2 = \\lVert \\mathbf u \\rVert^2 + \\lVert \\mathbf v \\rVert^2 - 2\\lVert \\mathbf u \\rVert \\lVert \\mathbf v \\rVert \\cos\\theta' },
      { say: 'The two right-hand sides are equal, so the cross terms are equal:', math: '\\mathbf u \\cdot \\mathbf v = \\lVert \\mathbf u \\rVert \\, \\lVert \\mathbf v \\rVert \\cos\\theta' },
      { say: 'Two consequences fall out. Since lengths are positive, $\\mathbf u\\cdot\\mathbf v$ has the sign of $\\cos\\theta$: positive below 90°, zero at 90°, negative above. And $\\mathbf u\\cdot\\mathbf u = \\lVert\\mathbf u\\rVert^2$, so length itself is a dot product.' },
    ],
    assumptions: [
      'Both vectors have the same number of components.',
      'The angle formula needs both vectors to be non-zero; the definition $\\sum u_i v_i$ works for any vectors in any dimension.',
    ],
    domain: [
      '$\\cos\\theta = \\dfrac{\\mathbf u\\cdot\\mathbf v}{\\lVert \\mathbf u\\rVert \\lVert \\mathbf v\\rVert}$ is undefined if either vector is $\\mathbf 0$: the zero vector has no direction.',
    ],
  },

  examples: [
    {
      title: 'Taste similarity',
      problem: 'For $\\mathbf u = (4, 1)$ and $\\mathbf v = (3, 2)$ find $\\mathbf u\\cdot\\mathbf v$, both lengths, and the angle.',
      steps: ['$\\mathbf u\\cdot\\mathbf v = 4\\cdot 3 + 1\\cdot 2 = 14$.', '$\\lVert\\mathbf u\\rVert = \\sqrt{17}$, $\\lVert\\mathbf v\\rVert = \\sqrt{13}$.', '$\\cos\\theta = 14/\\sqrt{221} \\approx 0.9417$, so $\\theta \\approx 19.65°$.'],
      answer: 'A small angle: very similar tastes. $\\cos\\theta \\approx 0.9417$ is their **cosine similarity**.',
      check: { value: 0.9417, tolerance: 1e-4, compute: () => 14 / Math.sqrt(17 * 13) },
    },
    {
      title: 'A right angle, and three dimensions',
      problem: 'Are $(2, -3)$ and $(6, 4)$ perpendicular? Then compute $(1, 2, 3)\\cdot(4, -5, 6)$.',
      steps: ['$2\\cdot 6 + (-3)\\cdot 4 = 12 - 12 = 0$: yes, perpendicular.', '$1\\cdot 4 + 2\\cdot(-5) + 3\\cdot 6 = 4 - 10 + 18 = 12$.'],
      answer: 'Perpendicular; and the 3-D dot product is $12$ — same rule, one more term.',
      check: { value: 12, compute: () => 1 * 4 + 2 * -5 + 3 * 6 },
    },
  ],

  counterexample: {
    title: 'Two things the dot product is not',
    body: [
      'It is not the componentwise product: $(1, 2)$ “times” $(3, 4)$ componentwise is the **vector** $(3, 8)$, while the dot product is the **number** $11$. NumPy writes them differently: `u * v` versus `u @ v`.',
      'A bigger dot product does not mean “more similar”: $(10, 0)\\cdot(1, 1) = 10$ but the angle is $45°$, while $(1, 0)\\cdot(1, 0.05) = 1$ with an angle under $3°$. Length inflates the dot product; dividing by both lengths (cosine similarity) removes it.',
    ],
  },

  predict: {
    prompt: 'Without drawing anything: is the angle between $(3, 1)$ and $(-1, 3)$ acute, right or obtuse?',
    choices: ['Acute', 'A right angle', 'Obtuse — one vector has a negative component', 'Cannot tell without a protractor'],
    answer: 1,
    reveal: '$(3)(-1) + (1)(3) = -3 + 3 = 0$. A zero dot product means a right angle, whatever the signs of the individual components.',
    misconception: {
      belief: 'A negative component means the angle is obtuse.',
      correction: 'Only the sign of the whole sum $\\sum u_i v_i$ matters. Negative terms can be cancelled by positive ones, as here.',
    },
  },

  practice: [
    item({ id: 'la-dot.p1', competency: 'la.dot-product', difficulty: 1, level: 'scaffolded', prompt: 'Compute $(2, 5)\\cdot(3, -1)$: multiply matching components, then add.', answer: num(1), compute: () => 2 * 3 + 5 * -1, hints: ['$2\\cdot 3 = 6$ and $5\\cdot(-1) = -5$.'], solution: '$6 - 5 = 1$.' }),
    item({ id: 'la-dot.p2', competency: 'la.vector-ops', difficulty: 1, level: 'scaffolded', prompt: 'How long is $(5, 12)$?', answer: num(13), compute: () => Math.hypot(5, 12), hints: ['$\\sqrt{25 + 144}$.'], solution: '$\\sqrt{169} = 13$.' }),
    item({ id: 'la-dot.p3', competency: 'la.dot-product', difficulty: 2, level: 'independent', prompt: 'Compute $(1, -2, 4)\\cdot(3, 0, -1)$.', answer: num(-1), compute: () => 3 + 0 - 4, solution: '$3 + 0 - 4 = -1$: slightly more than a right angle apart.' }),
    item({ id: 'la-dot.p4', competency: 'la.dot-product', difficulty: 2, level: 'independent', prompt: 'For which $k$ is $(2, k)$ perpendicular to $(3, 6)$?', answer: num(-1), compute: () => -6 / 6, hints: ['Set the dot product to zero: $6 + 6k = 0$.'], solution: '$6 + 6k = 0 \\Rightarrow k = -1$.' }),
    item({ id: 'la-dot.p5', competency: 'la.vector-ops', difficulty: 2, level: 'independent', prompt: 'For $\\mathbf u = (1, -2)$ and $\\mathbf v = (3, 5)$, compute $2\\mathbf u + \\mathbf v$.', answer: multi([5, 1], ['first component', 'second component']), solution: '$2\\mathbf u = (2, -4)$; adding $(3, 5)$ gives $(5, 1)$.' }),
    item({ id: 'la-dot.p6', competency: 'la.dot-product', difficulty: 3, level: 'transfer', prompt: 'Two documents are summarized by word-count vectors $(1, 2, 2)$ and $(2, 1, 2)$. What is their cosine similarity? (Three decimal places.)', answer: num(8 / 9, 0.0006), compute: () => 8 / 9, hints: ['Dot product 8; both lengths are 3.'], solution: '$8/(3 \\cdot 3) = 8/9 \\approx 0.889$.' }),
    item({ id: 'la-dot.p7', competency: 'la.dot-product', difficulty: 3, level: 'transfer', prompt: 'A rope pulls a sled with force $(3, 4)$ newtons while the sled moves $(5, 0)$ metres along flat ground. Work is force · displacement. How many joules of work are done?', answer: num(15), compute: () => dot([3, 4], [5, 0]), hints: ['Only the part of the force along the motion does work.'], solution: '$(3, 4)\\cdot(5, 0) = 15$ J. The upward 4 N does no work on a sled that only moves sideways.' }),
  ],

  checkpoint: [
    item({ id: 'la-dot.c1', competency: 'la.dot-product', difficulty: 1, prompt: 'Compute $(-2, 3)\\cdot(4, 1)$.', answer: num(-5), compute: () => -8 + 3, solution: '$-8 + 3 = -5$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Multiply matching components: $(-2)(4) = -8$ and $(3)(1) = 3$; then add.' }),
    item({ id: 'la-dot.c2', competency: 'la.dot-product', difficulty: 2, prompt: 'If $\\mathbf u\\cdot\\mathbf v < 0$ for two non-zero vectors, the angle between them is…', answer: choice(['acute', 'a right angle', 'obtuse', 'zero'], 2), feedback: { 0: 'Acute angles have positive cosine, so a positive dot product.', 1: 'A right angle gives exactly zero.' }, solution: '$\\mathbf u\\cdot\\mathbf v = \\lVert\\mathbf u\\rVert\\lVert\\mathbf v\\rVert\\cos\\theta$ has the sign of $\\cos\\theta$, which is negative for angles between 90° and 180°.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Use $\\mathbf u\\cdot\\mathbf v = \\lVert\\mathbf u\\rVert\\lVert\\mathbf v\\rVert\\cos\\theta$.' }),
    item({ id: 'la-dot.c3', competency: 'la.dot-product', difficulty: 3, prompt: 'What is the cosine of the angle between $(3, 4)$ and $(4, 3)$?', answer: num(0.96), compute: () => 24 / 25, solution: 'Dot product $12 + 12 = 24$; both lengths are 5; $\\cos\\theta = 24/25 = 0.96$.', feedbackCorrect: 'Right — nearly the same direction.', feedbackIncorrect: 'Divide the dot product by the product of the lengths.' }),
  ],

  python: {
    intro: 'In NumPy, `@` (or `np.dot`) is the dot product and `np.linalg.norm` the length. The taste scores are made up.',
    code: `import numpy as np

u = np.array([4.0, 1.0])   # taste: action, romance (made-up scores)
v = np.array([3.0, 2.0])
print(u @ v, np.dot(u, v))
print(round(float(np.linalg.norm(u) ** 2), 6), float(u @ u))

cos = (u @ v) / (np.linalg.norm(u) * np.linalg.norm(v))
print(round(float(cos), 4), round(float(np.degrees(np.arccos(cos))), 2))
print(np.array([2, -3]) @ np.array([6, 4]))`,
    output: '14.0 14.0\n17.0 17.0\n0.9417 19.65\n0',
    explain: 'Line 2 confirms $\\lVert\\mathbf u\\rVert^2 = \\mathbf u\\cdot\\mathbf u$; line 3 is the first worked example; the last line is the right-angle check (integer arrays give an integer result).',
  },

  reading: [
    { title: 'The Dot Product (§2.3)', source: 'OpenStax, Calculus Volume 3', url: 'https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product', note: 'Properties, the angle formula and projections, with many exercises.' },
    { title: 'Introduction to Applied Linear Algebra (VMLS), chapters 1–3', source: 'Boyd & Vandenberghe (free book)', url: 'https://web.stanford.edu/~boyd/vmls/', note: 'Vectors, norms and inner products with data-science applications.' },
  ],
};
