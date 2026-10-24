import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'Waiting times at a clinic are lopsided: most people wait a few minutes, a few wait an hour (mean 12 minutes, standard deviation 12). If each day you average the waits of 36 random patients, how much will that daily average vary — and what shape will its distribution have?',
    body: [
      'An average of many independent values varies much less than the values themselves, because highs and lows partly cancel. Its spread is the **standard error** $\\sigma/\\sqrt n$: here $12/\\sqrt{36} = 2$ minutes.',
      'And the shape changes: even from a skewed population, averages of a reasonably large sample are close to normally distributed. That is the **central limit theorem**, and it is why confidence intervals and tests can use the normal curve.',
    ],
  },

  glossary: [
    { term: '$\\mu$, $\\sigma$', meaning: 'Population mean and standard deviation (parameters — usually unknown).' },
    { term: '$\\bar X$', meaning: 'The mean of one random sample of size $n$ (a statistic — it varies from sample to sample).' },
    { term: 'sampling distribution', meaning: 'The distribution of $\\bar X$ over all possible samples.' },
    { term: '$\\sigma_{\\bar X} = \\sigma/\\sqrt n$', meaning: 'The standard error of the mean (Bluman: “Std Error of Mean”).' },
  ],

  priorCheck: [
    item({ id: 'st-clt.pre1', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the mean of 2, 4 and 9?', answer: num(5), compute: () => 15 / 3, solution: '$15/3 = 5$.' }),
    item({ id: 'st-clt.pre2', competency: 'stats.descriptive', difficulty: 1, prompt: 'A standard deviation measures…', answer: choice(['the centre of the data', 'the typical distance of values from their mean', 'the largest value minus the smallest', 'the most common value'], 1), solution: 'It is a typical deviation from the mean.' }),
  ],

  visualization: {
    lab: 'sampling',
    intro: 'Choose “Clinic waits (skewed)”, keep n = 1 and draw 1,000 samples: the histogram is lopsided. Now set n = 5, then 30, and draw again. Compare the SD of the means with σ/√n each time.',
    textAlternative: 'The lab draws many samples of size n from a chosen population and plots a histogram of their means against the normal curve with centre μ and spread σ/√n. A sentence gives the number of samples, the mean and standard deviation of the means and the predicted values; the table gives the histogram counts.',
  },

  derivation: {
    intro: 'The centre and spread of $\\bar X$ follow from two rules about expectation and variance; the shape is the theorem.',
    steps: [
      { say: 'Write $\\bar X = \\frac1n(X_1 + \\cdots + X_n)$, each $X_i$ drawn independently from the population. Expectation is linear, so', math: 'E[\\bar X] = \\frac1n\\big(E[X_1] + \\cdots + E[X_n]\\big) = \\frac1n \\cdot n\\mu = \\mu' },
      { say: 'For independent variables variances add, and scaling by $c$ multiplies variance by $c^2$:', math: '\\operatorname{Var}(\\bar X) = \\frac{1}{n^2}\\big(\\operatorname{Var}(X_1) + \\cdots + \\operatorname{Var}(X_n)\\big) = \\frac{n\\sigma^2}{n^2} = \\frac{\\sigma^2}{n}' },
      { say: 'Taking square roots gives the standard error:', math: '\\sigma_{\\bar X} = \\frac{\\sigma}{\\sqrt n}' },
      { say: 'The **central limit theorem** (stated here; its proof needs more probability than this course assumes): for independent, identically distributed values with finite variance, the distribution of $(\\bar X - \\mu)/(\\sigma/\\sqrt n)$ approaches the standard normal as $n$ grows. That justifies Bluman’s $z = (\\bar X - \\mu)/(\\sigma/\\sqrt n)$.' },
    ],
    assumptions: ['Observations are independent (a random sample, or under 10% of a population when sampling without replacement).', 'They come from the same distribution, which has a finite variance.', '“$n \\ge 30$ is enough” is a rule of thumb, not a theorem: heavier skew needs larger $n$.'],
    domain: ['The mean and spread formulas hold for every $n$; only the normal **shape** is approximate and needs $n$ large enough.'],
  },

  examples: [
    {
      title: 'The clinic',
      problem: 'With $\\mu = 12$ min, $\\sigma = 12$ min and $n = 36$, find the standard error.',
      steps: ['$\\sigma/\\sqrt n = 12/6 = 2$ minutes.', 'So most daily averages fall within about 2 × 2 = 4 minutes of 12.'],
      answer: 'Standard error 2 minutes: daily averages mostly between about 8 and 16 minutes.',
      check: { value: 2, compute: () => 12 / Math.sqrt(36) },
    },
    {
      title: 'How unusual is a slow day?',
      problem: 'With $\\mu = 20$, $\\sigma = 12$, $n = 36$, about how likely is an average above 22 minutes?',
      steps: ['$\\sigma_{\\bar X} = 2$; $z = (22 - 20)/2 = 1$.', 'By the CLT, $P(Z > 1) \\approx 0.1587$.'],
      answer: 'About 16% of days.',
      check: { value: 1, compute: () => (22 - 20) / (12 / Math.sqrt(36)) },
    },
  ],

  counterexample: {
    title: 'Where the CLT fails',
    body: [
      'The Cauchy distribution (the ratio of two independent standard normals) has no finite variance — not even a finite mean. The average of $n$ Cauchy values has exactly the same Cauchy distribution as a single value: averaging never narrows it.',
      'Real data with extremely heavy tails — insurance losses, network traffic bursts — can behave similarly enough that averages stay erratic far beyond $n = 30$.',
    ],
  },

  predict: {
    prompt: 'You quadruple the sample size from 25 to 100. What happens to the standard error of the mean?',
    choices: ['It is divided by 4', 'It is halved', 'It stays the same', 'It doubles'],
    answer: 1,
    reveal: '$\\sigma/\\sqrt{100} = \\sigma/10$ versus $\\sigma/\\sqrt{25} = \\sigma/5$: halved. Precision grows with the **square root** of $n$ — to halve the error you need four times the data.',
    misconception: {
      belief: 'With a large sample, the data themselves become normally distributed.',
      correction: 'The data keep the population’s shape (the clinic waits stay skewed). It is the distribution of the sample **mean** that becomes approximately normal.',
    },
  },

  practice: [
    item({ id: 'st-clt.p1', competency: 'stats.sampling', difficulty: 1, level: 'scaffolded', prompt: 'Find the standard error for $\\sigma = 10$ and $n = 25$.', answer: num(2), compute: () => 10 / 5, solution: '$10/\\sqrt{25} = 2$.' }),
    item({ id: 'st-clt.p2', competency: 'stats.sampling', difficulty: 1, level: 'scaffolded', prompt: 'If the population mean is 50, what is the mean of the sampling distribution of $\\bar X$?', answer: num(50), compute: () => 50, solution: '$E[\\bar X] = \\mu = 50$.' }),
    item({ id: 'st-clt.p3', competency: 'stats.sampling', difficulty: 2, level: 'independent', prompt: 'With $\\sigma = 8$, what sample size gives a standard error of 1?', answer: num(64), compute: () => 8 ** 2, hints: ['Solve $8/\\sqrt n = 1$.'], solution: '$\\sqrt n = 8$, so $n = 64$.' }),
    item({ id: 'st-clt.p4', competency: 'stats.sampling', difficulty: 2, level: 'independent', prompt: 'With $\\mu = 100$, $\\sigma = 15$, $n = 25$, what is the z-score of a sample mean of 103?', answer: num(1), compute: () => (103 - 100) / (15 / 5), solution: 'Standard error 3; $z = 3/3 = 1$.' }),
    item({ id: 'st-clt.p5', competency: 'stats.sampling', difficulty: 2, level: 'independent', prompt: 'Which condition does the central limit theorem need?', answer: choice(['The population must be normal', 'Independent observations from a distribution with finite variance', 'At least 100 observations', 'A symmetric population'], 1), feedback: { 0: 'If the population were normal, $\\bar X$ would be exactly normal for every n — the CLT is about populations that are NOT normal.' }, solution: 'Independence, identical distribution, finite variance.' }),
    item({ id: 'st-clt.p6', competency: 'stats.sampling', difficulty: 3, level: 'transfer', prompt: 'A machine fills bottles with mean 500 ml and standard deviation 4 ml. A pack holds 16 bottles. What is the standard deviation of a pack’s average fill, in ml?', answer: num(1), compute: () => 4 / 4, solution: '$4/\\sqrt{16} = 1$ ml.' }),
    item({ id: 'st-clt.p7', competency: 'stats.sampling', difficulty: 3, level: 'transfer', prompt: 'In Bluman’s formula $z = \\dfrac{\\bar X - \\mu}{\\sigma/\\sqrt n}$, what does the denominator represent?', answer: choice(['The population standard deviation', 'The standard deviation of the sample mean (standard error)', 'The sample size', 'The margin of error'], 1), solution: 'It is $\\sigma_{\\bar X}$: we standardize $\\bar X$ by ITS spread, not the spread of single values.' }),
  ],

  checkpoint: [
    item({ id: 'st-clt.c1', competency: 'stats.sampling', difficulty: 1, prompt: 'Find the standard error for $\\sigma = 20$ and $n = 100$.', answer: num(2), compute: () => 20 / 10, solution: '$20/10 = 2$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Divide σ by the square root of n.' }),
    item({ id: 'st-clt.c2', competency: 'stats.sampling', difficulty: 2, prompt: 'By the CLT, roughly what share of sample means fall within 2 standard errors of μ?', answer: choice(['about 50%', 'about 68%', 'about 95%', '100%'], 2), solution: 'For a normal distribution about 95% lies within 2 SD of the centre (1.96 for exactly 95%).', feedbackCorrect: 'Right.', feedbackIncorrect: 'Recall the 68–95–99.7 rule.' }),
    item({ id: 'st-clt.c3', competency: 'stats.sampling', difficulty: 3, prompt: 'Samples of size 4 are taken from the skewed clinic-wait population. Is a normal approximation for $\\bar X$ reliable?', answer: choice(['Yes — the CLT applies to any n', 'Not necessarily: with n = 4 the sample means are still noticeably skewed', 'No — the CLT never applies to skewed data', 'Yes, because σ is known'], 1), solution: 'The CLT is a limit; at n = 4 skewness persists (see the lab).', feedbackCorrect: 'Right.', feedbackIncorrect: 'Try n = 4 in the lab with the skewed population.' }),
  ],

  python: {
    intro: 'An exact check — no randomness. List every possible sample of size 2 (with replacement) from the tiny population {1, 2, 9} and compare the mean and variance of the sample means with μ and σ²/n.',
    code: `from itertools import product
from statistics import mean, pvariance

population = [1, 2, 9]
means = [mean(s) for s in product(population, repeat=2)]
print(sorted(means))
print(mean(population), mean(means))
print(round(pvariance(population) / 2, 4), round(pvariance(means), 4))`,
    output: '[1, 1.5, 1.5, 2, 5, 5, 5.5, 5.5, 9]\n4 4.0\n6.3333 6.3333',
    explain: 'The nine equally likely samples have means centred exactly on μ = 4, and their variance is exactly σ²/2. Python’s `statistics.mean` returns an int when every value is an int, which is why some means print as 1 rather than 1.0.',
  },

  reading: [
    { title: 'The Central Limit Theorem for Sample Means (§7.1)', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages', note: 'Worked probability problems using the CLT.' },
    { title: 'Seeing Theory — Probability Distributions', source: 'Brown University', url: 'https://seeing-theory.brown.edu/probability-distributions/index.html', note: 'Interactive visualisations including the central limit theorem.' },
  ],
};
