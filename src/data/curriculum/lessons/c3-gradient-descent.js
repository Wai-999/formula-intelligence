import { item, num, choice, multi } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A model’s error (its **loss**) depends on its weights. You cannot see the whole landscape — only the slope where you stand. Can you still find the bottom, and how big should each step be?',
    body: [
      'Step against the gradient: $\\mathbf w \\leftarrow \\mathbf w - \\eta\\,\\nabla L(\\mathbf w)$. The gradient points uphill, so its negative points downhill; the **learning rate** $\\eta$ sets the stride. Repeat until the steps stop changing anything.',
      'Too small a stride and you crawl; too large and you leap past the valley floor, landing higher than where you started. The shape of the valley decides which strides are safe.',
    ],
  },

  glossary: [
    { term: '$L(\\mathbf w)$', meaning: 'The loss: a number measuring how wrong the model is with weights $\\mathbf w$.' },
    { term: '$\\eta$', meaning: 'The learning rate (step size), a positive number.' },
    { term: '$\\mathbf w_{k+1} = \\mathbf w_k - \\eta\\,\\nabla L(\\mathbf w_k)$', meaning: 'One step of gradient descent.' },
    { term: '$\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$', meaning: 'The condition number of a quadratic loss: how much steeper the steepest direction is than the flattest.' },
  ],

  priorCheck: [
    item({ id: 'c3-gd.pre1', competency: 'calc.gradient', difficulty: 1, prompt: 'Find $\\nabla f$ for $f = x^2 + y^2$ at $(1, 2)$.', answer: multi([2, 4], ['∂f/∂x', '∂f/∂y']), solution: '$(2x, 2y) = (2, 4)$.', remedy: 'c3-gradient' }),
    item({ id: 'c3-gd.pre2', competency: 'calc.gradient', difficulty: 1, prompt: 'In which direction does $f$ decrease fastest?', answer: choice(['$\\nabla f$', '$-\\nabla f$', 'Perpendicular to $\\nabla f$', 'Along the x-axis'], 1), solution: 'Opposite to the gradient: $-\\nabla f$.', remedy: 'c3-gradient' }),
  ],

  visualization: {
    lab: 'gradient-descent',
    intro: 'Start with “Narrow valley”: see the zig-zag. Lower η until it stops zig-zagging, then raise it until it explodes. Note where the explosion starts.',
    textAlternative: 'The lab draws contours of L = ax² + by², the path of gradient descent from a start point, and the minimum. A sentence gives the settings, the final point and loss, and whether η is below the convergence limit; the table lists the first ten iterates.',
  },

  derivation: {
    intro: 'Why does a small step decrease the loss, and exactly how small is small enough?',
    steps: [
      { say: 'By the linear approximation, stepping by $-\\eta\\,\\mathbf g$ (with $\\mathbf g = \\nabla L \\ne \\mathbf 0$) changes the loss by about', math: 'L(\\mathbf w - \\eta\\mathbf g) \\approx L(\\mathbf w) - \\eta\\,\\mathbf g\\cdot\\mathbf g = L(\\mathbf w) - \\eta\\lVert\\mathbf g\\rVert^2 \\;<\\; L(\\mathbf w)' },
      { say: '“About” matters: the approximation is only good for small $\\eta$. A one-variable quadratic shows the exact limit. For $L(w) = \\tfrac12\\lambda w^2$ (curvature $\\lambda > 0$), $L\'(w) = \\lambda w$ and one step gives', math: 'w_{k+1} = w_k - \\eta\\lambda w_k = (1 - \\eta\\lambda)\\,w_k' },
      { say: 'So $w_k = (1 - \\eta\\lambda)^k w_0$, which shrinks to 0 exactly when $|1 - \\eta\\lambda| < 1$:', math: '0 < \\eta < \\frac{2}{\\lambda}' },
      { say: 'A bowl $L = a x^2 + b y^2$ is two such problems at once, with curvatures $2a$ and $2b$. One $\\eta$ must satisfy both, so $\\eta < 2/\\lambda_{\\max}$; then the flat direction shrinks only by $1 - \\eta\\lambda_{\\min}$ per step. When $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$ is large, no single step size is good for both directions — the zig-zag.' },
    ],
    assumptions: ['$L$ is differentiable; a fixed learning rate.', 'The exact convergence condition is for quadratics; for general smooth losses the same idea holds with $\\lambda_{\\max}$ replaced by a bound on the curvature.'],
    domain: ['$\\eta \\ge 2/\\lambda_{\\max}$ diverges on a quadratic.', 'Gradient descent stops at any point where $\\nabla L = \\mathbf 0$ — a minimum, but possibly a saddle or a merely local minimum.'],
  },

  examples: [
    {
      title: 'Shrinking by a constant factor',
      problem: 'For $L(w) = w^2$ (so $\\lambda = 2$) start at $w_0 = 3$ with $\\eta = 0.1$. Find $w_1$, $w_2$ and the factor per step.',
      steps: ['$L\'(w) = 2w$. $w_1 = 3 - 0.1 \\cdot 6 = 2.4$.', '$w_2 = 2.4 - 0.1 \\cdot 4.8 = 1.92$.', 'Factor $1 - \\eta\\lambda = 1 - 0.2 = 0.8$ each step.'],
      answer: '$2.4$, then $1.92$: multiplied by 0.8 every step, heading to 0.',
      check: { value: 1.92, compute: () => 3 * 0.8 * 0.8 },
    },
    {
      title: 'One step too far',
      problem: 'Same loss and start, but $\\eta = 1.1$.',
      steps: ['Factor $1 - 1.1 \\cdot 2 = -1.2$.', '$w_1 = -3.6$, $w_2 = 4.32$, $w_3 = -5.184$: growing and flipping sign.'],
      answer: 'It diverges, because $\\eta = 1.1 > 2/\\lambda = 1$.',
      check: { value: 4.32, compute: () => 3 * (-1.2) ** 2 },
    },
  ],

  counterexample: {
    title: 'Gradient descent finds critical points, not necessarily minima',
    body: [
      'On $L(x, y) = x^2 - y^2$, start exactly at $(1, 0)$. The gradient $(2x, -2y)$ has no $y$-component on the x-axis, so every step stays on it and converges to $(0, 0)$ — a **saddle point**, where $L$ is not a minimum at all.',
      'Start at $(1, 0.001)$ instead and the $y$-coordinate grows by the factor $1 + 2\\eta$ each step: the path escapes. In practice, noise usually knocks iterates off saddles, but plateaus near them can still slow training.',
    ],
  },

  predict: {
    prompt: 'For $L(w) = w^2$ with $\\eta = 0.5$, starting at $w = 4$, where are you after one step?',
    choices: ['2', '0', '−4', '3.5'],
    answer: 1,
    reveal: '$w_1 = 4 - 0.5 \\cdot 8 = 0$: the minimum in a single step. Here $\\eta = 1/\\lambda$ exactly cancels the factor: $1 - \\eta\\lambda = 0$.',
    misconception: {
      belief: 'Smaller learning rates are always safer and better.',
      correction: 'Small rates do not diverge, but they can take thousands of times longer. The best fixed rate for a quadratic balances both directions; in practice it is tuned, or adapted during training.',
    },
  },

  practice: [
    item({ id: 'c3-gd.p1', competency: 'calc.optimization', difficulty: 1, level: 'scaffolded', prompt: 'One gradient-descent step on $L(w) = w^2$ from $w = 2$ with $\\eta = 0.25$. ($L\'(w) = 2w$.)', answer: num(1), compute: () => 2 - 0.25 * 4, solution: '$2 - 0.25 \\cdot 4 = 1$.' }),
    item({ id: 'c3-gd.p2', competency: 'calc.optimization', difficulty: 1, level: 'scaffolded', prompt: 'For curvature $\\lambda = 2$ and $\\eta = 0.1$, what factor $1 - \\eta\\lambda$ multiplies $w$ each step?', answer: num(0.8), compute: () => 1 - 0.2, solution: '$1 - 0.2 = 0.8$.' }),
    item({ id: 'c3-gd.p3', competency: 'calc.optimization', difficulty: 2, level: 'independent', prompt: 'One step on $L = x^2 + 3y^2$ from $(1, 1)$ with $\\eta = 0.1$.', answer: multi([0.8, 0.4], ['x', 'y']), hints: ['$\\nabla L = (2x, 6y) = (2, 6)$.'], solution: '$(1, 1) - 0.1(2, 6) = (0.8, 0.4)$.' }),
    item({ id: 'c3-gd.p4', competency: 'calc.optimization', difficulty: 2, level: 'independent', prompt: 'For $L(w) = 5w^2$ (so $\\lambda = 10$), what is the largest learning rate below which gradient descent converges?', answer: num(0.2), compute: () => 2 / 10, solution: '$\\eta < 2/\\lambda = 0.2$.' }),
    item({ id: 'c3-gd.p5', competency: 'calc.optimization', difficulty: 2, level: 'independent', prompt: 'Why does gradient descent zig-zag across a long, narrow valley?', answer: choice(['The learning rate is too small', 'The curvature differs a lot between directions, so a step that suits the steep one overshoots it', 'The gradient is zero there', 'Because the loss is not differentiable'], 1), solution: 'In the steep direction the factor $1 - \\eta\\lambda_{\\max}$ is negative: each step jumps across the valley.' }),
    item({ id: 'c3-gd.p6', competency: 'calc.optimization', difficulty: 3, level: 'transfer', prompt: 'Fitting a constant $b$ to the data $y = (2, 4, 9)$ by least squares means minimizing $L(b) = \\sum (y_i - b)^2$. What is $L\'(0)$?', answer: num(-30), compute: () => -2 * (2 + 4 + 9), hints: ['$L\'(b) = -2\\sum (y_i - b)$.'], solution: '$-2(2 + 4 + 9) = -30$: negative, so increasing $b$ lowers the loss (toward the mean, 5).' }),
    item({ id: 'c3-gd.p7', competency: 'calc.optimization', difficulty: 3, level: 'transfer', prompt: 'A neural network’s training loss shoots up to NaN after a few steps. What is the first thing to try?', answer: choice(['Increase the learning rate', 'Decrease the learning rate', 'Train for more steps', 'Remove the validation set'], 1), solution: 'Divergence is the signature of too large a step: lower $\\eta$.' }),
  ],

  checkpoint: [
    item({ id: 'c3-gd.c1', competency: 'calc.optimization', difficulty: 1, prompt: 'One step on $L(w) = w^2$ from $w = 5$ with $\\eta = 0.1$.', answer: num(4), compute: () => 5 - 0.1 * 10, solution: '$5 - 0.1 \\cdot 10 = 4$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'The gradient is $2w = 10$; step by $-\\eta \\times 10$.' }),
    item({ id: 'c3-gd.c2', competency: 'calc.optimization', difficulty: 2, prompt: 'Same loss and rate from $w_0 = 5$: where are you after 3 steps?', answer: num(2.56), compute: () => 5 * 0.8 ** 3, solution: 'Factor 0.8 per step: $5 \\times 0.8^3 = 2.56$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Each step multiplies by $1 - \\eta\\lambda = 0.8$.' }),
    item({ id: 'c3-gd.c3', competency: 'calc.optimization', difficulty: 3, prompt: 'For $L = x^2 + 100y^2$ with $\\eta$ just under the limit $2/200 = 0.01$, progress along $x$ is…', answer: choice(['fast', 'very slow: a factor of about 0.98 per step', 'divergent', 'zero'], 1), solution: 'Along $x$, $1 - \\eta\\cdot 2 \\approx 0.98$: about 230 steps to shrink $x$ a hundredfold. Large $\\kappa$ (here 100) means slow progress.', feedbackCorrect: 'Right — ill-conditioning.', feedbackIncorrect: 'Compute $1 - \\eta\\lambda$ for the x direction, where $\\lambda = 2$.' }),
  ],

  python: {
    intro: 'Fifty steps on $L = x^2 + 10y^2$ (curvatures 2 and 20, so the limit is $\\eta < 0.1$) with three learning rates.',
    code: `import numpy as np

def grad(w):                      # L(w) = x^2 + 10 y^2
    return np.array([2 * w[0], 20 * w[1]])

for eta in [0.05, 0.09, 0.11]:
    w = np.array([1.0, 1.0])
    for _ in range(50):
        w = w - eta * grad(w)
    loss = w[0] ** 2 + 10 * w[1] ** 2
    print(eta, f"{loss:.3e}")`,
    output: '0.05 2.656e-05\n0.09 4.444e-09\n0.11 8.282e+08',
    explain: '0.09 beats 0.05 because it speeds up the slow x-direction while the y-direction still contracts (factor −0.8). Just past the limit, 0.11 explodes: the y-factor is −1.2.',
  },

  reading: [
    { title: 'Deep Learning, chapter 4: Numerical Computation (§4.3 Gradient-based optimization)', source: 'Goodfellow, Bengio & Courville (free online)', url: 'https://www.deeplearningbook.org/contents/numerical.html', note: 'Gradient descent, the Hessian and conditioning, from the ML side.' },
    { title: 'Why Momentum Really Works', source: 'Gabriel Goh, Distill (2017)', url: 'https://distill.pub/2017/momentum/', note: 'Interactive explanation of conditioning and how momentum helps.' },
  ],
};
