import { item, num, choice, multi, dot } from '../lessonKit.js';

// V4 exemplar 3: matrix multiplication → customer data. The four customers
// are invented for illustration; no real people or shop.

const X = [[8, 25, 12], [2, 80, 3], [5, 40, 20], [1, 15, 1]];
const W = [3, 0.2, 0.5];

export default {
  intuition: {
    question: 'An online shop keeps a table: one row per customer, with columns for visits per month, average basket in dollars, and months as a customer. Marketing wants one “engagement score” per customer to choose who gets an early-access invitation. How does a table and a list of weights become a list of scores — and how can one column quietly decide the result?',
    body: [
      'Each customer’s score is a weighted sum of their row: $3 \\times \\text{visits} + 0.2 \\times \\text{basket} + 0.5 \\times \\text{months}$. That is the **dot product** of the row with the weight vector $w = (3, 0.2, 0.5)$.',
      'Doing it for every row at once is a **matrix–vector product**: stack the rows into a matrix $X$ (customers × features) and $Xw$ is the column of scores. The shapes must fit: a $4 \\times 3$ table times a weight vector of length 3 gives 4 scores.',
      'This is exactly how a linear model scores data: predictions are $\\hat{y} = Xw$. The same arithmetic shows its trap — a column measured in big numbers can outweigh one measured in small numbers for reasons that have nothing to do with importance.',
    ],
  },

  glossary: [
    { term: '$X$', meaning: 'The **data matrix**, $n \\times d$: one row per observation (customer), one column per feature.' },
    { term: '$x_{ij}$', meaning: 'Row $i$, column $j$: customer $i$’s value of feature $j$.' },
    { term: '$w$', meaning: 'The **weight vector**: one weight per feature (length $d$).' },
    { term: '$Xw$', meaning: 'The scores: entry $i$ is the dot product of row $i$ with $w$ (length $n$).' },
    { term: '$(n \\times d)(d \\times 1)$', meaning: 'The **shape rule**: the inner sizes must match; the result is $n \\times 1$.' },
    { term: 'standardize', meaning: 'Replace each value by $(x - \\bar{x})/s$ for its column, so every column has mean 0 and standard deviation 1.' },
  ],

  priorCheck: [
    item({
      id: 'la-ms.pre1', competency: 'la.dot-product', difficulty: 1,
      prompt: 'Compute $(2, 1, 3) \\cdot (4, 0, 1)$.',
      answer: num(11), compute: () => dot([2, 1, 3], [4, 0, 1]), solution: '$8 + 0 + 3 = 11$.',
    }),
    item({
      id: 'la-ms.pre2', competency: 'la.vector-ops', difficulty: 1,
      prompt: 'Compute $3 \\cdot (2, 5)$.',
      answer: multi([6, 15], ['first entry', 'second entry']), solution: 'Multiply each entry by 3: $(6, 15)$.',
    }),
  ],

  visualization: {
    lab: 'matrix-scores',
    intro: 'Change the weights and watch the scores and the top two move. Then switch the basket to cents, and then to standardized columns.',
    textAlternative: 'The lab shows four customers’ scores as bars, with the two highest shaded. A sentence lists the shape of the product, every score and the top two after each change; the table shows the data matrix in its current units, the weights and the resulting scores.',
  },

  derivation: {
    intro: 'Why is a whole column of scores one product $Xw$, and what must the shapes satisfy?',
    steps: [
      { say: 'Write the data as a matrix, one customer per row, and the weights as a column:', math: 'X = \\begin{bmatrix} x_{11} & x_{12} & x_{13} \\\\ \\vdots & \\vdots & \\vdots \\\\ x_{n1} & x_{n2} & x_{n3} \\end{bmatrix}, \\qquad w = \\begin{bmatrix} w_1 \\\\ w_2 \\\\ w_3 \\end{bmatrix}' },
      { say: 'The matrix–vector product is defined row by row: entry $i$ is the dot product of row $i$ with $w$.', math: '(Xw)_i = \\sum_{j=1}^{d} x_{ij} w_j' },
      { say: 'Each row needs one weight per column, so the inner sizes must match: $(n \\times d)(d \\times 1)$ gives $n \\times 1$. A weight vector of the wrong length does not give a smaller answer — it gives no answer.' },
      { say: 'The product is linear, so each feature’s contribution can be read off separately — $x_{ij} w_j$ — and changing one weight changes every score by that column times the change:', math: 'X(w + u) = Xw + Xu, \\qquad X(cw) = c\\,Xw' },
    ],
    assumptions: [
      'Every customer has a value for every feature (no missing entries).',
      'A score is a weighted sum: features add up, with no interactions.',
    ],
    domain: [
      '$X$ is $n \\times d$ and $w$ has exactly $d$ entries.',
      'Each weight is “score per unit of its feature”: changing a column’s units (dollars to cents) changes what its weight means.',
    ],
  },

  examples: [
    {
      title: 'Two customers by hand',
      problem: 'Customer A: 8 visits, \\$25 basket, 12 months. Customer B: 2 visits, \\$80 basket, 3 months. With $w = (3, 0.2, 0.5)$, score both.',
      steps: ['A: $3 \\cdot 8 + 0.2 \\cdot 25 + 0.5 \\cdot 12 = 24 + 5 + 6 = 35$.', 'B: $3 \\cdot 2 + 0.2 \\cdot 80 + 0.5 \\cdot 3 = 6 + 16 + 1.5 = 23.5$.', 'Stacked: $\\begin{bmatrix} 8 & 25 & 12 \\\\ 2 & 80 & 3 \\end{bmatrix} w = \\begin{bmatrix} 35 \\\\ 23.5 \\end{bmatrix}$.'],
      answer: 'A scores 35, B scores 23.5',
      check: { value: 23.5, compute: () => dot(X[1], W) },
    },
    {
      title: 'Shapes',
      problem: 'A table has 1,000 customers and 6 features. What shape must $w$ have, and what shape is $Xw$?',
      steps: ['$X$ is $1000 \\times 6$.', 'Each row has 6 entries, so $w$ needs 6 weights: $6 \\times 1$.', '$Xw$ is $1000 \\times 1$: one score per customer.'],
      answer: '$w$ is $6 \\times 1$; $Xw$ is $1000 \\times 1$',
      check: { value: 1000, compute: () => 1000 },
    },
  ],

  counterexample: {
    title: 'Same weights, new units, different winner',
    body: [
      'Record the basket in cents instead of dollars and keep the weight 0.2: B’s basket term becomes $0.2 \\times 8000 = 1600$, and B outranks everyone by a mile. Nothing about B changed — only the units of one column.',
      'A weight means nothing without its column’s units. Standardizing each column (subtract its mean, divide by its standard deviation) puts features on one scale before they are weighed.',
    ],
  },

  predict: {
    prompt: '$X$ has 4 rows (customers) and 3 columns (features). Which $w$ can it be multiplied by?',
    choices: ['A vector with 4 entries', 'A vector with 3 entries', 'Any vector', 'A $4 \\times 3$ matrix'],
    answer: 1,
    reveal: 'One weight per column: $(4 \\times 3)(3 \\times 1) = 4 \\times 1$ — four scores, one per customer.',
    misconception: {
      belief: 'There is one weight per customer.',
      correction: 'Weights belong to the features (columns). The product gives one score per customer (row).',
    },
  },

  practice: [
    item({ id: 'la-ms.p1', competency: 'la.matrix-mult', difficulty: 1, level: 'scaffolded', prompt: 'Score a customer with features $(4, 30, 10)$ and weights $(3, 0.2, 0.5)$: $3 \\cdot 4 + 0.2 \\cdot 30 + 0.5 \\cdot 10$.', answer: num(23), compute: () => dot([4, 30, 10], W), hints: ['$12 + 6 + 5$.'], solution: '$12 + 6 + 5 = 23$.' }),
    item({ id: 'la-ms.p2', competency: 'la.matrix-mult', difficulty: 1, level: 'scaffolded', prompt: 'Compute $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} \\begin{bmatrix} 5 \\\\ 6 \\end{bmatrix}$.', answer: multi([17, 39], ['top entry', 'bottom entry']), hints: ['Top: $1 \\cdot 5 + 2 \\cdot 6$.'], solution: '$(5 + 12, 15 + 24) = (17, 39)$.' }),
    item({
      id: 'la-ms.p3', competency: 'la.matrix-mult', difficulty: 2, level: 'independent',
      prompt: '$X$ is $50 \\times 4$ and $w$ has 4 entries. What is the shape of $Xw$?',
      answer: choice(['$50 \\times 1$', '$4 \\times 1$', '$50 \\times 4$', '$1 \\times 1$'], 0),
      feedback: { 1: 'That is the shape of $w$.', 2: 'That is the shape of $X$.', 3: 'One number would be a single dot product, not one per row.' },
      solution: 'One score per row: $50 \\times 1$.',
    }),
    item({ id: 'la-ms.p4', competency: 'la.matrix-mult', difficulty: 2, level: 'independent', prompt: 'Compute $\\begin{bmatrix} 2 & 0 & 1 \\\\ 1 & 3 & 0 \\\\ 0 & 1 & 4 \\end{bmatrix} \\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\end{bmatrix}$.', answer: multi([5, 7, 14], ['first', 'second', 'third']), hints: ['Each entry is a row times $(1, 2, 3)$.'], solution: '$(2 + 0 + 3, 1 + 6 + 0, 0 + 2 + 12) = (5, 7, 14)$.' }),
    item({
      id: 'la-ms.p5', competency: 'la.matrix-mult', difficulty: 3, level: 'transfer',
      prompt: 'A recipe app stores each recipe’s grams of (flour, sugar, butter). Prices per gram are $(0.002, 0.003, 0.01)$ dollars. A recipe uses $(500, 200, 250)$ grams. What does it cost?',
      answer: num(4.1, 1e-6), compute: () => dot([500, 200, 250], [0.002, 0.003, 0.01]), hints: ['A cost is a weighted sum too: grams times price per gram.'], solution: '$1 + 0.6 + 2.5 = \\$4.10$. For many recipes at once, stack them into a matrix and multiply by the price vector.',
    }),
  ],

  apply: {
    scenario: 'Marketing will invite the top two of four customers. Data (visits per month, basket in \\$, months as customer): A $(8, 25, 12)$, B $(2, 80, 3)$, C $(5, 40, 20)$, D $(1, 15, 1)$. Weights $w = (3, 0.2, 0.5)$.',
    steps: [
      'Compute all four scores as one product $Xw$.',
      'Check which feature drives a score.',
      'See what a change of units would do to the invitation list.',
    ],
    items: [
      item({ id: 'la-ms.u1', competency: 'la.matrix-mult', difficulty: 3, prompt: 'Compute the scores $Xw$ for A, B, C and D.', answer: multi(X.map((r) => dot(r, W)), ['A', 'B', 'C', 'D']), hints: ['Each is one row times $w$; A is 35.'], solution: '$(35, 23.5, 33, 6.5)$: A and C are invited.' }),
      item({ id: 'la-ms.u2', competency: 'la.matrix-mult', difficulty: 3, prompt: 'What share of B’s score comes from the basket term $0.2 \\times 80$? (A fraction between 0 and 1, two decimals.)', answer: num(0.68, 0.006), compute: () => (0.2 * 80) / dot(X[1], W), hints: ['$16 / 23.5$.'], solution: '$16 / 23.5 \\approx 0.68$: two thirds of B’s score is the basket.' }),
      item({
        id: 'la-ms.u3', competency: 'la.matrix-mult', difficulty: 3,
        prompt: 'Someone records the basket in cents “for precision” and keeps the weights. Who is invited now?',
        answer: choice(['B and C', 'A and C (no change)', 'A and B', 'B and D'], 0),
        feedback: { 1: 'Recompute: the basket term is now 100 times larger.', 2: 'A’s basket is the second smallest.', 3: 'D has the smallest basket.' },
        solution: 'Scores become A 530, B 1607.5, C 825, D 303.5: B and C. The list changed because of units, not customers.',
      }),
    ],
    limits: [
      'A weighted sum treats features as adding up; real behaviour has interactions (a big basket may matter more for frequent visitors).',
      'Hand-picked weights encode someone’s judgement; fitted weights (regression) encode whatever the data contains, biases included.',
      'Scores used to target people can leave groups out unfairly — check who is excluded, not only who ranks first.',
      'Scoring today with information from the future (next month’s visits) is data leakage.',
    ],
  },

  checkpoint: [
    item({ id: 'la-ms.c1', competency: 'la.matrix-mult', difficulty: 1, prompt: 'Score features $(6, 50, 2)$ with weights $(3, 0.2, 0.5)$.', answer: num(29), compute: () => dot([6, 50, 2], W), solution: '$18 + 10 + 1 = 29$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Multiply each feature by its own weight, then add.' }),
    item({ id: 'la-ms.c2', competency: 'la.matrix-mult', difficulty: 2, prompt: 'Compute $\\begin{bmatrix} 1 & -1 \\\\ 2 & 0 \\\\ 0 & 3 \\end{bmatrix} \\begin{bmatrix} 4 \\\\ 2 \\end{bmatrix}$.', answer: multi([2, 8, 6], ['first', 'second', 'third']), solution: '$(4 - 2, 8 + 0, 0 + 6) = (2, 8, 6)$.', feedbackCorrect: 'Right — three rows, three scores.', feedbackIncorrect: 'Each entry is one row dotted with $(4, 2)$.' }),
    item({
      id: 'la-ms.c3', competency: 'la.matrix-mult', difficulty: 3,
      prompt: 'A credit model scores applicants as $Xw$. One column is annual income in dollars (around 50,000); another is the number of late payments (0–5). Before reading the weights as “importance”, what should you check?',
      answer: choice([
        'Whether the columns are on comparable scales — or standardized',
        'Whether $X$ has more rows than columns',
        'Whether every weight is positive',
        'Nothing: a bigger weight always means a more important feature',
      ], 0),
      feedback: { 1: 'Useful for fitting, but not what makes weights comparable.', 2: 'A negative weight can be perfectly sensible (late payments lower a score).', 3: 'A weight’s size depends on its column’s units.' },
      solution: 'A tiny weight on income can matter more than a large one on late payments, because income values are thousands of times larger. Compare weights only on standardized columns.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Think about the cents example: what does a weight depend on besides importance?',
    }),
  ],

  python: {
    intro: 'The same scores with NumPy: one product for the whole table, then equal weights on standardized columns.',
    code: `import numpy as np

X = np.array([[8, 25, 12],
              [2, 80, 3],
              [5, 40, 20],
              [1, 15, 1]])
w = np.array([3, 0.2, 0.5])

scores = X @ w
print(X.shape, w.shape, scores.shape)
print(scores)

Z = (X - X.mean(axis=0)) / X.std(axis=0)
print(np.round(Z @ np.ones(3), 2))`,
    output: '(4, 3) (3,) (4,)\n[35.  23.5 33.   6.5]\n[ 1.25  0.09  1.82 -3.16]',
    explain: '`X @ w` is the matrix–vector product. After standardizing, equal weights rank C first (1.82): its standardized row is about $(0.37, 0, 1.45)$ — a little above average in visits, exactly average in basket, and far above average in months as a customer. Which ranking is “right” is a business choice — the point is to make that choice deliberately, not through units.',
  },

  reading: [
    { title: 'numpy.matmul', source: 'NumPy documentation', url: 'https://numpy.org/doc/stable/reference/generated/numpy.matmul.html', note: 'The matrix product, and the `@` operator used above.' },
    { title: 'Numerical data: Normalization', source: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course/numerical-data/normalization', note: 'Why features on different scales cause trouble, and Z-score scaling.' },
  ],
};
