import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A test car’s speedometer reads $v(t) = t^2$ metres per second for $0 \\le t \\le 3$ seconds. The speed is never constant, so “distance = speed × time” does not apply directly. How far did the car travel?',
    body: [
      'Chop the 3 seconds into short pieces. On each piece the speed barely changes, so speed × duration is almost right; add the pieces. Drawn on a graph, each piece is a thin rectangle under the speed curve, and the total is an area.',
      'Using more, thinner pieces makes the sum more accurate. The exact answer — the limit of these **Riemann sums** — is the **definite integral**. Here it is exactly 9 metres.',
    ],
  },

  glossary: [
    { term: '$\\Delta x = \\dfrac{b - a}{n}$', meaning: 'The width of each of $n$ equal strips on $[a, b]$.' },
    { term: '$x_i^*$', meaning: 'The sample point in strip $i$: its left end, right end or midpoint.' },
    { term: '$\\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x$', meaning: 'A Riemann sum: heights times widths, added up.' },
    { term: '$\\int_a^b f(x)\\,dx$', meaning: 'The definite integral: the limit of Riemann sums as $n \\to \\infty$ — signed area.' },
  ],

  priorCheck: [
    item({ id: 'c2-rie.pre1', competency: 'arith.order-ops', difficulty: 1, prompt: 'Compute $1^2 + 2^2 + 3^2$.', answer: num(14), compute: () => 1 + 4 + 9, solution: '$1 + 4 + 9 = 14$.' }),
    item({ id: 'c2-rie.pre2', competency: 'calc.limits', difficulty: 2, prompt: 'What does $\\dfrac{9(n + 1)}{n}$ approach as $n \\to \\infty$?', answer: num(9), compute: () => 9, hints: ['Write it as $9 + 9/n$.'], solution: '$9 + 9/n \\to 9$.' }),
  ],

  visualization: {
    lab: 'riemann',
    intro: 'Start with x² on [0, 3] and right-hand rectangles. Increase n and watch the error; switch to midpoint and compare. Then try 4 − t, where some strips fall below the axis.',
    textAlternative: 'The lab draws the function and the n rectangles (or trapezoids) for the chosen rule. A sentence gives Δx, the sum, the exact integral and the error; the table lists each rule’s error for n = 3, 6, 12, 24 and 48.',
  },

  derivation: {
    intro: 'We can compute the limit exactly for $v(t) = t^2$ on $[0, 3]$ with right-hand sums, using the sum-of-squares formula $\\sum_{i=1}^{n} i^2 = \\dfrac{n(n+1)(2n+1)}{6}$.',
    steps: [
      { say: 'With $n$ strips, $\\Delta t = 3/n$ and the right endpoints are $t_i = 3i/n$:', math: 'R_n = \\sum_{i=1}^{n} \\Big(\\frac{3i}{n}\\Big)^2 \\frac{3}{n} = \\frac{27}{n^3} \\sum_{i=1}^{n} i^2 = \\frac{27}{n^3} \\cdot \\frac{n(n+1)(2n+1)}{6}' },
      { say: 'Simplify:', math: 'R_n = \\frac{9(n+1)(2n+1)}{2n^2} = 9 + \\frac{27}{2n} + \\frac{9}{2n^2}' },
      { say: 'The extra terms vanish as $n \\to \\infty$, so', math: '\\int_0^3 t^2\\,dt = \\lim_{n\\to\\infty} R_n = 9' },
      { say: 'The error of the right sum shrinks like $1/n$: double $n$, halve the error. Midpoint and trapezoid sums do better, with errors that shrink like $1/n^2$ for smooth functions — the lab’s table shows both rates.' },
    ],
    assumptions: ['$f$ is continuous on $[a, b]$; then left, right and midpoint sums all converge to the same limit.', 'Area below the axis counts as negative: the integral is **signed** area.'],
    domain: ['The interval is finite and $f$ is bounded on it. Infinite intervals or unbounded functions need improper integrals (Calculus II).'],
  },

  examples: [
    {
      title: 'Three strips, three rules',
      problem: 'Approximate $\\int_0^3 t^2\\,dt$ with $n = 3$ using left, right and midpoint sums.',
      steps: ['$\\Delta t = 1$. Left: $f(0) + f(1) + f(2) = 0 + 1 + 4 = 5$.', 'Right: $f(1) + f(2) + f(3) = 1 + 4 + 9 = 14$.', 'Midpoint: $f(0.5) + f(1.5) + f(2.5) = 0.25 + 2.25 + 6.25 = 8.75$.'],
      answer: '5, 14 and 8.75 against the exact 9: the increasing function makes left too low and right too high; midpoint is closest.',
      check: { value: 8.75, compute: () => 0.25 + 2.25 + 6.25 },
    },
    {
      title: 'The exact formula at n = 6',
      problem: 'Use $R_n = \\dfrac{9(n+1)(2n+1)}{2n^2}$ to compute the right sum with 6 strips.',
      steps: ['$R_6 = \\dfrac{9 \\cdot 7 \\cdot 13}{72} = \\dfrac{819}{72} = 11.375$.'],
      answer: '11.375 — error 2.375, about half the error of $R_3 = 14$ (error 5).',
      check: { value: 11.375, compute: () => (9 * 7 * 13) / (2 * 36) },
    },
  ],

  counterexample: {
    title: 'An integral of zero with plenty of area',
    body: [
      'A drone climbs at $v(t) = 4 - t$ m/s for $0 \\le t \\le 6$. Its altitude changes by $\\int_0^6 (4 - t)\\,dt = 24 - 18 = 6$ metres. But it climbed 8 m (until $t = 4$) and then descended 2 m: it moved 10 m in total.',
      'The integral gives **net** change because area below the axis counts negative. Total distance needs $\\int_0^6 |4 - t|\\,dt = 10$. Over $[-1, 1]$, $\\int x^3\\,dx = 0$ for the same reason.',
    ],
  },

  predict: {
    prompt: 'For an increasing function, right-hand Riemann sums…',
    choices: ['always overestimate the integral', 'always underestimate it', 'are exact once n ≥ 10', 'can go either way'],
    answer: 0,
    reveal: 'On each strip an increasing function is highest at the right end, so every rectangle pokes above the curve. The overestimate shrinks as $n$ grows but never becomes exact for a strictly increasing curve at finite $n$.',
    misconception: {
      belief: 'With enough rectangles the sum becomes the exact area.',
      correction: 'Any finite $n$ leaves an error (here $27/(2n) + 9/(2n^2)$). Only the limit is exact — that is what makes the integral a new idea rather than a big sum.',
    },
  },

  practice: [
    item({ id: 'c2-rie.p1', competency: 'calc.integral', difficulty: 1, level: 'scaffolded', prompt: 'What is $\\Delta x$ for $[0, 3]$ with $n = 6$ strips?', answer: num(0.5), compute: () => 3 / 6, solution: '$3/6 = 0.5$.' }),
    item({ id: 'c2-rie.p2', competency: 'calc.integral', difficulty: 1, level: 'scaffolded', prompt: 'Right Riemann sum for $f(x) = x^2$ on $[0, 2]$ with $n = 2$: $\\Delta x = 1$, add $f(1) + f(2)$.', answer: num(5), compute: () => 1 + 4, solution: '$1 + 4 = 5$.' }),
    item({ id: 'c2-rie.p3', competency: 'calc.integral', difficulty: 2, level: 'independent', prompt: 'Midpoint sum for $f(x) = x^2$ on $[0, 2]$ with $n = 2$.', answer: num(2.5), compute: () => (0.25 + 2.25) * 1, solution: '$f(0.5) + f(1.5) = 0.25 + 2.25 = 2.5$.' }),
    item({ id: 'c2-rie.p4', competency: 'calc.integral', difficulty: 2, level: 'independent', prompt: 'The exact value of $\\int_0^2 x^2\\,dx$ is $8/3$. Enter it to three decimals.', answer: num(8 / 3, 0.0006), compute: () => 8 / 3, solution: '$8/3 \\approx 2.667$ — the midpoint sum 2.5 is already within 0.17.' }),
    item({ id: 'c2-rie.p5', competency: 'calc.integral', difficulty: 2, level: 'independent', prompt: 'Trapezoid sum for $x^2$ on $[0, 2]$ with $n = 2$ — the average of the left sum and the right sum.', answer: num(3), compute: () => ((0 + 1) + (1 + 4)) / 2, hints: ['Left sum: $f(0) + f(1) = 1$. Right sum: 5.'], solution: '$(1 + 5)/2 = 3$.' }),
    item({ id: 'c2-rie.p6', competency: 'calc.integral', difficulty: 3, level: 'transfer', prompt: 'Water flows into a tank at $r(t) = 2t$ litres per minute for $0 \\le t \\le 10$. How many litres flow in? (The graph is a triangle.)', answer: num(100), compute: () => 0.5 * 10 * 20, solution: 'Area of the triangle: $\\tfrac12 \\cdot 10 \\cdot 20 = 100$ litres.' }),
    item({ id: 'c2-rie.p7', competency: 'calc.integral', difficulty: 3, level: 'transfer', prompt: 'A runner’s speed is recorded every 10 seconds. Which estimate of the distance covered uses those readings correctly?', answer: choice(['The average of the readings', 'Sum of (reading × 10 s), or better, the trapezoid sum', 'The last reading × total time', 'The largest reading × total time'], 1), solution: 'Speed × time on each 10-second piece, added up: a Riemann (or trapezoid) sum.' }),
  ],

  checkpoint: [
    item({ id: 'c2-rie.c1', competency: 'calc.integral', difficulty: 1, prompt: 'Left Riemann sum for $f(x) = x$ on $[0, 4]$ with $n = 4$.', answer: num(6), compute: () => 0 + 1 + 2 + 3, solution: '$f(0) + f(1) + f(2) + f(3) = 6$ (each $\\Delta x = 1$).', feedbackCorrect: 'Right — an underestimate of the exact 8.', feedbackIncorrect: 'Use the left ends 0, 1, 2, 3 of the four strips.' }),
    item({ id: 'c2-rie.c2', competency: 'calc.integral', difficulty: 2, prompt: 'Right Riemann sum for $f(x) = x^2$ on $[0, 3]$ with $n = 3$.', answer: num(14), compute: () => 1 + 4 + 9, solution: '$1 + 4 + 9 = 14$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Right ends: 1, 2, 3; $\\Delta x = 1$.' }),
    item({ id: 'c2-rie.c3', competency: 'calc.integral', difficulty: 3, prompt: 'A drone’s vertical velocity is $v(t) = 4 - t$ m/s for $0 \\le t \\le 6$. By how many metres does its altitude change?', answer: num(6), compute: () => 4 * 6 - 36 / 2, solution: '$\\int_0^6 (4 - t)\\,dt = 24 - 18 = 6$ m (up 8, then down 2).', feedbackCorrect: 'Right — net change, not total distance.', feedbackIncorrect: 'Area above the axis (0 to 4) is 8; below (4 to 6) is 2, and it subtracts.' }),
  ],

  python: {
    intro: 'Right and midpoint sums with NumPy for growing n, then NumPy’s trapezoid rule on 300 strips.',
    code: `import numpy as np

f = lambda x: x ** 2
a, b = 0.0, 3.0
for n in [3, 30, 300]:
    x = np.linspace(a, b, n + 1)
    dx = (b - a) / n
    right = np.sum(f(x[1:])) * dx
    mid = np.sum(f((x[:-1] + x[1:]) / 2)) * dx
    print(n, round(float(right), 6), round(float(mid), 6))

xs = np.linspace(0, 3, 301)
print(round(float(np.trapezoid(f(xs), xs)), 6))`,
    output: '3 14.0 8.75\n30 9.455 8.9975\n300 9.04505 8.999975\n9.00005',
    explain: 'Ten times more strips: the right-sum error drops about 10× (5 → 0.455 → 0.045), the midpoint error about 100× (0.25 → 0.0025 → 0.000025).',
  },

  reading: [
    { title: 'Approximating Areas (§5.1)', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas', note: 'Sigma notation, left and right sums, and their limits.' },
    { title: 'numpy.trapezoid', source: 'NumPy documentation', url: 'https://numpy.org/doc/stable/reference/generated/numpy.trapezoid.html', note: 'The trapezoid rule used in the Python section.' },
  ],
};
