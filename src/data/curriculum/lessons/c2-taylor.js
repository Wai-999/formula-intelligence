import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A calculator does not store a table of $e^x$ for every $x$. With only addition and multiplication, how can it produce $e^{0.5} = 1.6487\\ldots$ to many digits — and how can you know the answer is close enough?',
    body: [
      'Near $x = 0$, a polynomial can imitate a function by matching its value, its slope, its curvature, and so on. For $e^x$ every derivative at 0 equals 1, which gives the polynomial $1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$ — a **Taylor polynomial**.',
      'Four terms give $1.6458$ at $x = 0.5$; nine terms agree with $e^{0.5}$ to eight decimals. And a formula tells you how big the error can be, before you know the true answer.',
    ],
  },

  glossary: [
    { term: '$f^{(k)}(a)$', meaning: 'The $k$-th derivative of $f$ at $a$; $f^{(0)} = f$.' },
    { term: '$k!$', meaning: '$1 \\cdot 2 \\cdots k$, with $0! = 1$.' },
    { term: '$P_n(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(a)}{k!}(x - a)^k$', meaning: 'The degree-$n$ Taylor polynomial centred at $a$ (Maclaurin when $a = 0$).' },
    { term: '$R_n(x) = f(x) - P_n(x)$', meaning: 'The remainder: the error of the approximation.' },
  ],

  priorCheck: [
    item({ id: 'c2-tay.pre1', competency: 'calc.rules', difficulty: 1, prompt: 'What is the derivative of $x^3$ at $x = 2$?', answer: num(12), compute: () => 3 * 4, solution: '$3x^2 = 12$.', remedy: 'c1-derivative' }),
    item({ id: 'c2-tay.pre2', competency: 'arith.order-ops', difficulty: 1, prompt: 'Compute $4!$.', answer: num(24), compute: () => 24, solution: '$1 \\cdot 2 \\cdot 3 \\cdot 4 = 24$.' }),
  ],

  visualization: {
    lab: 'taylor',
    intro: 'Raise the degree for eˣ and watch the dashed polynomial hug the curve further out. Then open “ln(1 + x) at 1.5”: raising the degree makes things worse.',
    textAlternative: 'The lab draws the function, its degree-n Maclaurin polynomial, and both values at a chosen x. A sentence gives P(x), the true value and the error; the table lists the error for degrees 0 to 12.',
  },

  derivation: {
    intro: 'Why those coefficients? Ask a polynomial to match a function’s derivatives at the centre.',
    steps: [
      { say: 'Write $P(x) = c_0 + c_1(x - a) + c_2(x - a)^2 + \\cdots + c_n(x - a)^n$. Differentiating $k$ times kills every term of lower degree, turns $c_k (x - a)^k$ into $k!\\,c_k$, and leaves higher terms with a factor $(x - a)$ that vanishes at $x = a$:', math: 'P^{(k)}(a) = k!\\, c_k' },
      { say: 'Setting $P^{(k)}(a) = f^{(k)}(a)$ for $k = 0, 1, \\ldots, n$ forces', math: 'c_k = \\frac{f^{(k)}(a)}{k!}' },
      { say: 'For $f(x) = e^x$ at $a = 0$, every derivative is $e^0 = 1$:', math: 'e^x \\approx 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots + \\frac{x^n}{n!}' },
      { say: 'Taylor’s theorem (Lagrange form, proved in Calculus II) bounds the error: if $|f^{(n+1)}| \\le M$ between $a$ and $x$,', math: '|R_n(x)| \\le \\frac{M\\,|x - a|^{n+1}}{(n+1)!}' },
    ],
    assumptions: ['$f$ has $n + 1$ continuous derivatives on an interval containing $a$ and $x$.', 'The bound is a guarantee, usually larger than the actual error — it is what you can promise before knowing the true value.'],
    domain: ['A Taylor **series** (infinitely many terms) may converge only on an interval: for $\\ln(1 + x)$ about 0, only for $-1 < x \\le 1$.', '“Approximately equal” here is an approximation, not an identity: the polynomial equals the function only at the centre unless the series converges to it.'],
  },

  examples: [
    {
      title: 'e^0.5 with four terms, and a guarantee',
      problem: 'Use $P_3$ for $e^x$ at $x = 0.5$, and bound the error.',
      steps: ['$P_3(0.5) = 1 + 0.5 + 0.125 + 0.0208\\overline{3} = 1.6458\\overline{3}$.', 'On $[0, 0.5]$, $|f^{(4)}| = e^x \\le e^{0.5} < 1.65$, so $|R_3| \\le 1.65 \\cdot 0.5^4/4! \\approx 0.0043$.', 'Actual error: $e^{0.5} - 1.64583 \\approx 0.0029$ — inside the bound.'],
      answer: '$1.6458$, guaranteed within 0.0043 and actually within 0.0029.',
      check: { value: 1.6458333333, tolerance: 1e-9, compute: () => 1 + 0.5 + 0.125 + 0.5 ** 3 / 6 },
    },
    {
      title: 'The small-angle approximation',
      problem: 'Use $\\sin x \\approx x - x^3/6$ at $x = 0.1$ (radians).',
      steps: ['$0.1 - 0.001/6 = 0.0998333\\ldots$', 'The true value is $\\sin 0.1 = 0.0998334\\ldots$; the next term, $x^5/120 \\approx 8.3 \\times 10^{-8}$, accounts for the difference.'],
      answer: '$0.0998333$, accurate to about $10^{-7}$.',
      check: { value: 0.1 - 0.001 / 6, tolerance: 1e-12, compute: () => 0.1 - 0.1 ** 3 / 6 },
    },
  ],

  counterexample: {
    title: 'When more terms make it worse',
    body: [
      'The Maclaurin polynomials of $\\ln(1 + x)$ are $x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots$. At $x = 1.5$ the partial sums with 2, 4, 8 and 16 terms are $0.375$, $0.234$, $-0.908$ and $-23.09$, while $\\ln 2.5 \\approx 0.916$. The terms $1.5^k/k$ grow without bound, so the series diverges.',
      'Outside the interval of convergence, a higher degree is not a better approximation. Use a different centre instead (for example, expand around $a = 2$).',
    ],
  },

  predict: {
    prompt: 'You add more and more terms of the Maclaurin polynomial of $\\ln(1 + x)$ and evaluate at $x = 1.5$. The approximation…',
    choices: ['steadily improves', 'improves, but slowly', 'gets worse and worse', 'stays the same'],
    answer: 2,
    reveal: 'It diverges: the series for $\\ln(1 + x)$ only converges for $-1 < x \\le 1$. See the counterexample and the lab’s third example.',
    misconception: {
      belief: 'More terms always means a better approximation.',
      correction: 'Only inside the interval of convergence. Taylor polynomials are local: excellent near the centre, and possibly useless far from it.',
    },
  },

  practice: [
    item({ id: 'c2-tay.p1', competency: 'calc.series', difficulty: 1, level: 'scaffolded', prompt: 'Evaluate $P_2(x) = 1 + x + \\frac{x^2}{2}$ (for $e^x$) at $x = 0.2$.', answer: num(1.22), compute: () => 1 + 0.2 + 0.02, solution: '$1 + 0.2 + 0.02 = 1.22$ (true value 1.2214).' }),
    item({ id: 'c2-tay.p2', competency: 'calc.series', difficulty: 1, level: 'scaffolded', prompt: 'What is the coefficient of $x^3$ in the Maclaurin polynomial of $e^x$? (Three decimals.)', answer: num(1 / 6, 0.0006), compute: () => 1 / 6, hints: ['$f\'\'\'(0)/3!$.'], solution: '$1/3! = 1/6 \\approx 0.167$.' }),
    item({ id: 'c2-tay.p3', competency: 'calc.series', difficulty: 2, level: 'independent', prompt: 'Use $P_3$ for $\\sin x$, which is $x - \\frac{x^3}{6}$, at $x = 0.5$. (Four decimals.)', answer: num(0.5 - 0.125 / 6, 0.00006), compute: () => 0.5 - 0.125 / 6, solution: '$0.5 - 0.0208 = 0.4792$ (true value 0.4794).' }),
    item({ id: 'c2-tay.p4', competency: 'calc.series', difficulty: 2, level: 'independent', prompt: 'The Maclaurin polynomial of degree 2 for $\\dfrac{1}{1 - x}$ is $1 + x + x^2$. Evaluate it at $x = 0.1$.', answer: num(1.11), compute: () => 1 + 0.1 + 0.01, solution: '$1.11$, against the true $1/0.9 = 1.111\\ldots$' }),
    item({ id: 'c2-tay.p5', competency: 'calc.series', difficulty: 2, level: 'independent', prompt: 'Which is the degree-2 Maclaurin polynomial of $\\cos x$?', answer: choice(['$1 - \\dfrac{x^2}{2}$', '$1 + \\dfrac{x^2}{2}$', '$x - \\dfrac{x^3}{6}$', '$1 - x$'], 0), feedback: { 1: '$\\cos\'\'(0) = -\\cos 0 = -1$, so the sign is negative.', 2: 'That is the expansion of $\\sin x$.' }, solution: '$\\cos 0 = 1$, $\\cos\'(0) = 0$, $\\cos\'\'(0) = -1$: $1 - x^2/2$.' }),
    item({ id: 'c2-tay.p6', competency: 'calc.series', difficulty: 3, level: 'transfer', prompt: 'Engineers use $\\sin\\theta \\approx \\theta$ for small angles. For $\\theta = 0.2$ radians, what is the absolute error, to four decimals?', answer: num(0.2 - Math.sin(0.2), 0.00006), compute: () => 0.2 - Math.sin(0.2), solution: '$0.2 - \\sin 0.2 \\approx 0.2 - 0.19867 = 0.0013$ — about $\\theta^3/6$.' }),
    item({ id: 'c2-tay.p7', competency: 'calc.series', difficulty: 3, level: 'transfer', prompt: 'Bound the error of $P_2$ for $e^x$ at $x = 0.3$ using $M = 1.35$ (which exceeds $e^{0.3}$): compute $\\dfrac{M\\,x^3}{3!}$ to four decimals.', answer: num((1.35 * 0.027) / 6, 0.00006), compute: () => (1.35 * 0.3 ** 3) / 6, solution: '$1.35 \\times 0.027 / 6 \\approx 0.0061$. (The actual error is about 0.0049.)' }),
  ],

  checkpoint: [
    item({ id: 'c2-tay.c1', competency: 'calc.series', difficulty: 1, prompt: 'Evaluate $P_1(x) = 1 + x$ (for $e^x$) at $x = 0.1$.', answer: num(1.1), compute: () => 1.1, solution: '$1.1$ (true value 1.10517).', feedbackCorrect: 'Right: the tangent-line approximation.', feedbackIncorrect: 'Substitute $x = 0.1$ into $1 + x$.' }),
    item({ id: 'c2-tay.c2', competency: 'calc.series', difficulty: 2, prompt: 'Evaluate $P_4$ for $e^x$ at $x = 1$: $1 + 1 + \\frac12 + \\frac16 + \\frac1{24}$. (Four decimals.)', answer: num(1 + 1 + 0.5 + 1 / 6 + 1 / 24, 0.00006), compute: () => 1 + 1 + 0.5 + 1 / 6 + 1 / 24, solution: '$2.7083$, against $e \\approx 2.7183$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Add the five terms carefully: $1/6 \\approx 0.1667$, $1/24 \\approx 0.0417$.' }),
    item({ id: 'c2-tay.c3', competency: 'calc.series', difficulty: 3, prompt: 'The Maclaurin polynomials of $\\dfrac{1}{1-x}$ are $1 + x + \\cdots + x^n$. Used at $x = 3$, more terms will…', answer: choice(['converge to −0.5', 'converge slowly', 'diverge: the sum grows without bound', 'oscillate around −0.5'], 2), solution: '$1 + 3 + 9 + 27 + \\cdots$ grows without bound; the series converges only for $|x| < 1$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Write out the first few partial sums at x = 3.' }),
  ],

  python: {
    intro: 'Taylor polynomials of $e^x$ at 0.5 with growing degree, then the diverging partial sums of $\\ln(1 + x)$ at 1.5.',
    code: `import math

def taylor_exp(x, n):
    return sum(x ** k / math.factorial(k) for k in range(n + 1))

for n in [1, 2, 3, 5, 8]:
    approx = taylor_exp(0.5, n)
    print(n, f"{approx:.7f}", f"{abs(math.exp(0.5) - approx):.1e}")

def taylor_log1p(x, n):
    return sum((-1) ** (k + 1) * x ** k / k for k in range(1, n + 1))

print([round(taylor_log1p(1.5, n), 3) for n in [2, 4, 8, 16]])
print(round(math.log(2.5), 3))`,
    output: '1 1.5000000 1.5e-01\n2 1.6250000 2.4e-02\n3 1.6458333 2.9e-03\n5 1.6486979 2.3e-05\n8 1.6487213 5.7e-09\n[0.375, 0.234, -0.908, -23.093]\n0.916',
    explain: 'For $e^x$ each extra degree multiplies the accuracy; for $\\ln(1 + x)$ outside its interval of convergence, more terms run away from the true 0.916.',
  },

  reading: [
    { title: 'Taylor and Maclaurin Series (§6.3)', source: 'OpenStax, Calculus Volume 2', url: 'https://openstax.org/books/calculus-volume-2/pages/6-3-taylor-and-maclaurin-series', note: 'Taylor’s theorem with remainder, and convergence.' },
  ],
};
