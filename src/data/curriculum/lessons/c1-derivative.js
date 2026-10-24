import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A ball is thrown upward; its height after $t$ seconds is $h(t) = 20t - 5t^2$ metres. Its average speed over a time interval is easy: change in height over change in time. But how fast is it rising at **exactly** $t = 1$ second — an interval of length zero?',
    body: [
      'Take shorter and shorter intervals starting at $t = 1$. Over $[1, 1 + \\Delta t]$ the average velocity is $\\dfrac{h(1 + \\Delta t) - h(1)}{\\Delta t} = 10 - 5\\,\\Delta t$. As $\\Delta t$ shrinks toward 0 this approaches **10 m/s**. That limiting value is the **derivative**: the instantaneous rate of change.',
      'Geometrically, the average rate is the slope of a secant line through two points of the graph; the derivative is the slope of the tangent line at one point. It is slope — the Algebra I idea — made local.',
    ],
  },

  glossary: [
    { term: '$\\dfrac{f(a + h) - f(a)}{h}$', meaning: 'The difference quotient: the slope of the secant from $a$ to $a + h$ ($h \\ne 0$).' },
    { term: '$f\'(a)$, $\\dfrac{df}{dx}\\Big|_{x=a}$', meaning: 'The derivative at $a$. The straight $d$ is for functions of **one** variable.' },
    { term: '$\\lim_{h \\to 0}$', meaning: 'The value approached as $h$ gets arbitrarily close to 0, from both sides, without being 0.' },
    { term: '$\\dfrac{\\partial f}{\\partial x}$', meaning: 'A **partial** derivative (curly $\\partial$): used when $f$ has several inputs and the others are held fixed. You will meet it in the gradient lesson; do not mix the two notations.' },
  ],

  priorCheck: [
    item({ id: 'c1-der.pre1', competency: 'alg.slope', difficulty: 1, prompt: 'Find the slope of the line through $(1, 1)$ and $(3, 9)$.', answer: num(4), compute: () => (9 - 1) / (3 - 1), solution: '$8/2 = 4$.', remedy: 'a1-slope' }),
    item({ id: 'c1-der.pre2', competency: 'calc.limits', difficulty: 2, prompt: 'What value does $\\dfrac{x^2 - 1}{x - 1}$ approach as $x$ approaches 1?', answer: num(2), compute: () => 1 + 1, hints: ['Factor: $x^2 - 1 = (x - 1)(x + 1)$.'], solution: 'For $x \\ne 1$ it equals $x + 1$, which approaches 2.' }),
  ],

  visualization: {
    lab: 'slope',
    config: { mode: 'secant' },
    intro: 'Shrink h toward 0 and watch the secant slope settle on the tangent slope. Then open the “|x| at a = 0” example: the slopes from the two sides never agree.',
    textAlternative: 'The lab draws the function, the secant through (a, f(a)) and (a + h, f(a + h)), and the tangent where it exists. A sentence gives the secant slope, the tangent slope and the gap; the table lists difference quotients for h = 1, 0.5, 0.1, 0.01, 0.001 and for −h.',
  },

  derivation: {
    intro: 'The definition, then two derivatives computed from it.',
    steps: [
      { say: 'Definition: when this limit exists (and is the same from both sides),', math: "f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}" },
      { say: 'For $f(x) = x^2$, expand and simplify while $h \\ne 0$:', math: '\\frac{(a + h)^2 - a^2}{h} = \\frac{2ah + h^2}{h} = 2a + h \\;\\xrightarrow{\\,h \\to 0\\,}\\; 2a' },
      { say: 'For $f(x) = x^3$, the same steps with $(a + h)^3 = a^3 + 3a^2h + 3ah^2 + h^3$:', math: '\\frac{3a^2h + 3ah^2 + h^3}{h} = 3a^2 + 3ah + h^2 \\;\\xrightarrow{\\,h \\to 0\\,}\\; 3a^2' },
      { say: 'The pattern generalizes to the power rule $\\dfrac{d}{dx}x^n = n x^{n-1}$, proved in the Derivative rules unit. Two more facts follow straight from the definition: constants have derivative 0, and $\\dfrac{d}{dx}(cf) = c\\,f\'$, $\\dfrac{d}{dx}(f + g) = f\' + g\'$.' },
    ],
    assumptions: ['$f$ is defined on an interval around $a$.', 'Cancelling $h$ is legal because $h \\ne 0$ inside the limit — the limit never evaluates at $h = 0$ itself.'],
    domain: ['If the one-sided limits differ — or are infinite — the derivative does not exist at that point (corners, cusps, vertical tangents, jumps).', 'Differentiable implies continuous; continuous does not imply differentiable ($|x|$ at 0).'],
  },

  examples: [
    {
      title: 'The derivative of x² at 3, numerically and exactly',
      problem: 'Estimate $f\'(3)$ for $f(x) = x^2$ with $h = 0.1$ and $h = 0.01$, then find it exactly.',
      steps: ['$h = 0.1$: $(3.1^2 - 9)/0.1 = 0.61/0.1 = 6.1$.', '$h = 0.01$: $(3.01^2 - 9)/0.01 = 6.01$.', 'Exactly: $2a + h \\to 2 \\cdot 3 = 6$.'],
      answer: "$f'(3) = 6$; the estimates are $6 + h$, approaching it.",
      check: { value: 6.1, tolerance: 1e-9, compute: () => (3.1 ** 2 - 9) / 0.1 },
    },
    {
      title: 'The ball at t = 1',
      problem: 'For $h(t) = 20t - 5t^2$, find the velocity $h\'(1)$.',
      steps: ['$\\dfrac{h(1 + \\Delta t) - h(1)}{\\Delta t} = \\dfrac{20\\Delta t - 10\\Delta t - 5\\Delta t^2}{\\Delta t} = 10 - 5\\Delta t$.', 'As $\\Delta t \\to 0$: 10.', 'Using the rules: $h\'(t) = 20 - 10t$, so $h\'(1) = 10$. ✓'],
      answer: '10 m/s upward at $t = 1$; at $t = 2$ the velocity is 0 — the top of the flight.',
      check: { value: 10, compute: () => 20 - 10 * 1 },
    },
  ],

  counterexample: {
    title: 'A continuous function with no derivative at a point',
    body: [
      '$f(x) = |x|$ at $a = 0$: for $h > 0$ the difference quotient is $|h|/h = 1$; for $h < 0$ it is $-1$. The two one-sided limits disagree, so $f\'(0)$ does not exist — even though the graph has no gap. A sharp corner has no single tangent.',
      'In machine learning, the ReLU activation $\\max(0, x)$ has exactly this corner at 0; software simply picks a value there (a “subgradient”).',
    ],
  },

  predict: {
    prompt: 'For $f(x) = x^2$ at $a = 3$, the secant slope with $h = 0.5$ is $6.5$. What is it with $h = -0.5$?',
    choices: ['$6.5$', '$5.5$', '$6$', '$-6.5$'],
    answer: 1,
    reveal: 'The difference quotient is exactly $2a + h = 6 - 0.5 = 5.5$. From the left the secant slopes sit below 6; from the right, above. Both sides squeeze in on 6.',
    misconception: {
      belief: 'The derivative is the slope with a really small h, like 0.001.',
      correction: 'A small-h quotient is only an approximation (here $6.001$, not $6$), and on a computer, too-small h makes it worse through rounding (see the Python section). The derivative is the limit, which is exact.',
    },
  },

  practice: [
    item({ id: 'c1-der.p1', competency: 'calc.derivative', difficulty: 1, level: 'scaffolded', prompt: 'For $f(x) = x^2$, compute the difference quotient at $a = 2$ with $h = 0.1$: $\\dfrac{f(2.1) - f(2)}{0.1}$.', answer: num(4.1, 1e-9), compute: () => (2.1 ** 2 - 4) / 0.1, hints: ['$2.1^2 = 4.41$.'], solution: '$(4.41 - 4)/0.1 = 4.1$.' }),
    item({ id: 'c1-der.p2', competency: 'calc.derivative', difficulty: 1, level: 'scaffolded', prompt: 'Using $f\'(a) = 2a$ for $f(x) = x^2$, what is $f\'(2)$?', answer: num(4), compute: () => 2 * 2, solution: '$2 \\cdot 2 = 4$.' }),
    item({ id: 'c1-der.p3', competency: 'calc.derivative', difficulty: 2, level: 'independent', prompt: 'From the definition, the difference quotient of $f(x) = 3x^2 + 1$ simplifies to $6a + 3h$. What is $f\'(-1)$?', answer: num(-6), compute: () => 6 * -1, solution: 'Let $h \\to 0$: $f\'(a) = 6a$, so $f\'(-1) = -6$.' }),
    item({ id: 'c1-der.p4', competency: 'calc.derivative', difficulty: 2, level: 'independent', prompt: 'Using the result for $x^3$, what is the slope of $y = x^3$ at $x = 2$?', answer: num(12), compute: () => 3 * 2 ** 2, solution: '$3a^2 = 12$.' }),
    item({ id: 'c1-der.p5', competency: 'calc.derivative', difficulty: 2, level: 'independent', prompt: 'If $s(t)$ is a distance in metres and $t$ is time in seconds, what are the units of $s\'(t)$?', answer: choice(['metres', 'seconds per metre', 'metres per second', 'metres × seconds'], 2), solution: 'A derivative is a limit of (change in s)/(change in t): metres per second.' }),
    item({ id: 'c1-der.p6', competency: 'calc.derivative', difficulty: 3, level: 'transfer', prompt: 'A factory’s cost to make $q$ items is $C(q) = 500 + 4q + 0.01q^2$ dollars. Using the rules above (constants vanish, $q \\mapsto 4$, $q^2 \\mapsto 2q$), find the marginal cost $C\'(100)$ in dollars per item.', answer: num(6), compute: () => 4 + 0.02 * 100, solution: "$C'(q) = 4 + 0.02q$, so $C'(100) = 6$ dollars per item." }),
    item({ id: 'c1-der.p7', competency: 'calc.derivative', difficulty: 3, level: 'transfer', prompt: 'Which function is NOT differentiable at $x = 0$?', answer: choice(['$x^2$', '$|x|$', '$x^3$', '$2x + 1$'], 1), solution: '$|x|$ has a corner at 0: one-sided slopes $-1$ and $+1$.' }),
  ],

  checkpoint: [
    item({ id: 'c1-der.c1', competency: 'calc.derivative', difficulty: 1, prompt: 'What is the derivative of $x^2$ at $x = -1.5$?', answer: num(-3), compute: () => 2 * -1.5, solution: '$2a = -3$.', feedbackCorrect: 'Right — the curve is falling there.', feedbackIncorrect: 'Use $f\'(a) = 2a$.' }),
    item({ id: 'c1-der.c2', competency: 'calc.derivative', difficulty: 2, prompt: 'For $h(t) = 20t - 5t^2$, what is the velocity at $t = 2$ s, in m/s?', answer: num(0), compute: () => 20 - 10 * 2, solution: '$h\'(t) = 20 - 10t = 0$ at $t = 2$: the top of the flight.', feedbackCorrect: 'Right — momentarily at rest.', feedbackIncorrect: 'Differentiate term by term: $20 - 10t$.' }),
    item({ id: 'c1-der.c3', competency: 'calc.derivative', difficulty: 3, prompt: 'A tank holds $V(t) = 2t^2 + 3t$ litres after $t$ minutes. How fast is it filling at $t = 4$, in litres per minute?', answer: num(19), compute: () => 4 * 4 + 3, solution: '$V\'(t) = 4t + 3$, so $V\'(4) = 19$ L/min.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Differentiate each term, then substitute $t = 4$.' }),
  ],

  python: {
    intro: 'Forward difference quotients for $x^2$ at 3. Watch the error shrink — and then grow again as $h$ gets so small that rounding error takes over.',
    code: `def f(x):
    return x ** 2

a = 3.0
for h in [1e-1, 1e-2, 1e-4, 1e-8, 1e-12, 1e-15]:
    print(f"{h:.0e}  {(f(a + h) - f(a)) / h:.10f}")`,
    output: '1e-01  6.1000000000\n1e-02  6.0100000000\n1e-04  6.0001000000\n1e-08  5.9999999635\n1e-12  6.0005334035\n1e-15  5.3290705182',
    explain: 'Down to about $h = 10^{-8}$ the error is the $h$ term; below that, subtracting two nearly equal floating-point numbers loses digits and the estimate gets worse. This is why numerical differentiation needs care, and why machine-learning frameworks use automatic differentiation instead.',
  },

  reading: [
    { title: 'Defining the Derivative (§3.1)', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative', note: 'The limit definition, tangent lines and velocities.' },
    { title: 'The Definition of the Derivative', source: 'Paul’s Online Math Notes, Calculus I', url: 'https://tutorial.math.lamar.edu/Classes/CalcI/DefnOfDerivative.aspx', note: 'Many more derivatives computed from the definition.' },
    { title: 'Floating-Point Arithmetic: Issues and Limitations', source: 'Python documentation', url: 'https://docs.python.org/3/tutorial/floatingpoint.html', note: 'Why tiny h goes wrong.' },
  ],
};
