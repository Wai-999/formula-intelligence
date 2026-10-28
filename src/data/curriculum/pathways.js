// Learning paths: the order in which courses and lessons are recommended
// (src/lib/learningPath.js decides "what next" from this; the generated map
// is docs/LEARNING_PATH_MAP.md, `npm run docs:path`).
//
// These are self-study paths. They are not degree, transfer or
// certification requirements, and nothing here claims a course
// equivalency at any college.
//
// Two kinds:
//   route  every catalog course, in the order the path recommends them.
//          Outline-only courses stay in the route so the map is honest about
//          what is missing, but "next" passes over them with a note.
//   track  an optional, applied sequence of written lessons across courses,
//          with the planned topics it would need (named by their exact
//          planned titles in the catalog) and a final project.

export const DEFAULT_PATH = 'data-science';

export const PATHS = [
  {
    id: 'data-science',
    kind: 'route',
    title: 'Data Science Foundations → Advanced Applications',
    summary: 'From number sense to machine learning. Courses come in the order of the catalog’s levels, each after the courses it lists as prerequisites.',
    // Ordered by catalog level (1–7), then catalog order; prerequisites first
    // (tested). Branches that need only Algebra I — Probability & Statistics,
    // Linear Algebra, Python — can be taken in any order after it.
    courses: [
      'prealgebra',
      'algebra-1',
      'python-ds',
      'algebra-2',
      'prob-stats',
      'precalculus',
      'linear-algebra',
      'calculus-1',
      'calculus-2',
      'ml-foundations',
      'calculus-3',
    ],
    parallel: {
      'python-ds': 'Can be studied alongside algebra: it has no prerequisite, and no course here requires it yet.',
      'prob-stats': 'Needs only Algebra I, so it can be studied alongside Linear Algebra.',
      'linear-algebra': 'Needs only Algebra I, so it can be studied alongside Probability & Statistics.',
    },
  },
  {
    id: 'track.data-science',
    kind: 'track',
    title: 'Data science and machine learning',
    summary: 'Fit, compress and evaluate models — and know when their numbers can be trusted.',
    steps: [
      { lesson: 'a1-line-fit', why: 'Least squares: the first model most analysts fit to data.' },
      { lesson: 'st-sampling-clt', why: 'How much an average varies from one sample to the next.' },
      { lesson: 'st-bayes', why: 'Updating a probability with evidence, and why base rates matter.' },
      { lesson: 'la-dot-product', why: 'Similarity between vectors, the idea behind recommendations.' },
      { lesson: 'la-matrix-scores', why: 'A data table times a weight vector: how a linear model scores every row.' },
      { lesson: 'la-svd-pca', why: 'Compressing many measurements into a few directions.' },
      { lesson: 'c3-gradient-descent', why: 'How models are fitted when no formula gives the answer.' },
      { lesson: 'ml-validation', why: 'Estimating performance on data the model has not seen.' },
      { lesson: 'ml-classification-metrics', why: 'Precision, recall and the cost of each kind of mistake.' },
      { lesson: 'ml-calibration-fairness', why: 'Whether predicted probabilities mean what they say, for every group.' },
      { planned: 'Logistic regression', course: 'ml-foundations', why: 'The standard model for yes/no outcomes.' },
      { planned: 'Regularization', course: 'ml-foundations', why: 'Trading a little fit for a model that generalizes.' },
    ],
    project: 'proj.diagnosis',
  },
  {
    id: 'track.business',
    kind: 'track',
    title: 'Business, sales and marketing analytics',
    summary: 'Prices, costs, demand and forecasts — decisions a small business makes every week.',
    steps: [
      { lesson: 'pa-ratios-rates', why: 'Unit prices and rates: comparing offers of different sizes fairly.' },
      { lesson: 'a1-break-even', why: 'How many sales cover the fixed costs.' },
      { lesson: 'a1-slope', why: 'Rates of change with units: dollars per unit, sales per week.' },
      { lesson: 'a1-line-fit', why: 'Fitting a demand line to past prices and sales.' },
      { lesson: 'c1-marginal-cost', why: 'The cost of one more unit, and why it differs from the average cost.' },
      { lesson: 'st-sampling-clt', why: 'How much a weekly average can move by chance alone.' },
      { lesson: 'ml-validation', why: 'Checking a forecast on weeks it was not fitted to.' },
      { planned: 'Confidence intervals (chapter 7)', course: 'prob-stats', why: 'Comparing two campaigns without over-reading a small difference.' },
      { planned: 'Optimization', course: 'calculus-1', why: 'Choosing the price that maximizes profit, not sales.' },
    ],
    project: 'proj.pricing',
  },
  {
    id: 'track.finance',
    kind: 'track',
    title: 'Finance and economics',
    summary: 'Budgets, costs and changing rates: the arithmetic behind prices, wages and saving.',
    steps: [
      { lesson: 'pa-ratios-rates', why: 'Rates and percentages behind prices, wages and interest.' },
      { lesson: 'pa-equation-balance', why: 'Solving for the unknown amount in a budget.' },
      { lesson: 'a1-break-even', why: 'Fixed and variable costs, and the break-even point.' },
      { lesson: 'a1-slope-intercept', why: 'A fixed fee plus a rate: the intercept and slope of a cost line.' },
      { lesson: 'c1-marginal-cost', why: 'Marginal cost: the derivative economists use every day.' },
      { lesson: 'c2-riemann', why: 'Adding up a rate that changes over time.' },
      { planned: 'Exponential growth and decay', course: 'algebra-1', why: 'Compound growth of savings and prices.' },
      { planned: 'Arithmetic and geometric sequences', course: 'algebra-2', why: 'Regular payments: loans, rent and pensions.' },
    ],
    project: 'proj.budget',
  },
  {
    id: 'track.physics',
    kind: 'track',
    title: 'Physics, robotics and optimization',
    summary: 'Motion, directions and minimization: the mathematics of things that move and of finding the best setting.',
    steps: [
      { lesson: 'a1-slope', why: 'Speed as a slope: distance over time.' },
      { lesson: 'c1-derivative', why: 'Instantaneous rate of change: velocity from position.' },
      { lesson: 'c2-riemann', why: 'Distance travelled, from a changing speed.' },
      { lesson: 'c2-taylor', why: 'Approximating a function near a point, as in small-angle models.' },
      { lesson: 'la-dot-product', why: 'Components and the angle between two directions.' },
      { lesson: 'la-matrix-transform', why: 'Rotations and scalings as matrices.' },
      { lesson: 'la-elimination', why: 'Solving systems of linear equations, as in force balances or circuits.' },
      { lesson: 'c3-gradient', why: 'The direction of steepest ascent on a surface.' },
      { lesson: 'c3-gradient-descent', why: 'Minimizing an error or an energy by walking downhill.' },
      { planned: 'Components, magnitude and direction', course: 'precalculus', why: 'Resolving a force into parts.' },
      { planned: 'Euler’s method', course: 'calculus-3', why: 'Simulating motion one small time step at a time.' },
      { planned: 'Lagrange multipliers', course: 'calculus-3', why: 'Optimizing under a constraint.' },
    ],
    project: null,
    projectNote: 'No physics or robotics project is written yet. Until one is, the “Use it” task of Gradient descent is this track’s final applied task.',
  },
  {
    id: 'track.environment',
    kind: 'track',
    title: 'Environmental and spatial data',
    summary: 'Trends, seasons and totals in measured data, and how far a pattern can be trusted.',
    steps: [
      { lesson: 'a1-slope', why: 'A trend as a rate: degrees per decade, millimetres per year.' },
      { lesson: 'a1-line-fit', why: 'Fitting a trend line and reading what is left over.' },
      { lesson: 'st-sampling-clt', why: 'How much a monthly average varies by chance.' },
      { lesson: 'c2-riemann', why: 'Totals from rates, such as rainfall from intensity.' },
      { lesson: 'ml-validation', why: 'Testing a model on years it was not fitted to.' },
      { planned: 'The coordinate plane', course: 'prealgebra', why: 'Locating places by coordinates.' },
      { planned: 'Time-series foundations', course: 'prob-stats', why: 'Seasons, trends and noise in data ordered by time.' },
      { planned: 'Exploratory analysis', course: 'ml-foundations', why: 'Looking at a dataset before modelling it.' },
    ],
    project: 'proj.weather',
  },
];

