import { item, num, choice } from '../lessonKit.js';

// Phase 6 of the 80/20 upgrade (docs/learning-8020/PHASE6_LESSONS.md):
// Python functions — the next lesson of the thinnest course on the route
// (1 of 15 written), and the gap the site named to a learner who had
// finished the first three courses. Written to the professor contract from
// the start. The Python is checked by scripts/verify-python.mjs; the
// numbers are invented.

const square = (n) => n * n;
const f = (a, b) => a - 2 * b;
const fee = (km) => 2.5 + 1.2 * km;
const late = (times, limit) => times.filter((t) => t > limit).length;
const log = [19.6, null, 20.1, null, 19.7];
const valid = log.filter((r) => r !== null);

export default {
  intuition: {
    question: 'A café’s till works out “bill plus tip” in three places: the receipt, the daily report and the staff app. The owner changes the tip from 15% to 18% — and forgets one of the three. How would a function have prevented the wrong receipts, and how would you check that the function does what you think?',
    body: [
      'A **function** gives a name to a step. `def with_tip(bill, rate):` starts one, the indented lines are its **body**, and `return` hands back the result. Calling `with_tip(40, 0.15)` runs the body with `bill = 40` and `rate = 0.15` and gives back `46.0`. Write the step once, call it everywhere, and a change to the rule is made in one place.',
      'The names in the brackets are **parameters**; the values in a call are **arguments**. Variables made inside a function, like `tip`, are **local**: they exist only while that call runs, so two calls never interfere. This is the $f(x)$ of algebra — one output for each input — written in Python.',
      '`return` and `print` are different. `print` shows a value on the screen; `return` gives it back to the code that called the function. A function with no `return` gives back `None`, which is the commonest bug in a first function. One-line tests with `assert` catch it straight away.',
    ],
    simpler: [
      'A function is a recipe card. The card says what to do with whatever ingredients you bring (the parameters). Each time you cook from it, you bring real ingredients (the arguments) and get a dish back (the return value). Change the card once, and every cook who uses it changes too.',
    ],
  },

  outcomes: [
    'Define and call a function with parameters, and say what a call returns.',
    'Tell `return` from `print`, and explain why a function without `return` gives `None`.',
    'Test a function on ordinary and edge-case inputs with `assert`, and trace a call step by step.',
  ],

  glossary: [
    { term: '`def name(x):`', say: 'def name of x', meaning: 'Defines a function called `name` with one parameter, `x`. The indented lines below it are its body; they run only when the function is called.' },
    { term: '`return value`', say: 'return value', meaning: 'Ends the call and hands `value` back to the code that called it. A function that reaches its end without `return` gives back `None`.' },
    { term: 'parameter, argument', meaning: 'A **parameter** is a name in the definition (`bill`); an **argument** is the value given in a call (`40`). Arguments are matched to parameters in order.' },
    { term: '`assert condition`', say: 'assert condition', meaning: 'Does nothing if the condition is true, and stops with an `AssertionError` if it is false: a one-line test.' },
  ],

  priorCheck: [
    item({
      id: 'py-fn.pre1', competency: 'py.basics', difficulty: 1,
      prompt: 'What does this print? `x = 4`, then `x = x * 3`, then `print(x + 1)`.',
      answer: num(13), compute: () => 4 * 3 + 1, solution: '`x` becomes 12, and `x + 1` is 13.', remedy: 'py-first-steps',
    }),
    item({
      id: 'py-fn.pre2', competency: 'func.notation', difficulty: 1,
      prompt: 'If $f(x) = 2x + 1$, what is $f(5)$?',
      answer: num(11), compute: () => 2 * 5 + 1, solution: '$2 \\cdot 5 + 1 = 11$.', remedy: 'a1-functions',
    }),
  ],

  visualization: {
    lab: 'code-trace',
    config: { program: 'tip-function' },
    intro: 'Step through one function called twice. Before each step, say which variables exist right now. Watch `bill`, `rate` and `tip` appear when a call starts and vanish when it returns.',
    textAlternative: 'Eight steps of a seven-line program. Defining with_tip creates the function without running it. The first call sets bill to 40 and rate to 0.15, makes tip 6.0 and returns 46.0, which is stored in lunch. The second call starts with fresh variables, bill 80 and rate 0.1, makes tip 8.0 and returns 88.0, stored in dinner. The program prints 46.0 88.0. The table lists every variable after every step.',
  },

  derivation: {
    intro: 'What Python does, step by step, when it meets a definition and then a call.',
    steps: [
      { say: '`def` does not run the body. It creates the function and gives it a name — like writing a recipe card without cooking anything.' },
      { say: 'A call such as `with_tip(40, 0.15)` first works out its arguments, then binds each parameter to its argument, in order: `bill = 40`, `rate = 0.15`.' },
      { say: 'The body then runs line by line with those local names. `tip = bill * rate` makes a new local variable, `tip = 6.0`.' },
      { say: '`return bill + tip` works out 46.0, ends the call and hands the value back. The call is replaced by that value, so `lunch = 46.0`, and the locals `bill`, `rate` and `tip` are gone.' },
      { say: 'When the result depends only on the arguments, the Python function is a mathematical function: the same call always gives the same answer, which is exactly what makes it testable.', math: '\\texttt{with\\_tip}(b, r) = b + b\\,r = b\\,(1 + r)' },
    ],
    assumptions: [
      'The function reads only its parameters, not variables outside it, so its result depends only on its arguments.',
      'Money is a floating-point number here; a real till rounds to cents, or counts whole cents, to avoid floating-point surprises.',
    ],
    domain: [
      'A function that reads the clock, a file or a random number can return different results for the same arguments, and needs more careful tests.',
      'Arguments in the wrong order are not an error to Python: `with_tip(0.15, 40)` runs and returns 6.15.',
      'A parameter can have a default, `def price(qty, unit=2.5):`, used when the call leaves that argument out.',
    ],
  },

  examples: [
    {
      title: 'What does the call return?',
      problem: 'With `def area(w, h): return w * h`, what is `area(3, 4) + area(2, 5)`?',
      steps: [
        '`area(3, 4)` binds `w = 3` and `h = 4`, and returns 12.',
        '`area(2, 5)` is a separate call with its own `w` and `h`; it returns 10.',
        '$12 + 10 = 22$.',
      ],
      answer: '22',
      check: { value: 22, compute: () => 3 * 4 + 2 * 5 },
      tempting: {
        wrong: 'Tempting: think the second call still has `w = 3` from the first, and get $12 + 3 \\times 5 = 27$.',
        why: 'Every call gets fresh local variables, bound from its own arguments. Nothing from the first call survives into the second — which is exactly what lets a function be reused safely.',
      },
    },
    {
      title: '`print` is not `return`',
      problem: 'With `def double(x): print(x * 2)`, what does `y = double(5)` set `y` to?',
      steps: [
        'The call prints 10 on the screen.',
        'The body has no `return`, so the call gives back `None`.',
        'So `y` is `None`, and `y + 1` would stop with a `TypeError`.',
      ],
      answer: '`y` is `None` (after 10 is printed)',
      check: { value: 10, compute: () => 5 * 2 },
    },
    {
      title: 'Testing with `assert`',
      problem: 'A function should average a list: `def mean(xs): return sum(xs) / len(xs)`. Which tests would you write?',
      steps: [
        'An ordinary case with an answer you know: `assert mean([2, 4, 9]) == 5`.',
        'A single value: `assert mean([7]) == 7`.',
        'An edge case: `mean([])` divides by zero and stops with `ZeroDivisionError`. Decide what should happen for an empty list, then test that too.',
      ],
      answer: '`mean([2, 4, 9])` should be 5; the empty list needs a decision',
      check: { value: 5, compute: () => (2 + 4 + 9) / 3 },
    },
  ],

  counterexample: {
    title: 'A function whose answer drifts',
    body: [
      'This counter returns 1, then 2, then 3 for exactly the same call: `def next_ticket():` with `global count`, `count += 1` and `return count`. Its result depends on a variable outside itself, so the same call gives different answers, and a test that passes once can fail the next time.',
      'Sometimes that is what you want — a ticket counter must change — but such functions are harder to test and to reason about. Prefer functions whose result depends only on their arguments.',
    ],
  },

  predict: {
    prompt: 'With `def add_one(n): n = n + 1` defined, what does `x = 5; add_one(x); print(x)` print?',
    choices: ['5', '6', 'None', 'An error'],
    answer: 0,
    reveal: 'It prints 5. The call binds a new local `n` to 5 and changes that `n` to 6, but `x` outside is untouched, and nothing is returned. To change `x`, return the result and assign it: `return n + 1`, then `x = add_one(x)`.',
    misconception: {
      belief: 'Changing a parameter inside a function changes the caller’s variable.',
      correction: 'Assigning to a parameter only rebinds the local name. (A list passed in can be changed in place, with `append` for example — the copy-or-original question of the C++ functions lesson, in Python form.)',
    },
  },

  faded: {
    title: 'A function for the commute log',
    problem: 'Write `minutes_late(times, limit)`, which counts how many commutes in a list took longer than `limit` minutes, and use it on `[42, 35, 51, 38, 47]`.',
    steps: [
      { say: 'Name the step and its inputs, and start a count: `def minutes_late(times, limit):` then `count = 0`.' },
      {
        say: 'Loop and count: `for t in times:` and, inside it, `if t > limit: count += 1`.',
        item: item({ id: 'py-fn.f1', competency: 'py.basics', difficulty: 1, level: 'scaffolded', prompt: 'With a limit of 45, how many of 42, 35, 51, 38 and 47 are counted?', answer: num(2), compute: () => late([42, 35, 51, 38, 47], 45), hints: ['Which values are greater than 45?'], solution: '2: the 51 and the 47.' }),
      },
      {
        say: 'Return the count rather than printing it, so other code can use it: `return count`.',
        item: item({ id: 'py-fn.f2', competency: 'py.basics', difficulty: 2, level: 'scaffolded', prompt: 'What does `minutes_late([42, 35, 51, 38, 47], 50)` return?', answer: num(1), compute: () => late([42, 35, 51, 38, 47], 50), hints: ['Only values greater than 50 count now.'], solution: '1: only the 51. The same function answers a new question with a new argument.' }),
      },
      {
        say: 'Test an edge case: a week with no recorded commutes.',
        item: item({ id: 'py-fn.f3', competency: 'py.debugging', difficulty: 2, level: 'scaffolded', prompt: 'What should `minutes_late([], 45)` return?', answer: num(0), compute: () => late([], 45), hints: ['How many times does the loop run on an empty list?'], solution: '0: the loop runs no times, so the count stays 0. Write it as a test: `assert minutes_late([], 45) == 0`.' }),
      },
    ],
    answer: '`minutes_late([42, 35, 51, 38, 47], 45)` returns 2; with a limit of 50 it returns 1; for an empty list it returns 0.',
  },

  practice: [
    item({ id: 'py-fn.p1', competency: 'py.basics', difficulty: 1, level: 'scaffolded', prompt: 'With `def square(n): return n * n`, what is `square(7)`?', answer: num(49), compute: () => square(7), hints: ['`n` is 7 inside the call.'], solution: '$7 \\times 7 = 49$.' }),
    item({ id: 'py-fn.p2', competency: 'py.basics', difficulty: 1, level: 'scaffolded', prompt: 'With the same function, what is `square(3) + square(4)`?', answer: num(25), compute: () => square(3) + square(4), hints: ['Two separate calls: 9 and 16.'], solution: '$9 + 16 = 25$.' }),
    item({ id: 'py-fn.p3', competency: 'py.basics', difficulty: 2, level: 'independent', prompt: 'With `def f(a, b): return a - 2 * b`, what is `f(10, 3)`?', answer: num(4), compute: () => f(10, 3), hints: ['`a = 10`, `b = 3`.'], solution: '$10 - 6 = 4$.' }),
    item({ id: 'py-fn.p4', competency: 'py.basics', difficulty: 2, level: 'independent', prompt: 'With the same `f`, what is `f(3, 10)`?', answer: num(-17), compute: () => f(3, 10), hints: ['Arguments match parameters in order: now `a = 3` and `b = 10`.'], solution: '$3 - 20 = -17$. Swapping the arguments changed the answer, and Python gave no warning.' }),
    item({
      id: 'py-fn.p5', competency: 'py.debugging', difficulty: 2, level: 'independent',
      prompt: 'A function `total(prices)` sets `s = 0` and adds each price to `s` in a loop — and that is all. `total([2, 3])` gives `None`. Why?',
      answer: choice(['The function never returns `s`', 'The loop never runs', '`s` should start at 1', 'A list cannot be passed to a function'], 0),
      hints: ['What does a function give back when it reaches its end?'],
      feedback: { 1: 'The loop runs twice and `s` becomes 5 — inside the call.', 2: 'Starting at 1 would make the total wrong, not `None`.', 3: 'Lists are passed to functions all the time.' },
      solution: 'Without `return s`, the call gives back `None`. Add `return s` after the loop.',
    }),
    item({
      id: 'py-fn.p6', competency: 'py.basics', difficulty: 3, level: 'transfer',
      prompt: 'A delivery app charges `def fee(km): return 2.5 + 1.2 * km` dollars. How much more do two 5 km trips cost, `fee(5) + fee(5)`, than one 10 km trip, `fee(10)`?',
      answer: num(2.5), compute: () => fee(5) + fee(5) - fee(10),
      hints: ['`fee(5)` is 8.5 and `fee(10)` is 14.5.'],
      solution: '$17 - 14.5 = 2.5$ dollars: the fixed 2.5 is charged on every trip. In algebra terms, $f(5) + f(5) \\ne f(10)$, because the rule has a constant.',
    }),
  ],

  apply: {
    scenario: 'The greenhouse project’s sensor log records °C, with `None` where a reading is missing. You are writing small functions for the morning pipeline, and testing them before they run unattended.',
    steps: [
      'Use a conversion function.',
      'Count and average with missing values handled on purpose.',
      'Pick the test that catches a colleague’s bug.',
    ],
    items: [
      item({ id: 'py-fn.u1', competency: 'py.basics', difficulty: 1, prompt: 'With `def to_f(c): return 1.8 * c + 32`, what does `to_f(25)` return?', answer: num(77), compute: () => 1.8 * 25 + 32, hints: ['$1.8 \\times 25 + 32$.'], solution: '$45 + 32 = 77$ °F.' }),
      item({ id: 'py-fn.u2', competency: 'py.basics', difficulty: 2, prompt: '`count_missing(readings)` should return how many readings are `None`. What should it return for `[19.6, None, 20.1, None, 19.7]`?', answer: num(2), compute: () => log.filter((r) => r === null).length, hints: ['Count the `None` values.'], solution: '2.' }),
      item({ id: 'py-fn.u3', competency: 'py.basics', difficulty: 2, prompt: '`morning_mean(readings)` averages the readings that are not `None`. What should it return for the same list? (Two decimal places.)', answer: num(19.8, 0.005), compute: () => valid.reduce((a, b) => a + b, 0) / valid.length, hints: ['Three real readings: 19.6, 20.1 and 19.7.'], solution: '$59.4 / 3 = 19.8$ °C.' }),
      item({
        id: 'py-fn.u4', competency: 'py.debugging', difficulty: 3,
        prompt: 'A colleague’s `morning_mean` adds the real readings but divides by `len(readings)`, the length of the whole list. Which test catches the bug?',
        answer: choice(['`assert morning_mean([20, None]) == 20` — the buggy version returns 10', '`assert morning_mean([20, 20]) == 20`', '`assert morning_mean([19.6, 20.1, 19.7]) > 0`', '`assert type(morning_mean([20])) == float`'], 0),
        feedback: { 1: 'With no `None` in the list, both versions divide by 2 and agree: this test passes either way.', 2: 'The buggy version also returns a positive number, so this test cannot tell them apart.', 3: 'Both versions return a float.' },
        solution: 'A good test is one the bug fails: with one missing value, dividing by the list length halves the average.',
      }),
    ],
    limits: [
      'Tests check only the cases you thought of: a fault code such as −999 would pass straight through these functions.',
      'Floating-point results can differ in the last digit, so tests of inexact arithmetic compare with a tolerance, `abs(a - b) < 1e-9`, rather than `==`.',
      'A function that quietly skips `None` should also report how many it skipped, or the average hides missing data.',
    ],
  },

  checkpoint: [
    item({ id: 'py-fn.c1', competency: 'py.basics', difficulty: 1, prompt: 'With `def half(x): return x / 2`, what is `half(9)`?', answer: num(4.5), compute: () => 9 / 2, solution: '`9 / 2` is 4.5 in Python 3.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Put 9 in for `x`; in Python 3, `/` gives the exact decimal.' }),
    item({ id: 'py-fn.c2', competency: 'py.basics', difficulty: 2, prompt: 'With `def g(n): return n * 3 - 1`, what is `g(g(2))`?', answer: num(14), compute: () => ((2 * 3 - 1) * 3 - 1), solution: 'The inner call first: `g(2)` is 5. Then `g(5)` is 14.', feedbackCorrect: 'Right — a composite, as in algebra.', feedbackIncorrect: 'Work from the inside out: find `g(2)`, then use it as the argument of the outer call.' }),
    item({
      id: 'py-fn.c3', competency: 'py.debugging', difficulty: 2,
      prompt: 'A function prints the right answer, but `result = f(4)` leaves `result` equal to `None`. What is the fix?',
      answer: choice(['Replace `print(...)` with `return ...` inside the function', 'Call it as `print(f(4))`', 'Write `result = None` before the call', 'Rename the function'], 0),
      feedback: { 1: 'That prints the `None` the call returns.', 2: '`result` would still be `None` after the call.', 3: 'The name is not the problem; the missing `return` is.' },
      solution: 'The function must `return` its answer for the caller to receive it.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'What does a call give back when the function only prints?',
    }),
    item({
      id: 'py-fn.c4', competency: 'py.basics', difficulty: 3,
      prompt: 'With `def price(qty, unit=2.5): return qty * unit`, the unit price is 2.5 unless a call gives another. What is `price(4) + price(4, 3)`?',
      answer: num(22), compute: () => 4 * 2.5 + 4 * 3,
      solution: '`price(4)` uses the default unit price: 10.0. `price(4, 3)` uses 3: 12. Together, 22.',
      feedbackCorrect: 'Right — a default is used only when the argument is left out.', feedbackIncorrect: 'In the first call the unit price is left out, so the default 2.5 applies; in the second it is 3.',
    }),
  ],

  python: {
    intro: 'Two functions, three tests and the `print`-instead-of-`return` bug, run for real.',
    code: `def with_tip(bill, rate):
    tip = bill * rate
    return bill + tip

def minutes_late(times, limit):
    count = 0
    for t in times:
        if t > limit:
            count += 1
    return count

print(with_tip(40, 0.15))
print(minutes_late([42, 35, 51, 38, 47], 45))

assert minutes_late([], 45) == 0
assert minutes_late([50, 50], 45) == 2

def double(x):
    print(x * 2)  # shows a value, but returns nothing

y = double(5)
print("y is", y)
print("all tests passed")`,
    output: '46.0\n2\n10\ny is None\nall tests passed',
    explain: 'The asserts print nothing when they pass; a failing one would stop the program with an `AssertionError`. `double(5)` prints 10, but the value it returns is `None`.',
  },

  reading: [
    { title: 'Defining Functions', source: 'The Python Tutorial (Python 3 documentation)', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', note: 'def, return and local variables, from the people who write Python.' },
    { title: 'More on Defining Functions', source: 'The Python Tutorial (Python 3 documentation)', url: 'https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions', note: 'Default arguments and keyword arguments.' },
  ],
};
