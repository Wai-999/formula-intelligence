// The no-code path for the core exercises (V4 §8: "every Python exercise
// must offer a non-coding interpretation path for early learners").
//
// `show` runs after the reference solution; `output` is what it prints —
// captured by running it, and checked on every CI run by
// scripts/verify-python.mjs. `question` asks what that result means, so a
// learner who is not coding yet still practises the idea. Predict-output and
// interpret exercises need none: they are already about reading code.

const ask = (prompt, choices, correct, explain) => ({ prompt, choices, correct, explain });

export const NO_CODE = {
  'py.slope-fn': {
    show: 'print(slope((2, 7), (6, 15)))\nprint(slope((0, 3), (4, 1)))',
    output: '2.0\n-0.5',
    question: ask('A ride costs \\$7 for 2 km and \\$15 for 6 km, and the slope between those points is 2.0. What does 2.0 mean?', ['Each extra kilometre adds \\$2', 'The ride costs \\$2', 'The booking fee is \\$2', '2 km were driven'], 0, 'Slope is change in price per change in distance: \\$8 more for 4 km more.'),
  },
  'py.mean-gap': {
    show: 'print(mean([3, 5, 4, 8, 10]))',
    output: '6.0',
    question: ask('Five quiz scores have mean 6.0. A sixth student scores exactly 6. What happens to the mean?', ['It stays 6', 'It rises', 'It falls', 'It cannot be known'], 0, 'Adding a value equal to the mean leaves the mean unchanged: 36 / 6 = 6.'),
  },
  'py.debug-variance': {
    show: 'print(round(sample_variance([2, 4, 4, 4, 5, 5, 7, 9]), 3))',
    output: '4.571',
    question: ask('The fixed function divides by n − 1 and gets 4.571 (dividing by n would give 4.0). Why n − 1 for a sample?', ['Dividing by n underestimates the population’s spread on average, because the sample mean sits closer to the data than the true mean', 'It makes the number bigger so it looks cautious', 'n − 1 is the number of different values', 'One value is always an outlier'], 0, 'Measuring spread around the sample’s own mean shrinks it slightly; n − 1 corrects that bias.'),
  },
  'py.ls-numpy': {
    show: 'print(round(float(m), 3), round(float(b), 3))',
    output: '1.7 0.9',
    question: ask('For hours of practice against quiz score, the least-squares line has slope 1.7 and intercept 0.9. What does the slope say?', ['Each extra hour goes with about 1.7 more points, on average', 'Every student scored 1.7', 'Practice causes a 1.7-point rise for everyone', 'Zero hours gives 1.7 points'], 0, 'A slope is an average rate along the line. It describes this data; it does not prove that practice caused the scores.'),
  },
  'py.cosine': {
    show: 'print(round(cosine(np.array([1.0, 0.0]), np.array([1.0, 1.0])), 4))',
    output: '0.7071',
    question: ask('The cosine between $(1, 0)$ and $(1, 1)$ is 0.7071. What angle is that?', ['45°', '90°', '0°', '70.71°'], 0, '$\\cos 45° = 1/\\sqrt{2} \\approx 0.7071$. Cosine 1 means same direction, 0 means perpendicular.'),
  },
  'py.bayes-fn': {
    show: 'print(round(posterior(0.01, 0.9, 0.09), 4))',
    output: '0.0917',
    question: ask('A condition affects 1% of people; the test catches 90% of cases with 9% false positives. After a positive result, how likely is the condition?', ['About 9%', 'About 90%', 'About 91%', 'About 1%'], 0, 'Out of 1,000 people: 9 true positives, about 89 false positives. Only 9 of 98 positives are real.'),
  },
  'py.gd-loop': {
    show: 'print(round(descend(0, 0.1, 50), 4))\nprint(round(descend(0, 1.1, 10), 1))',
    output: '3.0\n-15.6',
    question: ask('With step size 0.1 gradient descent reaches the minimum at 3.0; with 1.1 it ends at −15.6, getting worse each step. Why?', ['The step is so large it overshoots the minimum by more each time', 'The derivative is wrong', 'There were too few steps', 'Floating-point rounding'], 0, 'Each step multiplies the distance to 3 by $(1 - 2\\eta)$. For $\\eta = 1.1$ that factor is −1.2: the distance grows and flips sign.'),
  },
  'py.visualize-residuals': {
    show: 'print([round(float(r), 2) for r in residuals])',
    output: '[0.4, 0.7, -2.0, 0.3, 0.6]',
    question: ask('The residuals are 0.4, 0.7, −2.0, 0.3 and 0.6. What does a plot of them show?', ['One point (the third) sits well below the line; the rest are close above it', 'The line passes through every point', 'The relationship is clearly curved', 'The slope is negative'], 0, 'Residual = actual − fitted. One large negative residual is worth checking: a data error, or something the line misses.'),
  },
  'py.anscombe-stats': {
    show: 'for k, (mu, var) in stats.items():\n    print(k, round(float(mu), 2), round(float(var), 2))',
    output: 'I 7.5 4.13\nII 7.5 4.13\nIII 7.5 4.12\nIV 7.5 4.12',
    question: ask('All four series have mean 7.5 and variance about 4.1. Do the four datasets look alike?', ['Not necessarily — very different datasets can share their summary statistics', 'Yes — same mean and variance means the same data', 'Only if they have the same number of points', 'Yes, apart from rounding'], 0, 'That is the point of Anscombe’s quartet: plot the data before trusting a summary.'),
  },
  'py.anscombe-fit': {
    show: 'for k, (m, b) in lines.items():\n    print(k, round(float(m), 3), round(float(b), 2))',
    output: 'I 0.5 3.0\nII 0.5 3.0\nIII 0.5 3.0\nIV 0.5 3.0',
    question: ask('All four series give the line $y = 0.5x + 3$. What should come before trusting any of them?', ['Plot each series and look at it', 'Compute more decimal places', 'Add a fifth series', 'Remove the intercept'], 0, 'One series is a curve, one is a straight line with an outlier, one is driven by a single point. Only a plot shows it.'),
  },
  'py.screening-ppv': {
    show: 'print([round(p, 3) for p in ppv])',
    output: '[0.092, 0.526, 0.476]',
    question: ask('Testing only referred patients (prevalence 10%) gives 0.526; a better test in the general population gives 0.476. Which change helped more?', ['Testing referred patients', 'The better test', 'They are equal', 'Neither changed it'], 0, 'Who is tested matters as much as how good the test is: a higher base rate makes positives far more likely to be real.'),
  },
  'py.screening-counts': {
    show: 'print(round(tp), round(fn), round(fp), round(tn))',
    output: '90 10 891 9009',
    question: ask('Of 10,000 people screened, 981 test positive. How many of them actually have the condition?', ['90', '981', '900', '10'], 0, '90 true positives and 891 false positives: fewer than one positive in ten is real.'),
  },
  'py.pca-cov': {
    show: 'print([[round(float(v), 2) for v in row] for row in C])',
    output: '[[7.5, 8.0], [8.0, 9.5]]',
    question: ask('The covariance between height and arm span is +8.0. What does that mean?', ['Taller people in the data tend to have longer arm spans', 'Height and span are unrelated', 'Span varies 8 times more than height', 'The data are standardized'], 0, 'A positive covariance means the two move together; its size depends on the units, so compare correlations to judge strength.'),
  },
  'py.pca-pc1': {
    show: 'print([round(abs(float(v)), 3) for v in pc1], round(float(ratio), 3))',
    output: '[0.662, 0.75] 0.974',
    question: ask('The first principal component explains 97.4% of the variance. What would keeping only PC1 lose?', ['About 2.6% of the variation — small differences between people of the same overall size', 'Nothing at all', 'Most of the information', 'Half the people'], 0, 'PC1 is roughly “overall size” (height and span together). Dropping PC2 keeps 97.4% of the spread.'),
  },
};
