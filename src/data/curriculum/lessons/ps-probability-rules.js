import { item, num, choice } from '../lessonKit.js';

// Phase 6 of the 80/20 upgrade (docs/learning-8020/PHASE6_LESSONS.md): the
// complement, addition and multiplication rules. Bayes' theorem, the random
// variables behind the CLT and discrete probability in Discrete Structures
// all build on them; placement items dx.s3 and dx.s4 test them; and the
// Bayes lesson had no bridge to fall back on. Written to the professor
// contract from the start. All numbers are illustrative.

const DICE = Array.from({ length: 36 }, (_, i) => [Math.floor(i / 6) + 1, (i % 6) + 1]);
const count = (test) => DICE.filter(test).length;

export default {
  intuition: {
    question: 'A weather app gives a 30% chance of rain on Saturday and 30% on Sunday. A friend says: “So there’s a 60% chance it rains this weekend.” Is that right? What would make it wrong — and what is the real chance, if the two days are independent?',
    body: [
      'When outcomes are equally likely, a **probability** is a count: $P(A) = \\dfrac{\\text{outcomes in } A}{\\text{all outcomes}}$. Two fair dice can land 36 ways, and 6 of them sum to 7, so $P(\\text{sum is } 7) = 6/36 = 1/6$.',
      'Three rules do most of the work. **Not**: $P(\\text{not } A) = 1 - P(A)$. **Or**: $P(A \\text{ or } B) = P(A) + P(B) - P(A \\text{ and } B)$, taking off what was counted twice. **And**, for independent events: $P(A \\text{ and } B) = P(A) \\cdot P(B)$.',
      '“At least one” questions are easiest through the complement. The chance of at least one rainy day is 1 minus the chance of no rain on either day: $1 - 0.7 \\times 0.7 = 0.51$, not 0.6. Adding the two 30%s counts the weekends with rain on both days twice.',
    ],
    simpler: [
      'Think of two club lists. To count the students in the football club or the chess club, you add the two lists — but anyone on both lists has been counted twice, so you take them off once. The addition rule is that sentence, with probabilities.',
    ],
  },

  outcomes: [
    'Find probabilities by counting equally likely outcomes, and use the complement rule.',
    'Use the addition rule, subtracting the overlap, and recognise events that are mutually exclusive.',
    'Multiply probabilities for independent events, and solve “at least one” questions through the complement.',
  ],

  glossary: [
    { term: '$P(A)$', say: 'P of A', meaning: 'The probability of event $A$: a number from 0 (impossible) to 1 (certain).' },
    { term: '$P(A^c) = 1 - P(A)$', say: 'P of A complement equals one minus P of A', meaning: 'The **complement** $A^c$ is “not $A$”: every outcome outside $A$.' },
    { term: '$P(A \\cup B)$, $P(A \\cap B)$', say: 'P of A union B, and P of A intersection B: P of A or B, and P of A and B', meaning: '“Or” ($\\cup$) means at least one of the two happens; “and” ($\\cap$) means both happen.' },
    { term: 'mutually exclusive, independent', meaning: '**Mutually exclusive**: the events cannot happen together, so $P(A \\cap B) = 0$. **Independent**: knowing one happened does not change the chance of the other, so $P(A \\cap B) = P(A)\\,P(B)$.' },
  ],

  priorCheck: [
    item({
      id: 'ps-pr.pre1', competency: 'arith.fractions', difficulty: 1,
      prompt: 'What is $1 - 0.35$?',
      answer: num(0.65), compute: () => 1 - 0.35, solution: '$0.65$.',
    }),
    item({
      id: 'ps-pr.pre2', competency: 'arith.fractions', difficulty: 1,
      prompt: 'What is $0.3 \\times 0.3$?',
      answer: num(0.09), compute: () => 0.3 * 0.3, solution: '$3 \\times 3 = 9$, with two decimal places: $0.09$.',
    }),
  ],

  visualization: {
    lab: 'dice-grid',
    intro: 'Start with “Sum 7 or a six”: 6 squares sum to 7, 11 contain a six, and 2 are in both. Count the squares in either — 15, not 17. Then try “Sum 7 or doubles”: no square is in both, so the two counts simply add.',
    textAlternative: 'A six-by-six grid of the 36 ways two fair dice can land, first die down the side and second across the top. Two events are chosen from a list (sum is 7, at least one six, doubles, first die even, sum 10 or more). Squares in event A are marked A, squares in B are marked B, and squares in both are marked A B. The readout and the table give each count out of 36 and show that the number in A or B equals the number in A plus the number in B minus the number in both.',
  },

  derivation: {
    intro: 'Each rule comes from counting outcomes, when all of them are equally likely.',
    steps: [
      { say: 'With $N$ equally likely outcomes, an event is a set of them, and its probability is its share of the total:', math: 'P(A) = \\frac{|A|}{N}, \\qquad 0 \\le P(A) \\le 1' },
      { say: 'Every outcome is either in $A$ or outside it, so the two counts add up to $N$:', math: '|A| + |A^c| = N \\;\\Rightarrow\\; P(A^c) = 1 - P(A)' },
      { say: 'Counting $A$ and then $B$ counts the outcomes in both twice. Taking them off once fixes it:', math: '|A \\cup B| = |A| + |B| - |A \\cap B| \\;\\Rightarrow\\; P(A \\cup B) = P(A) + P(B) - P(A \\cap B)' },
      { say: 'Each of the 6 results of the first die pairs with each of the 6 of the second, giving $6 \\times 6 = 36$ outcomes. An event about the first die and an event about the second pair up the same way — which is the multiplication rule for independent events:', math: 'P(A \\cap B) = \\frac{|A| \\cdot |B|}{6 \\cdot 6} = P(A)\\,P(B)' },
      { say: '“At least one” is the complement of “none”, and with independent tries “none” is a product:', math: 'P(\\text{at least one in } n) = 1 - (1 - p)^n' },
    ],
    assumptions: [
      'Counting needs equally likely outcomes: fair coins and dice, or a random pick from a list.',
      'The multiplication rule needs independence. For linked events, $P(A \\cap B) = P(A)\\,P(B \\mid A)$, which the Bayes lesson takes up.',
    ],
    domain: [
      'Every probability lies between 0 and 1; an answer outside that range is a mistake.',
      'Mutually exclusive events (each possible) are never independent: if one happens, the other cannot.',
      'Real-world probabilities, like a chance of rain, come from data and models, not from counting.',
    ],
  },

  examples: [
    {
      title: '“Or”, with an overlap',
      problem: 'Roll two fair dice. What is the probability that the sum is 7 or at least one die shows a six?',
      steps: [
        'Sum 7: 6 of the 36 outcomes. At least one six: 11 (6 with a six on the first die, 6 on the second, minus the 1 with both).',
        'In both: $(1, 6)$ and $(6, 1)$, 2 outcomes.',
        '$P = \\dfrac{6 + 11 - 2}{36} = \\dfrac{15}{36} \\approx 0.417$.',
      ],
      answer: '$15/36 \\approx 0.417$',
      check: { value: 15 / 36, compute: () => count(([a, b]) => a + b === 7 || a === 6 || b === 6) / 36 },
      tempting: {
        wrong: 'Tempting: add the two probabilities, $\\tfrac{6}{36} + \\tfrac{11}{36} = \\tfrac{17}{36}$.',
        why: 'The outcomes $(1, 6)$ and $(6, 1)$ sum to 7 *and* contain a six, so adding the two counts includes them twice. The addition rule subtracts the overlap once: $17 - 2 = 15$ outcomes.',
      },
    },
    {
      title: 'The complement',
      problem: 'What is the probability that two dice do not show doubles?',
      steps: [
        'Doubles are $(1, 1)$ to $(6, 6)$: 6 outcomes, so $P(\\text{doubles}) = 6/36 = 1/6$.',
        '$P(\\text{not doubles}) = 1 - 1/6 = 5/6 \\approx 0.833$.',
        'Check by counting: $36 - 6 = 30$ outcomes, and $30/36 = 5/6$.',
      ],
      answer: '$5/6 \\approx 0.833$',
      check: { value: 5 / 6, compute: () => count(([a, b]) => a !== b) / 36 },
    },
    {
      title: 'Independent days and “at least one”',
      problem: 'The weather app gives a 30% chance of rain on each day of the weekend. Treating the two days as independent, what is the chance it rains on at least one day?',
      steps: [
        'No rain on one day: $0.7$. No rain on either day: $0.7 \\times 0.7 = 0.49$, by independence.',
        'At least one rainy day: $1 - 0.49 = 0.51$.',
        'Check with the addition rule: $0.3 + 0.3 - 0.3 \\times 0.3 = 0.51$.',
      ],
      answer: '0.51, not 0.6',
      check: { value: 0.51, compute: () => 1 - 0.7 ** 2, tolerance: 1e-12 },
    },
  ],

  counterexample: {
    title: 'When probabilities do not add',
    body: [
      'Adding works only for events that cannot happen together. Over ten days with a 30% chance of rain on each, adding gives $10 \\times 0.3 = 3$ — a “probability” of 300%, which is impossible. The chance of at least one rainy day is $1 - 0.7^{10} \\approx 0.97$.',
      'Multiplying fails too when events are linked. If rain on Saturday makes rain on Sunday more likely (one weather system), then $P(\\text{both})$ is more than $0.3 \\times 0.3 = 0.09$. Independence is an assumption to check, not a default.',
    ],
  },

  predict: {
    prompt: 'A fair coin lands heads five times in a row. What is the probability that the next flip is heads?',
    choices: ['$\\tfrac12$', 'Less than $\\tfrac12$: tails is due', 'More than $\\tfrac12$: heads is on a streak', '$\\tfrac{1}{64}$'],
    answer: 0,
    reveal: 'A fair coin has no memory: each flip is independent of the ones before, so the next is still $\\tfrac12$. Five heads in a row was unlikely beforehand ($\\tfrac{1}{32}$), but it has already happened and does not change the next flip.',
    misconception: {
      belief: 'After a run of heads, tails is “due” — the gambler’s fallacy.',
      correction: 'Independent events do not balance out in the short run. Long-run frequencies settle near $\\tfrac12$ because later flips swamp an early streak, not because the coin corrects itself.',
    },
  },

  faded: {
    title: 'Two quality checks',
    problem: 'A factory’s parts pass a size check 95% of the time and, independently, a strength check 90% of the time. A part ships only if it passes both. What share ship, what share fail at least one check, and what share fail both?',
    steps: [
      { say: 'Name the events: $S$ = passes the size check, $T$ = passes the strength check, with $P(S) = 0.95$ and $P(T) = 0.90$, independent.' },
      {
        say: 'Shipping needs both, so multiply:',
        item: item({ id: 'ps-pr.f1', competency: 'stats.probability', difficulty: 2, level: 'scaffolded', prompt: 'What is $P(S \\cap T)$?', answer: num(0.855), compute: () => 0.95 * 0.9, hints: ['Independent: $P(S)\\,P(T)$.'], solution: '$0.95 \\times 0.90 = 0.855$: 85.5% of parts ship.' }),
      },
      {
        say: '“Fails at least one check” is the complement of “passes both”.',
        item: item({ id: 'ps-pr.f2', competency: 'stats.probability', difficulty: 2, level: 'scaffolded', prompt: 'What share fail at least one check?', answer: num(0.145), compute: () => 1 - 0.95 * 0.9, hints: ['$1 - P(S \\cap T)$.'], solution: '$1 - 0.855 = 0.145$.' }),
      },
      {
        say: 'Failing both needs a size failure (0.05) and a strength failure (0.10).',
        item: item({ id: 'ps-pr.f3', competency: 'stats.probability', difficulty: 2, level: 'scaffolded', prompt: 'What share fail both checks?', answer: num(0.005), compute: () => 0.05 * 0.1, hints: ['The failures are independent too: multiply.'], solution: '$0.05 \\times 0.10 = 0.005$, half a percent — much rarer than failing at least one.' }),
      },
    ],
    answer: '85.5% ship; 14.5% fail at least one check; only 0.5% fail both.',
  },

  practice: [
    item({ id: 'ps-pr.p1', competency: 'stats.probability', difficulty: 1, level: 'scaffolded', prompt: 'A bag holds 3 red, 5 blue and 2 green marbles. One is drawn at random. What is $P(\\text{blue})$?', answer: num(0.5), compute: () => 5 / 10, hints: ['5 blue out of 10 marbles.'], solution: '$5/10 = 0.5$.' }),
    item({ id: 'ps-pr.p2', competency: 'stats.probability', difficulty: 1, level: 'scaffolded', prompt: 'From the same bag, what is $P(\\text{not green})$?', answer: num(0.8), compute: () => 1 - 2 / 10, hints: ['Complement: $1 - P(\\text{green})$.'], solution: '$1 - 0.2 = 0.8$.' }),
    item({ id: 'ps-pr.p3', competency: 'stats.probability', difficulty: 2, level: 'independent', prompt: 'One card is drawn from a standard 52-card deck. What is the probability that it is a heart or a king? (Three decimal places.)', answer: num(0.308, 0.001), compute: () => (13 + 4 - 1) / 52, hints: ['13 hearts and 4 kings; one card is both.'], solution: '$(13 + 4 - 1)/52 = 16/52 \\approx 0.308$.' }),
    item({ id: 'ps-pr.p4', competency: 'stats.probability', difficulty: 2, level: 'independent', prompt: 'Two fair dice are rolled. What is the probability that both show an even number?', answer: num(0.25), compute: () => count(([a, b]) => a % 2 === 0 && b % 2 === 0) / 36, hints: ['Each die is even with probability $\\tfrac12$, independently.'], solution: '$\\tfrac12 \\times \\tfrac12 = \\tfrac14$; by counting, 9 of the 36 outcomes.' }),
    item({
      id: 'ps-pr.p5', competency: 'stats.probability', difficulty: 2, level: 'independent',
      prompt: 'Which pair of events is mutually exclusive?',
      answer: choice(['Rolling a 2 and rolling a 5 on one throw of a die', 'Rolling a 2 and rolling an even number on one throw', 'Rain today and rain tomorrow', 'Drawing a heart and drawing a king, with one card'], 0),
      hints: ['Mutually exclusive: they can never happen together.'],
      feedback: { 1: 'A 2 is an even number, so both happen whenever a 2 is rolled.', 2: 'It can rain on both days; these events are not even independent.', 3: 'The king of hearts is both.' },
      solution: 'One throw shows one number, so a 2 and a 5 cannot both happen.',
    }),
    item({
      id: 'ps-pr.p6', competency: 'stats.probability', difficulty: 3, level: 'transfer',
      prompt: 'Each guess at a code succeeds with probability 1 in 1000, independently. What is the probability of at least one success in 100 guesses? (Three decimal places.)',
      answer: num(0.095, 0.001), compute: () => 1 - 0.999 ** 100,
      hints: ['“At least one” is the complement of “all 100 fail”.', 'All fail: $0.999^{100}$.'],
      solution: '$1 - 0.999^{100} \\approx 1 - 0.905 = 0.095$, a little under the $100 \\times 0.001 = 0.1$ that adding would suggest.',
    }),
  ],

  apply: {
    scenario: 'An online shop’s warehouse packs the right item 98% of the time, and its courier delivers on time 90% of the time. A customer complains if either goes wrong. Treat the two as independent. The shop sends 2000 orders a month.',
    steps: [
      'Find the chance an order goes perfectly.',
      'Find the chance of at least one problem, and turn it into a count.',
      'Check a manager’s shortcut.',
    ],
    items: [
      item({ id: 'ps-pr.u1', competency: 'stats.probability', difficulty: 1, prompt: 'What is the probability that an order is right and on time?', answer: num(0.882), compute: () => 0.98 * 0.9, hints: ['Independent: multiply.'], solution: '$0.98 \\times 0.90 = 0.882$.' }),
      item({ id: 'ps-pr.u2', competency: 'stats.probability', difficulty: 2, prompt: 'What is the probability that an order has at least one problem?', answer: num(0.118), compute: () => 1 - 0.98 * 0.9, hints: ['Complement of a perfect order.'], solution: '$1 - 0.882 = 0.118$.' }),
      item({ id: 'ps-pr.u3', competency: 'stats.probability', difficulty: 2, prompt: 'About how many of the 2000 monthly orders have at least one problem?', answer: num(236, 0.5), compute: () => 2000 * (1 - 0.98 * 0.9), hints: ['$2000 \\times 0.118$.'], solution: 'About 236 orders a month.' }),
      item({
        id: 'ps-pr.u4', competency: 'stats.probability', difficulty: 3,
        prompt: 'The manager adds the two failure rates: “2% + 10% = 12% of orders have a problem.” Is that right?',
        answer: choice(['Close, but it counts the 0.2% of orders with both problems twice: $0.02 + 0.10 - 0.002 = 0.118$', 'Exactly right: failure rates always add', 'Far too high: the true figure is $0.02 \\times 0.10 = 0.2\\%$', 'Too low: it should be 20%'], 0),
        feedback: { 1: 'Rates add only for problems that cannot happen together; here an order can be both wrong and late.', 2: '0.2% is the share with both problems, not with at least one.', 3: 'Nothing here doubles the 10%.' },
        solution: 'Addition rule: $0.02 + 0.10 - 0.02 \\times 0.10 = 0.118$. The shortcut is off by the overlap, which is small here because both rates are small.',
      }),
    ],
    limits: [
      'Independence is an assumption: a busy holiday week could make packing errors and late couriers more likely together.',
      'The rates come from past orders and can drift.',
      'A complaint rate is not a cost: a wrong item may cost far more than a late one.',
    ],
  },

  checkpoint: [
    item({ id: 'ps-pr.c1', competency: 'stats.probability', difficulty: 1, prompt: 'One fair die is rolled. What is the probability of a number greater than 4? (Three decimal places.)', answer: num(1 / 3, 0.001), compute: () => 2 / 6, solution: 'Two outcomes, 5 and 6, out of 6: $2/6 \\approx 0.333$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Count the outcomes greater than 4 and divide by 6.' }),
    item({ id: 'ps-pr.c2', competency: 'stats.probability', difficulty: 2, prompt: '60% of students use the library, 45% use the gym and 25% use both. What share use the library or the gym?', answer: num(0.8), compute: () => 0.6 + 0.45 - 0.25, solution: '$0.60 + 0.45 - 0.25 = 0.80$.', feedbackCorrect: 'Right — the overlap came off once.', feedbackIncorrect: 'Adding 60% and 45% counts the students who use both twice; subtract them once.' }),
    item({
      id: 'ps-pr.c3', competency: 'stats.probability', difficulty: 2,
      prompt: '$P(A) = 0.5$ and $P(B) = 0.4$. If $A$ and $B$ are independent, which must be true?',
      answer: choice(['$P(A \\cap B) = 0.2$', '$P(A \\cup B) = 0.9$', '$P(A \\cap B) = 0$', '$P(A \\cup B) = 0.2$'], 0),
      feedback: { 1: '$0.9$ would need the events to be mutually exclusive. With independence, $P(A \\cup B) = 0.5 + 0.4 - 0.2 = 0.7$.', 2: 'That describes mutually exclusive events, which are not independent.', 3: '0.2 is the chance of both, not of either.' },
      solution: 'Independence means $P(A \\cap B) = P(A)\\,P(B) = 0.5 \\times 0.4 = 0.2$.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Independence is a statement about “and”: multiply.',
    }),
    item({
      id: 'ps-pr.c4', competency: 'stats.probability', difficulty: 3,
      prompt: 'A smoke alarm works 95% of the time. A house has two alarms that fail independently. What is the probability that at least one works in a fire?',
      answer: num(0.9975, 0.0001), compute: () => 1 - 0.05 ** 2,
      solution: 'Both fail with probability $0.05 \\times 0.05 = 0.0025$, so at least one works with probability $0.9975$.',
      feedbackCorrect: 'Right — a second independent alarm cuts the failure chance twentyfold.', feedbackIncorrect: 'Work out the chance that both fail, then take the complement.',
    }),
  ],

  python: {
    intro: 'Python can list all 36 outcomes, so every rule can be checked by counting. `Fraction` keeps the answers exact.',
    code: `from fractions import Fraction
from itertools import product

outcomes = list(product(range(1, 7), repeat=2))  # all 36 (first, second) pairs
sum7 = {o for o in outcomes if sum(o) == 7}
six = {o for o in outcomes if 6 in o}

def p(event):
    return Fraction(len(event), len(outcomes))

print("P(sum 7) =", p(sum7), "  P(a six) =", p(six))
print("P(sum 7 or a six) =", p(sum7 | six))
print("P(sum 7) + P(a six) - P(both) =", p(sum7) + p(six) - p(sum7 & six))
print("rain on at least one of two days:", round(1 - 0.7 ** 2, 2))`,
    output: 'P(sum 7) = 1/6   P(a six) = 11/36\nP(sum 7 or a six) = 5/12\nP(sum 7) + P(a six) - P(both) = 5/12\nrain on at least one of two days: 0.51',
    explain: 'Python’s set operators match the notation: `|` is “or” (union) and `&` is “and” (intersection). Counting the union directly and using the addition rule give the same $5/12$, which is $15/36$.',
  },

  reading: [
    { title: '3.1 Terminology', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology', note: 'Sample spaces, events, “and”, “or” and complements.' },
    { title: '3.2 Independent and Mutually Exclusive Events', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events', note: 'The two ideas most often confused, side by side.' },
    { title: '3.3 Two Basic Rules of Probability', source: 'OpenStax, Introductory Statistics 2e', url: 'https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability', note: 'The multiplication and addition rules, with worked examples.' },
  ],
};
