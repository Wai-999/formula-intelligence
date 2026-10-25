import { item, num, choice } from '../lessonKit.js';

// V4 exemplar 1: linear equation → restaurant break-even. All money figures
// are illustrative (an invented restaurant), not operational data.

export default {
  intuition: {
    question: 'A small restaurant spends \\$1,200 a day on rent, staff and power before it serves anyone. Each order sells for \\$18 and costs \\$10 in ingredients and packaging. How many orders a day does it need before it stops losing money — and how far should you trust that number?',
    body: [
      'Each order brings in \\$18 and costs \\$10, so it contributes \\$8 toward the \\$1,200 that is spent anyway. Profit is revenue minus costs: $P = 18q - (1200 + 10q) = 8q - 1200$, where $q$ is the number of orders in a day.',
      'Break-even is the $q$ where profit is exactly zero: $8q - 1200 = 0$, so $q = 150$. Below 150 orders the day loses money; above it, each extra order adds \\$8.',
      'That number is only as good as the model behind it — one price, one cost per order, fixed costs that do not move. The last steps of this lesson ask where those assumptions break.',
    ],
  },

  glossary: [
    { term: '$q$', meaning: 'Number of orders (units sold) in a day.' },
    { term: '$p$', meaning: 'Price of one order, in dollars.' },
    { term: '$v$', meaning: '**Variable cost**: what one more order costs to make — ingredients, packaging, card fees (dollars per order).' },
    { term: '$F$', meaning: '**Fixed costs**: paid per day whatever is sold — rent, salaries, power.' },
    { term: '$p - v$', meaning: '**Contribution margin**: what each order contributes toward the fixed costs.' },
    { term: '$q^*$', meaning: '**Break-even quantity**: the $q$ at which profit is zero.' },
  ],

  priorCheck: [
    item({
      id: 'a1-be.pre1', competency: 'arith.equations', difficulty: 1,
      prompt: 'Solve $5x - 40 = 0$.',
      answer: num(8), compute: () => 40 / 5, solution: 'Add 40 to both sides, then divide by 5: $x = 8$.',
    }),
    item({
      id: 'a1-be.pre2', competency: 'arith.order-ops', difficulty: 1,
      prompt: 'Evaluate $18 \\cdot 20 - (1200 + 10 \\cdot 20)$.',
      answer: num(-1040), compute: () => 18 * 20 - (1200 + 10 * 20), solution: '$360 - (1200 + 200) = 360 - 1400 = -1040$.',
    }),
  ],

  visualization: {
    lab: 'break-even',
    intro: 'Move the price, the cost per order and the fixed costs. Break-even is where the revenue line crosses the total-cost line; the vertical bar at “orders today” is that day’s profit or loss.',
    textAlternative: 'The lab draws revenue (price times orders) and total cost (fixed costs plus cost per order times orders) against orders per day, and marks where they cross. A sentence states the margin, the break-even number of orders and the profit at the chosen order count after every change; the table lists revenue, cost and profit at 0 to 300 orders.',
  },

  derivation: {
    intro: 'Where does $q^* = F/(p - v)$ come from — and why does it stop making sense when the price does not exceed the cost of an order?',
    steps: [
      { say: 'Revenue is price times quantity; total cost is the fixed part plus the per-order part:', math: 'R(q) = pq, \\qquad C(q) = F + vq' },
      { say: 'Profit is their difference. It is a **linear** function of $q$: slope $p - v$ (the margin), intercept $-F$.', math: 'P(q) = R(q) - C(q) = (p - v)q - F' },
      { say: 'Break-even means zero profit. Solving the linear equation:', math: '(p - v)q - F = 0 \\;\\Rightarrow\\; q^* = \\frac{F}{p - v} \\quad (p > v)' },
      { say: 'If $p \\le v$, the slope of $P$ is zero or negative: each order adds nothing or makes the loss bigger, so with $F > 0$ no number of orders breaks even. The formula’s division by a non-positive margin is the warning sign.' },
    ],
    assumptions: [
      'Every order sells at the same price $p$ (no discounts, no surge pricing).',
      'Every order costs the same $v$ to make — no bulk savings, no waste.',
      'Fixed costs stay the same over the range of orders considered (no extra staff or second shift).',
    ],
    domain: [
      'A break-even point exists only when $p > v$ (for $F > 0$).',
      'Orders are whole numbers: when $q^*$ is not an integer, the business needs $\\lceil q^* \\rceil$ orders to avoid a loss.',
    ],
  },

  examples: [
    {
      title: 'The restaurant',
      problem: '$F = \\$1{,}200$ a day, $p = \\$18$, $v = \\$10$. Find the break-even number of orders.',
      steps: ['Margin: $p - v = 18 - 10 = 8$ dollars per order.', '$q^* = 1200 / 8 = 150$ orders a day.', 'Check: revenue $18 \\cdot 150 = 2700$; cost $1200 + 10 \\cdot 150 = 2700$. ✓'],
      answer: '$q^* = 150$ orders a day',
      check: { value: 150, compute: () => 1200 / (18 - 10) },
    },
    {
      title: 'Not a whole number',
      problem: 'A food truck has $F = \\$500$ a day and sells at $p = \\$12$ with $v = \\$5$. How many orders must it sell to avoid a loss?',
      steps: ['$q^* = 500 / (12 - 5) = 500/7 \\approx 71.43$.', 'You cannot sell 0.43 of an order. At 71 orders profit is $7 \\cdot 71 - 500 = -3$ dollars; at 72 it is $+4$.', 'So the truck needs 72 orders.'],
      answer: '72 orders (break-even at about 71.4)',
      check: { value: 72, compute: () => Math.ceil(500 / 7) },
    },
  ],

  counterexample: {
    title: 'When the price does not cover the cost of an order',
    body: [
      'If each order sells for \\$9 but costs \\$10 to make, the margin is $-1$ and the formula gives $q^* = 1200 / (-1) = -1200$ — a negative number of orders. That is not a break-even point; it is the formula saying none exists: every extra order makes the loss bigger.',
      'Selling more never fixes a negative margin. Only a higher price or a lower cost per order can.',
    ],
  },

  predict: {
    prompt: 'Rent rises and fixed costs go from \\$1,200 to \\$1,500 a day; price and cost per order stay at \\$18 and \\$10. What happens to break-even?',
    choices: ['It rises by 300 orders', 'It rises by 37.5 orders, to 187.5', 'It stays at 150 orders', 'It doubles'],
    answer: 1,
    reveal: 'Break-even is $F/(p - v) = 1500/8 = 187.5$ — 188 whole orders. Each order covers only its \\$8 margin, so the extra \\$300 needs $300/8 = 37.5$ more orders.',
    misconception: {
      belief: 'Extra fixed costs need the same number of extra orders: \\$300 more cost, 300 more orders.',
      correction: 'Each order covers only its margin ($p - v$ = \\$8), not its price. The extra \\$300 is divided by the margin, not counted one-for-one.',
    },
  },

  practice: [
    item({ id: 'a1-be.p1', competency: 'alg.linear-eq', difficulty: 1, level: 'scaffolded', prompt: 'A stall has fixed costs of \\$300 a day and makes \\$6 on every item sold (its margin). Solve $6q - 300 = 0$ for break-even.', answer: num(50), compute: () => 300 / 6, hints: ['Add 300 to both sides, then divide by 6.'], solution: '$6q = 300$, so $q = 50$ items.' }),
    item({ id: 'a1-be.p2', competency: 'alg.linear-eq', difficulty: 1, level: 'scaffolded', prompt: 'Price \\$25, cost per item \\$15, fixed costs \\$2,000. First find the margin, then break-even.', answer: num(200), compute: () => 2000 / (25 - 15), hints: ['Margin: $25 - 15 = 10$.', 'Divide the fixed costs by the margin.'], solution: 'Margin \\$10; $q^* = 2000/10 = 200$.' }),
    item({ id: 'a1-be.p3', competency: 'alg.linear-eq', difficulty: 2, level: 'independent', prompt: 'A coffee cart sells cups at \\$4.50 that cost \\$1.30 each, with fixed costs of \\$240 a day. How many cups must it sell to avoid a loss?', answer: num(75), compute: () => Math.ceil(240 / (4.5 - 1.3)), hints: ['$q^* = 240 / 3.2$.', 'Round up to a whole cup.'], solution: '$q^* = 240/3.20 = 75$ exactly, so 75 cups.' }),
    item({ id: 'a1-be.p4', competency: 'alg.linear-eq', difficulty: 2, level: 'independent', prompt: 'The restaurant ($F = 1200$, $v = 10$) wants to break even at 120 orders a day. What price $p$ would do that?', answer: num(20), compute: () => 1200 / 120 + 10, hints: ['Solve $(p - 10) \\cdot 120 = 1200$ for $p$.'], solution: '$p - 10 = 10$, so $p = \\$20$.' }),
    item({
      id: 'a1-be.p5', competency: 'alg.linear-eq', difficulty: 3, level: 'transfer',
      prompt: 'A gym charges \\$40 a month per member; each member costs \\$12 a month (towels, cleaning, card fees). Rent and staff are \\$9,800 a month. How many members does it need to break even?',
      answer: num(350), compute: () => 9800 / (40 - 12), hints: ['Same model, different units: per member per month.'], solution: '$q^* = 9800 / 28 = 350$ members.',
    }),
  ],

  apply: {
    scenario: 'You run the restaurant ($F = \\$1{,}200$, $p = \\$18$, $v = \\$10$, about 170 orders a day). A delivery app offers new customers. It costs \\$150 a day and takes a \\$2 commission on each order it brings; ingredients stay at \\$10. The app promises 40 extra orders a day.',
    steps: [
      'Work out what each app order contributes, after the commission.',
      'Find how many app orders a day pay for the subscription.',
      'Compute the change in daily profit, then decide — and say what could make the decision wrong.',
    ],
    items: [
      item({ id: 'a1-be.u1', competency: 'alg.linear-eq', difficulty: 3, prompt: 'How many app orders a day are needed just to pay for the \\$150 subscription?', answer: num(25), compute: () => 150 / (18 - 10 - 2), hints: ['Each app order contributes $18 - 10 - 2 = 6$ dollars.'], solution: 'Margin per app order \\$6; $150 / 6 = 25$ orders.' }),
      item({ id: 'a1-be.u2', competency: 'alg.linear-eq', difficulty: 3, prompt: 'If the app really brings 40 extra orders a day, by how many dollars does daily profit change?', answer: num(90), compute: () => 40 * (18 - 10 - 2) - 150, hints: ['Extra contribution minus the subscription.'], solution: '$40 \\cdot 6 - 150 = 240 - 150 = +\\$90$ a day.' }),
      item({
        id: 'a1-be.u3', competency: 'alg.linear-eq', difficulty: 3,
        prompt: 'Which fact, if true, would most change the decision?',
        answer: choice([
          'Many “app” orders are regulars who would have ordered anyway — now paying a \\$2 commission',
          'Prices are quoted in dollars',
          'The subscription is billed daily rather than monthly',
          'Break-even without the app is 150 orders',
        ], 0),
        feedback: { 1: 'Units do not change the comparison.', 2: '\\$150 a day is the same cost however it is billed.', 3: 'True, but the decision is about the change the app makes.' },
        solution: 'If regular customers switch to ordering through the app, those orders earn \\$6 instead of \\$8 and are not extra at all. With enough of them, the app loses money even if total orders rise.',
      }),
    ],
    limits: [
      'Demand is not fixed: a higher price usually sells fewer orders, so $p$ and $q$ are not independent.',
      'Capacity: a kitchen can only make so many orders; past that, more staff turn a fixed cost into a step.',
      'Waste: food prepared but not sold is a cost the model ignores.',
      'Percentage fees (card fees, many delivery apps) grow with the price, not per order.',
    ],
  },

  checkpoint: [
    item({ id: 'a1-be.c1', competency: 'alg.linear-eq', difficulty: 1, prompt: 'Fixed costs \\$900 a day, price \\$15, cost per item \\$6. Find the break-even quantity.', answer: num(100), compute: () => 900 / (15 - 6), solution: 'Margin \\$9; $900 / 9 = 100$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Divide the fixed costs by the margin $p - v$, not by the price.' }),
    item({ id: 'a1-be.c2', competency: 'alg.linear-eq', difficulty: 2, prompt: 'With $F = \\$900$ and $v = \\$6$, what price makes break-even exactly 60 items a day?', answer: num(21), compute: () => 900 / 60 + 6, solution: '$(p - 6) \\cdot 60 = 900$, so $p - 6 = 15$ and $p = \\$21$.', feedbackCorrect: 'Right — the margin must be \\$15.', feedbackIncorrect: 'Set profit to zero at $q = 60$: $(p - 6) \\cdot 60 - 900 = 0$.' }),
    item({
      id: 'a1-be.c3', competency: 'alg.linear-eq', difficulty: 3,
      prompt: 'An owner raises the price from \\$18 to \\$24 and says break-even falls from 150 to 86 orders a day. What is the biggest flaw in relying on that?',
      answer: choice([
        'It assumes the restaurant still sells as many orders at the higher price',
        'The arithmetic is wrong: break-even rises when the price rises',
        'Break-even is not defined when the price changes',
        'Fixed costs always rise with the price',
      ], 0),
      feedback: { 1: 'The arithmetic is right: $1200/(24 - 10) \\approx 85.7$.', 2: 'It is defined whenever $p > v$.', 3: 'Rent does not depend on the menu price.' },
      solution: 'The model holds $q$ independent of $p$. A higher price lowers break-even on paper, but if it drives customers away, the restaurant may sell fewer than 86 orders and lose more money.',
      feedbackCorrect: 'Right — the model has no demand curve.', feedbackIncorrect: 'The calculation is fine. Ask what the model assumes about customers when the price changes.',
    }),
  ],

  python: {
    intro: 'The linear profit model and its break-even point — the numbers behind the lab’s graph.',
    code: `F, p, v = 1200, 18, 10

def profit(q):
    return (p - v) * q - F

q_star = F / (p - v)
print("break-even:", q_star)
for q in [100, 150, 200]:
    print(q, profit(q))`,
    output: 'break-even: 150.0\n100 -400\n150 0\n200 400',
    explain: '`profit(q)` is the model $P = (p - v)q - F$. To draw it, add `import matplotlib.pyplot as plt`, then `plt.plot(range(0, 301), [profit(q) for q in range(0, 301)])` in the Python lab: the line crosses zero at 150.',
  },

  reading: [
    { title: '7.1 Systems of Linear Equations: Two Variables — “Using Systems of Equations to Investigate Profits”', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/7-1-systems-of-linear-equations-two-variables', note: 'Break-even as the intersection of cost and revenue lines (Example 10).' },
  ],
};
