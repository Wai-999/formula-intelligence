import { item, num, choice, multi } from '../lessonKit.js';

export default {
  intuition: {
    question: 'On a hill whose height is $f(x, y) = 9 - x^2 - 2y^2$ (x east, y north), you stand at $(1, 1)$. Which way is straight uphill, how steep is it, and how steep is the path if you walk due east instead?',
    body: [
      'With one input, the derivative is one number. With two inputs there is a rate of change in **every direction**. The rates along the two axes — the **partial derivatives** — are enough to recover all the others, and packed into a vector they form the **gradient**, $\\nabla f$.',
      'The gradient points straight uphill, its length is the steepest slope, and it is perpendicular to the contour lines of a map. Every model trained by gradient descent is following this vector downhill.',
    ],
  },

  glossary: [
    { term: "$f'(x)$, $\\dfrac{df}{dx}$", meaning: 'Single-variable derivative (straight $d$): $f$ has one input.' },
    { term: '$\\dfrac{\\partial f}{\\partial x}$, $f_x$', meaning: 'Partial derivative (curly $\\partial$): differentiate in $x$ while **holding $y$ fixed**.' },
    { term: '$\\nabla f = \\left(\\dfrac{\\partial f}{\\partial x}, \\dfrac{\\partial f}{\\partial y}\\right)$', meaning: 'The gradient: a vector, one partial per input.' },
    { term: '$D_{\\mathbf u} f = \\nabla f\\cdot\\mathbf u$', meaning: 'The directional derivative: the rate of change moving in the unit direction $\\mathbf u$.' },
    { term: '$H = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy}\\end{bmatrix}$', meaning: 'The Hessian: second partial derivatives, describing curvature.' },
  ],

  priorCheck: [
    item({ id: 'c3-grad.pre1', competency: 'calc.derivative', difficulty: 1, prompt: 'What is the derivative of $x^2$ at $x = 3$?', answer: num(6), compute: () => 6, solution: '$2x = 6$.', remedy: 'c1-derivative' }),
    item({ id: 'c3-grad.pre2', competency: 'la.dot-product', difficulty: 1, prompt: 'Compute $(1, 2)\\cdot(3, 4)$.', answer: num(11), compute: () => 3 + 8, solution: '$3 + 8 = 11$.', remedy: 'la-dot-product' }),
  ],

  visualization: {
    lab: 'gradient-hessian',
    intro: 'On “Hill at (1, 1)”, turn your direction u all the way round. Where is D_u f largest, where is it zero, and how do those directions relate to the gradient arrow and the contour lines?',
    textAlternative: 'The lab draws contour lines of f, the point, the gradient arrow and your direction u. A sentence gives f, ∇f, its length and D_u f; at a critical point it gives the Hessian and the second-derivative test result. The table lists D_u f in eight compass directions.',
  },

  derivation: {
    intro: 'From partial derivatives to the gradient’s two key properties.',
    steps: [
      { say: 'A partial derivative is an ordinary derivative along one axis, with the other input frozen:', math: '\\frac{\\partial f}{\\partial x}(a, b) = \\lim_{h \\to 0} \\frac{f(a + h, b) - f(a, b)}{h}' },
      { say: 'For a differentiable $f$, a small step $(h u_1, h u_2)$ changes $f$ by about $h u_1 f_x + h u_2 f_y$ (the linear approximation). Dividing by $h$ and letting $h \\to 0$, the rate in the unit direction $\\mathbf u$ is', math: 'D_{\\mathbf u} f = f_x u_1 + f_y u_2 = \\nabla f \\cdot \\mathbf u' },
      { say: 'By the dot product, $\\nabla f\\cdot\\mathbf u = \\lVert\\nabla f\\rVert\\cos\\theta$. It is largest, $\\lVert\\nabla f\\rVert$, when $\\mathbf u$ points along $\\nabla f$ (steepest ascent), most negative in the opposite direction (steepest descent), and zero at right angles — which is the direction of the contour, where $f$ does not change.' },
      { say: 'At a critical point ($\\nabla f = \\mathbf 0$) the second-order approximation $f(\\mathbf p + \\mathbf d) \\approx f(\\mathbf p) + \\tfrac12 \\mathbf d^\\top H \\mathbf d$ decides the shape. For two variables:', math: '\\det H > 0,\\ f_{xx} > 0 \\Rightarrow \\text{min};\\quad \\det H > 0,\\ f_{xx} < 0 \\Rightarrow \\text{max};\\quad \\det H < 0 \\Rightarrow \\text{saddle}' },
    ],
    assumptions: ['$f$ is differentiable at the point (continuous partial derivatives are enough).', '$\\mathbf u$ is a unit vector; for a non-unit direction, divide by its length first.'],
    domain: ['If $\\det H = 0$ the test is inconclusive.', 'Existing partial derivatives do NOT guarantee differentiability — see the non-example.'],
  },

  examples: [
    {
      title: 'The hill',
      problem: 'For $f = 9 - x^2 - 2y^2$ at $(1, 1)$: find $\\nabla f$, the steepest slope, and the slope walking due east.',
      steps: ['$f_x = -2x = -2$, $f_y = -4y = -4$, so $\\nabla f(1, 1) = (-2, -4)$.', 'Steepest slope $\\lVert\\nabla f\\rVert = \\sqrt{4 + 16} = \\sqrt{20} \\approx 4.472$, in direction $(-1, -2)/\\sqrt5$ (south-west, toward the summit at the origin).', 'Due east, $\\mathbf u = (1, 0)$: $D_{\\mathbf u} f = -2$ — downhill.'],
      answer: '$\\nabla f = (-2, -4)$; steepest climb $\\approx 4.47$; east is downhill at rate 2.',
      check: { value: Math.sqrt(20), tolerance: 1e-9, compute: () => Math.hypot(-2, -4) },
    },
    {
      title: 'Classifying critical points',
      problem: 'Classify the critical point at the origin of $f = x^2 + 3y^2$ and of $g = x^2 - y^2$.',
      steps: ['$f$: $H = \\begin{bmatrix}2 & 0\\\\ 0 & 6\\end{bmatrix}$, $\\det H = 12 > 0$ and $f_{xx} = 2 > 0$: a minimum.', '$g$: $H = \\begin{bmatrix}2 & 0\\\\ 0 & -2\\end{bmatrix}$, $\\det H = -4 < 0$: a saddle — up along x, down along y.'],
      answer: 'Minimum for $f$; saddle for $g$.',
      check: { value: -4, compute: () => 2 * -2 - 0 },
    },
  ],

  counterexample: {
    title: 'Partial derivatives that lie',
    body: [
      'Let $f(x, y) = \\dfrac{xy}{x^2 + y^2}$ with $f(0, 0) = 0$. Along both axes $f$ is identically 0, so $f_x(0, 0) = f_y(0, 0) = 0$ and the “gradient” is $(0, 0)$.',
      'Yet along the line $y = x$, $f = \\tfrac12$ everywhere except the origin: $f$ is not even continuous there, let alone differentiable. The formula $D_{\\mathbf u} f = \\nabla f\\cdot\\mathbf u$ needs differentiability, not just partial derivatives.',
    ],
  },

  predict: {
    prompt: 'At some point $\\nabla f = (3, 4)$. You move in the unit direction $\\mathbf u = (0.8, -0.6)$. At what rate does $f$ change?',
    choices: ['5', '0', '2.4', '−5'],
    answer: 1,
    reveal: '$\\nabla f\\cdot\\mathbf u = 2.4 - 2.4 = 0$. This direction is perpendicular to the gradient: you are walking along a contour, neither up nor down.',
    misconception: {
      belief: 'Any direction other than the gradient’s goes downhill.',
      correction: 'Every direction within 90° of the gradient still climbs (positive dot product); only those beyond 90° descend, and the ones at exactly 90° stay level.',
    },
  },

  practice: [
    item({ id: 'c3-grad.p1', competency: 'calc.gradient', difficulty: 1, level: 'scaffolded', prompt: 'For $f(x, y) = x^2 y$, find $\\dfrac{\\partial f}{\\partial x}$ at $(2, 3)$. (Treat $y$ as a constant: $\\partial f/\\partial x = 2xy$.)', answer: num(12), compute: () => 2 * 2 * 3, solution: '$2 \\cdot 2 \\cdot 3 = 12$.' }),
    item({ id: 'c3-grad.p2', competency: 'calc.gradient', difficulty: 1, level: 'scaffolded', prompt: 'For the same $f = x^2 y$, find $\\dfrac{\\partial f}{\\partial y}$ at $(2, 3)$.', answer: num(4), compute: () => 2 ** 2, hints: ['Now $x$ is the constant: $\\partial f/\\partial y = x^2$.'], solution: '$x^2 = 4$.' }),
    item({ id: 'c3-grad.p3', competency: 'calc.gradient', difficulty: 2, level: 'independent', prompt: 'Find $\\nabla f$ for $f = 3x^2 + 2xy$ at $(1, -1)$.', answer: multi([4, 2], ['∂f/∂x', '∂f/∂y']), hints: ['$f_x = 6x + 2y$, $f_y = 2x$.'], solution: '$(6 - 2,\\ 2) = (4, 2)$.' }),
    item({ id: 'c3-grad.p4', competency: 'calc.gradient', difficulty: 2, level: 'independent', prompt: 'For $f = x^2 + y^2$ at $(1, 2)$, find the directional derivative in the unit direction $(0.6, 0.8)$.', answer: num(4.4), compute: () => 2 * 0.6 + 4 * 0.8, hints: ['$\\nabla f = (2, 4)$.'], solution: '$(2, 4)\\cdot(0.6, 0.8) = 1.2 + 3.2 = 4.4$.' }),
    item({ id: 'c3-grad.p5', competency: 'calc.optimization', difficulty: 2, level: 'independent', prompt: 'Classify the critical point at the origin of $f = x^2 + xy + y^2$.', answer: choice(['Minimum', 'Maximum', 'Saddle', 'The test is inconclusive'], 0), feedback: { 2: '$\\det H = 2\\cdot2 - 1\\cdot1 = 3 > 0$, which rules out a saddle.' }, solution: '$H = \\begin{bmatrix}2 & 1\\\\ 1 & 2\\end{bmatrix}$, $\\det H = 3 > 0$, $f_{xx} = 2 > 0$: a minimum.' }),
    item({ id: 'c3-grad.p6', competency: 'calc.gradient', difficulty: 3, level: 'transfer', prompt: 'A model’s loss is $L(w_1, w_2) = (w_1 - 2)^2 + 4(w_2 + 1)^2$. How large is $\\nabla L$ at $(0, 0)$? (Three decimals.)', answer: num(Math.sqrt(80), 0.0006), compute: () => Math.hypot(-4, 8), hints: ['$\\nabla L = (2(w_1 - 2),\\ 8(w_2 + 1)) = (-4, 8)$.'], solution: '$\\sqrt{16 + 64} = \\sqrt{80} \\approx 8.944$.' }),
    item({ id: 'c3-grad.p7', competency: 'calc.gradient', difficulty: 3, level: 'transfer', prompt: 'Temperature $T(x, y)$ (x east, y north) has gradient $(-3, 0)$ where you stand. Which way should you walk to warm up fastest?', answer: choice(['East', 'West', 'North', 'Any direction'], 1), solution: 'The gradient points toward fastest increase: $(-3, 0)$ is due west.' }),
  ],

  checkpoint: [
    item({ id: 'c3-grad.c1', competency: 'calc.gradient', difficulty: 1, prompt: 'For $f(x, y) = 5x + y^3$, find $\\dfrac{\\partial f}{\\partial y}$ at $(1, 2)$.', answer: num(12), compute: () => 3 * 4, solution: '$3y^2 = 12$ (the $5x$ term is constant in $y$).', feedbackCorrect: 'Right.', feedbackIncorrect: 'Hold $x$ fixed: $\\partial(5x)/\\partial y = 0$ and $\\partial(y^3)/\\partial y = 3y^2$.' }),
    item({ id: 'c3-grad.c2', competency: 'calc.gradient', difficulty: 2, prompt: 'At a point, $\\nabla f = (5, 12)$. What is the greatest rate of increase of $f$ there?', answer: num(13), compute: () => Math.hypot(5, 12), solution: '$\\lVert\\nabla f\\rVert = 13$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'The steepest rate is the length of the gradient.' }),
    item({ id: 'c3-grad.c3', competency: 'calc.optimization', difficulty: 3, prompt: 'For $f(x, y) = xy$, the gradient at the origin is $\\mathbf 0$. The origin is…', answer: choice(['a minimum', 'a maximum', 'a saddle point', 'not a critical point'], 2), solution: '$H = \\begin{bmatrix}0 & 1\\\\ 1 & 0\\end{bmatrix}$, $\\det H = -1 < 0$: a saddle ($f > 0$ in two quadrants, $< 0$ in the others).', feedbackCorrect: 'Right.', feedbackIncorrect: 'Compute the Hessian of $xy$ and its determinant.' }),
  ],

  python: {
    intro: 'The analytic gradient of the hill, checked against a central-difference estimate — the standard way to test hand-written gradients in machine-learning code.',
    code: `import numpy as np

def f(p):
    x, y = p
    return 9 - x ** 2 - 2 * y ** 2

def grad_f(p):
    x, y = p
    return np.array([-2 * x, -4 * y])

def numerical_grad(f, p, h=1e-5):
    p = np.asarray(p, dtype=float)
    g = np.zeros_like(p)
    for i in range(len(p)):
        e = np.zeros_like(p)
        e[i] = h
        g[i] = (f(p + e) - f(p - e)) / (2 * h)
    return g

p = np.array([1.0, 1.0])
print(grad_f(p), np.round(numerical_grad(f, p), 6))
print(round(float(np.linalg.norm(grad_f(p))), 4))
print(grad_f(p) @ np.array([1.0, 0.0]))`,
    output: '[-2. -4.] [-2. -4.]\n4.4721\n-2.0',
    explain: 'The numerical estimate matches; the length is the steepest slope $\\sqrt{20}$; the last line is the due-east directional derivative.',
  },

  reading: [
    { title: 'Partial Derivatives (§4.3)', source: 'OpenStax, Calculus Volume 3', url: 'https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives', note: 'Notation and computation of partial derivatives.' },
    { title: 'Directional Derivatives and the Gradient (§4.6)', source: 'OpenStax, Calculus Volume 3', url: 'https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient', note: 'Proofs of the properties used here.' },
    { title: 'Maxima/Minima Problems (§4.7)', source: 'OpenStax, Calculus Volume 3', url: 'https://openstax.org/books/calculus-volume-3/pages/4-7-maxima-minima-problems', note: 'The second-derivative test in full.' },
  ],
};
