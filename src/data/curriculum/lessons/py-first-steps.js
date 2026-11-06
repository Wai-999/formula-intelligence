import { item, num, choice } from '../lessonKit.js';

// V5 Phase 5: the first lesson of Python for Data Science. Supports Ohlone
// CS-142 (Python) and the programming-with-data side of CS-108, whose
// catalog entry names no language. The Python is checked by
// scripts/verify-python.mjs; the commute and fitness numbers are invented.

const rides = [42, 35, 51, null, 38, 44, 40, 36, null, 47];
const recorded = rides.filter((r) => r !== null);
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export default {
  intuition: {
    question: 'Your commute took 42, 35 and 51 minutes this week, and a three-line Python program prints the average. Before you run it: what will it print? And what happens on a week when one day was not recorded?',
    body: [
      'Python keeps the week in a **list**, `times = [42, 35, 51]`, and a **for loop** visits each value in turn. Tracing it is the same skill as in any language: the total goes 0 → 42 → 77 → 128, and the average is $128 / 3$.',
      'Python 3’s `/` always divides exactly, so the average is 42.666…, printed as 42.7 after rounding. (In C++, `128 / 3` between two `int`s is 42.) Getting a language’s small rules right is half of programming.',
      'Real logs have gaps. A missing day stored as `None` makes `total += t` stop with a **TypeError** — and the error message names the line. Filter the gaps out deliberately, and say how many you removed.',
    ],
  },

  glossary: [
    { term: '`times = [42, 35, 51]`', say: 'times is set to the list 42, 35, 51', meaning: 'A **list**: values in order. `len(times)` is 3; `times[0]` is 42.' },
    { term: '`for t in times:`', say: 'for t in times', meaning: 'Run the indented block once for each value, calling the current one `t`.' },
    { term: '`/` and `//`', say: 'slash, and double slash', meaning: '`/` divides exactly (`7 / 2` is 3.5); `//` is floor division (`7 // 2` is 3).' },
    { term: '`None`', say: 'None', meaning: 'Python’s value for “nothing here” — often a missing measurement. It is not 0, and arithmetic with it fails.' },
  ],

  priorCheck: [
    item({
      id: 'py-first.pre1', competency: 'arith.fractions', difficulty: 1,
      prompt: 'What is the mean of 4, 8 and 9?',
      answer: num(7), compute: () => (4 + 8 + 9) / 3, solution: '$(4 + 8 + 9) / 3 = 21 / 3 = 7$.',
    }),
    item({
      id: 'py-first.pre2', competency: 'arith.order-ops', difficulty: 1,
      prompt: 'What is $3 + 4 \\times 2$?',
      answer: num(11), compute: () => 3 + 4 * 2, solution: 'Multiply first: $3 + 8 = 11$. Python follows the same order.',
    }),
  ],

  visualization: {
    lab: 'code-trace',
    config: { program: 'commute-average' },
    intro: 'Step through the commute program. Before each step, say which variable changes and to what.',
    textAlternative: 'Ten steps. The list holds 42, 35 and 51; total starts at 0 and becomes 42, 77 and 128 as t takes each value; average becomes 42.666666666666664; the program prints 42.7. The table lists every variable after every step.',
  },

  derivation: {
    intro: 'Why the loop computes the mean — and the two Python details that decide what it prints.',
    steps: [
      { say: 'A list keeps its values in order, and `len(times)` counts them: here $n = 3$.' },
      { say: 'After the loop has visited the first $k$ values, `total` holds their sum (the same invariant as in the C++ loops lesson):', math: '\\text{total} = \\sum_{i=1}^{k} t_i' },
      { say: 'After the last value, `total` is the sum of all $n$ values, so dividing by $n$ gives the mean:', math: '\\bar t = \\frac{1}{n} \\sum_{i=1}^{n} t_i = \\frac{128}{3} \\approx 42.67' },
      { say: 'Python 3’s `/` returns an exact decimal (a float), so the mean keeps its fraction; `round(average, 1)` changes only the printed text. With `//` the result would be 42 — floor division, like C++ integer division.' },
    ],
    assumptions: [
      'Every value in the list is a number.',
    ],
    domain: [
      'An empty list makes `len(times)` zero, and dividing by it raises `ZeroDivisionError`: check before dividing.',
      'A `None` in the list makes `total += t` raise `TypeError`: remove (and count) gaps first.',
    ],
  },

  examples: [
    {
      title: 'Predicting a loop',
      problem: 'What does `s = 0`, then `for x in [2, 5, 9]: s += x * x`, then `print(s)` print?',
      steps: ['The loop squares each value: 4, 25, 81.', 'It adds them: $4 + 25 + 81$.', 'It prints 110.'],
      answer: '110',
      check: { value: 110, compute: () => [2, 5, 9].reduce((s, x) => s + x * x, 0) },
    },
    {
      title: 'Averaging around a gap',
      problem: 'For `times = [42, None, 51]`, keep the recorded values with `valid = [t for t in times if t is not None]` and average them.',
      steps: ['`valid` is `[42, 51]`.', '$(42 + 51) / 2 = 46.5$.', 'Report it as “46.5 minutes over 2 recorded days (1 missing)”.'],
      answer: '46.5',
      check: { value: 46.5, compute: () => mean([42, 51]) },
    },
  ],

  counterexample: {
    title: 'An average that hides a gap',
    body: [
      'Replacing the missing day with 0 makes the code run: $(42 + 0 + 51) / 3 = 31$ minutes. It looks like a fast week, and it is wrong — no commute took 0 minutes.',
      'Code that runs is not code that is right. A missing value is information; handle it on purpose and report it.',
    ],
  },

  predict: {
    prompt: 'What does `print(7 / 2, 7 // 2)` print in Python 3?',
    choices: ['3.5 3', '3 3', '3.5 3.5', '3 3.5'],
    answer: 0,
    reveal: '`/` is exact division (3.5); `//` is floor division (3). Python prints both, separated by a space.',
    misconception: {
      belief: 'Python divides two whole numbers the way C++ divides two `int`s, dropping the fraction.',
      correction: 'In Python 3, `/` always keeps the fraction. Use `//` when you want whole-number division.',
    },
  },

  practice: [
    item({ id: 'py-first.p1', competency: 'py.collections', difficulty: 1, level: 'scaffolded', prompt: 'After `xs = [4, 1, 3]` and `xs.append(2)`, what is `len(xs)`?', answer: num(4), compute: () => [4, 1, 3, 2].length, hints: ['`append` adds one value at the end.'], solution: '`xs` is `[4, 1, 3, 2]`: four values.' }),
    item({ id: 'py-first.p2', competency: 'py.basics', difficulty: 1, level: 'scaffolded', prompt: 'What does `total = 0`, then `for v in [3, 4, 5]: total += v`, then `print(total)` print?', answer: num(12), compute: () => 3 + 4 + 5, hints: ['Add the values one at a time.'], solution: '$0 + 3 + 4 + 5 = 12$.' }),
    item({ id: 'py-first.p3', competency: 'py.basics', difficulty: 2, level: 'independent', prompt: 'What does `print(sum([2, 4, 9]) / 3)` print? (Enter the number.)', answer: num(5), compute: () => (2 + 4 + 9) / 3, hints: ['`sum` adds the list; `/` divides exactly.'], solution: '$15 / 3$ prints `5.0` — a float, because `/` always returns one.' }),
    item({ id: 'py-first.p4', competency: 'py.collections', difficulty: 2, level: 'independent', prompt: 'What does `print(max([42, 35, 51]) - min([42, 35, 51]))` print?', answer: num(16), compute: () => 51 - 35, hints: ['`max` is 51 and `min` is 35.'], solution: '$51 - 35 = 16$: the range of the week.' }),
    item({
      id: 'py-first.p5', competency: 'py.debugging', difficulty: 2, level: 'independent',
      prompt: 'With `times = [42, None, 51]`, which line raises `TypeError`?',
      answer: choice(['`total += t`', '`times = [42, None, 51]`', '`for t in times:`', '`print(total)`'], 0),
      feedback: { 1: 'A list may hold `None`; storing it is fine.', 2: 'The loop happily hands `None` to the body.', 3: 'The program never gets that far.' },
      hints: ['Which line does arithmetic with `t`?'],
      solution: 'On the second pass `t` is `None`, and `int + None` is not defined: `total += t` raises the error.',
    }),
    item({
      id: 'py-first.p6', competency: 'py.collections', difficulty: 3, level: 'transfer',
      prompt: 'A fitness app stores daily steps as `[8200, 9100, None, 12000]` (one day did not sync). What is the average of the synced days, to two decimals?',
      answer: num(9766.67, 0.005), compute: () => mean([8200, 9100, 12000]), hints: ['Leave out the `None` — do not count it as 0.'], solution: '$(8200 + 9100 + 12000) / 3 \\approx 9766.67$ steps, over 3 synced days.',
    }),
  ],

  apply: {
    scenario: 'A cyclist logs commute minutes for two weeks: `[42, 35, 51, None, 38, 44, 40, 36, None, 47]` — two rides were not recorded because the app crashed. They want the average and an honest note about the gaps.',
    steps: [
      'Count the recorded rides.',
      'Average them.',
      'Decide what the report must say about the gaps.',
    ],
    items: [
      item({ id: 'py-first.u1', competency: 'py.collections', difficulty: 2, prompt: 'How many rides have a recorded time?', answer: num(8), compute: () => recorded.length, hints: ['Two entries are `None`.'], solution: 'Ten entries, two missing: 8 recorded rides.' }),
      item({ id: 'py-first.u2', competency: 'py.collections', difficulty: 2, prompt: 'What is the average of the recorded rides, to three decimals?', answer: num(41.625, 0.0005), compute: () => mean(recorded), hints: ['Their sum is 333.'], solution: '$333 / 8 = 41.625$ minutes.' }),
      item({ id: 'py-first.u3', competency: 'py.collections', difficulty: 3, prompt: 'Suppose both missing rides took 60 minutes (the crash happened on bad days). What would the 10-ride average be?', answer: num(45.3, 1e-9), compute: () => (333 + 120) / 10, hints: ['Add 120 minutes and divide by 10.'], solution: '$(333 + 120) / 10 = 45.3$ minutes — almost 4 minutes more.' }),
      item({
        id: 'py-first.u4', competency: 'py.collections', difficulty: 3,
        prompt: 'What should the cyclist’s summary say?',
        answer: choice(['The average of the 8 recorded rides, plus that 2 are missing and could raise it', 'The 10-ride average with the missing rides counted as 0', 'Nothing until every ride is recorded', 'Only the slowest ride'], 0),
        feedback: { 1: 'Zero-minute rides never happened; that average is too low.', 2: 'An honest partial answer is more useful than none.', 3: 'One ride does not describe two weeks.' },
        solution: 'Report what the data support (41.6 minutes over 8 rides) and the uncertainty the gaps add (up to 45.3 if the missing rides were slow).',
      }),
    ],
    limits: [
      'Ten rides is a small sample: weather and traffic vary from week to week.',
      'Gaps may not be random — if the app crashes on long rides, the recorded average is biased low.',
      'The numbers are invented.',
    ],
  },

  checkpoint: [
    item({ id: 'py-first.c1', competency: 'py.collections', difficulty: 1, prompt: 'What does `print(len([5, 6, 7, 8]))` print?', answer: num(4), compute: () => [5, 6, 7, 8].length, solution: 'Four values: 4.', feedbackCorrect: 'Right.', feedbackIncorrect: '`len` counts the values in the list.' }),
    item({ id: 'py-first.c2', competency: 'py.collections', difficulty: 2, prompt: 'What does `vals = [3, 8, 1]`, then `vals.sort()`, then `print(vals[0] + vals[-1])` print?', answer: num(9), compute: () => { const v = [3, 8, 1].sort((a, b) => a - b); return v[0] + v[v.length - 1]; }, solution: 'Sorted: `[1, 3, 8]`; first plus last is $1 + 8 = 9$.', feedbackCorrect: 'Right — `[-1]` is the last item.', feedbackIncorrect: 'Sort first, then take index 0 (the smallest) and index −1 (the largest).' }),
    item({
      id: 'py-first.c3', competency: 'py.collections', difficulty: 3,
      prompt: 'A greenhouse sensor logged `temps = [18.5, None, 21.0, 19.5]`. What is the average of the recorded temperatures, to two decimals?',
      answer: num(19.67, 0.005), compute: () => mean([18.5, 21.0, 19.5]),
      solution: '$(18.5 + 21.0 + 19.5) / 3 \\approx 19.67$, over 3 readings — report the missing one too.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Leave out the `None`, then divide by the number of real readings.',
    }),
  ],

  python: {
    intro: 'Counting, filtering and averaging around a gap, the two kinds of division, and the error a gap causes.',
    code: `times = [42, 35, None, 51]
valid = [t for t in times if t is not None]
print(len(times), len(valid))
print(round(sum(valid) / len(valid), 2))
print(7 / 2, 7 // 2)
try:
    total = 0
    for t in times:
        total += t
except TypeError as err:
    print("TypeError:", err)`,
    output: "4 3\n42.67\n3.5 3\nTypeError: unsupported operand type(s) for +=: 'int' and 'NoneType'",
    explain: 'The list comprehension keeps the recorded values. The last block shows the error a gap causes when nobody handles it — the message names the operation and the two types involved.',
  },

  reading: [
    { title: 'An Informal Introduction to Python', source: 'The Python Tutorial (docs.python.org)', url: 'https://docs.python.org/3/tutorial/introduction.html', note: 'Numbers, division and lists.' },
    { title: 'More Control Flow Tools', source: 'The Python Tutorial (docs.python.org)', url: 'https://docs.python.org/3/tutorial/controlflow.html', note: 'for loops and functions.' },
  ],
};
