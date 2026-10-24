import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A condition affects 1% of people. A screening test catches 90% of people who have it, and wrongly flags 9% of people who do not. You test positive. What is the chance you actually have the condition?',
    body: [
      'Most people guess about 90%. Count instead: of 1,000 people, 10 have the condition and 9 of them test positive. Of the 990 who do not, about 89 also test positive. So of roughly 98 positives, only 9 are real: **about 9%**.',
      '**Bayes’ theorem** is that count, written as a formula. It turns “how likely is the evidence if the hypothesis is true?” into “how likely is the hypothesis, given the evidence?” — two very different numbers.',
    ],
  },

  glossary: [
    { term: 'prior $P(D)$', meaning: 'How likely the hypothesis is before the evidence (here, the base rate 1%).' },
    { term: 'sensitivity $P(+ \\mid D)$', meaning: 'Chance of a positive result if you have the condition.' },
    { term: 'false-positive rate $P(+ \\mid \\bar D)$', meaning: 'Chance of a positive result if you do not (1 − specificity).' },
    { term: 'posterior $P(D \\mid +)$', meaning: 'How likely the hypothesis is after seeing the evidence.' },
    { term: 'likelihood ratio', meaning: '$P(+ \\mid D)/P(+ \\mid \\bar D)$: how much more likely the evidence is under the hypothesis.' },
  ],

  priorCheck: [
    item({ id: 'st-bayes.pre1', competency: 'stats.probability', difficulty: 1, prompt: 'If $P(A) = 0.5$ and $P(B \\mid A) = 0.2$, what is $P(A \\text{ and } B)$?', answer: num(0.1), compute: () => 0.5 * 0.2, solution: 'Multiplication rule: $0.5 \\times 0.2 = 0.1$.' }),
    item({ id: 'st-bayes.pre2', competency: 'stats.probability', difficulty: 2, prompt: 'In a class, 12 of 30 students take chemistry, and 4 of those also take physics. Given a student takes chemistry, what is the probability they take physics?', answer: num(1 / 3, 0.0006), compute: () => 4 / 12, solution: 'Within the 12 chemistry students: $4/12 \\approx 0.333$.' }),
  ],

  visualization: {
    lab: 'bayes',
    intro: 'Read the dot picture first: how many filled squares are red? Then raise the prior to 10% and watch the posterior jump. Finally add a second positive test.',
    textAlternative: 'The lab shows 1,000 people as dots, marking those who test positive and those who have the condition. A sentence gives the counts and the share of positives who are truly sick; sliders set the prior, sensitivity, false-positive rate and number of positive tests, and the table lists the probability after each test.',
  },

  derivation: {
    intro: 'Bayes’ theorem is the definition of conditional probability, used twice.',
    steps: [
      { say: 'By definition of conditional probability, applied in both directions,', math: 'P(D \\mid +) = \\frac{P(D \\text{ and } +)}{P(+)} \\qquad\\text{and}\\qquad P(D \\text{ and } +) = P(+ \\mid D)\\,P(D)' },
      { say: 'A positive result comes either from someone with the condition or from someone without it (total probability):', math: 'P(+) = P(+ \\mid D)P(D) + P(+ \\mid \\bar D)P(\\bar D)' },
      { say: 'Substituting both:', math: 'P(D \\mid +) = \\frac{P(+ \\mid D)\\,P(D)}{P(+ \\mid D)P(D) + P(+ \\mid \\bar D)P(\\bar D)}' },
      { say: 'Dividing $P(D\\mid+)$ by $P(\\bar D\\mid+)$ cancels $P(+)$ and gives the **odds form** — the easiest way to update repeatedly:', math: '\\underbrace{\\frac{P(D \\mid +)}{P(\\bar D \\mid +)}}_{\\text{posterior odds}} = \\underbrace{\\frac{P(D)}{P(\\bar D)}}_{\\text{prior odds}} \\times \\underbrace{\\frac{P(+ \\mid D)}{P(+ \\mid \\bar D)}}_{\\text{likelihood ratio}}' },
    ],
    assumptions: ['The prior describes the group being tested (screening everyone versus testing people with symptoms changes it).', 'For repeated tests: results are independent given the true status. Real repeat tests often share errors, which makes the second test less informative than this assumes.'],
    domain: ['Needs $P(+) > 0$: you cannot condition on evidence that is impossible.'],
  },

  examples: [
    {
      title: 'The screening test',
      problem: 'Prior 0.01, sensitivity 0.90, false-positive rate 0.09. Find $P(D \\mid +)$.',
      steps: ['Numerator: $0.90 \\times 0.01 = 0.009$.', 'Denominator: $0.009 + 0.09 \\times 0.99 = 0.009 + 0.0891 = 0.0981$.', '$0.009/0.0981 \\approx 0.0917$.'],
      answer: 'About 9.2% — far from 90%.',
      check: { value: 0.0917, tolerance: 1e-4, compute: () => 0.009 / (0.009 + 0.09 * 0.99) },
    },
    {
      title: 'A second positive test',
      problem: 'The same person takes an independent second test and is positive again.',
      steps: ['Prior odds now: $0.0917/0.9083 \\approx 0.101$ (exactly $1/99 \\times 10$).', 'Likelihood ratio $0.90/0.09 = 10$, so posterior odds $\\approx 1.01$.', 'Probability $= 1.01/2.01 \\approx 0.5025$.'],
      answer: 'About 50% after two positives.',
      check: { value: 0.5025, tolerance: 1e-4, compute: () => { const p = 0.009 / 0.0981; return (0.9 * p) / (0.9 * p + 0.09 * (1 - p)); } },
    },
  ],

  counterexample: {
    title: 'Swapping the conditional',
    body: [
      '“If you have the condition, the test is positive 90% of the time” is $P(+ \\mid D) = 0.9$. “If the test is positive, you have the condition 90% of the time” would be $P(D \\mid +) = 0.9$. Here the second is actually about 0.09. Confusing the two in court is called the **prosecutor’s fallacy**: the chance that innocent evidence would look like this is not the chance of innocence.',
    ],
  },

  predict: {
    prompt: 'Keep the same test, but suppose the condition affects 10% of the people tested instead of 1%. Is a positive result more convincing, less convincing, or the same?',
    choices: ['More convincing', 'Less convincing', 'The same — the test has not changed'],
    answer: 0,
    reveal: '$0.09/(0.09 + 0.09 \\times 0.9) = 0.09/0.171 \\approx 0.53$, up from 0.09. With more real cases, a smaller share of positives are false alarms.',
    misconception: {
      belief: 'A test’s accuracy alone tells you how likely a positive result is to be right.',
      correction: 'The posterior depends on the base rate as much as on the test. The same test means very different things in a screening programme and in a specialist clinic.',
    },
  },

  practice: [
    item({ id: 'st-bayes.p1', competency: 'stats.bayes', difficulty: 1, level: 'scaffolded', prompt: 'Of 1,000 people with a 1% rate, how many have the condition AND test positive, if sensitivity is 90%?', answer: num(9), compute: () => 1000 * 0.01 * 0.9, solution: '10 have it; 90% of 10 is 9.' }),
    item({ id: 'st-bayes.p2', competency: 'stats.bayes', difficulty: 1, level: 'scaffolded', prompt: 'Of the 990 who do not have it, how many test positive at a 9% false-positive rate?', answer: num(89.1, 0.05), compute: () => 990 * 0.09, solution: '$0.09 \\times 990 = 89.1$.' }),
    item({ id: 'st-bayes.p3', competency: 'stats.bayes', difficulty: 2, level: 'independent', prompt: 'Prior 0.02, sensitivity 0.95, false-positive rate 0.05. Find $P(D \\mid +)$ to three decimals.', answer: num(0.019 / 0.068, 0.0006), compute: () => (0.95 * 0.02) / (0.95 * 0.02 + 0.05 * 0.98), solution: '$0.019/(0.019 + 0.049) = 0.019/0.068 \\approx 0.279$.' }),
    item({ id: 'st-bayes.p4', competency: 'stats.bayes', difficulty: 2, level: 'independent', prompt: 'What is the likelihood ratio of a positive result for a test with sensitivity 0.8 and false-positive rate 0.1?', answer: num(8), compute: () => 0.8 / 0.1, solution: '$0.8/0.1 = 8$.' }),
    item({ id: 'st-bayes.p5', competency: 'stats.bayes', difficulty: 2, level: 'independent', prompt: 'With a rare condition, which change raises $P(D \\mid +)$ the most?', answer: choice(['Raising sensitivity from 90% to 99%', 'Cutting the false-positive rate from 9% to 1%', 'Testing twice as many people', 'Reporting more decimal places'], 1), feedback: { 0: 'It only raises the numerator slightly (9 → 9.9 true positives per 1,000).' }, solution: 'False positives dominate when the condition is rare: 89 → about 10 per 1,000, so the posterior rises from 9% to about 48%.' }),
    item({ id: 'st-bayes.p6', competency: 'stats.bayes', difficulty: 3, level: 'transfer', prompt: 'A spam filter: 20% of email is spam; the word “prize” appears in 30% of spam and 1% of other email. What is $P(\\text{spam} \\mid \\text{“prize”})$? (Three decimals.)', answer: num(0.06 / 0.068, 0.0006), compute: () => (0.3 * 0.2) / (0.3 * 0.2 + 0.01 * 0.8), solution: '$0.06/(0.06 + 0.008) \\approx 0.882$.' }),
    item({ id: 'st-bayes.p7', competency: 'stats.bayes', difficulty: 3, level: 'transfer', prompt: 'An expert says: “The chance of this DNA match if the suspect were innocent is 1 in 10,000, so the chance the suspect is innocent is 1 in 10,000.” What is wrong?', answer: choice(['Nothing', 'It swaps P(match | innocent) for P(innocent | match), ignoring how many other people could match', 'DNA evidence is never reliable', 'The numbers should be multiplied'], 1), solution: 'In a city of a million, about 100 innocent people would match too. The posterior depends on that base rate.' }),
  ],

  checkpoint: [
    item({ id: 'st-bayes.c1', competency: 'stats.bayes', difficulty: 1, prompt: 'With $P(D) = 0.05$ and sensitivity 0.8, what is $P(D \\text{ and } +)$?', answer: num(0.04), compute: () => 0.05 * 0.8, solution: '$0.05 \\times 0.8 = 0.04$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Multiply the prior by the sensitivity.' }),
    item({ id: 'st-bayes.c2', competency: 'stats.bayes', difficulty: 2, prompt: 'Prior 0.05, sensitivity 0.8, false-positive rate 0.1. Find $P(D \\mid +)$ to three decimals.', answer: num(0.04 / 0.135, 0.0006), compute: () => 0.04 / (0.04 + 0.1 * 0.95), solution: '$0.04/(0.04 + 0.095) = 0.04/0.135 \\approx 0.296$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Denominator: true positives (0.04) plus false positives ($0.1 \\times 0.95$).' }),
    item({ id: 'st-bayes.c3', competency: 'stats.bayes', difficulty: 3, prompt: 'Prior odds are 1 : 4 and the likelihood ratio of the evidence is 6. What is the posterior probability?', answer: num(0.6), compute: () => 6 / 4 / (1 + 6 / 4), solution: 'Posterior odds $6 : 4 = 1.5$; probability $1.5/2.5 = 0.6$.', feedbackCorrect: 'Right — the odds form at work.', feedbackIncorrect: 'Multiply the odds by 6, then convert odds $o$ to probability $o/(1 + o)$.' }),
  ],

  python: {
    intro: 'Bayes’ theorem as a function, applied twice — the posterior after the first test becomes the prior for the second.',
    code: `def posterior(prior, sensitivity, false_positive_rate):
    true_pos = sensitivity * prior
    false_pos = false_positive_rate * (1 - prior)
    return true_pos / (true_pos + false_pos)

p1 = posterior(0.01, 0.90, 0.09)
p2 = posterior(p1, 0.90, 0.09)
print(round(p1, 4), round(p2, 4))
print(round(posterior(0.10, 0.90, 0.09), 4))`,
    output: '0.0917 0.5025\n0.5263',
    explain: 'The two worked examples, then the predict question with a 10% base rate.',
  },

  reading: [
    { title: 'Seeing Theory — Bayesian Inference', source: 'Brown University', url: 'https://seeing-theory.brown.edu/bayesian-inference/index.html', note: 'Interactive Bayes’ theorem and updating.' },
    { title: 'Independent and Mutually Exclusive Events (§3.2)', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events', note: 'Conditional probability and independence, the ingredients of Bayes’ theorem.' },
  ],
};