/**
 * Where an outline-only course sends a learner instead of a dead end. Any
 * course not listed here offers the next written course on the path.
 */
export const OUTLINE_ALTERNATIVES = {
  'python-ds': {
    page: 'apply/exercises',
    label: 'Practise Python in Code exercises',
    why: 'The Python course is not written yet, but the code exercises under Apply teach and check real Python now.',
  },
};

/**
 * CSU transfer preparation (informational). Areas a transfer-oriented learner
 * usually prepares for, mapped to what this app has. It does not list or
 * imply any official course, unit or articulation.
 */
export const CSU_PREP = {
  title: 'Preparing for CSU transfer mathematics (informational)',
  disclaimer: 'Self-study preparation only. Using this website does not award Ohlone College or CSU credit, does not appear on a transcript, and does not guarantee articulation of any course. Requirements differ by campus and major: check them with a college counselor and on ASSIST, California’s official transfer articulation database.',
  areas: [
    { id: 'calculus', title: 'Calculus', courses: ['calculus-1', 'calculus-2', 'calculus-3'] },
    { id: 'linear-algebra', title: 'Linear algebra', courses: ['linear-algebra'] },
    { id: 'discrete', title: 'Discrete mathematics', courses: [], note: 'Not covered here yet. Apart from “Direct proof and counterexample”, planned in Algebra II, there is no course on logic, sets, combinatorics or graphs.' },
    { id: 'statistics', title: 'Probability and statistics', courses: ['prob-stats'] },
    { id: 'programming', title: 'Programming', courses: ['python-ds'], note: 'The Python course is an outline. The code exercises and the Python lab under Apply are available now.' },
  ],
};
