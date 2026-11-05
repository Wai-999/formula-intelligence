import { item, num, choice } from '../lessonKit.js';

// V5 Phase 2B (Algebra II → Precalculus → Calculus I): exponential growth
// and the logarithm that undoes it. Ohlone MATH-100 lists exponential and
// logarithmic functions; MATH-101A differentiates them. Rates and visitor
// numbers are illustrative.

const ln = Math.log;
const monthly = 1.6 ** (1 / 6); // 2000 → 3200 visitors in 6 months

export default {
  intuition: {
    question: 'A savings account pays 6% a year, added once a year. How long until \\$1,000 becomes \\$2,000? “About 17 years” (100 ÷ 6) is the answer for simple interest — but the interest itself earns interest. The exact answer needs the operation that undoes an exponent: the logarithm.',
    body: [
      'Exponential growth multiplies by the same **factor** every period. At 6% the factor is 1.06, so after $t$ years the balance is $A(t) = 1000 \\cdot 1.06^{t}$.',
      'To find when it doubles we must solve $1.06^{t} = 2$ for the exponent. The **logarithm** does exactly that: $t = \\log_{1.06} 2 = \\dfrac{\\ln 2}{\\ln 1.06} \\approx 11.9$ years — five years sooner than simple interest.',
      'Logarithms turn multiplication into addition: $\\log(xy) = \\log x + \\log y$. That is why constant-rate growth is a straight line on a logarithmic axis, and why the exponential function $e^x$ is the one function equal to its own derivative — a fact Calculus I builds on.',
    ],
  },

  glossary: [
    { term: '$b^{t}$', meaning: 'An **exponential**: the factor $b$ multiplied $t$ times. Growth when $b > 1$, decay when $0 < b < 1$.' },
    { term: '$\\log_b y$', meaning: 'The **logarithm** base $b$ of $y$: the exponent $x$ with $b^x = y$. So $\\log_2 8 = 3$.' },
    { term: '$\\ln y$', meaning: 'The **natural logarithm**, base $e \\approx 2.718$. Calculators and code (`math.log`) use it by default.' },
    { term: '**doubling time**', meaning: 'How many periods it takes to double: $\\ln 2 / \\ln(1 + r)$ at a growth rate $r$ per period.' },
  ],

  priorCheck: [
    item({
      id: 'a2-log.pre1', competency: 'arith.exponents', difficulty: 1,
      prompt: 'What is $2^5$?',
      answer: num(32), compute: () => 2 ** 5, solution: '$2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 = 32$.',
    }),
    item({
      id: 'a2-log.pre2', competency: 'func.compose-inverse', difficulty: 1,
      prompt: 'For $f(x) = 3x$, what is $f^{-1}(12)$?',
      answer: num(4), compute: () => 12 / 3, solution: 'The inverse divides by 3: $12 / 3 = 4$. A logarithm is the inverse of an exponential in the same sense.', remedy: 'a2-composition',
    }),
  ],

  visualization: {
    lab: 'log-scale',
    intro: 'Watch growth on a linear axis, then switch the axis to logarithmic. Change the rate and compare the exact doubling time with the rule of 70.',
    textAlternative: 'The lab plots constant-rate growth with a dashed line at each doubling. On a linear axis the curve bends upward; on a logarithmic axis it is a straight line whose slope is log₁₀ of the growth factor. At 6% a year the amount doubles every 11.90 years (rule of 70: 11.67). The table lists the amount and its logarithm for each period; the logarithm rises by the same step every time.',
  },

  derivation: {
    intro: 'Where do the logarithm laws come from, and why do they solve for an unknown exponent?',
    steps: [
      { say: 'Definition: $\\log_b y = x$ means $b^x = y$, for $b > 0$, $b \\ne 1$ and $y > 0$. A logarithm is an exponent.' },
      { say: 'Product law: if $M = b^m$ and $N = b^n$, then $MN = b^{m+n}$. Taking logarithms gives back the exponents:', math: '\\log_b(MN) = m + n = \\log_b M + \\log_b N' },
      { say: 'Power law: $M^k = (b^m)^k = b^{km}$, so $\\log_b(M^k) = k \\log_b M$. This brings an unknown exponent down to where algebra can reach it:', math: 'b^{t} = y \\;\\Longrightarrow\\; t \\ln b = \\ln y \\;\\Longrightarrow\\; t = \\frac{\\ln y}{\\ln b}' },
      { say: 'Doubling at rate $r$: $(1 + r)^t = 2$ gives $t = \\ln 2 / \\ln(1 + r)$. For small $r$, $\\ln(1 + r) \\approx r$, so $t \\approx 0.693/r$ — the “rule of 70”: 70 divided by the percentage rate.' },
    ],
    assumptions: [
      'Growth by a constant factor each period (a constant rate, compounded once per period).',
    ],
    domain: [
      '$\\log_b y$ exists only for $y > 0$ (and $b > 0$, $b \\ne 1$): no power of a positive base is zero or negative.',
      'The rule of 70 is an approximation. At 70% growth it says 1 period; the exact doubling time is about 1.31.',
    ],
  },

  examples: [
    {
      title: 'Doubling time at 6%',
      problem: 'Solve $1000 \\cdot 1.06^{t} = 2000$.',
      steps: ['Divide by 1000: $1.06^{t} = 2$.', 'Take logarithms: $t \\ln 1.06 = \\ln 2$.', '$t = \\ln 2 / \\ln 1.06 \\approx 0.6931 / 0.0583 \\approx 11.90$ years.'],
      answer: 'about 11.9 years',
      check: { value: 11.8957, compute: () => ln(2) / ln(1.06), tolerance: 1e-4 },
    },
    {
      title: 'Solving for time in fast growth',
      problem: 'A bacteria culture of 500 cells triples every hour. When does it reach 1,000,000 cells?',
      steps: ['$500 \\cdot 3^{t} = 1{,}000{,}000$, so $3^{t} = 2000$.', '$t = \\ln 2000 / \\ln 3 \\approx 7.601 / 1.099$.', 'About 6.92 hours.'],
      answer: 'about 6.92 hours',
      check: { value: 6.9186, compute: () => ln(2000) / ln(3), tolerance: 1e-4 },
    },
  ],

  counterexample: {
    title: 'Linear thinking about compound growth',
    body: [
      'Simple interest adds \\$60 a year to \\$1,000, so it takes $100 / 6 \\approx 16.7$ years to double. Compound interest adds 6% of a growing balance: it doubles in 11.9 years, and after 17 years it is \\$2,692.77, not \\$2,020.',
      'The same mistake underestimates anything that grows by a percentage — debt, viral spread, a user base — and overestimates how long you have to react.',
    ],
  },

  predict: {
    prompt: 'On a chart whose vertical axis is logarithmic (1, 10, 100, 1,000 equally spaced), what does steady 6% yearly growth look like?',
    choices: ['A straight line rising steadily', 'A curve bending upward', 'A curve flattening out', 'A horizontal line'],
    answer: 0,
    reveal: 'Each year multiplies by 1.06, and on a log axis every multiplication by 1.06 is the same upward step ($\\log 1.06$). Equal steps make a straight line.',
    misconception: {
      belief: 'Exponential growth always looks like a curve that shoots up.',
      correction: 'Only on a linear axis. On a log axis, equal factors are equal distances, so constant-rate growth is a straight line whose slope is the log of the factor.',
    },
  },

  practice: [
    item({ id: 'a2-log.p1', competency: 'alg.exp-log', difficulty: 1, level: 'scaffolded', prompt: 'What is $\\log_2 64$? (Which power of 2 is 64?)', answer: num(6), compute: () => Math.log2(64), hints: ['$2^6 = 64$.'], solution: '$2^6 = 64$, so $\\log_2 64 = 6$.' }),
    item({ id: 'a2-log.p2', competency: 'alg.exp-log', difficulty: 1, level: 'scaffolded', prompt: 'Given $\\log_{10} 2 \\approx 0.301$, use $\\log(MN) = \\log M + \\log N$ to find $\\log_{10} 200$. Three decimals.', answer: num(2.301, 0.001), compute: () => Math.log10(200), hints: ['$200 = 2 \\times 100$, and $\\log_{10} 100 = 2$.'], solution: '$0.301 + 2 = 2.301$.' }),
    item({ id: 'a2-log.p3', competency: 'alg.exp-log', difficulty: 2, level: 'independent', prompt: 'Solve $5^{t} = 125$.', answer: num(3), compute: () => ln(125) / ln(5), hints: ['Which power of 5 is 125?'], solution: '$5^3 = 125$, so $t = 3$.' }),
    item({ id: 'a2-log.p4', competency: 'alg.exp-log', difficulty: 2, level: 'independent', prompt: 'Money grows 8% a year. Solve $1.08^{t} = 2$ for the doubling time, to two decimals.', answer: num(9.01, 0.005), compute: () => ln(2) / ln(1.08), hints: ['$t = \\ln 2 / \\ln 1.08$.'], solution: '$0.6931 / 0.0770 \\approx 9.01$ years (rule of 70: 8.75).' }),
    item({
      id: 'a2-log.p5', competency: 'alg.exp-log', difficulty: 2, level: 'independent',
      prompt: 'Which expression equals $\\ln(e^{3x})$?',
      answer: choice(['$3x$', '$e^{3x}$', '$3 + x$', '$\\ln 3 + x$'], 0),
      feedback: { 1: 'The logarithm undoes the exponential; it does not leave it unchanged.', 2: 'The power law multiplies: $\\ln(e^{3x}) = 3x \\ln e$.', 3: 'That would be $\\ln(3e^{x})$.' },
      solution: '$\\ln(e^{3x}) = 3x \\cdot \\ln e = 3x$, because $\\ln e = 1$.',
    }),
    item({
      id: 'a2-log.p6', competency: 'alg.exp-log', difficulty: 3, level: 'transfer',
      prompt: 'A medicine’s concentration in the blood halves every 6 hours. Starting at 80 mg/L, after how many hours is it 10 mg/L?',
      answer: num(18), compute: () => 6 * (ln(80 / 10) / ln(2)), hints: ['80 → 40 → 20 → 10: count the halvings.', 'Or solve $80 \\cdot 0.5^{t/6} = 10$.'],
      solution: 'Three halvings, so $3 \\times 6 = 18$ hours. With logarithms: $0.5^{t/6} = 1/8$ gives $t/6 = 3$.',
    }),
  ],

  apply: {
    scenario: 'A small online shop had 2,000 monthly visitors in January and 3,200 in July, growing fairly steadily. The owner asks for the monthly growth rate, and when visitors would reach 10,000 if growth continued at that rate.',
    steps: [
      'Turn “2,000 to 3,200 in 6 months” into a monthly factor.',
      'Solve for the month that reaches 10,000.',
      'Judge the weakest assumption.',
    ],
    items: [
      item({ id: 'a2-log.u1', competency: 'alg.exp-log', difficulty: 2, prompt: 'Find the monthly factor $b$ with $2000 \\cdot b^{6} = 3200$, to four decimals.', answer: num(1.0815, 0.00005), compute: () => monthly, hints: ['$b^6 = 1.6$, so $b = 1.6^{1/6}$.'], solution: '$b = 1.6^{1/6} \\approx 1.0815$: about 8.15% growth a month.' }),
      item({ id: 'a2-log.u2', competency: 'alg.exp-log', difficulty: 3, prompt: 'At that rate, how many months after January until 10,000 visitors? One decimal.', answer: num(20.5, 0.06), compute: () => ln(5) / ln(monthly), hints: ['Solve $2000 \\cdot b^{t} = 10000$: $b^{t} = 5$.'], solution: '$t = \\ln 5 / \\ln 1.0815 \\approx 20.5$ months.' }),
      item({
        id: 'a2-log.u3', competency: 'alg.exp-log', difficulty: 3,
        prompt: 'What is the weakest assumption in that forecast?',
        answer: choice(['That the same percentage growth continues for nearly two years', 'That logarithms apply to website visitors', 'That January had 2,000 visitors', 'That months have equal length'], 0),
        feedback: { 1: 'Logarithms are just arithmetic on the model; the model is the question.', 2: 'That is data, not an assumption.', 3: 'A minor effect compared with the growth assumption.' },
        solution: 'Six months of data say little about the next 14: growth usually slows as an audience saturates. Treat 20.5 months as “if nothing changes”, not a prediction.',
      }),
    ],
    limits: [
      'Six months is a short history; percentage growth rarely stays constant.',
      'Visitors are not customers: revenue needs a conversion rate too.',
      'The numbers are illustrative.',
    ],
  },

  checkpoint: [
    item({ id: 'a2-log.c1', competency: 'alg.exp-log', difficulty: 1, prompt: 'What is $\\log_3 81$?', answer: num(4), compute: () => ln(81) / ln(3), solution: '$3^4 = 81$, so 4.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Ask which power of 3 gives 81: 3, 9, 27, 81, …' }),
    item({ id: 'a2-log.c2', competency: 'alg.exp-log', difficulty: 2, prompt: 'Solve $2 \\cdot 3^{t} = 54$.', answer: num(3), compute: () => ln(27) / ln(3), solution: 'Divide by 2: $3^{t} = 27$, so $t = 3$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Isolate the power first (divide by 2), then find the exponent.' }),
    item({
      id: 'a2-log.c3', competency: 'alg.exp-log', difficulty: 3,
      prompt: 'Carbon-14 has a half-life of about 5,730 years. A sample has 25% of its original carbon-14 left. About how old is it, in years?',
      answer: num(11460, 0.5), compute: () => 5730 * (ln(1 / 0.25) / ln(2)),
      solution: '25% is two halvings: $2 \\times 5730 = 11{,}460$ years. With logarithms: $0.5^{t/5730} = 0.25$ gives $t/5730 = 2$.',
      feedbackCorrect: 'Right — radiocarbon dating is a logarithm.', feedbackIncorrect: 'How many times must 100% be halved to reach 25%? Each halving takes 5,730 years.',
    }),
  ],

  python: {
    intro: 'Exact doubling times against the rule of 70, and the cost of thinking linearly.',
    code: `import math

r = 0.06
exact = math.log(2) / math.log(1 + r)
print("doubling time:", round(exact, 2), "years")
print("rule of 70:", round(70 / (100 * r), 2), "years")
print("balance after 17 years:", round(1000 * (1 + r) ** 17, 2))
for rate in [0.01, 0.06, 0.20, 0.70]:
    print(rate, round(math.log(2) / math.log(1 + rate), 2), round(70 / (100 * rate), 2))`,
    output: 'doubling time: 11.9 years\nrule of 70: 11.67 years\nbalance after 17 years: 2692.77\n0.01 69.66 70.0\n0.06 11.9 11.67\n0.2 3.8 3.5\n0.7 1.31 1.0',
    explain: '`math.log` is the natural logarithm. The rule of 70 is within a few percent for small rates and wrong by almost a third at 70% — an approximation, not a law.',
  },

  reading: [
    { title: '6.3 Logarithmic Functions', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/6-3-logarithmic-functions', note: 'Definition, evaluation and graphs of logarithms.' },
    { title: '6.6 Exponential and Logarithmic Equations', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/6-6-exponential-and-logarithmic-equations', note: 'Solving for an unknown exponent with logarithms.' },
  ],
};
