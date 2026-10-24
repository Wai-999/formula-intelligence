import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'Five students (invented for this lesson) recorded hours of practice and their score on a 10-point quiz: (1, 3), (2, 5), (3, 4), (4, 8), (5, 10). The points do not lie on a line. Which single line describes them best — and what does “best” even mean?',
    body: [
      'Any line we draw misses most of the points. For each point, the miss is its **residual**: actual y minus the line’s predicted ŷ. A good line keeps the residuals small *overall*.',
      'The usual choice — **least squares** — picks the line that makes the sum of the squared residuals as small as possible. Squaring treats misses above and below the line alike and penalizes large misses heavily. This is the same line that statistics calls the regression line ($y\' = a + bx$ in Bluman’s Chapter 10).',
    ],
  },

  glossary: [
    { term: '$\\hat y = mx + b$', meaning: 'The fitted line; $\\hat y$ (“y-hat”) is a prediction, not an observation.' },
    { term: '$e_i = y_i - \\hat y_i$', meaning: 'The residual of point $i$: positive above the line, negative below.' },
    { term: '$\\bar x, \\bar y$', meaning: 'The means of the x-values and of the y-values.' },
    { term: '$S_{xy} = \\sum (x_i - \\bar x)(y_i - \\bar y)$', meaning: 'How x and y move together around their means.' },
    { term: '$S_{xx} = \\sum (x_i - \\bar x)^2$', meaning: 'How spread out the x-values are.' },
  ],

  priorCheck: [
    item({
      id: 'a1-fit.pre1', competency: 'alg.slope-intercept', difficulty: 1,
      prompt: 'For $\\hat y = 2x + 1$, what is the prediction at $x = 4$?',
      answer: num(9), compute: () => 2 * 4 + 1, solution: '$2 \\cdot 4 + 1 = 9$.', remedy: 'a1-slope-intercept',
    }),
    item({
      id: 'a1-fit.pre2', competency: 'stats.descriptive', difficulty: 1,
      prompt: 'What is the mean of 3, 5, 4, 8 and 10?',
      answer: num(6), compute: () => (3 + 5 + 4 + 8 + 10) / 5, solution: 'Sum 30, divided by 5 values: 6.',
    }),
  ],

  visualization: {
    lab: 'least-squares',
    intro: 'Adjust your own line to make the shaded squares as small as you can, then compare with the least-squares line. Then try the dataset with an outlier, and the curve.',
    textAlternative: 'The lab plots the data, your line, and optionally the least-squares line. Each residual is drawn as a vertical segment with a square on it. A sentence gives both lines and both sums of squared residuals; the table lists every residual and its square.',
  },

  derivation: {
    intro: 'Where do the formulas for the best slope and intercept come from? Two facts about quadratics do all the work. (The vertex fact in step 4 is taught properly in the Quadratics unit; it is stated here so the formula is not a black box.)',
    steps: [
      { say: 'The quantity to minimize is the sum of squared residuals, a function of the two unknowns $m$ and $b$:', math: 'SSE(m, b) = \\sum_{i=1}^{n} \\big(y_i - (m x_i + b)\\big)^2' },
      { say: 'Fix $m$ for a moment and write $d_i = y_i - m x_i$. Then $SSE = \\sum (d_i - b)^2$, and a sum of squared distances from a number $b$ is smallest when $b$ is the mean of the $d_i$:', math: 'b = \\bar d = \\bar y - m \\bar x' },
      { say: 'So the best line passes through the point of means $(\\bar x, \\bar y)$. Substituting this $b$ back in, every residual becomes $(y_i - \\bar y) - m(x_i - \\bar x)$, and expanding the square gives a quadratic in $m$ (where $S_{yy} = \\sum (y_i - \\bar y)^2$):', math: 'SSE(m) = S_{yy} - 2m\\,S_{xy} + m^2 S_{xx}' },
      { say: 'A quadratic $Am^2 + Bm + C$ with $A > 0$ is smallest at its vertex $m = -B/(2A)$. Here $A = S_{xx}$ and $B = -2S_{xy}$:', math: 'm = \\frac{S_{xy}}{S_{xx}} = \\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2}, \\qquad b = \\bar y - m\\bar x' },
    ],
    assumptions: [
      'Errors are measured vertically: we are predicting y from x. Predicting x from y gives a different line.',
      'A straight line is a sensible summary — check the residuals for a pattern before trusting it.',
      'Least squares describes association in these data. It does not show that x causes y.',
    ],
    domain: [
      'Needs $S_{xx} > 0$: at least two different x-values. If every x is the same, no slope can be estimated.',
      'Predictions are only trustworthy inside the range of the observed x-values; outside it (extrapolation) the line can give absurd answers.',
    ],
  },

  examples: [
    {
      title: 'The practice data',
      problem: 'Fit the least-squares line to (1, 3), (2, 5), (3, 4), (4, 8), (5, 10) and predict the score after 3.5 hours.',
      steps: [
        '$\\bar x = 3$, $\\bar y = 6$. Deviations: $x - \\bar x = -2, -1, 0, 1, 2$ and $y - \\bar y = -3, -1, -2, 2, 4$.',
        '$S_{xy} = 6 + 1 + 0 + 2 + 8 = 17$ and $S_{xx} = 4 + 1 + 0 + 1 + 4 = 10$.',
        '$m = 17/10 = 1.7$ and $b = 6 - 1.7 \\cdot 3 = 0.9$, so $\\hat y = 1.7x + 0.9$.',
        'At $x = 3.5$: $\\hat y = 1.7 \\cdot 3.5 + 0.9 = 6.85$.',
      ],
      answer: '$\\hat y = 1.7x + 0.9$; predicted score 6.85. Each extra hour goes with 1.7 more points **on average in these data**.',
      check: { value: 6.85, compute: () => 1.7 * 3.5 + 0.9 },
    },
    {
      title: 'Three points, by hand',
      problem: 'Fit the least-squares line to $(0, 1)$, $(1, 3)$, $(2, 2)$.',
      steps: ['$\\bar x = 1$, $\\bar y = 2$; deviations $-1, 0, 1$ and $-1, 1, 0$.', '$S_{xy} = 1 + 0 + 0 = 1$, $S_{xx} = 2$, so $m = 0.5$.', '$b = 2 - 0.5 \\cdot 1 = 1.5$.'],
      answer: '$\\hat y = 0.5x + 1.5$ — passing through none of the three points.',
      check: { value: 0.5, compute: () => ((0 - 1) * (1 - 2) + (1 - 1) * (3 - 2) + (2 - 1) * (2 - 2)) / 2 },
    },
  ],

  counterexample: {
    title: 'A perfect relationship with slope zero',
    body: [
      'Fit a line to $(-2, 4), (-1, 1), (0, 0), (1, 1), (2, 4)$ — points on $y = x^2$. Here $S_{xy} = 0$, so the least-squares line is the flat line $\\hat y = 2$.',
      'y depends on x perfectly, yet the best **line** says “no linear trend”. The residuals give it away: positive at both ends, negative in the middle — a pattern. Least squares answers the question you asked (best straight line), not the one you meant.',
    ],
  },

  predict: {
    prompt: 'How many of the five practice-data points does the least-squares line $\\hat y = 1.7x + 0.9$ pass through?',
    choices: ['All five', 'At least two — a best line must touch some points', 'Exactly one: the middle point', 'Possibly none'],
    answer: 3,
    reveal: 'None. At $x = 1, \\dots, 5$ the line gives 2.6, 4.3, 6.0, 7.7, 9.4 — not one equals its data value. It does pass through $(\\bar x, \\bar y) = (3, 6)$, which is not a data point.',
    misconception: {
      belief: 'The line of best fit should go through as many points as possible.',
      correction: 'Least squares balances all the misses at once. A line through two points can leave the others with large residuals and a bigger total; the best line often touches no point at all.',
    },
  },

  practice: [
    item({
      id: 'a1-fit.p1', competency: 'alg.line-fit', difficulty: 1, level: 'scaffolded',
      prompt: 'A dataset has $\\bar x = 4$ and $\\bar y = 10$, and its least-squares slope is $m = 2.5$. The line passes through $(\\bar x, \\bar y)$. Find $b$.',
      answer: num(0), compute: () => 10 - 2.5 * 4, hints: ['$b = \\bar y - m\\bar x$.'], solution: '$b = 10 - 2.5 \\cdot 4 = 0$.',
    }),
    item({
      id: 'a1-fit.p2', competency: 'alg.line-fit', difficulty: 1, level: 'scaffolded',
      prompt: 'An observation has $y = 12$ and the line predicts $\\hat y = 10.5$. What is its residual?',
      answer: num(1.5), compute: () => 12 - 10.5, hints: ['Residual = actual − predicted.'], solution: '$12 - 10.5 = 1.5$: the point is 1.5 above the line.',
    }),
    item({
      id: 'a1-fit.p3', competency: 'alg.line-fit', difficulty: 2, level: 'independent',
      prompt: 'Find the least-squares slope for $(1, 2), (2, 3), (3, 7)$.',
      answer: num(2.5), compute: () => ((1 - 2) * (2 - 4) + 0 + (3 - 2) * (7 - 4)) / 2,
      hints: ['$\\bar x = 2$, $\\bar y = 4$.', '$S_{xy} = (-1)(-2) + 0 + (1)(3)$.'],
      solution: '$S_{xy} = 2 + 0 + 3 = 5$, $S_{xx} = 2$, so $m = 2.5$.',
    }),
    item({
      id: 'a1-fit.p4', competency: 'alg.line-fit', difficulty: 2, level: 'independent',
      prompt: 'For the same three points, what is the intercept $b$?',
      answer: num(-1), compute: () => 4 - 2.5 * 2, hints: ['Use $b = \\bar y - m\\bar x$ with $m = 2.5$.'], solution: '$b = 4 - 2.5 \\cdot 2 = -1$, so $\\hat y = 2.5x - 1$.',
    }),
    item({
      id: 'a1-fit.p5', competency: 'alg.line-fit', difficulty: 2, level: 'independent',
      prompt: 'Which quantity does least squares make as small as possible?',
      answer: choice(['$\\sum (y_i - \\hat y_i)$', '$\\sum |y_i - \\hat y_i|$', '$\\sum (y_i - \\hat y_i)^2$', 'The number of points not on the line'], 2),
      feedback: { 0: 'For the least-squares line this sum is always exactly 0 — positive and negative misses cancel, so it cannot measure fit.', 1: 'That criterion exists (least absolute deviations) but gives a different line.' },
      solution: 'The sum of squared residuals.',
    }),
    item({
      id: 'a1-fit.p6', competency: 'alg.line-fit', difficulty: 3, level: 'transfer',
      prompt: 'A café fitted $\\hat y = 420 - 6.5x$ to (invented) data on daily hot-drink sales $y$ and temperature $x$ in °C, for days between 5 °C and 30 °C. How many drinks does the model predict on a 20 °C day?',
      answer: num(290), compute: () => 420 - 6.5 * 20, solution: '$420 - 6.5 \\cdot 20 = 290$ drinks.',
    }),
    item({
      id: 'a1-fit.p7', competency: 'alg.line-fit', difficulty: 3, level: 'transfer',
      prompt: 'The same model predicts $420 - 6.5 \\cdot 70 = -35$ drinks at 70 °C. What is the best explanation?',
      answer: choice(['Negative sales are possible on very hot days', 'The model is being used far outside the temperatures it was fitted on', 'The slope must have the wrong sign', 'The intercept should be 0'], 1),
      feedback: { 0: 'A count of drinks cannot be negative; the line, not the café, broke.', 2: 'Sales falling as temperature rises is plausible for hot drinks inside the data range.', 3: 'Forcing the line through 0 would make it fit the actual data worse.' },
      solution: 'Extrapolation: the data only covered 5–30 °C, and nothing guarantees the trend continues to 70 °C.',
    }),
  ],

  checkpoint: [
    item({
      id: 'a1-fit.c1', competency: 'alg.line-fit', difficulty: 1,
      prompt: 'A point has observed $y = 7.5$ and predicted $\\hat y = 8.25$. What is its residual?',
      answer: num(-0.75), compute: () => 7.5 - 8.25, solution: '$7.5 - 8.25 = -0.75$: the point is below the line.',
      feedbackCorrect: 'Right — negative means below the line.', feedbackIncorrect: 'Residual = observed − predicted, in that order.',
    }),
    item({
      id: 'a1-fit.c2', competency: 'alg.line-fit', difficulty: 2,
      prompt: 'Find the least-squares slope for $(0, 1), (2, 5), (4, 6)$.',
      answer: num(1.25), compute: () => ((0 - 2) * (1 - 4) + 0 + (4 - 2) * (6 - 4)) / 8,
      solution: '$\\bar x = 2$, $\\bar y = 4$; $S_{xy} = 6 + 0 + 4 = 10$; $S_{xx} = 4 + 0 + 4 = 8$; $m = 1.25$.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Compute the means first ($\\bar x = 2$, $\\bar y = 4$), then $S_{xy}$ and $S_{xx}$.',
    }),
    item({
      id: 'a1-fit.c3', competency: 'alg.line-fit', difficulty: 3,
      prompt: 'In (invented) data on students, the least-squares slope of exam score on hours slept the night before is 3.1 points per hour. Which conclusion is justified?',
      answer: choice(['Sleeping one more hour causes a 3.1-point gain', 'In these data, students who slept an hour more scored 3.1 points higher on average', 'Every student gains exactly 3.1 points per hour of sleep', 'Hours slept explains all the variation in scores'], 1),
      feedback: { 0: 'A fitted slope shows association. Causation needs a design that rules out other explanations (Probability & Statistics, causal basics).', 2: 'The slope describes an average trend; individual points scatter around it.', 3: 'Nothing about the slope says how tightly points cluster — that is what $r^2$ measures.' },
      solution: 'A regression slope summarizes an average association in the observed data.',
      feedbackCorrect: 'Right: association, on average, in these data.', feedbackIncorrect: 'Ask: what does a slope of a fitted line actually summarize?',
    }),
  ],

  python: {
    intro: 'Compute the slope and intercept from the formulas, then check them against NumPy’s polynomial fit — two independent routes to the same line. The data are the synthetic practice scores.',
    code: `import numpy as np

x = np.array([1, 2, 3, 4, 5], dtype=float)   # hours of practice (synthetic)
y = np.array([3, 5, 4, 8, 10], dtype=float)  # quiz score out of 10

m = np.sum((x - x.mean()) * (y - y.mean())) / np.sum((x - x.mean()) ** 2)
b = y.mean() - m * x.mean()
print(round(m, 6), round(b, 6))

m2, b2 = np.polyfit(x, y, 1)
print(np.isclose(m, m2), np.isclose(b, b2))

residuals = y - (m * x + b)
print(np.round(residuals, 6))
print(round(float(np.sum(residuals ** 2)), 6))`,
    output: '1.7 0.9\nTrue True\n[ 0.4  0.7 -2.   0.3  0.6]\n5.1',
    explain: 'Rounding hides floating-point noise in the last digits (b is computed as 0.9000000000000004). Comparing with `np.isclose`, not `==`, is the right habit for any computed number. The residuals sum to zero and their squares to 5.1 — the smallest total any line can achieve here.',
  },

  reading: [
    { title: 'The Regression Equation (§12.3)', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/12-3-the-regression-equation', note: 'The same line from the statistics side, with r and r².' },
    { title: 'numpy.polyfit', source: 'NumPy documentation', url: 'https://numpy.org/doc/stable/reference/generated/numpy.polyfit.html', note: 'The least-squares polynomial fit used in the Python section.' },
  ],
};
