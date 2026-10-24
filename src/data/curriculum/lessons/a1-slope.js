import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A ride-hailing app charges a fixed booking fee plus a price per kilometre. A 2 km ride cost \\$7 and a 6 km ride cost \\$15. How much does each extra kilometre cost — and can two receipts really tell you?',
    body: [
      'Between the two rides the distance grew by 4 km and the fare grew by \\$8. If every kilometre costs the same, each one must cost \\$8 ÷ 4 = \\$2. That number — **how much the output changes for each one-unit change in the input** — is the slope.',
      'Slope is a rate. It always has units: dollars per kilometre, litres per minute, metres per hour. Reading a slope means saying that sentence out loud, units included.',
    ],
  },

  glossary: [
    { term: '$(x_1, y_1)$, $(x_2, y_2)$', meaning: 'Two points on the line. The subscripts only name them; they are not exponents.' },
    { term: '$\\Delta y = y_2 - y_1$', meaning: 'The rise: the change in the output. Δ (delta) means “change in”.' },
    { term: '$\\Delta x = x_2 - x_1$', meaning: 'The run: the change in the input.' },
    { term: '$m$', meaning: 'The slope, $\\Delta y / \\Delta x$, in units of y per unit of x.' },
  ],

  priorCheck: [
    item({
      id: 'a1-slope.pre1', competency: 'arith.ratios', difficulty: 1,
      prompt: 'A car travels 150 km in 3 hours at a steady speed. How many kilometres does it travel per hour?',
      answer: num(50), compute: () => 150 / 3,
      solution: '150 ÷ 3 = 50 km per hour. A rate divides one quantity by another.',
      remedy: 'pa-ratios-rates',
    }),
    item({
      id: 'a1-slope.pre2', competency: 'arith.coordinates', difficulty: 1,
      prompt: 'Which point is 2 units to the left of the y-axis and 3 units above the x-axis?',
      answer: choice(['$(2, 3)$', '$(-2, 3)$', '$(3, -2)$', '$(-3, 2)$'], 1),
      feedback: { 0: '(2, 3) is to the RIGHT of the y-axis: positive x means right.', 3: 'The first coordinate is x (left/right). Here x = −3 is 3 units left.' },
      solution: 'Left of the y-axis means negative x, so x = −2; above the x-axis means positive y, so y = 3: the point (−2, 3).',
    }),
  ],

  visualization: {
    lab: 'slope',
    config: { mode: 'points' },
    intro: 'The “Ride fare” example puts the two receipts on a graph: (2, 7) and (6, 15). Try the other examples, then drag a point and predict the slope before you look.',
    textAlternative: 'The lab plots two points and the line through them, with the horizontal run and vertical rise drawn as the legs of a right triangle. A live sentence and a table give the points, rise, run and slope, so the lab can be used entirely without the picture.',
  },

  derivation: {
    intro: 'Why is “rise over run” the right definition, and why does it not matter which two points we pick?',
    steps: [
      { say: 'A non-vertical line is exactly a graph on which equal steps in x always produce equal steps in y. So there is one number — change in y per one unit of x — that describes the whole line.' },
      { say: 'Moving from $P_1$ to $P_2$ changes y by $\\Delta y = y_2 - y_1$ and x by $\\Delta x = x_2 - x_1$. Spread evenly, the change per unit of x is', math: 'm = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}' },
      { say: 'The order of the points does not matter, because swapping them negates both the top and the bottom:', math: '\\frac{y_1 - y_2}{x_1 - x_2} = \\frac{-(y_2 - y_1)}{-(x_2 - x_1)} = \\frac{y_2 - y_1}{x_2 - x_1}' },
      { say: 'Any other pair of points on the same line gives the same value: the rise–run triangles they form are similar (same angles), and similar triangles have the same ratio of legs. That is what “the slope of a line” means.' },
    ],
    assumptions: [
      'The two points are distinct and lie on the same straight line.',
      'The units of $m$ are (units of y) per (unit of x); a slope without units is only half an answer.',
    ],
    domain: [
      'Requires $x_1 \\ne x_2$. If $x_1 = x_2$ the line is vertical, $\\Delta x = 0$, and the slope is **undefined** — not zero, and not a number at all.',
    ],
  },

  examples: [
    {
      title: 'A falling line',
      problem: 'Find the slope of the line through $(-1, 4)$ and $(3, -4)$, and say what it means.',
      steps: [
        'Rise: $\\Delta y = -4 - 4 = -8$.',
        'Run: $\\Delta x = 3 - (-1) = 4$. Subtracting a negative adds.',
        '$m = -8 / 4 = -2$.',
      ],
      answer: '$m = -2$: y falls by 2 for every 1 that x increases.',
      check: { value: -2, compute: () => (-4 - 4) / (3 - -1) },
    },
    {
      title: 'A draining tank (with units)',
      problem: 'A tank holds 340 litres after 2 minutes of draining and 190 litres after 7 minutes, draining steadily. What is the slope, with units?',
      steps: [
        'Input x is time in minutes; output y is volume in litres.',
        '$\\Delta y = 190 - 340 = -150$ litres; $\\Delta x = 7 - 2 = 5$ minutes.',
        '$m = -150 / 5 = -30$ litres per minute.',
      ],
      answer: '$m = -30$ L/min: the tank loses 30 litres every minute. The negative sign is the word “loses”.',
      check: { value: -30, compute: () => (190 - 340) / (7 - 2) },
    },
  ],

  counterexample: {
    title: 'Where “the slope” stops making sense',
    body: [
      'Take three points from $y = x^2$: $(1, 1)$, $(2, 4)$ and $(3, 9)$. From the first to the second the slope is $3$; from the second to the third it is $5$. There is no single slope: the points do not lie on a line, and the rate depends on where you measure it.',
      'That is not a failure of the idea — it is where calculus starts. The derivative (Calculus I) asks for the slope at a single point of a curve.',
    ],
  },

  predict: {
    prompt: 'Before you calculate: what is the slope of the line through $(2, 5)$ and $(2, -1)$?',
    choices: ['$0$', '$6$', '$-6$', 'Undefined'],
    answer: 3,
    reveal: 'Both points have $x = 2$, so the run is $0$ and $\\frac{-6}{0}$ has no value. The line is vertical, and its slope is undefined. Try it in the lab with the “Vertical” example.',
    misconception: {
      belief: 'A vertical line has slope 0.',
      correction: 'Slope 0 means **no rise**: a horizontal line, where y never changes. A vertical line has **no run**, and division by zero is undefined. “Flat” and “straight up” are opposites, so their slopes cannot be the same number.',
    },
  },

  practice: [
    item({
      id: 'a1-slope.p1', competency: 'alg.slope', difficulty: 1, level: 'scaffolded',
      prompt: 'Find the slope through $(1, 2)$ and $(4, 11)$. Step 1: the rise is $11 - 2$. Step 2: the run is $4 - 1$. Step 3: divide.',
      answer: num(3), compute: () => (11 - 2) / (4 - 1),
      hints: ['The rise is 9.', 'The run is 3.'],
      solution: '$m = (11 - 2)/(4 - 1) = 9/3 = 3$.',
    }),
    item({
      id: 'a1-slope.p2', competency: 'alg.slope', difficulty: 1, level: 'scaffolded',
      prompt: 'Find the slope through $(0, 5)$ and $(2, 1)$.',
      answer: num(-2), compute: () => (1 - 5) / (2 - 0),
      hints: ['Subtract in the same order on top and bottom: $(1 - 5)/(2 - 0)$.'],
      solution: '$m = (1 - 5)/(2 - 0) = -4/2 = -2$.',
    }),
    item({
      id: 'a1-slope.p3', competency: 'alg.slope', difficulty: 2, level: 'independent',
      prompt: 'Find the slope through $(-3, -2)$ and $(5, 2)$. A fraction or a decimal is fine.',
      answer: num(0.5), compute: () => (2 - -2) / (5 - -3),
      hints: ['Both subtractions involve a negative number: $2 - (-2)$ and $5 - (-3)$.'],
      solution: '$m = (2 - (-2))/(5 - (-3)) = 4/8 = 1/2$.',
    }),
    item({
      id: 'a1-slope.p4', competency: 'alg.slope', difficulty: 2, level: 'independent',
      prompt: 'Which pair of points lies on a line with slope $0$?',
      answer: choice(['$(1, 3)$ and $(3, 1)$', '$(2, 4)$ and $(5, 4)$', '$(3, 1)$ and $(3, 6)$', '$(0, 0)$ and $(4, 4)$'], 1),
      feedback: { 2: 'Same x-values give a vertical line: the slope is undefined, not 0.', 0: 'Here y falls by 2 while x rises by 2: slope −1.', 3: 'This line rises 4 over a run of 4: slope 1.' },
      solution: 'Slope 0 needs no rise: equal y-values. Only $(2, 4)$ and $(5, 4)$ have that.',
    }),
    item({
      id: 'a1-slope.p5', competency: 'alg.slope', difficulty: 3, level: 'transfer',
      prompt: 'A phone plan bills linearly by data. Using 3 GB costs \\$34 and using 8 GB costs \\$49. What does each additional gigabyte cost, in dollars?',
      answer: num(3), compute: () => (49 - 34) / (8 - 3),
      hints: ['Treat the plans as points (GB, dollars).', 'Rise = 49 − 34 dollars, run = 8 − 3 GB.'],
      solution: '$m = (49 - 34)/(8 - 3) = 15/5 = 3$ dollars per GB.',
    }),
    item({
      id: 'a1-slope.p6', competency: 'alg.slope', difficulty: 3, level: 'transfer',
      prompt: 'On a steady climb a hiker’s altimeter reads 1,250 m at 9:00 and 1,610 m at 11:00. What is the rate of climb in metres per hour?',
      answer: num(180), compute: () => (1610 - 1250) / 2,
      hints: ['How many hours pass from 9:00 to 11:00?'],
      solution: 'Rise 360 m over a run of 2 hours: $m = 360/2 = 180$ m per hour.',
    }),
  ],

  checkpoint: [
    item({
      id: 'a1-slope.c1', competency: 'alg.slope', difficulty: 1,
      prompt: 'Find the slope of the line through $(2, -3)$ and $(6, 5)$.',
      answer: num(2), compute: () => (5 - -3) / (6 - 2),
      solution: '$m = (5 - (-3))/(6 - 2) = 8/4 = 2$.',
      feedbackCorrect: 'Right — including the subtraction of a negative.',
      feedbackIncorrect: 'Check $5 - (-3)$: subtracting a negative adds, giving 8. Then divide by the run, 4.',
    }),
    item({
      id: 'a1-slope.c2', competency: 'alg.slope', difficulty: 2,
      prompt: 'A line passes through $(-1, 7)$ and $(3, 7)$. Its slope is…',
      answer: choice(['$0$', 'undefined', '$7$', '$1$'], 0),
      feedback: { 1: 'Undefined belongs to vertical lines (equal x). Here the x-values differ and the y-values are equal.', 2: '7 is the y-value both points share, not a rate of change.' },
      solution: 'The rise is $7 - 7 = 0$ over a run of 4, so $m = 0$: a horizontal line.',
      feedbackCorrect: 'Right: no rise means slope 0.',
      feedbackIncorrect: 'Compute the rise first: both points have y = 7.',
    }),
    item({
      id: 'a1-slope.c3', competency: 'alg.slope', difficulty: 3,
      prompt: 'A printer has printed 42 pages after 3 minutes and 112 pages after 8 minutes, at a steady rate. How many pages does it print per minute?',
      answer: num(14), compute: () => (112 - 42) / (8 - 3),
      solution: 'Rise 70 pages over a run of 5 minutes: 14 pages per minute.',
      feedbackCorrect: 'Right — a slope with units: pages per minute.',
      feedbackIncorrect: 'Make points (minutes, pages): (3, 42) and (8, 112). Rise ÷ run.',
    }),
  ],

  python: {
    intro: 'The definition becomes a three-line function. The vertical case is handled explicitly instead of letting Python raise ZeroDivisionError with no explanation.',
    code: `def slope(p1, p2):
    (x1, y1), (x2, y2) = p1, p2
    if x1 == x2:
        raise ValueError("vertical line: slope undefined")
    return (y2 - y1) / (x2 - x1)

print(slope((2, 7), (6, 15)))     # ride fare: dollars per km
print(slope((-1, 4), (3, -4)))
print(slope((2, 340), (7, 190)))  # tank: litres per minute`,
    output: '2.0\n-2.0\n-30.0',
    explain: 'Each result matches a worked example above. Python prints 2.0 rather than 2 because `/` always produces a float.',
  },

  reading: [
    { title: 'Understand Slope of a Line (§4.4)', source: 'OpenStax, Elementary Algebra 2e', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-4-understand-slope-of-a-line', note: 'More practice with geoboards and graphs, including the slope formula.' },
    { title: 'Ratios and Rate (§5.6)', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/5-6-ratios-and-rate', note: 'Review of rates and unit rates, if the units felt unfamiliar.' },
  ],
};
