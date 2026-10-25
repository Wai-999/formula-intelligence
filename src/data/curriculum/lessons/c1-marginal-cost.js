import { item, num, choice } from '../lessonKit.js';

// V4 exemplar 2: derivative → marginal cost. The bakery's cost function is
// an illustrative quadratic, not fitted to real data.

const C = (q) => 200 + 1.5 * q + 0.002 * q * q;
const dC = (q) => 1.5 + 0.004 * q;

export default {
  intuition: {
    question: 'A bakery’s daily cost of making $q$ loaves is $C(q) = 200 + 1.5q + 0.002q^2$ dollars: rent and staff, flour and yeast, and overtime and oven time that grow faster as output rises. It bakes 300 loaves a day. What does the 301st loaf cost — and could you estimate that from noisy cost records alone?',
    body: [
      'The extra cost of one more loaf is $C(301) - C(300)$. Here $C(300) = 200 + 450 + 180 = 830$ and $C(301) = 832.702$, so the 301st loaf costs about \\$2.70.',
      'That rate has a name: the **marginal cost**, $C\'(q)$. For this bakery $C\'(q) = 1.5 + 0.004q$, so $C\'(300) = \\$2.70$ — the derivative gives the cost of the next loaf without computing $C$ twice, and shows how it changes as you grow: at 500 loaves it is \\$3.50.',
      'Real cost records are noisy. Estimating a derivative from them with a tiny step amplifies the noise; the lab shows why the step size matters.',
    ],
  },

  glossary: [
    { term: '$C(q)$', meaning: 'Total cost, in dollars, of producing $q$ units in a day.' },
    { term: "$C'(q)$", meaning: '**Marginal cost**: the rate at which cost grows per extra unit, at output $q$ (dollars per unit).' },
    { term: '$\\dfrac{C(q + h) - C(q)}{h}$', meaning: '**Difference quotient**: average cost per unit of the next $h$ units. With $h = 1$, the exact cost of the next unit.' },
    { term: '$C(q)/q$', meaning: '**Average cost** per unit — a different quantity from marginal cost.' },
  ],

  priorCheck: [
    item({
      id: 'c1-mc.pre1', competency: 'calc.derivative', difficulty: 1,
      prompt: "For $f(x) = x^2$, what is $f'(3)$?",
      answer: num(6), compute: () => 2 * 3, solution: "$f'(x) = 2x$, so $f'(3) = 6$.",
    }),
    item({
      id: 'c1-mc.pre2', competency: 'alg.slope', difficulty: 1,
      prompt: 'A line passes through $(2, 10)$ and $(6, 22)$. What is its slope?',
      answer: num(3), compute: () => (22 - 10) / (6 - 2), solution: '$(22 - 10)/(6 - 2) = 12/4 = 3$.',
    }),
  ],

  visualization: {
    lab: 'marginal-cost',
    intro: 'Move the output and compare the tangent (the derivative) with estimates from two cost records. Then make one record \\$1 too high and try a tiny step.',
    textAlternative: 'The lab plots total cost against output with the tangent line at the chosen output, whose slope is the marginal cost. A sentence gives the marginal cost, the difference-quotient estimate for the chosen step and its error; the table lists the estimate for steps from 0.01 to 50, from exact records and from records with one value \\$1 too high.',
  },

  derivation: {
    intro: 'Why is $C\'(q)$ almost the cost of one more unit, and how close is “almost”?',
    steps: [
      { say: 'The cost per unit of the next $h$ units is a difference quotient; for $h = 1$ it is exactly the cost of the next unit:', math: '\\frac{C(q + h) - C(q)}{h}' },
      { say: 'For a quadratic cost $C(q) = F + aq + bq^2$, expand $C(q + h)$ and simplify:', math: '\\frac{C(q+h) - C(q)}{h} = \\frac{ah + 2bqh + bh^2}{h} = a + 2bq + bh' },
      { say: 'As $h \\to 0$ the last term vanishes, leaving the derivative:', math: "C'(q) = a + 2bq" },
      { say: 'So the next unit ($h = 1$) costs exactly $C\'(q) + b$. With $b = 0.002$ the derivative is off by a fifth of a cent. For any smooth cost, the gap depends on how fast marginal cost itself changes — the curvature, $C\'\'(q)$.' },
    ],
    assumptions: [
      'Cost is a smooth function of output (quantities treated as continuous).',
      'The cost function is known; in practice it is estimated from past records.',
    ],
    domain: [
      '$q \\ge 0$, and only over the range of output the cost data covered.',
      'Marginal cost is per unit of $q$: per loaf, not per batch.',
    ],
  },

  examples: [
    {
      title: 'Marginal cost at two outputs',
      problem: "For $C(q) = 200 + 1.5q + 0.002q^2$, find $C'(300)$ and $C'(500)$.",
      steps: ["$C'(q) = 1.5 + 0.004q$.", "$C'(300) = 1.5 + 1.2 = 2.70$ dollars per loaf.", "$C'(500) = 1.5 + 2.0 = 3.50$: each extra loaf gets dearer as output grows."],
      answer: "$C'(300) = \\$2.70$, $C'(500) = \\$3.50$",
      check: { value: 3.5, compute: () => dC(500), tolerance: 1e-9 },
    },
    {
      title: 'Marginal versus average',
      problem: 'At $q = 300$, compare the marginal cost with the average cost $C(q)/q$.',
      steps: ['$C(300) = 830$, so average cost is $830/300 \\approx 2.77$ dollars per loaf.', "Marginal cost $C'(300) = 2.70$ is lower than the average.", 'So one more loaf pulls the average down slightly: at 300 loaves, average cost is still falling.'],
      answer: 'average ≈ \\$2.77, above the marginal \\$2.70',
      check: { value: 830 / 300, compute: () => C(300) / 300 },
    },
  ],

  counterexample: {
    title: 'When the next unit is not a small change',
    body: [
      'A courier pays \\$400 a day per van, and a van carries up to 50 parcels. Going from 50 to 51 parcels needs a second van, so that parcel costs \\$400 more. Cost jumps at 50; there is no derivative there, and no smooth curve fitted through the data will show the jump.',
      'Derivatives describe smooth change. Steps — a new van, a second shift, a bigger oven — are decisions to cost separately.',
    ],
  },

  predict: {
    prompt: "You estimate $C'(300)$ from cost records, and one record is \\$1 too high. Which step $h$ between the records gives the more trustworthy estimate?",
    choices: ['$h = 0.01$ loaves — smaller is always better', '$h = 20$ loaves', 'Both are equally good', 'Neither: a derivative cannot be estimated from data'],
    answer: 1,
    reveal: 'The estimate divides the difference of two records by $h$. With $h = 0.01$ the \\$1 error becomes \\$100 per loaf; with $h = 20$ it becomes \\$0.05. The larger step adds a small bias ($bh = 0.04$ here) but removes most of the noise.',
    misconception: {
      belief: 'A smaller step always gives a better derivative estimate.',
      correction: 'With an exact formula, yes. With measured data the error is divided by $h$, so past some point smaller steps make the estimate worse.',
    },
  },

  practice: [
    item({ id: 'c1-mc.p1', competency: 'calc.derivative', difficulty: 1, level: 'scaffolded', prompt: 'For $C(q) = 100 + 4q$, what is the marginal cost? (The cost of each extra unit is the slope.)', answer: num(4), compute: () => 4, hints: ['A linear cost has the same slope everywhere.'], solution: "$C'(q) = 4$ dollars per unit, at every output." }),
    item({ id: 'c1-mc.p2', competency: 'calc.derivative', difficulty: 1, level: 'scaffolded', prompt: "For $C(q) = 50 + 2q + 0.01q^2$, $C'(q) = 2 + 0.02q$. Find $C'(100)$.", answer: num(4), compute: () => 2 + 0.02 * 100, hints: ['Substitute $q = 100$.'], solution: "$2 + 2 = 4$ dollars per unit." }),
    item({ id: 'c1-mc.p3', competency: 'calc.derivative', difficulty: 2, level: 'independent', prompt: 'For $C(q) = 500 + 3q + 0.005q^2$, find the marginal cost at $q = 200$.', answer: num(5), compute: () => 3 + 2 * 0.005 * 200, hints: ["$C'(q) = 3 + 0.01q$."], solution: "$C'(200) = 3 + 2 = \\$5$ per unit." }),
    item({ id: 'c1-mc.p4', competency: 'calc.derivative', difficulty: 2, level: 'independent', prompt: 'For the same $C(q) = 500 + 3q + 0.005q^2$, compute the exact cost of the 201st unit, $C(201) - C(200)$.', answer: num(5.005, 1e-6), compute: () => (500 + 3 * 201 + 0.005 * 201 ** 2) - (500 + 3 * 200 + 0.005 * 200 ** 2), hints: ['It is $C\'(200) + b$ with $b = 0.005$.'], solution: '$3 + 0.005 \\cdot (2 \\cdot 200 + 1) = 5.005$ — half a cent more than the derivative.' }),
    item({
      id: 'c1-mc.p5', competency: 'calc.derivative', difficulty: 3, level: 'transfer',
      prompt: 'A cloud service bills $C(g) = 20 + 0.08g + 0.00001g^2$ dollars a month for $g$ gigabytes of storage. A customer has 2,000 GB. What does one more gigabyte add to the bill, per GB, at that size?',
      answer: num(0.12, 1e-6), compute: () => 0.08 + 2 * 0.00001 * 2000, hints: ["Differentiate: $C'(g) = 0.08 + 0.00002g$."], solution: "$C'(2000) = 0.08 + 0.04 = \\$0.12$ per GB.",
    }),
  ],

  apply: {
    scenario: 'You run the bakery, making 300 loaves a day with $C(q) = 200 + 1.5q + 0.002q^2$. A café offers to buy 50 extra loaves a day at \\$3.20 each.',
    steps: [
      'Estimate the extra cost of 50 loaves from the marginal cost at 300.',
      'Compute the exact extra cost and compare.',
      'Decide whether to accept, and say what the model leaves out.',
    ],
    items: [
      item({ id: 'c1-mc.u1', competency: 'calc.derivative', difficulty: 3, prompt: "Estimate the extra daily cost of 50 more loaves as $50 \\cdot C'(300)$.", answer: num(135), compute: () => 50 * dC(300), hints: ["$C'(300) = 2.70$."], solution: '$50 \\cdot 2.70 = \\$135$.' }),
      item({ id: 'c1-mc.u2', competency: 'calc.derivative', difficulty: 3, prompt: 'Now the exact extra cost, $C(350) - C(300)$.', answer: num(140, 1e-6), compute: () => C(350) - C(300), hints: ['$C(350) = 200 + 525 + 245$.'], solution: '$C(350) = 970$, so $970 - 830 = \\$140$. The estimate was \\$5 low because marginal cost rises from \\$2.70 to \\$2.90 across those 50 loaves.' }),
      item({ id: 'c1-mc.u3', competency: 'calc.derivative', difficulty: 3, prompt: 'The café pays $50 \\times \\$3.20 = \\$160$ a day. By how much does daily profit change if you accept?', answer: num(20, 1e-6), compute: () => 160 - (C(350) - C(300)), hints: ['Extra revenue minus exact extra cost.'], solution: '$160 - 140 = +\\$20$ a day.' }),
    ],
    limits: [
      'The cost curve was fitted to past output; well beyond that range (say 600 loaves) it is a guess.',
      'Capacity steps — another oven, another shift — are not in a smooth curve.',
      'Selling cheaper to one customer can change what others expect to pay.',
    ],
  },

  checkpoint: [
    item({ id: 'c1-mc.c1', competency: 'calc.derivative', difficulty: 1, prompt: "For $C(q) = 80 + 6q + 0.02q^2$, find $C'(50)$.", answer: num(8), compute: () => 6 + 2 * 0.02 * 50, solution: "$C'(q) = 6 + 0.04q$, so $C'(50) = 8$.", feedbackCorrect: 'Right.', feedbackIncorrect: "Differentiate term by term: the $0.02q^2$ term gives $0.04q$." }),
    item({ id: 'c1-mc.c2', competency: 'calc.derivative', difficulty: 2, prompt: 'For the same $C$, at what output does marginal cost reach \\$10 per unit?', answer: num(100), compute: () => (10 - 6) / 0.04, solution: '$6 + 0.04q = 10$, so $q = 100$.', feedbackCorrect: 'Right.', feedbackIncorrect: "Set $C'(q) = 10$ and solve the linear equation." }),
    item({
      id: 'c1-mc.c3', competency: 'calc.derivative', difficulty: 3,
      prompt: 'A printer’s cost jumps by \\$2,000 whenever output passes a multiple of 10,000 copies (a new press shift). Why is the derivative of a smooth curve fitted to its costs a poor guide to the cost of copy 10,001?',
      answer: choice([
        'The jump is a step: there is no derivative there, and the smooth fit averages it away',
        'Derivatives only work for quadratic cost functions',
        'Copy 10,001 is free because the press is already running',
        'The derivative is exact for any cost function',
      ], 0),
      feedback: { 1: 'Any smooth function has a derivative; the problem is the step.', 2: 'It costs a new shift — about \\$2,000.', 3: 'Even for smooth costs the next unit differs slightly; here it is far off.' },
      solution: 'Marginal cost describes smooth change. At a step the next copy costs about \\$2,000 more, which a fitted curve spreads across all copies.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Ask what happens to cost exactly at 10,000 copies.',
    }),
  ],

  python: {
    intro: 'The exact marginal cost against difference-quotient estimates — first from exact records, then with one record \\$1 too high.',
    code: `def C(q):
    return 200 + 1.5 * q + 0.002 * q**2

def dC(q):
    return 1.5 + 0.004 * q

q = 300
print("exact:", round(dC(q), 4))
for h in [10, 1, 0.01]:
    est = (C(q + h) - C(q)) / h
    print("h =", h, "estimate", round(est, 4))

error = 1.0  # one cost record $1 too high
for h in [20, 0.01]:
    est = (C(q + h) + error - C(q)) / h
    print("h =", h, "noisy estimate", round(est, 2))`,
    output: 'exact: 2.7\nh = 10 estimate 2.72\nh = 1 estimate 2.702\nh = 0.01 estimate 2.7\nh = 20 noisy estimate 2.79\nh = 0.01 noisy estimate 102.7',
    explain: 'With exact records the estimate approaches 2.7 as $h$ shrinks (the bias is $bh$). With one bad record, $h = 0.01$ turns a \\$1 error into a \\$100 error, while $h = 20$ is off by only 9 cents. The exact rule ($C\'(q) = a + 2bq$) is what the derivative buys you.',
  },

  reading: [
    { title: '3.4 Derivatives as Rates of Change — “Changes in Cost and Revenue”', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change', note: 'Marginal cost, revenue and profit defined as derivatives.' },
  ],
};
