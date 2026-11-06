import { item, num, choice } from '../lessonKit.js';

// Phase 6 of the 80/20 upgrade (docs/learning-8020/PHASE6_LESSONS.md):
// exponents and roots, which 15 written lessons build on (exponentials and
// logarithms, polynomials, norms, big-O, the standard error) and which three
// placement items test (dx.a11–a13) with no lesson behind them until now.
// Written to the professor contract from the start. All numbers are
// illustrative.

const round = (x) => 3 ** x;
const reached = (n) => Array.from({ length: n }, (_, i) => 3 ** (i + 1)).reduce((a, b) => a + b, 0);

export default {
  intuition: {
    question: 'A video spreads by sharing: everyone who watches it sends it to 3 friends, and each of them sends it to 3 more. In the fifth round of sharing, how many new people get it — and why is the answer 243, not 15?',
    body: [
      'An **exponent** counts repeated multiplication. $3^5 = 3 \\cdot 3 \\cdot 3 \\cdot 3 \\cdot 3 = 243$: the **base** 3 is the factor, and the exponent 5 says how many factors there are. $3 \\times 5 = 15$ counts repeated *addition* instead, which is why it is so much smaller.',
      'The rules of exponents are all ways of counting factors. Multiplying $a^m$ by $a^n$ strings $m$ factors and $n$ more together, so $a^m \\cdot a^n = a^{m+n}$. Dividing cancels factors, so $a^m / a^n = a^{m-n}$. That one rule also says what $a^0$ and $a^{-n}$ must mean.',
      'A **root** undoes a power. $\\sqrt{49} = 7$ because $7^2 = 49$, and $\\sqrt[3]{8} = 2$ because $2^3 = 8$. Written as fractional exponents, $\\sqrt{a} = a^{1/2}$, roots follow the same rules as every other power.',
    ],
    simpler: [
      'Fold a sheet of paper in half: 2 layers. Fold again: 4. Again: 8. Each fold doubles, so after 3 folds there are $2^3 = 8$ layers. The exponent is the number of folds, not the number of layers.',
      'A square root asks the question backwards: which side length makes a square of area 49? Side 7, because $7 \\times 7 = 49$.',
    ],
  },

  outcomes: [
    'Evaluate powers, including zero and negative exponents, and tell $3^5$ from $3 \\times 5$.',
    'Simplify with the product, quotient and power rules, and say why each one is true.',
    'Evaluate square and cube roots, and write a root as a fractional exponent.',
  ],

  glossary: [
    { term: '$a^n$', say: 'a to the n, or a to the power n', meaning: '$n$ factors of $a$ multiplied together: $a^3 = a \\cdot a \\cdot a$. $a$ is the **base**, $n$ the **exponent**. $a^2$ is said “a squared” and $a^3$ “a cubed”.' },
    { term: '$a^0 = 1$', say: 'a to the zero equals one', meaning: 'Any base except 0, to the power 0, is 1: a product with no factors at all.' },
    { term: '$a^{-n} = \\dfrac{1}{a^n}$', say: 'a to the minus n equals one over a to the n', meaning: 'A negative exponent divides: $2^{-3} = \\tfrac18$. It never makes the number negative.' },
    { term: '$\\sqrt{a}$, $\\sqrt[3]{a}$', say: 'the square root of a; the cube root of a', meaning: 'The non-negative number whose square is $a$, and the number whose cube is $a$. As powers, $\\sqrt{a} = a^{1/2}$ and $\\sqrt[3]{a} = a^{1/3}$.' },
  ],

  priorCheck: [
    item({
      id: 'pa-exp.pre1', competency: 'arith.order-ops', difficulty: 1,
      prompt: 'What is $2 + 3 \\times 4$?',
      answer: num(14), compute: () => 2 + 3 * 4, solution: 'Multiply first: $2 + 12 = 14$.',
    }),
    item({
      id: 'pa-exp.pre2', competency: 'arith.integers', difficulty: 1,
      prompt: 'What is $(-2) \\times (-2) \\times (-2)$?',
      answer: num(-8), compute: () => (-2) * (-2) * (-2), solution: '$(-2)(-2) = 4$, and $4 \\times (-2) = -8$: an odd number of negative factors gives a negative product.',
    }),
  ],

  visualization: {
    lab: 'log-scale',
    intro: 'Each dashed line marks one more doubling, labelled ×2, ×4, ×8, …: the powers $2^1$, $2^2$, $2^3$. Count the doublings up to any time and the exponent tells you the factor. Then switch the vertical axis to logarithmic: equal steps in the exponent become equal steps up the page.',
    textAlternative: 'A graph of an amount growing by a fixed percentage each period, with a dashed line at every doubling labelled ×2, ×4, ×8, ×16 and so on, which are the powers of 2. A switch changes the vertical axis to a logarithmic one, on which the growth becomes a straight line. The table lists the amount and its logarithm for each period.',
  },

  derivation: {
    intro: 'Every rule for exponents is a way of counting factors — and so are the meanings of zero and negative exponents.',
    steps: [
      { say: 'Multiplying two powers of the same base strings their factors together: $m$ factors, then $n$ more.', math: 'a^m \\cdot a^n = \\underbrace{a \\cdots a}_{m}\\,\\underbrace{a \\cdots a}_{n} = a^{m+n}' },
      { say: 'Dividing cancels factors: $m$ on top, $n$ underneath, $m - n$ left over (for $a \\ne 0$).', math: '\\frac{a^m}{a^n} = a^{m-n}' },
      { say: 'The quotient rule with $m = n$ forces the meaning of $a^0$, and with $m = 0$ the meaning of a negative exponent:', math: 'a^0 = \\frac{a^n}{a^n} = 1, \\qquad a^{-n} = \\frac{a^0}{a^n} = \\frac{1}{a^n}' },
      { say: 'A power of a power multiplies the exponents: $n$ copies of $m$ factors each.', math: '(a^m)^n = a^{mn}' },
      { say: 'A fractional exponent is the power that undoes a square. The power rule gives $(a^{1/2})^2 = a$, so $a^{1/2}$ is the number whose square is $a$:', math: '\\left(a^{1/2}\\right)^2 = a^{\\frac12 \\cdot 2} = a \\quad\\Rightarrow\\quad a^{1/2} = \\sqrt{a}' },
    ],
    assumptions: [
      'The rules need one base: $2^3 \\cdot 5^2$ cannot be combined into a single power.',
      'For roots and fractional exponents the base is not negative here; the square root of a negative number is not a real number.',
    ],
    domain: [
      '$a^0 = 1$ and $a^{-n}$ need $a \\ne 0$: $0^{-1}$ would divide by zero, and $0^0$ is left undefined in this course.',
      '$\\sqrt{x}$ means the non-negative root: $\\sqrt{49} = 7$, even though $(-7)^2 = 49$ too.',
      'Exponents spread over products, $(ab)^2 = a^2 b^2$, but not over sums: $(a + b)^2$ is not $a^2 + b^2$.',
    ],
  },

  examples: [
    {
      title: 'Simplifying with the rules',
      problem: 'Simplify $\\dfrac{2^5 \\cdot 2^3}{2^4}$ and give its value.',
      steps: [
        'Product rule on top: $2^5 \\cdot 2^3 = 2^{5+3} = 2^8$.',
        'Quotient rule: $2^8 / 2^4 = 2^{8-4} = 2^4$.',
        '$2^4 = 16$. Check with the numbers: $32 \\times 8 = 256$, and $256 / 16 = 16$.',
      ],
      answer: '$2^4 = 16$',
      check: { value: 16, compute: () => (2 ** 5 * 2 ** 3) / 2 ** 4 },
      tempting: {
        wrong: 'Tempting: multiply the exponents on top, so $2^5 \\cdot 2^3 = 2^{15}$.',
        why: 'Multiplying powers adds the counts of factors: five 2s and then three more is eight 2s, $2^8 = 256$. $2^{15} = 32768$ would be fifteen 2s. Multiplying the exponents is the rule for a power of a power, $(2^5)^3$.',
      },
    },
    {
      title: 'Zero and negative exponents',
      problem: 'Evaluate $5^0$, $4^{-2}$ and $10^{-3}$.',
      steps: [
        '$5^0 = 1$: no factors at all leaves the empty product, 1.',
        '$4^{-2} = \\dfrac{1}{4^2} = \\dfrac{1}{16} = 0.0625$.',
        '$10^{-3} = \\dfrac{1}{1000} = 0.001$: a negative power of 10 counts decimal places.',
      ],
      answer: '$1$, $0.0625$ and $0.001$',
      check: { value: 0.0625, compute: () => 4 ** -2 },
    },
    {
      title: 'A root as a fractional exponent',
      problem: 'A square tile has an area of 2.25 m². How long is each side? Then find $8^{2/3}$.',
      steps: [
        'The side is $\\sqrt{2.25} = 1.5$ m, because $1.5^2 = 2.25$.',
        '$8^{2/3} = \\left(8^{1/3}\\right)^2 = 2^2 = 4$: take the cube root first, then square.',
        'Check the other way round: $(8^2)^{1/3} = \\sqrt[3]{64} = 4$ as well, because $4^3 = 64$.',
      ],
      answer: 'Side 1.5 m; $8^{2/3} = 4$',
      check: { value: 4, compute: () => 8 ** (2 / 3), tolerance: 1e-9 },
    },
  ],

  counterexample: {
    title: 'Exponents do not spread over sums',
    body: [
      '$(3 + 4)^2 = 7^2 = 49$, but $3^2 + 4^2 = 9 + 16 = 25$. Squaring a sum is not squaring each part: the missing $2 \\cdot 3 \\cdot 4 = 24$ is exactly the difference.',
      'Roots fail the same way: $\\sqrt{9 + 16} = \\sqrt{25} = 5$, not $\\sqrt{9} + \\sqrt{16} = 7$. Exponents do spread over products — $(3 \\cdot 4)^2 = 3^2 \\cdot 4^2 = 144$ — because a product is multiplication all the way through.',
    ],
  },

  predict: {
    prompt: 'Which is larger: $2^{10}$ or $10^2$?',
    choices: ['$2^{10}$', '$10^2$', 'They are equal', 'It depends on the units'],
    answer: 0,
    reveal: '$2^{10} = 1024$ and $10^2 = 100$. Ten factors of 2 beat two factors of 10 by about ten times. Swapping the base and the exponent changes the number, and the exponent usually matters more.',
    misconception: {
      belief: 'The base and the exponent can be swapped, or $2^{10}$ is about $2 \\times 10 = 20$.',
      correction: 'The exponent counts factors, so it grows a number far faster than the base does. $a^b$ and $b^a$ are rarely equal; $2^4 = 4^2 = 16$ is a famous exception.',
    },
  },

  faded: {
    title: 'Photos on a phone',
    problem: 'A phone has $2^7 = 128$ GB of storage, and one photo takes $2^{-6}$ GB (a sixty-fourth of a gigabyte, about 16 MB). How many photos fit?',
    steps: [
      { say: 'The number of photos is the storage divided by the size of one photo: $\\dfrac{2^7}{2^{-6}}$. Both are powers of 2, so the quotient rule applies.' },
      {
        say: 'Subtract the exponents:',
        item: item({ id: 'pa-exp.f1', competency: 'arith.exponents', difficulty: 2, level: 'scaffolded', prompt: 'What is the exponent of 2 in $\\dfrac{2^7}{2^{-6}}$?', answer: num(13), compute: () => 7 - -6, hints: ['$7 - (-6)$: subtracting a negative number adds it.'], solution: '$7 - (-6) = 13$, so the quotient is $2^{13}$.' }),
      },
      {
        say: 'Evaluate the power. $2^{10} = 1024$ is worth remembering.',
        item: item({ id: 'pa-exp.f2', competency: 'arith.exponents', difficulty: 2, level: 'scaffolded', prompt: 'How many photos is $2^{13}$?', answer: num(8192), compute: () => 2 ** 13, hints: ['$2^{13} = 2^{10} \\cdot 2^3$.'], solution: '$1024 \\times 8 = 8192$ photos.' }),
      },
      {
        say: 'Check with decimals: $2^{-6} = \\tfrac{1}{64} = 0.015625$ GB per photo.',
        item: item({ id: 'pa-exp.f3', competency: 'arith.exponents', difficulty: 1, level: 'scaffolded', prompt: 'How many GB do 1000 photos take?', answer: num(15.625, 0.05), compute: () => 1000 * 2 ** -6, hints: ['$1000 \\times 0.015625$.'], solution: '$15.625$, about 15.6 GB. So 128 GB holds about $128 / 15.625 \\times 1000 = 8192$ photos, as the exponents said.' }),
      },
    ],
    answer: '$2^7 / 2^{-6} = 2^{13} = 8192$ photos; 1000 photos take about 15.6 GB.',
  },

  practice: [
    item({ id: 'pa-exp.p1', competency: 'arith.exponents', difficulty: 1, level: 'scaffolded', prompt: 'What is $3^4$?', answer: num(81), compute: () => 3 ** 4, hints: ['$3 \\cdot 3 \\cdot 3 \\cdot 3$.'], solution: '$9 \\cdot 9 = 81$.' }),
    item({ id: 'pa-exp.p2', competency: 'arith.exponents', difficulty: 1, level: 'scaffolded', prompt: 'What is $(-2)^4$?', answer: num(16), compute: () => (-2) ** 4, hints: ['Four negative factors: an even number of them gives a positive product.'], solution: '$(-2)(-2)(-2)(-2) = 16$. Without the brackets, $-2^4$ means $-(2^4) = -16$.' }),
    item({ id: 'pa-exp.p3', competency: 'arith.exponents', difficulty: 2, level: 'independent', prompt: 'Write $\\dfrac{x^9}{x^3}$ as $x^k$. What is $k$?', answer: num(6), compute: () => 9 - 3, hints: ['Quotient rule: subtract the exponents.'], solution: '$x^{9-3} = x^6$. It is not $x^3$: dividing subtracts exponents, it does not divide them.' }),
    item({ id: 'pa-exp.p4', competency: 'arith.exponents', difficulty: 2, level: 'independent', prompt: 'Write $(x^2)^5 \\cdot x^3$ as $x^k$. What is $k$?', answer: num(13), compute: () => 2 * 5 + 3, hints: ['Power rule first: $(x^2)^5 = x^{10}$.', 'Then the product rule.'], solution: '$x^{10} \\cdot x^3 = x^{13}$.' }),
    item({
      id: 'pa-exp.p5', competency: 'arith.exponents', difficulty: 2, level: 'independent',
      prompt: 'Which number equals $\\sqrt{36 + 64}$?',
      answer: choice(['10', '14', '100', '48'], 0),
      hints: ['Add under the root first.'],
      feedback: { 1: '14 is $\\sqrt{36} + \\sqrt{64}$, but a root does not split over a sum.', 2: '100 is the number under the root; its square root is what is asked.', 3: '48 is $36 + 64$ halved, not a square root.' },
      solution: '$\\sqrt{100} = 10$.',
    }),
    item({
      id: 'pa-exp.p6', competency: 'arith.exponents', difficulty: 3, level: 'transfer',
      prompt: 'A culture of bacteria doubles every hour: $N(t) = 500 \\cdot 2^t$ cells, $t$ hours after 9 am. What does the rule give for $t = -2$?',
      answer: num(125), compute: () => 500 * 2 ** -2,
      hints: ['$2^{-2} = \\tfrac14$.', 'A negative time is a time before 9 am.'],
      solution: '$500 \\cdot \\tfrac14 = 125$ cells: the culture two hours earlier, at 7 am, if it was doubling then too. A negative exponent runs the doubling backwards.',
    }),
  ],

  apply: {
    scenario: 'A company sets up a phone tree for emergencies: a manager calls 3 people, each of them calls 3 more, and so on. Each round of calls takes about 5 minutes. You are checking whether the tree can reach all 1000 staff, and how quickly.',
    steps: [
      'Count the calls in one round with a power.',
      'Find the round that first reaches enough people.',
      'Add up the rounds, and catch a multiplication mistake in the plan.',
    ],
    items: [
      item({ id: 'pa-exp.u1', competency: 'arith.exponents', difficulty: 1, prompt: 'Round $n$ reaches $3^n$ new people. How many are called in round 4?', answer: num(81), compute: () => round(4), hints: ['$3^4$.'], solution: '$3^4 = 81$ people.' }),
      item({ id: 'pa-exp.u2', competency: 'arith.exponents', difficulty: 2, prompt: 'In which round does a single round first reach more than 500 people?', answer: num(6), compute: () => { let n = 1; while (round(n) <= 500) n += 1; return n; }, hints: ['Keep multiplying by 3: 3, 9, 27, 81, 243, …'], solution: 'Round 5 reaches $3^5 = 243$; round 6 reaches $3^6 = 729$. So round 6.' }),
      item({ id: 'pa-exp.u3', competency: 'arith.exponents', difficulty: 2, prompt: 'How many people have been called altogether after round 6, $3 + 3^2 + \\cdots + 3^6$?', answer: num(1092), compute: () => reached(6), hints: ['$3 + 9 + 27 + 81 + 243 + 729$.'], solution: '1092 people: enough for all 1000 staff, after 6 rounds — about 30 minutes.' }),
      item({
        id: 'pa-exp.u4', competency: 'arith.exponents', difficulty: 3,
        prompt: 'A planner writes: “6 rounds of 3 calls each is $6 \\times 3 = 18$ calls, so the tree is far too small.” What is wrong?',
        answer: choice(['Each round multiplies the callers by 3, so round 6 alone is $3^6 = 729$ calls: the count is a power, not a product', 'Nothing: 18 calls are made', 'It should be $3 + 6 = 9$ calls', 'Round 6 is $6^3 = 216$ calls'], 0),
        feedback: { 1: '18 would be right if only the manager made calls. In each round, everyone called in the round before makes 3 calls.', 2: 'Adding the round number to the branching factor has no meaning here.', 3: 'That swaps the base and the exponent: the factor 3 is repeated 6 times, $3^6$, not 6 repeated 3 times.' },
        solution: 'The number of callers grows by a factor of 3 each round, so round 6 has $3^6 = 729$ calls. $6 \\times 3$ treats repeated multiplication as repeated addition.',
      }),
    ],
    limits: [
      'Real phone trees break: people miss calls, and two callers may both ring the same colleague.',
      'Exponential counts outgrow any real group quickly: round 15 alone would be $3^{15}$, over 14 million calls, so the tree stops when everyone is reached.',
      'Time adds while reach multiplies: 6 rounds take about $6 \\times 5 = 30$ minutes.',
    ],
  },

  checkpoint: [
    item({ id: 'pa-exp.c1', competency: 'arith.exponents', difficulty: 1, prompt: 'What is $2^{-3}$, as a decimal?', answer: num(0.125), compute: () => 2 ** -3, solution: '$2^{-3} = 1/2^3 = 1/8 = 0.125$.', feedbackCorrect: 'Right — a negative exponent divides.', feedbackIncorrect: 'A negative exponent means “one over”: $2^{-3} = 1/2^3$. It does not make the number negative.' }),
    item({ id: 'pa-exp.c2', competency: 'arith.exponents', difficulty: 2, prompt: 'Write $\\dfrac{5^3 \\cdot 5^4}{5^5}$ as a single power of 5, then give its value.', answer: num(25), compute: () => (5 ** 3 * 5 ** 4) / 5 ** 5, solution: '$5^{3+4-5} = 5^2 = 25$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Add the exponents on top ($3 + 4 = 7$), subtract the one underneath ($7 - 5$), then evaluate.' }),
    item({
      id: 'pa-exp.c3', competency: 'arith.exponents', difficulty: 2,
      prompt: 'Which statement is true?',
      answer: choice(['$(2^3)^2 = 2^6$', '$2^3 \\cdot 2^2 = 2^6$', '$(2 + 3)^2 = 2^2 + 3^2$', '$\\sqrt{9 + 16} = 7$'], 0),
      feedback: { 1: 'Multiplying powers adds the exponents: $2^3 \\cdot 2^2 = 2^5$.', 2: '$(2 + 3)^2 = 25$, but $2^2 + 3^2 = 13$: a power does not spread over a sum.', 3: '$\\sqrt{25} = 5$: a root does not spread over a sum either.' },
      solution: 'A power of a power multiplies the exponents: $(2^3)^2 = 8^2 = 64 = 2^6$.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Check each one with numbers: $(2^3)^2 = 64$; which others give equal sides?',
    }),
    item({
      id: 'pa-exp.c4', competency: 'arith.exponents', difficulty: 3,
      prompt: 'In Python, `**` is the power operator: `2 ** 10` gives 1024. What does `10 ** -2` give?',
      answer: num(0.01), compute: () => 10 ** -2,
      solution: '$10^{-2} = 1/100 = 0.01$ (Python prints `0.01`).',
      feedbackCorrect: 'Right — the rules are the same in code.', feedbackIncorrect: 'A negative exponent divides: $10^{-2} = 1/10^2$.',
    }),
  ],

  python: {
    intro: 'Python writes $a^n$ as `a ** n`. The rules can be checked directly, including the one that fails.',
    code: `print("3 ** 5 =", 3 ** 5, "but 3 * 5 =", 3 * 5)
print("2 ** -3 =", 2 ** -3)
print("square root of 2.25:", 2.25 ** 0.5)
print("8 ** (2/3) =", round(8 ** (2 / 3), 10))

# The product rule, checked for one base: a^m * a^n equals a^(m+n).
a, m, n = 7, 4, 3
print("7**4 * 7**3 == 7**7:", a ** m * a ** n == a ** (m + n))
print("(3 + 4) ** 2 =", (3 + 4) ** 2, "but 3**2 + 4**2 =", 3 ** 2 + 4 ** 2)`,
    output: '3 ** 5 = 243 but 3 * 5 = 15\n2 ** -3 = 0.125\nsquare root of 2.25: 1.5\n8 ** (2/3) = 4.0\n7**4 * 7**3 == 7**7: True\n(3 + 4) ** 2 = 49 but 3**2 + 4**2 = 25',
    explain: 'Fractional powers are computed in floating point, so `8 ** (2 / 3)` comes out a hair under 4; rounding shows it. The last line is the non-example: a power does not spread over a sum.',
  },

  reading: [
    { title: '10.2 Use Multiplication Properties of Exponents', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/10-2-use-multiplication-properties-of-exponents', note: 'The product and power rules, with many worked examples.' },
    { title: '10.5 Integer Exponents and Scientific Notation', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/10-5-integer-exponents-and-scientific-notation', note: 'Zero and negative exponents, and powers of 10.' },
    { title: '5.7 Simplify and Use Square Roots', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/5-7-simplify-and-use-square-roots', note: 'Square roots and estimating them.' },
  ],
};
