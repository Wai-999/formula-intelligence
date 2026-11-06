import { item, num, choice } from '../lessonKit.js';

// Phase 6 of the 80/20 upgrade (docs/learning-8020/PHASE6_LESSONS.md):
// describing data with a center and a spread. Six written lessons build on it
// — the sampling distribution and CLT (a priority lesson with no bridge
// until now), fitting a line, validation and PCA — and placement items
// dx.s1 and dx.s2 test it. Written to the professor contract from the
// start. All numbers are illustrative.

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)); };
const clinic = [9, 11, 12, 12, 13, 14, 15, 16, 18, 40];

export default {
  intuition: {
    question: 'Two bus routes both average 30 minutes. On route A every trip takes 28 to 32 minutes; on route B trips range from 15 to 55. You have a job interview at 9:00. Which route do you take — and what number, besides the average, would have told you?',
    body: [
      'The **mean**, $\\bar x$, is the balance point of the data: add the values and divide by how many there are. The **median** is the middle value once the data are sorted. Both describe the **center**.',
      'Center is half the story. **Spread** says how far values typically sit from the center. The **standard deviation**, $s$, is roughly the typical distance of a value from the mean, in the data’s own units. The **interquartile range** (IQR) is the width of the middle half of the data.',
      'The two pairs react differently to an extreme value. One very large salary drags the mean up and inflates the standard deviation, while the median and the IQR barely move. Choosing the summary is part of the analysis, and an honest report gives a center *with* a spread.',
    ],
    simpler: [
      'Picture children sitting along a seesaw. The mean is where the pivot must go for it to balance: one child moving far out shifts it a lot. The median is the child in the middle of the line-up: moving the end child further out does not change who sits in the middle.',
    ],
  },

  outcomes: [
    'Compute the mean, median, standard deviation and interquartile range of a small data set.',
    'Say what each one measures, and predict how an outlier changes it.',
    'Choose a summary that suits the data and the decision, and report a center together with a spread.',
  ],

  glossary: [
    { term: '$\\bar x = \\dfrac{\\sum x}{n}$', say: 'x bar equals the sum of x over n', meaning: 'The **mean**: the total divided by the count. $\\sum$ (capital sigma) means “add them all up”.' },
    { term: 'median', meaning: 'The middle value of the sorted data; with an even count, the mean of the two middle values.' },
    { term: '$s = \\sqrt{\\dfrac{\\sum (x - \\bar x)^2}{n - 1}}$', say: 's equals the square root of the sum of x minus x bar, squared, over n minus one', meaning: 'The **sample standard deviation**: roughly the typical distance of a value from the mean. Its square, $s^2$, is the **variance**.' },
    { term: '$Q_1$, $Q_3$, IQR $= Q_3 - Q_1$', say: 'Q one, Q three; I Q R equals Q three minus Q one', meaning: 'The **quartiles** cut the sorted data into quarters; the **interquartile range** is the width of the middle half.' },
  ],

  priorCheck: [
    item({
      id: 'ps-cs.pre1', competency: 'arith.fractions', difficulty: 1,
      prompt: 'What is $\\dfrac{12 + 15 + 18}{3}$?',
      answer: num(15), compute: () => (12 + 15 + 18) / 3, solution: '$45 / 3 = 15$.',
    }),
    item({
      id: 'ps-cs.pre2', competency: 'arith.exponents', difficulty: 1,
      prompt: 'What is $\\sqrt{16 + 9}$?',
      answer: num(5), compute: () => Math.sqrt(16 + 9), solution: 'Add first: $\\sqrt{25} = 5$.', remedy: 'pa-exponents',
    }),
  ],

  visualization: {
    lab: 'center-spread',
    intro: 'Start with the bus trips. Drag the largest value out to 120 minutes: the mean and the standard-deviation band chase it, while the median and the middle-half box stay where they were. Then try the salaries, where one value is already far out.',
    textAlternative: 'A dot plot of a small data set on a number line. Above it, a band marks the mean plus and minus one standard deviation, with a line at the mean; a second band marks the middle half of the data, from the first to the third quartile, with a line at the median. A slider moves the largest value. The readout gives the mean, median, standard deviation and IQR, and how far the mean sits from the median; the table lists each value with its deviation and squared deviation.',
  },

  derivation: {
    intro: 'Why the mean is a balance point, why the standard deviation squares the deviations, and why it divides by $n - 1$.',
    steps: [
      { say: 'The deviations from the mean always add up to zero. That is what makes the mean the balance point:', math: '\\sum (x_i - \\bar x) = \\sum x_i - n\\bar x = n\\bar x - n\\bar x = 0' },
      { say: 'So the plain average of the deviations is always 0 and says nothing about spread. Squaring makes every deviation count, whichever side of the mean it is on:', math: '\\sum (x_i - \\bar x)^2 \\ge 0, \\text{ and } = 0 \\text{ only if every value is } \\bar x' },
      { say: 'Dividing by $n - 1$ gives the variance; its square root brings the result back to the data’s units:', math: 's = \\sqrt{\\frac{\\sum (x_i - \\bar x)^2}{n - 1}}' },
      { say: 'Why $n - 1$: once $n - 1$ of the deviations are known, the last one is forced, because they add to zero. Only $n - 1$ are free — the **degrees of freedom** — and deviations from $\\bar x$, which was fitted to these very values, run slightly small. Dividing by $n - 1$ rather than $n$ corrects for that.', math: 'x_n - \\bar x = -\\sum_{i=1}^{n-1} (x_i - \\bar x)' },
      { say: 'An outlier enters the mean once and the standard deviation squared, so both follow it. The median and the quartiles depend only on which values sit in the middle, so they barely move — unless the data set is so small that the quartiles sit next to the ends.' },
    ],
    assumptions: [
      'The values are measurements on a scale where differences mean something (minutes, dollars), not category labels.',
      'The data are a sample from something larger, so the standard deviation divides by $n - 1$. For a whole population it divides by $N$ and is written $\\sigma$.',
    ],
    domain: [
      'A standard deviation needs at least two values, is never negative, and is 0 only when every value is the same.',
      'For skewed data or data with outliers, the median and IQR describe a typical value better than the mean and standard deviation.',
      'Quartiles here are the medians of the two halves, leaving out the middle value when the count is odd; software that interpolates can give slightly different quartiles.',
    ],
  },

  examples: [
    {
      title: 'Mean, median and standard deviation',
      problem: 'Five trips on route A took 28, 30, 31, 29 and 32 minutes. Find the mean, the median and the standard deviation.',
      steps: [
        'Mean: $\\bar x = 150 / 5 = 30$ minutes.',
        'Sorted: 28, 29, 30, 31, 32. The median is the middle value, 30.',
        'Deviations from 30: $-2, -1, 0, 1, 2$; their squares $4, 1, 0, 1, 4$ add to 10. So $s = \\sqrt{10 / 4} = \\sqrt{2.5} \\approx 1.58$ minutes.',
      ],
      answer: 'Mean 30, median 30, $s \\approx 1.58$ minutes',
      check: { value: 1.5811, compute: () => sd([28, 30, 31, 29, 32]), tolerance: 1e-4 },
      tempting: {
        wrong: 'Tempting: average the deviations, $(-2 - 1 + 0 + 1 + 2) / 5 = 0$, and conclude that the trips do not vary.',
        why: 'Deviations from the mean cancel to zero for every data set — that is what makes $\\bar x$ the balance point. Squaring before averaging stops the cancelling, which is why the standard deviation squares the deviations and then takes the square root.',
      },
    },
    {
      title: 'One extreme value',
      problem: 'Route B took 15, 22, 30, 33 and 55 minutes. Find the mean and the median. Then a breakdown turns the 55-minute trip into 95 minutes: what happens to each?',
      steps: [
        'Mean $155 / 5 = 31$ minutes; median 30.',
        'With 95 instead of 55: mean $195 / 5 = 39$, up 8 minutes; the median is still 30.',
        'The extra 40 minutes is shared across 5 trips, so the mean rises by $40 / 5 = 8$. The median depends only on the middle trip, which did not change.',
      ],
      answer: 'The mean goes from 31 to 39 minutes; the median stays at 30',
      check: { value: 39, compute: () => mean([15, 22, 30, 33, 95]) },
    },
    {
      title: 'Quartiles and the IQR',
      problem: 'Eight deliveries took 12, 15, 17, 18, 20, 22, 25 and 40 minutes. Find the quartiles and the IQR.',
      steps: [
        'The data are sorted. The lower half is 12, 15, 17, 18, so $Q_1 = (15 + 17) / 2 = 16$.',
        'The upper half is 20, 22, 25, 40, so $Q_3 = (22 + 25) / 2 = 23.5$.',
        'IQR $= 23.5 - 16 = 7.5$ minutes. The 40-minute delivery lies beyond $Q_3 + 1.5 \\times \\text{IQR} = 34.75$, the usual fence for an outlier.',
      ],
      answer: '$Q_1 = 16$, $Q_3 = 23.5$, IQR $= 7.5$ minutes',
      check: { value: 7.5, compute: () => (22 + 25) / 2 - (15 + 17) / 2 },
    },
  ],

  counterexample: {
    title: 'Same mean, different stories',
    body: [
      'Route A (28 to 32 minutes) and route B (15 to 55 minutes) average 30 and 31 minutes. “Both routes average about 30 minutes” is true and misleading: A’s standard deviation is about 1.6 minutes and B’s about 15. For a 9:00 interview, B’s spread is the whole risk.',
      'A median can hide just as much: 10, 10, 10, 90, 90 and 10, 10, 10, 11, 12 both have median 10. A center without a spread is not a summary of the data.',
    ],
  },

  predict: {
    prompt: 'Ten employees earn between \\$40,000 and \\$60,000, averaging \\$50,000. The CEO, who earns \\$2 million, is added to the data. Which summary changes most?',
    choices: ['The mean', 'The median', 'Both change by the same amount', 'Neither changes'],
    answer: 0,
    reveal: 'The mean jumps by about \\$177,000, to roughly \\$227,000 — the CEO’s pay shared out over 11 people — while the median moves only to the next value in the middle. That is why incomes and house prices are usually reported with medians.',
    misconception: {
      belief: 'The mean is the typical value, so it is always the best summary.',
      correction: 'The mean is the balance point, and one far value drags it. When data are skewed or have outliers, the median is the better “typical” value; say which one you used.',
    },
  },

  faded: {
    title: 'Daily water use',
    problem: 'A household’s water meter read 310, 290, 305, 295 and 300 litres on five days. Find the mean and the standard deviation.',
    steps: [
      { say: 'Add and divide: the total is 1500 litres, so $\\bar x = 300$ litres a day.' },
      {
        say: 'The deviations from 300 are $10, -10, 5, -5, 0$. Square them and add.',
        item: item({ id: 'ps-cs.f1', competency: 'stats.descriptive', difficulty: 2, level: 'scaffolded', prompt: 'What is $\\sum (x - \\bar x)^2$?', answer: num(250), compute: () => [310, 290, 305, 295, 300].reduce((a, x) => a + (x - 300) ** 2, 0), hints: ['$10^2 + (-10)^2 + 5^2 + (-5)^2 + 0^2$.'], solution: '$100 + 100 + 25 + 25 + 0 = 250$.' }),
      },
      {
        say: 'Divide by $n - 1 = 4$ to get the variance.',
        item: item({ id: 'ps-cs.f2', competency: 'stats.descriptive', difficulty: 2, level: 'scaffolded', prompt: 'What is the variance $s^2$, in litres squared?', answer: num(62.5), compute: () => 250 / 4, hints: ['$250 / 4$.'], solution: '$62.5$ litres squared — in squared units, which is why the next step takes a root.' }),
      },
      {
        say: 'Take the square root to return to litres.',
        item: item({ id: 'ps-cs.f3', competency: 'stats.descriptive', difficulty: 1, level: 'scaffolded', prompt: 'What is $s$, in litres? (Two decimal places.)', answer: num(7.91, 0.01), compute: () => sd([310, 290, 305, 295, 300]), hints: ['$\\sqrt{62.5}$ lies between $\\sqrt{49} = 7$ and $\\sqrt{64} = 8$.'], solution: '$\\sqrt{62.5} \\approx 7.91$ litres.' }),
      },
    ],
    answer: 'Mean 300 litres a day, $s \\approx 7.9$ litres: the household’s use barely varies from day to day.',
  },

  practice: [
    item({ id: 'ps-cs.p1', competency: 'stats.descriptive', difficulty: 1, level: 'scaffolded', prompt: 'What is the mean of 6, 9, 9 and 16?', answer: num(10), compute: () => mean([6, 9, 9, 16]), hints: ['The total is 40.'], solution: '$40 / 4 = 10$.' }),
    item({ id: 'ps-cs.p2', competency: 'stats.descriptive', difficulty: 1, level: 'scaffolded', prompt: 'What is the median of 6, 9, 9, 16 and 40?', answer: num(9), compute: () => median([6, 9, 9, 16, 40]), hints: ['Five sorted values: the third is the middle one.'], solution: 'The middle value is 9. The 40 does not affect it.' }),
    item({ id: 'ps-cs.p3', competency: 'stats.descriptive', difficulty: 2, level: 'independent', prompt: 'What is the median of 3, 8, 1, 10, 7 and 5?', answer: num(6), compute: () => median([3, 8, 1, 10, 7, 5]), hints: ['Sort first: 1, 3, 5, 7, 8, 10.', 'With six values, average the two in the middle.'], solution: '$(5 + 7) / 2 = 6$. The median need not be one of the values.' }),
    item({ id: 'ps-cs.p4', competency: 'stats.descriptive', difficulty: 2, level: 'independent', prompt: 'What is the sample standard deviation of 2, 4 and 6?', answer: num(2), compute: () => sd([2, 4, 6]), hints: ['The mean is 4; the squared deviations are 4, 0 and 4.', 'Divide their sum by $n - 1 = 2$, then take the root.'], solution: '$\\sqrt{8 / 2} = \\sqrt{4} = 2$.' }),
    item({
      id: 'ps-cs.p5', competency: 'stats.descriptive', difficulty: 2, level: 'independent',
      prompt: 'Every value in a data set is increased by 10. What happens to the standard deviation?',
      answer: choice(['It stays the same', 'It increases by 10', 'It increases by $\\sqrt{10}$', 'It doubles'], 0),
      hints: ['What happens to the mean, and so to each deviation from it?'],
      feedback: { 1: 'The mean rises by 10 too, so every deviation $x - \\bar x$ is unchanged.', 2: 'Nothing about the deviations changes, so no root of 10 appears.', 3: 'Doubling would need every deviation to double, which happens when values are multiplied by 2, not shifted.' },
      solution: 'Shifting every value shifts the mean by the same amount, so the deviations, and the standard deviation, do not change.',
    }),
    item({
      id: 'ps-cs.p6', competency: 'stats.descriptive', difficulty: 3, level: 'transfer',
      prompt: 'A city’s daily temperatures have mean 20 °C and standard deviation 5 °C. In Fahrenheit, $F = 1.8C + 32$. What is the standard deviation in °F?',
      answer: num(9), compute: () => 1.8 * 5,
      hints: ['Adding 32 shifts every value and does not change the spread.', 'Multiplying by 1.8 multiplies every deviation by 1.8.'],
      solution: '$1.8 \\times 5 = 9$ °F. The mean becomes $1.8 \\times 20 + 32 = 68$ °F, but the spread only feels the 1.8.',
    }),
  ],

  apply: {
    scenario: 'A small clinic is choosing how long its appointment slots should be. Last week’s consultations took 9, 11, 12, 12, 13, 14, 15, 16, 18 and 40 minutes. The 40-minute one needed an interpreter who had not been booked.',
    steps: [
      'Compute the mean and the median.',
      'Measure the spread of the middle half.',
      'Advise on the slot length, saying which summary you used.',
    ],
    items: [
      item({ id: 'ps-cs.u1', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the mean consultation time, in minutes?', answer: num(16), compute: () => mean(clinic), hints: ['The ten times add to 160.'], solution: '$160 / 10 = 16$ minutes.' }),
      item({ id: 'ps-cs.u2', competency: 'stats.descriptive', difficulty: 2, prompt: 'What is the median, in minutes?', answer: num(13.5), compute: () => median(clinic), hints: ['Ten values: average the 5th and 6th.'], solution: '$(13 + 14) / 2 = 13.5$ minutes.' }),
      item({ id: 'ps-cs.u3', competency: 'stats.descriptive', difficulty: 2, prompt: 'What is the IQR, in minutes? (Use the median of each half.)', answer: num(4), compute: () => median([14, 15, 16, 18, 40]) - median([9, 11, 12, 12, 13]), hints: ['Lower half 9, 11, 12, 12, 13; upper half 14, 15, 16, 18, 40.'], solution: '$Q_1 = 12$ and $Q_3 = 16$, so the IQR is 4 minutes: the middle half of consultations took 12 to 16 minutes.' }),
      item({
        id: 'ps-cs.u4', competency: 'stats.descriptive', difficulty: 3,
        prompt: 'The manager proposes 16-minute slots “because that is the average”. What would you advise?',
        answer: choice(['The mean is pulled up by one unusual 40-minute case; the median (13.5) and the middle half (12 to 16 minutes) describe a typical visit, so plan slots from those and book a long slot when an interpreter is needed', 'Use 16 minutes: the mean is always the right planning number', 'Use 40 minutes, so that no consultation ever runs over', 'Drop the 40-minute visit from the data and use the new mean'], 0),
        feedback: { 1: 'One unusual visit raised the mean by about 2.7 minutes (from 13.3 without it); a slot plan built on it would leave most slots partly idle.', 2: 'Planning every slot for the longest visit would leave most of each day idle.', 3: 'Deleting it hides a real need: it belongs in the plan as a different kind of appointment.' },
        solution: 'Describe typical visits with the median and IQR, and treat the interpreter case as its own appointment type.',
      }),
    ],
    limits: [
      'One week is a small sample: another week might have two long cases or none.',
      'Slot length trades patients’ waiting time against idle time; a summary statistic informs that choice but does not make it.',
      'The 40-minute case is real information, not an error: it says some visits need booking differently.',
    ],
  },

  checkpoint: [
    item({ id: 'ps-cs.c1', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the median of 7, 2, 9, 4 and 5?', answer: num(5), compute: () => median([7, 2, 9, 4, 5]), solution: 'Sorted: 2, 4, 5, 7, 9. The middle value is 5.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Sort the values first, then take the one in the middle.' }),
    item({ id: 'ps-cs.c2', competency: 'stats.descriptive', difficulty: 2, prompt: 'What is the sample standard deviation of 1, 3, 5 and 7? (Two decimal places.)', answer: num(2.58, 0.01), compute: () => sd([1, 3, 5, 7]), solution: 'The mean is 4; the squared deviations 9, 1, 1, 9 add to 20; $\\sqrt{20 / 3} \\approx 2.58$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Find the mean, square each deviation, add them, divide by $n - 1 = 3$, then take the square root.' }),
    item({
      id: 'ps-cs.c3', competency: 'stats.descriptive', difficulty: 2,
      prompt: 'House prices in a town are reported as “median \\$310,000, mean \\$420,000”. What does that suggest?',
      answer: choice(['A few very expensive houses pull the mean above the median: the prices are skewed to the right', 'Most houses cost about \\$420,000', 'The report must be wrong, because the mean and median should match', 'Most houses cost more than \\$420,000'], 0),
      feedback: { 1: 'Half the houses cost less than the median, \\$310,000; the mean is above the typical price.', 2: 'They match only for symmetric data; prices are rarely symmetric.', 3: 'Half of the houses are below \\$310,000, so most cannot be above \\$420,000.' },
      solution: 'The mean is well above the median, so a long tail of expensive houses is pulling it up.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Which summary would a handful of mansions move, and which would they leave alone?',
    }),
    item({
      id: 'ps-cs.c4', competency: 'stats.descriptive', difficulty: 3,
      prompt: 'In Python, `statistics.stdev([10, 20, 30])` returns `10.0`. What does `statistics.stdev([110, 120, 130])` return?',
      answer: num(10), compute: () => sd([110, 120, 130]),
      solution: '10.0 again: adding 100 to every value moves the mean by 100 and leaves every deviation the same.',
      feedbackCorrect: 'Right — shifting data never changes its spread.', feedbackIncorrect: 'Compare the deviations from the mean in the two lists.',
    }),
  ],

  python: {
    intro: 'Python’s `statistics` module computes the same summaries. The breakdown shows which ones an extreme value moves.',
    code: `import statistics as st

route_a = [28, 30, 31, 29, 32]
route_b = [15, 22, 30, 33, 55]
for name, trips in [("A", route_a), ("B", route_b)]:
    print(name, "mean", st.mean(trips), "median", st.median(trips),
          "sd", round(st.stdev(trips), 2))

# One breakdown: the 55-minute trip takes 95 minutes instead.
broken = [15, 22, 30, 33, 95]
print("after the breakdown: mean", st.mean(broken), "median", st.median(broken),
      "sd", round(st.stdev(broken), 2))`,
    output: 'A mean 30 median 30 sd 1.58\nB mean 31 median 30 sd 15.15\nafter the breakdown: mean 39 median 30 sd 32.09',
    explain: '`st.stdev` is the sample standard deviation (dividing by $n - 1$); `st.pstdev` divides by $n$. One 40-minute delay moved the mean by 8 and more than doubled the standard deviation, while the median stayed at 30.',
  },

  reading: [
    { title: '2.5 Measures of the Center of the Data', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-5-measures-of-the-center-of-the-data', note: 'Mean and median, and when each is the better choice.' },
    { title: '2.7 Measures of the Spread of the Data', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data', note: 'The standard deviation, worked by hand and interpreted.' },
    { title: '2.3 Measures of the Location of the Data', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-3-measures-of-the-location-of-the-data', note: 'Quartiles, percentiles and the IQR outlier rule.' },
  ],
};
