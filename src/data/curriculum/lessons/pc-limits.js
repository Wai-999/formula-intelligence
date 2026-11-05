import { item, num, choice } from '../lessonKit.js';

// V5 vertical slice, step 2 of 3 (Algebra II → Precalculus → Calculus I).
// Limits from the numerical, graphical and algebraic views, with one-sided
// limits and continuity — what the derivative's definition needs. Prices are
// illustrative.

export default {
  intuition: {
    question: 'A courier charges \\$5 for parcels up to 2 kg and \\$9 above. A 1.999 kg parcel costs \\$5; a 2.001 kg parcel costs \\$9. What does the price approach as the weight approaches 2 kg — and why does calculus care?',
    body: [
      'A **limit** describes what $f(x)$ gets close to as $x$ gets close to a number $a$, without ever using $f(a)$ itself. Approaching 2 kg from below, the price is always \\$5; from above, always \\$9.',
      'The two **one-sided limits** disagree: $\\lim_{w \\to 2^-} p(w) = 5$ but $\\lim_{w \\to 2^+} p(w) = 9$. So the two-sided limit $\\lim_{w \\to 2} p(w)$ does not exist — the price jumps.',
      'Compare $f(x) = \\dfrac{x^2 - 4}{x - 2}$. It is undefined at $x = 2$, yet $f(1.999) = 3.999$ and $f(2.001) = 4.001$: both sides close in on 4, so the limit is 4. The derivative is exactly this kind of limit — a slope you approach but can never compute directly at a step of zero.',
    ],
  },

  glossary: [
    { term: '$\\lim_{x \\to a} f(x) = L$', meaning: 'As $x$ gets close to $a$ from both sides ($x \\ne a$), $f(x)$ gets as close to $L$ as you like.' },
    { term: '$x \\to a^-$, $x \\to a^+$', meaning: 'Approaching $a$ from the left (smaller values) or from the right (larger values): **one-sided limits**.' },
    { term: '**continuous** at $a$', meaning: '$f(a)$ is defined and equals $\\lim_{x \\to a} f(x)$: no hole, jump or blow-up there.' },
    { term: '**removable discontinuity**', meaning: 'A hole: the limit exists, but $f(a)$ is missing or different from it.' },
  ],

  priorCheck: [
    item({
      id: 'pc-lim.pre1', competency: 'func.notation', difficulty: 1,
      prompt: 'For $f(x) = x + 2$, what is $f(1.99)$?',
      answer: num(3.99), compute: () => 1.99 + 2, solution: '$1.99 + 2 = 3.99$.',
    }),
    item({
      id: 'pc-lim.pre2', competency: 'alg.quadratics', difficulty: 1,
      prompt: 'Complete the factorization $x^2 - 9 = (x - 3)(x + k)$. What is $k$?',
      answer: num(3), compute: () => 3, solution: 'A difference of squares: $x^2 - 9 = (x - 3)(x + 3)$, so $k = 3$.',
    }),
  ],

  visualization: {
    lab: 'limits',
    intro: 'Choose a function and shrink the distance $h$ to the point. Do the readings from the left and from the right settle on the same number?',
    textAlternative: 'The lab plots the chosen function near the point $a$, with a reading at distance $h$ on each side: a circle on the left, a square on the right. A sentence gives both readings and, once $h$ is small, what they approach. The table lists $f(a - h)$ and $f(a + h)$ for $h$ from 1 down to 0.001.',
  },

  derivation: {
    intro: 'Why is $\\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2} = 4$ when the formula breaks at 2?',
    steps: [
      { say: 'A limit never uses $x = 2$ itself, only values of $x$ near 2. For those, factor the numerator:', math: '\\frac{x^2 - 4}{x - 2} = \\frac{(x - 2)(x + 2)}{x - 2}' },
      { say: 'Because $x \\ne 2$, the factor $x - 2$ is not zero, so it cancels:', math: '\\frac{x^2 - 4}{x - 2} = x + 2 \\qquad (x \\ne 2)' },
      { say: 'Near 2, $x + 2$ is near 4 — from either side:', math: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x + 2) = 4' },
      { say: 'In general, a two-sided limit exists exactly when both one-sided limits exist and agree:', math: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = L = \\lim_{x \\to a^+} f(x)' },
    ],
    assumptions: [
      '$f$ is defined at every point near $a$ on both sides; it need not be defined at $a$.',
    ],
    domain: [
      'Cancelling $x - 2$ is valid only because $x \\ne 2$ inside the limit. The original and simplified formulas differ at exactly one point, $x = 2$.',
      'If the values grow without bound, as $1/x^2$ does near 0, the limit does not exist as a number; writing $\\infty$ says how it fails.',
    ],
  },

  examples: [
    {
      title: 'A hole you can fill',
      problem: 'Find $\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3}$.',
      steps: ['Factor: $x^2 - 9 = (x - 3)(x + 3)$.', 'For $x \\ne 3$ the quotient equals $x + 3$.', 'As $x \\to 3$, $x + 3 \\to 6$. A table agrees: $f(2.999) = 5.999$ and $f(3.001) = 6.001$.'],
      answer: '6',
      check: { value: 6, compute: () => { const f = (x) => (x * x - 9) / (x - 3); return (f(3 - 1e-6) + f(3 + 1e-6)) / 2; }, tolerance: 1e-5 },
    },
    {
      title: 'One-sided limits at a corner',
      problem: 'A phone plan costs $c(m) = 20$ dollars for up to 5 GB of data and $c(m) = 20 + 10(m - 5)$ above 5 GB. Find both one-sided limits at $m = 5$. Is the cost continuous there?',
      steps: ['From the left, $c(m) = 20$ for every $m < 5$, so the left limit is 20.', 'From the right, $20 + 10(m - 5) \\to 20 + 0 = 20$.', 'Both are 20 and $c(5) = 20$, so $c$ is continuous at 5: the graph bends, but it does not jump.'],
      answer: 'both one-sided limits are \\$20; continuous',
      check: { value: 20, compute: () => 20 + 10 * (5.000001 - 5), tolerance: 1e-4 },
    },
  ],

  counterexample: {
    title: 'Substituting is not the definition',
    body: [
      'For $f(x) = x + 2$ you can find the limit at 2 by substituting: 4. That works because $f$ is continuous — and only then. For the courier price, substituting $w = 2$ gives \\$5, yet the limit does not exist.',
      'For $\\dfrac{x^2 - 4}{x - 2}$, substituting gives $0/0$. That does not mean “no limit” — it is a signal to simplify first.',
    ],
  },

  predict: {
    prompt: 'For $f(x) = \\dfrac{\\sin x}{x}$ ($x$ in radians), a calculator gives an error at $x = 0$. What happens to $f(x)$ as $x$ approaches 0 from either side?',
    choices: ['It approaches 0', 'It approaches 1', 'It grows without bound', 'It has no pattern, because $\\sin 0 = 0$'],
    answer: 1,
    reveal: '$f(0.1) \\approx 0.99833$, and $f(-0.1)$ is the same because sine and $x$ both change sign. At $x = 0.001$ it is $0.9999998$. The limit is 1 — the fact behind the derivative of $\\sin x$.',
    misconception: {
      belief: '$0/0$ means the limit is 0, or that there is no limit.',
      correction: '$0/0$ only says this formula cannot be evaluated at that point. The limit depends on how fast the top and bottom shrink together — here at the same rate, which gives 1.',
    },
  },

  practice: [
    item({ id: 'pc-lim.p1', competency: 'calc.limits', difficulty: 1, level: 'scaffolded', prompt: 'For $x \\ne 4$, $\\dfrac{x^2 - 16}{x - 4} = x + 4$. What is $\\lim_{x \\to 4} \\dfrac{x^2 - 16}{x - 4}$?', answer: num(8), compute: () => 4 + 4, hints: ['Let $x$ approach 4 in the simplified form $x + 4$.'], solution: '$x + 4 \\to 8$.' }),
    item({ id: 'pc-lim.p2', competency: 'calc.limits', difficulty: 1, level: 'scaffolded', prompt: 'A garage charges \\$3 for parking up to 1 hour and \\$7 for anything longer. What does the charge approach as the time approaches 1 hour **from the right**?', answer: num(7), compute: () => 7, hints: ['From the right means times just over 1 hour.'], solution: 'Every time just over an hour costs \\$7, so the right-hand limit is 7. (From the left it is 3, so the two-sided limit does not exist.)' }),
    item({ id: 'pc-lim.p3', competency: 'calc.limits', difficulty: 2, level: 'independent', prompt: 'Find $\\lim_{x \\to -1} \\dfrac{x^2 + 3x + 2}{x + 1}$.', answer: num(1), compute: () => -1 + 2, hints: ['Factor the top: $(x + 1)(x + 2)$.'], solution: 'For $x \\ne -1$ the quotient is $x + 2$, which approaches $1$.' }),
    item({ id: 'pc-lim.p4', competency: 'calc.limits', difficulty: 2, level: 'independent', prompt: 'Find $\\lim_{x \\to 5} \\dfrac{x^2 - 25}{x - 5}$.', answer: num(10), compute: () => 5 + 5, hints: ['A difference of squares again.'], solution: '$\\dfrac{(x - 5)(x + 5)}{x - 5} = x + 5 \\to 10$.' }),
    item({
      id: 'pc-lim.p5', competency: 'calc.limits', difficulty: 2, level: 'independent',
      prompt: 'For $f(x) = \\dfrac{|x|}{x}$, what is $\\lim_{x \\to 0} f(x)$?',
      answer: choice(['1', '−1', '0', 'It does not exist: the left limit is −1 and the right limit is 1'], 3),
      feedback: { 0: 'That is only the limit from the right.', 1: 'That is only the limit from the left.', 2: '$f(x)$ is never 0: it is $1$ for $x > 0$ and $-1$ for $x < 0$.' },
      hints: ['Try $x = 0.1$ and $x = -0.1$.'],
      solution: 'For $x > 0$, $|x|/x = 1$; for $x < 0$, it is $-1$. The one-sided limits differ, so there is no limit.',
    }),
    item({
      id: 'pc-lim.p6', competency: 'calc.limits', difficulty: 3, level: 'transfer',
      prompt: 'A ball’s height is $s(t) = 20t - 5t^2$ metres after $t$ seconds. Its average velocity from $t = 1$ to $t = 1 + h$ simplifies to $\\dfrac{s(1 + h) - s(1)}{h} = 10 - 5h$ m/s. What does it approach as $h \\to 0$?',
      answer: num(10), compute: () => 20 - 10 * 1, hints: ['Let $h$ shrink in $10 - 5h$.'],
      solution: '$10 - 5h \\to 10$ m/s: the ball’s velocity at $t = 1$. That limit is the derivative $s\'(1)$.',
    }),
  ],

  apply: {
    scenario: 'You advise a small online shop choosing a courier. Courier A charges $p_A(w) = 5$ dollars for $w \\le 2$ kg and \\$9 above. Courier B charges $p_B(w) = 3 + 2w$ for $w \\le 2$ and $7 + 0.5(w - 2)$ above 2 kg. The shop’s scale can be off by 50 g either way.',
    steps: [
      'Find the one-sided limits of each price at 2 kg.',
      'Decide which price jumps, and by how much.',
      'Advise the shop about parcels that weigh “about 2 kg”.',
    ],
    items: [
      item({ id: 'pc-lim.u1', competency: 'calc.limits', difficulty: 2, prompt: 'For courier B, what does the price approach as $w \\to 2^-$ (from below)?', answer: num(7), compute: () => 3 + 2 * 2, hints: ['Use the piece for $w \\le 2$.'], solution: '$3 + 2 \\cdot 2 = 7$.' }),
      item({ id: 'pc-lim.u2', competency: 'calc.limits', difficulty: 2, prompt: 'For courier B, what does the price approach as $w \\to 2^+$ (from above)?', answer: num(7), compute: () => { const pB = (w) => 7 + 0.5 * (w - 2); return pB(2 + 1e-12); }, hints: ['Use the piece for $w > 2$, and let $w - 2$ shrink to 0.'], solution: '$7 + 0.5 \\cdot 0 = 7$: both sides agree, so B’s price is continuous at 2 kg.' }),
      item({
        id: 'pc-lim.u3', competency: 'calc.limits', difficulty: 3,
        prompt: 'A parcel reads exactly 2 kg on the shop’s scale. For which courier can the 50 g scale error change the price by \\$4?',
        answer: choice(['Courier A: its price jumps at 2 kg', 'Courier B', 'Both couriers', 'Neither: 50 g is too small to matter'], 0),
        feedback: { 1: 'B’s one-sided limits are both \\$7: a 50 g error moves its price by at most about 10 cents.', 2: 'Only A jumps; B is continuous at 2 kg.', 3: 'At a jump, any error that crosses the threshold changes the price by the full jump.' },
        solution: 'A’s one-sided limits are \\$5 and \\$9, a \\$4 jump, so 50 g either way can flip the price. For B the price runs from \\$6.90 at 1.95 kg to about \\$7.03 at 2.05 kg.',
      }),
    ],
    limits: [
      'Real rate cards are steps everywhere (often every half kilogram); the same caution applies near each step.',
      'The scale error is modelled as at most 50 g; real scales also drift and need calibration.',
      'A limit says what prices approach — not which price a courier’s software charges at exactly 2 kg.',
    ],
  },

  checkpoint: [
    item({ id: 'pc-lim.c1', competency: 'calc.limits', difficulty: 1, prompt: 'Find $\\lim_{x \\to 6} \\dfrac{x^2 - 36}{x - 6}$.', answer: num(12), compute: () => 6 + 6, solution: '$\\dfrac{(x - 6)(x + 6)}{x - 6} = x + 6 \\to 12$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Factor the top as $(x - 6)(x + 6)$, cancel, then let $x \\to 6$.' }),
    item({
      id: 'pc-lim.c2', competency: 'calc.limits', difficulty: 2,
      prompt: 'A function has $\\lim_{x \\to 1^-} f(x) = 3$, $\\lim_{x \\to 1^+} f(x) = 3$ and $f(1) = 5$. Which statement is true?',
      answer: choice(['$\\lim_{x \\to 1} f(x) = 3$, but $f$ is not continuous at 1', '$\\lim_{x \\to 1} f(x) = 5$', 'The limit does not exist, because $f(1) \\ne 3$', '$f$ is continuous at 1'], 0),
      feedback: { 1: 'A limit ignores the value at the point itself.', 2: 'The limit exists: both sides agree on 3.', 3: 'Continuity needs $f(1)$ to equal the limit, 3.' },
      solution: 'Both sides approach 3, so the limit is 3. Since $f(1) = 5 \\ne 3$, there is a removable discontinuity at 1.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Keep the limit (what both sides approach) separate from the value at the point.',
    }),
    item({
      id: 'pc-lim.c3', competency: 'calc.limits', difficulty: 3,
      prompt: 'A sensor reports $g(-0.01) = 2.98$, $g(-0.001) = 2.998$, $g(0.001) = 3.002$ and $g(0.01) = 3.02$; the reading at $t = 0$ is missing. Estimate $\\lim_{t \\to 0} g(t)$.',
      answer: num(3, 0.01), compute: () => (2.998 + 3.002) / 2,
      solution: 'From both sides the readings close in on 3 (each step ten times closer to 0 is ten times closer to 3). A table suggests the limit; it cannot prove it.',
      feedbackCorrect: 'Right — and the missing value at 0 does not matter.', feedbackIncorrect: 'Look at both sides: as $t$ gets closer to 0, which number do the readings close in on?',
    }),
    item({
      id: 'pc-lim.c4', competency: 'calc.limits', difficulty: 2,
      prompt: 'A tank’s water level is $L(t) = 2t^2 + 1$ metres after $t$ minutes. Its average rate of rise from $t = 3$ to $t = 3 + h$ simplifies to $12 + 2h$ m/min. What rate does it approach as $h \\to 0$?',
      answer: num(12), compute: () => { const L = (t) => 2 * t * t + 1; return (L(3 + 1e-3) - L(3 - 1e-3)) / 2e-3; },
      solution: '$12 + 2h \\to 12$ m/min — the instantaneous rate, $L\'(3)$.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Let $h$ shrink to 0 in the simplified expression $12 + 2h$.',
    }),
  ],

  python: {
    intro: 'Readings on both sides of the hole and of the courier’s jump.',
    code: `def f(x):
    return (x**2 - 4) / (x - 2)

def courier(w):
    return 5 if w <= 2 else 9

for h in [0.1, 0.01, 0.001]:
    print(h, round(f(2 - h), 4), round(f(2 + h), 4))

print("courier:", courier(2 - 0.001), courier(2 + 0.001))`,
    output: '0.1 3.9 4.1\n0.01 3.99 4.01\n0.001 3.999 4.001\ncourier: 5 9',
    explain: 'Both sides of the hole close in on 4, so the limit is 4 — although `f(2)` itself raises a ZeroDivisionError. The courier price is 5 just below 2 kg and 9 just above, however small the step: the one-sided limits disagree, so there is no limit.',
  },

  reading: [
    { title: '2.2 The Limit of a Function', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function', note: 'Limits from tables and graphs, one-sided limits and infinite limits.' },
    { title: '2.4 Continuity', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/2-4-continuity', note: 'Removable, jump and infinite discontinuities.' },
  ],
};
