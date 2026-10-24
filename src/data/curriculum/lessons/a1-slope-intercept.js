import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'The ride app charges a \\$3 booking fee and \\$2 per kilometre. Can one short equation give the fare for every distance — and tell you, at a glance, what happens to the graph if the booking fee rises to \\$5?',
    body: [
      'Fare = 3 + 2 × distance. Every non-vertical line has this shape: a **starting value** plus a **constant rate** times the input. Written with letters, $y = mx + b$.',
      'The two numbers do two different jobs. $b$ says where the line starts (its height at $x = 0$); $m$ says how steeply it climbs. Change $b$ and the line slides up or down without turning. Change $m$ and it turns around the point $(0, b)$.',
    ],
  },

  glossary: [
    { term: '$y = mx + b$', meaning: 'Slope–intercept form of a line.' },
    { term: '$m$', meaning: 'The slope: change in y per unit of x.' },
    { term: '$b$', meaning: 'The y-intercept: the value of y when $x = 0$; the line passes through $(0, b)$.' },
    { term: 'x-intercept', meaning: 'Where the line crosses the x-axis ($y = 0$). For $m \\ne 0$ it is $x = -b/m$.' },
    { term: 'parallel', meaning: 'Two different lines with the same slope never meet.' },
  ],

  priorCheck: [
    item({
      id: 'a1-si.pre1', competency: 'alg.slope', difficulty: 1,
      prompt: 'Find the slope of the line through $(1, 4)$ and $(3, 10)$.',
      answer: num(3), compute: () => (10 - 4) / (3 - 1),
      solution: '$(10 - 4)/(3 - 1) = 6/2 = 3$.',
      remedy: 'a1-slope',
    }),
    item({
      id: 'a1-si.pre2', competency: 'arith.equations', difficulty: 1,
      prompt: 'Solve for $b$: $7 = 2 \\cdot 2 + b$.',
      answer: num(3), compute: () => 7 - 2 * 2,
      solution: '$7 = 4 + b$, so subtract 4 from both sides: $b = 3$.',
      remedy: 'pa-equation-balance',
    }),
  ],

  visualization: {
    lab: 'function-transformations',
    config: { mode: 'line' },
    intro: 'Start with the ride fare, $y = 2x + 3$. Raise the booking fee to 5 with the b slider, then make kilometres cheaper with the m slider. Say what you expect before each move.',
    textAlternative: 'The lab draws y = mx + b with its y-intercept and x-intercept marked and a one-unit step showing the slope. A sentence states the equation, both intercepts and the rate; the table lists y for x from −2 to 4.',
    more: [{ lab: 'function-transformations', config: { mode: 'general' }, intro: 'Adding b slides a line up; the same move slides ANY graph up. Try $y = a\\,f(x - h) + k$ on other parent functions — the Algebra II unit on transformations starts here.' }],
  },

  derivation: {
    intro: 'Why must every non-vertical line be $y = mx + b$ — and how do we find $b$ from any point?',
    steps: [
      { say: 'Let the line have slope $m$ and cross the y-axis at $(0, b)$. Take any other point $(x, y)$ on it. The slope between those two points must be $m$:', math: '\\frac{y - b}{x - 0} = m \\qquad (x \\ne 0)' },
      { say: 'Multiply both sides by $x$, then add $b$ to both sides:', math: 'y - b = mx \\quad\\Longrightarrow\\quad y = mx + b' },
      { say: 'The point we set aside, $x = 0$, is $(0, b)$ itself, and it satisfies $y = m \\cdot 0 + b$ too. So the equation holds for every point of the line.' },
      { say: 'If instead we know the slope and some point $(x_1, y_1)$, the same argument gives point–slope form, and solving for y shows what b must be:', math: 'y - y_1 = m(x - x_1) \\quad\\Longrightarrow\\quad y = mx + (y_1 - m x_1), \\qquad b = y_1 - m x_1' },
    ],
    assumptions: [
      'The line is not vertical. A vertical line $x = c$ has no slope, so it has no slope–intercept form.',
      'In a context, $b$ only means “starting value” if $x = 0$ makes sense there (zero kilometres, time zero).',
    ],
    domain: [
      'As a pure equation, any real $x$. In context the domain is often restricted — distance cannot be negative, so the fare line only applies for $x \\ge 0$.',
    ],
  },

  examples: [
    {
      title: 'From a slope and a point',
      problem: 'A line has slope $2$ and passes through $(2, 7)$. Write its equation and check another point.',
      steps: ['$b = y_1 - m x_1 = 7 - 2 \\cdot 2 = 3$.', 'So $y = 2x + 3$.', 'Check $(6, 15)$: $2 \\cdot 6 + 3 = 15$. ✓ (It is the second ride receipt.)'],
      answer: '$y = 2x + 3$',
      check: { value: 3, compute: () => 7 - 2 * 2 },
    },
    {
      title: 'From two points',
      problem: 'Write the equation of the line through $(-2, 5)$ and $(4, -1)$, and find its x-intercept.',
      steps: ['$m = (-1 - 5)/(4 - (-2)) = -6/6 = -1$.', '$b = 5 - (-1)(-2) = 5 - 2 = 3$, so $y = -x + 3$.', 'x-intercept: $0 = -x + 3$ gives $x = 3$.'],
      answer: '$y = -x + 3$, crossing the x-axis at $(3, 0)$.',
      check: { value: 3, compute: () => 5 - ((-1 - 5) / (4 - -2)) * -2 },
    },
  ],

  counterexample: {
    title: 'Two things slope–intercept form cannot say',
    body: [
      'The vertical line through $(4, 0)$ and $(4, 3)$ is $x = 4$. There is no $m$ that works, because its slope is undefined.',
      'A data plan that charges \\$10 for up to 5 GB and \\$4 for each GB after that is two lines, not one: $y = 10$ for $0 \\le x \\le 5$ and $y = 10 + 4(x - 5)$ for $x > 5$. A single $y = mx + b$ fits one piece only. Always check that one constant rate really describes the whole situation.',
    ],
  },

  predict: {
    prompt: 'For $y = 2x + 3$, the x-intercept is $-1.5$. If $b$ changes from 3 to 5, where does the x-intercept go?',
    choices: ['It moves 1 to the right', 'It moves 1 to the left', 'It does not move — only the y-intercept changes', 'It moves up 2'],
    answer: 1,
    reveal: 'The new x-intercept is $-5/2 = -2.5$: one unit to the **left**. Raising b lifts every point of the line by 2. Because the slope is 2, a line lifted by 2 looks exactly like the old line moved left by 1.',
    misconception: {
      belief: 'Changing b only moves the y-intercept.',
      correction: 'b is added to every y-value, so the whole line moves. Every point — both intercepts included — is on the new, parallel line.',
    },
  },

  practice: [
    item({
      id: 'a1-si.p1', competency: 'alg.slope-intercept', difficulty: 1, level: 'scaffolded',
      prompt: 'In $y = -4x + 7$, what is the slope?',
      answer: num(-4), hints: ['The slope is the number multiplying x.'], solution: 'Comparing with $y = mx + b$: $m = -4$.',
    }),
    item({
      id: 'a1-si.p2', competency: 'alg.slope-intercept', difficulty: 1, level: 'scaffolded',
      prompt: 'In $y = -4x + 7$, what is y when $x = 0$?',
      answer: num(7), compute: () => ((x) => -4 * x + 7)(0), hints: ['Substitute $x = 0$.'], solution: '$y = -4 \\cdot 0 + 7 = 7$: that is the y-intercept, b.',
    }),
    item({
      id: 'a1-si.p3', competency: 'alg.slope-intercept', difficulty: 2, level: 'independent',
      prompt: 'A line has slope 3 and passes through $(2, 1)$. What is $b$?',
      answer: num(-5), compute: () => 1 - 3 * 2, hints: ['$b = y_1 - m x_1$.'], solution: '$b = 1 - 3 \\cdot 2 = -5$, so $y = 3x - 5$.',
    }),
    item({
      id: 'a1-si.p4', competency: 'alg.slope-intercept', difficulty: 2, level: 'independent',
      prompt: 'A line passes through $(1, 4)$ and $(3, 8)$. What is its y-intercept $b$?',
      answer: num(2), compute: () => 4 - ((8 - 4) / (3 - 1)) * 1, hints: ['Find m first.', 'm = 2; then b = 4 − 2·1.'], solution: '$m = 4/2 = 2$, $b = 4 - 2 = 2$: $y = 2x + 2$.',
    }),
    item({
      id: 'a1-si.p5', competency: 'alg.slope-intercept', difficulty: 2, level: 'independent',
      prompt: 'Which line is parallel to $y = 2x - 1$?',
      answer: choice(['$y = -2x + 1$', '$y = 2x + 5$', '$y = 0.5x - 1$', '$y = -0.5x$'], 1),
      feedback: { 0: 'Opposite slope means the lines cross; parallel needs the SAME slope.', 2: 'This shares the intercept −1, not the slope.', 3: 'Slopes 2 and −0.5 multiply to −1: these lines are perpendicular, not parallel.' },
      solution: 'Parallel lines have equal slopes and different intercepts: $y = 2x + 5$.',
    }),
    item({
      id: 'a1-si.p6', competency: 'alg.slope-intercept', difficulty: 3, level: 'transfer',
      prompt: 'A gym charges a joining fee plus a fixed monthly fee. After 3 months you have paid \\$95 in total; after 7 months, \\$175. What was the joining fee, in dollars?',
      answer: num(35), compute: () => 95 - ((175 - 95) / (7 - 3)) * 3,
      hints: ['Points (months, total): (3, 95) and (7, 175).', 'The joining fee is the total at 0 months: b.'],
      solution: '$m = 80/4 = 20$ dollars a month; $b = 95 - 20 \\cdot 3 = 35$ dollars.',
    }),
    item({
      id: 'a1-si.p7', competency: 'alg.slope-intercept', difficulty: 3, level: 'transfer',
      prompt: 'A 24 cm candle burns down 1.5 cm per hour. After how many hours is it 15 cm tall?',
      answer: num(6), compute: () => (24 - 15) / 1.5,
      hints: ['Height $y = -1.5t + 24$.', 'Set $y = 15$ and solve.'],
      solution: '$15 = -1.5t + 24 \\Rightarrow 1.5t = 9 \\Rightarrow t = 6$ hours.',
    }),
  ],

  checkpoint: [
    item({
      id: 'a1-si.c1', competency: 'alg.slope-intercept', difficulty: 1,
      prompt: 'What is the y-intercept of $y = 0.5x - 3$?',
      answer: num(-3), solution: 'b = −3: the line passes through (0, −3).',
      feedbackCorrect: 'Right — and note the sign comes with it.', feedbackIncorrect: 'In $y = mx + b$, b is the constant term, sign included: here $-3$.',
    }),
    item({
      id: 'a1-si.c2', competency: 'alg.slope-intercept', difficulty: 2,
      prompt: 'A line has slope $-2$ and passes through $(3, 1)$. What is $b$?',
      answer: num(7), compute: () => 1 - -2 * 3, solution: '$b = 1 - (-2)(3) = 1 + 6 = 7$, so $y = -2x + 7$.',
      feedbackCorrect: 'Right — including the double negative.', feedbackIncorrect: 'Use $b = y_1 - m x_1 = 1 - (-2)(3)$. Subtracting a negative product adds.',
    }),
    item({
      id: 'a1-si.c3', competency: 'alg.slope-intercept', difficulty: 3,
      prompt: 'A delivery van starts the day with 80 litres of fuel and uses 12 litres per hour of driving. How many litres remain after 4.5 hours?',
      answer: num(26), compute: () => 80 - 12 * 4.5, solution: '$y = -12x + 80$; at $x = 4.5$: $80 - 54 = 26$ litres.',
      feedbackCorrect: 'Right: b = 80 is the starting amount, m = −12 the rate.', feedbackIncorrect: 'The starting amount is b = 80 and the rate is m = −12 L/h. Evaluate at x = 4.5.',
    }),
  ],

  python: {
    intro: 'Given two points, compute m and then b = y₁ − m·x₁ — the same two steps as the worked example.',
    code: `def line_through(p1, p2):
    (x1, y1), (x2, y2) = p1, p2
    m = (y2 - y1) / (x2 - x1)
    b = y1 - m * x1
    return m, b

print(*line_through((2, 7), (6, 15)))
print(*line_through((-2, 5), (4, -1)))

fare = lambda km: 2.0 * km + 3.0
print([fare(km) for km in [0, 1, 2, 5]])`,
    output: '2.0 3.0\n-1.0 3.0\n[3.0, 5.0, 7.0, 13.0]',
    explain: 'The first two lines reproduce both worked examples; the list is the fare at 0, 1, 2 and 5 km — the y-intercept first.',
  },

  reading: [
    { title: 'Use the Slope–Intercept Form of an Equation of a Line (§4.5)', source: 'OpenStax, Elementary Algebra 2e', url: 'https://openstax.org/books/elementary-algebra-2e/pages/4-5-use-the-slope-intercept-form-of-an-equation-of-a-line', note: 'Graphing from m and b, and recognising parallel and perpendicular lines.' },
    { title: 'Transformation of Functions (§3.5)', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/3-5-transformation-of-functions', note: 'Where “slide and turn” goes next: shifts and stretches of any function.' },
  ],
};
