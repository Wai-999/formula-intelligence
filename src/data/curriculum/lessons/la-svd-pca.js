import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'For 200 people (synthetic data) you have height and arm span, and the two move almost in lock-step. If you may keep only **one** number per person, which combination of the two loses the least information?',
    body: [
      'Picture the data as a cloud of points shaped like a tilted cigar. Projecting every point onto the cigar’s long axis keeps nearly all of the spread; projecting onto the short axis keeps almost none. **Principal component analysis (PCA)** finds those axes: the first principal component is the direction in which the data vary most.',
      'The **singular value decomposition (SVD)** is the engine that computes them, and it reaches far beyond PCA: compression, recommender systems, and least squares all run on it.',
    ],
  },

  glossary: [
    { term: '$X$', meaning: 'The centred data: one row per person, one column per variable, column means subtracted.' },
    { term: '$C = \\dfrac{X^\\top X}{n - 1}$', meaning: 'The covariance matrix (2×2 here): variances on the diagonal, covariance off it.' },
    { term: '$\\mathbf w^\\top C\\, \\mathbf w$', meaning: 'The variance of the data projected onto the unit direction $\\mathbf w$.' },
    { term: '$\\lambda_1 \\ge \\lambda_2$, $\\mathbf q_1, \\mathbf q_2$', meaning: 'Eigenvalues and unit eigenvectors of $C$; $\\mathbf q_1$ is the first principal component.' },
    { term: '$X = U\\Sigma V^\\top$', meaning: 'The SVD: $V$’s columns are the principal directions; $\\lambda_i = \\sigma_i^2/(n-1)$.' },
  ],

  priorCheck: [
    item({ id: 'la-pca.pre1', competency: 'la.projection', difficulty: 1, prompt: 'What is the scalar projection of $(3, 4)$ onto the unit vector $(1, 0)$?', answer: num(3), compute: () => 3, solution: '$(3, 4)\\cdot(1, 0) = 3$.', remedy: 'la-projection' }),
    item({ id: 'la-pca.pre2', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the sample variance of 1, 2, 3 (divide by $n - 1$)?', answer: num(1), compute: () => ((1 - 2) ** 2 + 0 + (3 - 2) ** 2) / 2, solution: 'Mean 2; squared deviations 1, 0, 1; sum 2; divided by 2 gives 1.' }),
  ],

  visualization: {
    lab: 'svd-pca',
    intro: 'Turn the direction and watch the variance of the projected points. Find the angle that maximizes it, then compare with the lab’s PC1. Finally try the ring.',
    textAlternative: 'The lab draws centred synthetic points, a line at the chosen angle with each point’s projection onto it, and both principal axes. A sentence gives the variance along your direction, the maximum (λ₁) and its angle, and the share of variance PC1 explains; the table lists the variance at six angles.',
  },

  derivation: {
    intro: 'Why is the best direction an eigenvector of the covariance matrix, and how does the SVD give it?',
    steps: [
      { say: 'Projecting the centred data onto a unit vector $\\mathbf w$ gives the numbers $X\\mathbf w$. Their mean is 0, so their sample variance is', math: '\\frac{(X\\mathbf w)^\\top (X\\mathbf w)}{n - 1} = \\mathbf w^\\top \\frac{X^\\top X}{n-1} \\mathbf w = \\mathbf w^\\top C\\,\\mathbf w' },
      { say: '$C$ is symmetric, so (spectral theorem) it has perpendicular unit eigenvectors $\\mathbf q_1, \\mathbf q_2$ with eigenvalues $\\lambda_1 \\ge \\lambda_2 \\ge 0$. Write any unit $\\mathbf w = a\\mathbf q_1 + b\\mathbf q_2$ with $a^2 + b^2 = 1$:', math: '\\mathbf w^\\top C\\,\\mathbf w = \\lambda_1 a^2 + \\lambda_2 b^2 \\le \\lambda_1 (a^2 + b^2) = \\lambda_1' },
      { say: 'Equality holds at $\\mathbf w = \\mathbf q_1$. So the first principal component is the top eigenvector, it captures variance $\\lambda_1$, and it explains the fraction', math: '\\frac{\\lambda_1}{\\lambda_1 + \\lambda_2}' },
      { say: 'From the SVD $X = U\\Sigma V^\\top$ (with $U, V$ orthogonal): $X^\\top X = V\\Sigma U^\\top U \\Sigma V^\\top = V\\Sigma^2 V^\\top$. So the columns of $V$ are the eigenvectors of $C$ and $\\lambda_i = \\sigma_i^2/(n - 1)$. Software computes PCA through the SVD because forming $X^\\top X$ squares the condition number and loses precision.' },
    ],
    assumptions: ['The data are centred (column means subtracted).', 'Variance is treated as information. That is a choice: in different units, the answer changes — standardize variables measured on different scales.', 'PCA finds straight-line directions; curved structure is invisible to it.'],
    domain: ['Eigenvectors are only defined up to sign: $\\mathbf q_1$ and $-\\mathbf q_1$ are the same axis.', 'If $\\lambda_1 = \\lambda_2$, no single direction is best.'],
  },

  examples: [
    {
      title: 'From a covariance matrix',
      problem: 'Height and arm span (standardized) have covariance matrix $C = \\begin{bmatrix}3 & 2\\\\ 2 & 3\\end{bmatrix}$. Find the principal components and the share PC1 explains.',
      steps: ['$C(1, 1) = (5, 5) = 5(1, 1)$ and $C(1, -1) = (1, -1)$: eigenvalues 5 and 1.', 'Unit directions: $\\mathbf q_1 = (1, 1)/\\sqrt2$ and $\\mathbf q_2 = (1, -1)/\\sqrt2$.', 'PC1 explains $5/(5 + 1) \\approx 0.833$.'],
      answer: 'PC1 is the “overall size” axis $(1, 1)/\\sqrt2$, explaining about 83% of the variance.',
      check: { value: 5 / 6, tolerance: 1e-9, compute: () => 5 / (5 + 1) },
    },
    {
      title: 'Variance in a chosen direction',
      problem: 'With the same $C$, how much variance does height alone, $\\mathbf w = (1, 0)$, capture?',
      steps: ['$\\mathbf w^\\top C\\,\\mathbf w = C_{11} = 3$.', 'PC1 captures 5, out of a total of $3 + 3 = 6$.'],
      answer: '3 — keeping height alone keeps half the variance; the PC1 combination keeps 5/6 of it.',
      check: { value: 3, compute: () => 3 },
    },
  ],

  counterexample: {
    title: 'When PCA answers the wrong question',
    body: [
      'Measure height in millimetres and arm span in metres. Height’s numbers are 1,000 times larger, so its variance is a million times larger, and PC1 points almost exactly along height — because of the units, not the data. Standardizing each variable first removes this artefact.',
      'Points spread evenly around a circle have $\\lambda_1 = \\lambda_2$: PCA finds no preferred direction even though the data lie on a simple one-dimensional curve. PCA sees only linear structure.',
    ],
  },

  predict: {
    prompt: 'For the covariance matrix $C = \\begin{bmatrix}4 & 0\\\\ 0 & 1\\end{bmatrix}$, which direction is the first principal component?',
    choices: ['$(1, 0)$', '$(0, 1)$', '$(1, 1)/\\sqrt2$', 'Every direction is equally good'],
    answer: 0,
    reveal: 'The variables are uncorrelated (zero off the diagonal), and the first has variance 4 against 1. The direction of greatest spread is simply the first axis.',
    misconception: {
      belief: 'PC1 always mixes the variables, like (1, 1)/√2.',
      correction: 'PC1 mixes variables only when they are correlated. With zero covariance the principal components are the original axes, ordered by variance.',
    },
  },

  practice: [
    item({ id: 'la-pca.p1', competency: 'la.svd-pca', difficulty: 1, level: 'scaffolded', prompt: 'For $C = \\begin{bmatrix}3 & 2\\\\ 2 & 3\\end{bmatrix}$, compute the variance along $\\mathbf w = (1, 0)$, that is $\\mathbf w^\\top C\\,\\mathbf w$.', answer: num(3), compute: () => 3, hints: ['With $\\mathbf w = (1, 0)$ this picks out the top-left entry.'], solution: '$3$.' }),
    item({ id: 'la-pca.p2', competency: 'la.svd-pca', difficulty: 1, level: 'scaffolded', prompt: 'The eigenvalues of a covariance matrix are 5 and 1. What fraction of the total variance does PC1 explain? (Three decimals.)', answer: num(5 / 6, 0.0006), compute: () => 5 / 6, solution: '$5/6 \\approx 0.833$.' }),
    item({ id: 'la-pca.p3', competency: 'la.svd-pca', difficulty: 2, level: 'independent', prompt: 'For the same $C$, what is the variance along $\\mathbf w = (1, 1)/\\sqrt2$?', answer: num(5), compute: () => (3 + 2 + 2 + 3) / 2, hints: ['$\\mathbf w^\\top C\\,\\mathbf w = \\tfrac12(3 + 2 + 2 + 3)$.'], solution: '$10/2 = 5$ — the maximum, since this is PC1.' }),
    item({ id: 'la-pca.p4', competency: 'la.svd-pca', difficulty: 2, level: 'independent', prompt: 'The centred data matrix has singular values $\\sigma_1 = 6$, $\\sigma_2 = 2$, with $n = 10$ rows. What is $\\lambda_1$?', answer: num(4), compute: () => 36 / 9, hints: ['$\\lambda = \\sigma^2/(n - 1)$.'], solution: '$36/9 = 4$.' }),
    item({ id: 'la-pca.p5', competency: 'la.svd-pca', difficulty: 2, level: 'independent', prompt: 'Why standardize variables before PCA when they are in different units?', answer: choice(['PCA cannot run otherwise', 'So that a variable does not dominate merely because its unit makes its numbers large', 'To make the eigenvalues equal', 'To remove outliers'], 1), solution: 'Variance depends on units; standardizing puts each variable on a comparable scale.' }),
    item({ id: 'la-pca.p6', competency: 'la.svd-pca', difficulty: 3, level: 'transfer', prompt: 'A dataset with 50 features has cumulative explained variance 0.62, 0.81, 0.90, 0.95 for its first 1, 2, 3, 4 principal components. What is the smallest number of components that keeps at least 90%?', answer: num(3), compute: () => 3, solution: 'Three components reach 0.90.' }),
    item({ id: 'la-pca.p7', competency: 'la.svd-pca', difficulty: 3, level: 'transfer', prompt: 'PCA on standardized customer data gives PC1 = (0.71, 0.70) on (visits per month, spend per visit). What is the best reading of PC1?', answer: choice(['Customers who visit often spend less', 'An overall-engagement axis: high scorers visit often AND spend more', 'Visits do not matter', 'Spend is measured in the wrong units'], 1), feedback: { 0: 'That would need loadings of opposite sign.' }, solution: 'Both loadings are large and positive, so PC1 grows when both variables grow together.' }),
  ],

  checkpoint: [
    item({ id: 'la-pca.c1', competency: 'la.svd-pca', difficulty: 1, prompt: 'Eigenvalues 9 and 3: what fraction of the variance does PC1 explain?', answer: num(0.75), compute: () => 9 / 12, solution: '$9/12 = 0.75$.', feedbackCorrect: 'Right.', feedbackIncorrect: '$\\lambda_1/(\\lambda_1 + \\lambda_2)$.' }),
    item({ id: 'la-pca.c2', competency: 'la.svd-pca', difficulty: 2, prompt: 'Centred data with $n = 17$ rows has top singular value $\\sigma_1 = 12$. What is the variance along PC1?', answer: num(9), compute: () => 144 / 16, solution: '$\\sigma_1^2/(n - 1) = 144/16 = 9$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Use $\\lambda = \\sigma^2/(n - 1)$.' }),
    item({ id: 'la-pca.c3', competency: 'la.svd-pca', difficulty: 3, prompt: 'Points evenly spread around a circle give two equal eigenvalues. What does that mean for PCA?', answer: choice(['PC1 is the x-axis', 'No direction is preferred; one component keeps only half the variance', 'The data are uncorrelated noise', 'The circle is perfectly captured by PC1'], 1), solution: 'Equal eigenvalues mean every direction has the same variance.', feedbackCorrect: 'Right — PCA sees no linear structure in a circle.', feedbackIncorrect: 'With $\\lambda_1 = \\lambda_2$, what is $\\mathbf w^\\top C\\,\\mathbf w$ for every unit $\\mathbf w$?' }),
  ],

  python: {
    intro: 'The worked example in NumPy, then a check on a small fixed dataset that the SVD and the covariance eigenvalues agree.',
    code: `import numpy as np

C = np.array([[3.0, 2.0], [2.0, 3.0]])
vals, vecs = np.linalg.eigh(C)            # ascending order
print(np.round(vals, 6))
print(np.round(np.abs(vecs[:, 1]), 4))    # PC1, up to sign
print(round(float(vals[1] / vals.sum()), 4))

X = np.array([[2.0, 1.0], [0.0, 1.0], [-1.0, -2.0], [3.0, 4.0], [-4.0, -4.0]])
Xc = X - X.mean(axis=0)
s = np.linalg.svd(Xc, compute_uv=False)
lam = np.linalg.eigvalsh(np.cov(Xc, rowvar=False))[::-1]
print(np.allclose(s ** 2 / (len(X) - 1), lam))`,
    output: '[1. 5.]\n[0.7071 0.7071]\n0.8333\nTrue',
    explain: 'eigh is NumPy’s routine for symmetric matrices; it returns eigenvalues in ascending order, so PC1 is the last column.',
  },

  reading: [
    { title: 'Lecture 29: Singular value decomposition', source: 'MIT OpenCourseWare 18.06, Gilbert Strang', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/', note: 'The SVD as rotation–stretch–rotation.' },
    { title: 'A Tutorial on Principal Component Analysis', source: 'Jonathon Shlens (arXiv:1404.1100)', url: 'https://arxiv.org/abs/1404.1100', note: 'A careful derivation of PCA, including its assumptions.' },
    { title: 'Decomposing signals in components — PCA', source: 'scikit-learn user guide §2.5', url: 'https://scikit-learn.org/stable/modules/decomposition.html', note: 'How PCA is used in practice, with whitening and incremental variants.' },
  ],
};
