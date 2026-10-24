import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A 2 kg bag of rice costs \\$5.40 and a 5 kg bag of the same rice costs \\$12.75. Which is the better deal — and by how much per kilogram?',
    body: [
      'The totals cannot be compared directly: the bags hold different amounts. Divide each price by its quantity to get the price of **one** kilogram — the **unit rate**: \\$5.40 ÷ 2 = \\$2.70 per kg, and \\$12.75 ÷ 5 = \\$2.55 per kg. The 5 kg bag is cheaper by 15 cents per kilogram.',
      'A **ratio** compares two quantities by division; a **rate** is a ratio of quantities with different units (dollars per kilogram, kilometres per hour). Rates are the seed of slope: a constant rate drawn on a graph is a line.',
    ],
  },

  glossary: [
    { term: '$a : b$ or $\\dfrac{a}{b}$', meaning: 'The ratio of $a$ to $b$ ($b \\ne 0$).' },
    { term: 'rate', meaning: 'A ratio of two quantities measured in different units, such as dollars per kilogram.' },
    { term: 'unit rate', meaning: 'A rate per one unit of the second quantity: $\\$2.70$ per 1 kg.' },
    { term: 'proportion', meaning: 'An equation between two ratios, $\\dfrac{a}{b} = \\dfrac{c}{d}$.' },
  ],

  priorCheck: [
    item({ id: 'pa-rr.pre1', competency: 'arith.fractions', difficulty: 1, prompt: 'What is $\\tfrac{3}{4}$ of 20?', answer: num(15), compute: () => (3 / 4) * 20, solution: '$20 \\div 4 = 5$, and $3 \\times 5 = 15$.' }),
    item({ id: 'pa-rr.pre2', competency: 'arith.fractions', difficulty: 1, prompt: 'Compute $5.40 \\div 2$.', answer: num(2.7), compute: () => 5.4 / 2, solution: '$5.40 \\div 2 = 2.70$.' }),
  ],

  visualization: {
    lab: 'ratio',
    intro: 'Each deal is drawn as a double number line: quantity above, price below. Read the price under “1” — the unit rate — for each deal. Then try the notebooks, where the bigger pack is NOT the better deal.',
    textAlternative: 'The lab draws two double number lines, one per deal, marked at each whole unit with the matching price. A sentence states each unit rate and which deal is cheaper and by how much; the table lists prices for 1 to 6 units at each rate.',
  },

  derivation: {
    intro: 'Why does dividing give the price of one unit, and why can a proportion be solved by “cross-multiplying”?',
    steps: [
      { say: 'If the price per kilogram is the same for every kilogram in the bag, the \\$5.40 is shared equally among 2 kg. Each kilogram costs $5.40 / 2$. In general, for a constant rate,', math: '\\text{unit rate} = \\frac{\\text{total}}{\\text{quantity}}' },
      { say: 'Multiplying the top and bottom of a ratio by the same non-zero number $k$ multiplies it by $k/k = 1$, so its value does not change. That is why 2 kg for \\$5.40 and 4 kg for \\$10.80 are the same deal:', math: '\\frac{a \\cdot k}{b \\cdot k} = \\frac{a}{b} \\cdot \\frac{k}{k} = \\frac{a}{b} \\qquad (k \\ne 0)' },
      { say: 'If two ratios are equal, $\\frac{a}{b} = \\frac{c}{d}$ with $b, d \\ne 0$, multiply both sides by $bd$ (a fair move — the same non-zero number on both sides):', math: '\\frac{a}{b} = \\frac{c}{d} \\;\\Longrightarrow\\; ad = bc' },
    ],
    assumptions: [
      'The rate is constant: every unit costs the same. Bulk discounts or fixed fees break this.',
      'Quantities being compared are in the same units (convert grams to kilograms first).',
    ],
    domain: [
      'Denominators must be non-zero: a rate “per 0 kg” has no meaning.',
    ],
  },

  examples: [
    {
      title: 'Which bag?',
      problem: 'Compare \\$5.40 for 2 kg with \\$12.75 for 5 kg.',
      steps: ['$5.40 \\div 2 = 2.70$ dollars per kg.', '$12.75 \\div 5 = 2.55$ dollars per kg.', '$2.70 - 2.55 = 0.15$.'],
      answer: 'The 5 kg bag, by \\$0.15 per kilogram.',
      check: { value: 0.15, compute: () => 5.4 / 2 - 12.75 / 5 },
    },
    {
      title: 'Scaling a recipe',
      problem: 'A recipe uses 3 cups of flour for 4 servings. How much flour for 10 servings?',
      steps: ['Set up the proportion $\\dfrac{3}{4} = \\dfrac{x}{10}$.', 'Cross-multiply: $4x = 30$.', '$x = 7.5$.'],
      answer: '7.5 cups of flour.',
      check: { value: 7.5, compute: () => (3 * 10) / 4 },
    },
  ],

  counterexample: {
    title: 'When a fixed fee breaks proportionality',
    body: [
      'A ride costs a \\$3 booking fee plus \\$2 per kilometre. A 2 km ride costs \\$7. Is a 4 km ride \\$14? No: it is $3 + 2 \\cdot 4 = \\$11$.',
      'The ratio fare ÷ distance is \\$3.50 per km for the short ride and \\$2.75 per km for the long one — not constant, so the fare is **not** proportional to distance. The per-kilometre part is a constant rate; the fixed fee is not. Algebra I’s slope–intercept form handles exactly this.',
    ],
  },

  predict: {
    prompt: 'Shop A sells 3 notebooks for \\$4.50; shop B sells 8 for \\$12.40. Which is cheaper per notebook?',
    choices: ['Shop A', 'Shop B — the bigger pack', 'They are the same', 'You cannot tell without knowing how many you need'],
    answer: 0,
    reveal: 'A: $4.50 / 3 = \\$1.50$ each. B: $12.40 / 8 = \\$1.55$ each. The smaller pack is cheaper per notebook.',
    misconception: {
      belief: 'The bigger pack is always the better deal.',
      correction: 'Size says nothing about price per unit. Only the unit rate compares deals of different sizes — and stores do sometimes charge more per unit for larger packs.',
    },
  },

  practice: [
    item({ id: 'pa-rr.p1', competency: 'arith.ratios', difficulty: 1, level: 'scaffolded', prompt: '12 apples cost \\$4.80. What does one apple cost, in dollars? (Divide the total by the quantity.)', answer: num(0.4), compute: () => 4.8 / 12, hints: ['$4.80 \\div 12$.'], solution: '$4.80 / 12 = 0.40$ dollars.' }),
    item({ id: 'pa-rr.p2', competency: 'arith.ratios', difficulty: 1, level: 'scaffolded', prompt: 'Complete the equivalent ratio: $15 : 25 = 3 : x$.', answer: num(5), compute: () => 25 / 5, hints: ['15 was divided by 5 to get 3.'], solution: 'Divide both terms by 5: $15 : 25 = 3 : 5$.' }),
    item({ id: 'pa-rr.p3', competency: 'arith.ratios', difficulty: 2, level: 'independent', prompt: 'A cyclist covers 42 km in 1.5 hours at a steady speed. What is the speed in km per hour?', answer: num(28), compute: () => 42 / 1.5, solution: '$42 / 1.5 = 28$ km/h.' }),
    item({ id: 'pa-rr.p4', competency: 'arith.ratios', difficulty: 2, level: 'independent', prompt: 'Solve the proportion $\\dfrac{4}{6} = \\dfrac{x}{15}$.', answer: num(10), compute: () => (4 * 15) / 6, hints: ['Cross-multiply: $6x = 60$.'], solution: '$6x = 60$, so $x = 10$.' }),
    item({
      id: 'pa-rr.p5', competency: 'arith.ratios', difficulty: 2, level: 'independent',
      prompt: 'Which of these is a unit rate?',
      answer: choice(['\\$12 for 3 kg', '\\$4 per kg', '3 : 12', '12 kg'], 1),
      feedback: { 0: 'A rate, but for 3 kg, not for one.', 2: 'A ratio of two numbers, with no units and not “per one”.' },
      solution: '“\\$4 per kg” is the cost of exactly one kilogram.',
    }),
    item({ id: 'pa-rr.p6', competency: 'arith.ratios', difficulty: 3, level: 'transfer', prompt: 'A printer prints 18 pages in 45 seconds. At the same rate, how many pages does it print in 4 minutes?', answer: num(96), compute: () => (18 / 45) * 240, hints: ['Convert 4 minutes to seconds first.', 'Unit rate: $18/45 = 0.4$ pages per second.'], solution: '$0.4 \\times 240 = 96$ pages.' }),
    item({ id: 'pa-rr.p7', competency: 'arith.ratios', difficulty: 3, level: 'transfer', prompt: 'Convert 72 km/h to metres per second.', answer: num(20), compute: () => (72 * 1000) / 3600, hints: ['1 km = 1000 m and 1 h = 3600 s.'], solution: '$72 \\times 1000 / 3600 = 20$ m/s.' }),
  ],

  checkpoint: [
    item({ id: 'pa-rr.c1', competency: 'arith.ratios', difficulty: 1, prompt: 'A 6-pack of juice costs \\$7.50. What is the price per bottle, in dollars?', answer: num(1.25), compute: () => 7.5 / 6, solution: '$7.50 / 6 = 1.25$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Unit price = total ÷ number of bottles.' }),
    item({ id: 'pa-rr.c2', competency: 'arith.ratios', difficulty: 2, prompt: 'A map’s scale is 1 cm : 2.5 km. Two towns are 7.2 cm apart on the map. How far apart are they, in km?', answer: num(18), compute: () => 7.2 * 2.5, solution: '$7.2 \\times 2.5 = 18$ km.', feedbackCorrect: 'Right: every map centimetre is 2.5 km.', feedbackIncorrect: 'Each centimetre stands for 2.5 km, so multiply.' }),
    item({
      id: 'pa-rr.c3', competency: 'arith.ratios', difficulty: 3,
      prompt: 'A ride costs a \\$3 booking fee plus \\$2 per km. Is the fare proportional to the distance?',
      answer: choice(['Yes, with rate \\$2 per km', 'Yes, with rate \\$3.50 per km', 'No — because of the fixed fee, fare ÷ distance changes with distance', 'You cannot tell without more rides'], 2),
      feedback: { 0: '\\$2 per km is the rate of the distance part, but the fixed fee means fare ÷ km is not constant.', 1: '\\$3.50 per km is the 2 km ride only; at 4 km it is \\$2.75 per km.' },
      solution: 'Proportional means fare ÷ distance is constant. With a fixed fee it is not.',
      feedbackCorrect: 'Right — a constant rate plus a fixed fee is linear, but not proportional.', feedbackIncorrect: 'Compute fare ÷ distance for 2 km and for 4 km.',
    }),
  ],

  python: {
    intro: 'Unit rates and a proportion solver, reproducing the worked examples.',
    code: `deals = {"2 kg bag": (5.40, 2), "5 kg bag": (12.75, 5)}
for name, (price, kg) in deals.items():
    print(name, round(price / kg, 2), "per kg")

def solve_proportion(a, b, d):
    """Solve a/b = x/d for x."""
    return a * d / b

print(solve_proportion(3, 4, 10))
print(round(72 * 1000 / 3600, 2))`,
    output: '2 kg bag 2.7 per kg\n5 kg bag 2.55 per kg\n7.5\n20.0',
    explain: 'Python prints 2.7, not 2.70: rounding produces a number, and numbers carry no trailing zeros. To show money, format it: `f"{2.7:.2f}"` gives `2.70`.',
  },

  reading: [
    { title: 'Ratios and Rate (§5.6)', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/5-6-ratios-and-rate', note: 'Ratios, rates, unit rates and unit prices with more practice.' },
    { title: 'Solve Proportions and their Applications (§6.5)', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/6-5-solve-proportions-and-their-applications', note: 'Proportions, cross-multiplication and applications.' },
  ],
};
