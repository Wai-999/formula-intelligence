import { item, num, choice, multi } from '../lessonKit.js';

// V5 Computer Science track: Ohlone CS-102 preparation. Read → predict →
// trace → debug → write. Every C++ program here is compiled and run by
// scripts/verify-cpp.mjs; the bakery numbers are illustrative.

const loaves = [12, 30, 41, 28, 15, 9, 4];

export default {
  intuition: {
    question: 'A bakery logs the loaves it sells each hour, and a short C++ program adds them up. The total it prints is too low by exactly one hour’s sales. Before touching the keyboard, can you predict what a loop will print — and see where it went wrong?',
    body: [
      'A loop repeats its body while a condition holds. To know what it prints, **trace** it: write down every variable after every step, exactly as the computer would.',
      'In `for (int h = 0; h < n; ++h)`, `h` starts at 0, the body runs, `h` goes up by 1, and the condition is checked again. With `n = 4` the body runs for `h` = 0, 1, 2 and 3 — four times, never with `h = 4`.',
      'The most common loop bug is being **off by one**: `h < n - 1` skips the last hour; `h <= n` reads past the end. A trace finds it in a minute. Staring at the code often does not.',
    ],
  },

  glossary: [
    { term: '`for (init; condition; update)`', meaning: 'Run `init` once; then, while `condition` is true, run the body and then `update`.' },
    { term: '**trace table**', meaning: 'One row per step, one column per variable: each variable’s value after that step.' },
    { term: '**off-by-one error**', meaning: 'A loop that runs once too often or once too few — usually `<` versus `<=`, or a wrong starting index.' },
    { term: '`std::vector<int>`', meaning: 'A resizable list of `int`s. `v.size()` is its length and `v[i]` is element `i`, counting from 0.' },
  ],

  priorCheck: [
    item({
      id: 'cpp-loop.pre1', competency: 'cpp.basics', difficulty: 1,
      prompt: 'What is the value of `x` after `int x = 5; x = x * 2 + 1;`?',
      answer: num(11), compute: () => 5 * 2 + 1, solution: 'Multiply first: $5 \\times 2 + 1 = 11$, and that is stored back in `x`.',
    }),
    item({
      id: 'cpp-loop.pre2', competency: 'cpp.basics', difficulty: 1,
      prompt: 'In C++, what is `17 / 5` when both numbers are `int`?',
      answer: num(3), compute: () => Math.trunc(17 / 5), solution: 'Integer division drops the remainder: 3 (the remainder, `17 % 5`, is 2).',
    }),
  ],

  visualization: {
    lab: 'code-trace',
    config: { program: 'cafe-total' },
    intro: 'Step through a three-hour version of the program one line at a time. Before each step, say which variable will change and to what; then check.',
    textAlternative: 'The lab shows the program’s ten steps. After each step a sentence says which line ran, which variable changed and what was printed; the table lists the value of `cups`, `total` and `h` after every step. The loop runs for h = 0, 1, 2; the check with h = 3 fails; the program prints 44.',
  },

  derivation: {
    intro: 'Why does the loop add up exactly the hours you asked for? A **loop invariant** — a statement that is true every time the condition is checked — answers it.',
    steps: [
      { say: 'Claim: whenever the loop checks `h < n`, `total` holds the sum of the first `h` readings, `cups[0]` to `cups[h-1]`. Before the first check, `h = 0` and `total = 0`: the sum of no readings is 0, so the claim holds.' },
      { say: 'Each pass adds `cups[h]` and then increases `h` by one. If the claim held before the pass, it holds after it:', math: '\\text{total}_{\\text{new}} = \\sum_{i=0}^{h-1} c_i + c_h = \\sum_{i=0}^{h} c_i' },
      { say: 'The loop stops at the first check where `h < n` is false, which is `h = n`. The claim then says `total` is the sum of all $n$ readings — what we wanted.' },
      { say: 'Write the condition as `h < n - 1` and the loop stops at `h = n - 1`: the same claim now proves the total is missing the last reading. That is the bakery’s bug, found by reasoning rather than guessing.' },
    ],
    assumptions: [
      '`n` is the number of readings in the vector, `cups.size()`.',
      'The total fits in an `int` (up to about 2.1 billion); bigger totals need `long long`.',
    ],
    domain: [
      'With no readings ($n = 0$) the body never runs and the total stays 0 — the right answer.',
      'Reading `cups[n]` is out of bounds. C++ does not check: the program may print garbage or crash, differently on each run.',
    ],
  },

  examples: [
    {
      title: 'Predicting a loop’s output',
      problem: 'What does this print? `int t = 0; for (int i = 1; i <= 4; ++i) t += i * 10; std::cout << t;`',
      steps: ['`i` takes the values 1, 2, 3, 4 (at 5 the condition `i <= 4` fails).', 'The body adds 10, 20, 30 and 40.', '`t` ends at 100, so it prints 100.'],
      answer: '100',
      check: { value: 100, compute: () => [1, 2, 3, 4].reduce((s, i) => s + i * 10, 0) },
    },
    {
      title: 'Finding an off-by-one bug',
      problem: 'A loop meant to add six hourly readings is written `for (int h = 1; h < 6; ++h) total += cups[h];`. How many readings does it add, and which one does it miss?',
      steps: ['`h` takes 1, 2, 3, 4, 5: five values.', 'It never reads `cups[0]`, the first hour.', 'Fix: start at `h = 0` and keep `h < 6`.'],
      answer: 'five readings; it misses the first hour',
      check: { value: 5, compute: () => [1, 2, 3, 4, 5].length },
    },
  ],

  counterexample: {
    title: 'Code that looks right is not evidence',
    body: [
      '`for (int h = 0; h <= cups.size(); ++h)` compiles and often prints a plausible number. It reads one element past the end — undefined behaviour — so the number can change between runs, or the program can crash.',
      'Only a trace, or a test with a known answer, exposes it. Compiling with warnings on (`g++ -Wall -Wextra`) also helps: it flags the comparison between a signed `int` and the unsigned `size()`.',
    ],
  },

  predict: {
    prompt: 'What does this print? `int n = 0; for (int i = 10; i > 0; i -= 3) ++n; std::cout << n;`',
    choices: ['3', '4', '10', 'Nothing: the loop never stops'],
    answer: 1,
    reveal: '`i` takes 10, 7, 4 and 1; the next value, −2, fails `i > 0`. Four passes, so it prints 4.',
    misconception: {
      belief: 'The number of passes is the starting value divided by the step: 10 ÷ 3, about 3.',
      correction: 'Count the values the variable actually takes, including the last one that still passes the test. Division gives a rough guess, not the count.',
    },
  },

  practice: [
    item({ id: 'cpp-loop.p1', competency: 'cpp.basics', difficulty: 1, level: 'scaffolded', prompt: 'Trace `int s = 0; for (int i = 0; i < 3; ++i) s += 2;`. What is `s` at the end? (The body runs for `i` = 0, 1, 2.)', answer: num(6), compute: () => 3 * 2, hints: ['Three passes, each adding 2.'], solution: '$0 + 2 + 2 + 2 = 6$.' }),
    item({ id: 'cpp-loop.p2', competency: 'cpp.basics', difficulty: 1, level: 'scaffolded', prompt: 'How many times does the body of `for (int k = 2; k <= 8; k += 2)` run? (`k` takes 2, 4, …)', answer: num(4), compute: () => [2, 4, 6, 8].length, hints: ['List the values: 2, 4, 6, 8, then 10 fails.'], solution: 'Four times: $k$ = 2, 4, 6, 8.' }),
    item({ id: 'cpp-loop.p3', competency: 'cpp.basics', difficulty: 2, level: 'independent', prompt: 'What does this print? `int p = 1; for (int i = 1; i <= 5; ++i) p *= 2; std::cout << p;`', answer: num(32), compute: () => 2 ** 5, hints: ['Five passes, each doubling `p`.'], solution: '$p$ doubles five times: $2^5 = 32$.' }),
    item({
      id: 'cpp-loop.p4', competency: 'cpp.basics', difficulty: 2, level: 'independent',
      prompt: 'Trace `int a = 0, b = 1; for (int i = 0; i < 4; ++i) { int t = a + b; a = b; b = t; }`. What are `a` and `b` after the loop?',
      answer: multi([3, 5], ['a', 'b']), hints: ['Make a table with columns i, t, a, b.', 'After the first pass: t = 1, a = 1, b = 1.'],
      solution: 'Passes give (a, b) = (1, 1), (1, 2), (2, 3), (3, 5). These are Fibonacci numbers.',
    }),
    item({
      id: 'cpp-loop.p5', competency: 'cpp.debugging', difficulty: 2, level: 'independent',
      prompt: 'This should print the largest reading, but prints 0 for the readings `{−5, −2, −9}`: `int best = 0; for (int x : v) if (x > best) best = x;` What is the bug?',
      answer: choice(['`best` should start at the first reading, `v[0]`, not at 0', 'The comparison should be `<`', '`int` cannot store negative numbers', 'A range-based `for` skips the first element'], 0),
      feedback: { 1: 'That would find the smallest reading.', 2: '`int` stores negative numbers fine.', 3: 'A range-based `for` visits every element.' },
      hints: ['Which reading beats 0?'],
      solution: 'No reading beats the starting value 0, so 0 is printed. Starting from `v[0]` (when `v` is not empty) makes the answer −2.',
    }),
    item({
      id: 'cpp-loop.p6', competency: 'cpp.basics', difficulty: 3, level: 'transfer',
      prompt: 'A step counter stores daily totals `{9100, 7600, 8000, 12000, 8001}`. The program counts active days with `if (s > 8000) ++count;`. What does it print?',
      answer: num(3), compute: () => [9100, 7600, 8000, 12000, 8001].filter((s) => s > 8000).length, hints: ['Is 8000 greater than 8000?'],
      solution: '9100, 12000 and 8001 pass; 7600 does not, and neither does 8000 (`>` is strict). It prints 3.',
    }),
  ],

  apply: {
    scenario: 'A small bakery logs loaves sold each hour after opening: `{12, 30, 41, 28, 15, 9, 4}`. The owner wants a program that prints the total, the busiest hour and how many hours sold fewer than 10 loaves — to decide when to stop baking.',
    steps: [
      'Predict each number by tracing, before looking at the program’s output.',
      'Check your numbers against the program below (or compile it yourself).',
      'Decide what one day of data does and does not justify.',
    ],
    items: [
      item({ id: 'cpp-loop.u1', competency: 'cpp.basics', difficulty: 2, prompt: 'What total does the program print?', answer: num(139), compute: () => loaves.reduce((a, b) => a + b, 0), hints: ['Add the seven readings.'], solution: '$12 + 30 + 41 + 28 + 15 + 9 + 4 = 139$.' }),
      item({ id: 'cpp-loop.u2', competency: 'cpp.basics', difficulty: 2, prompt: 'Counting the first hour as hour 0, which hour is the busiest?', answer: num(2), compute: () => loaves.indexOf(Math.max(...loaves)), hints: ['The largest reading is 41.'], solution: '41 loaves, at index 2 (the third hour).' }),
      item({ id: 'cpp-loop.u3', competency: 'cpp.basics', difficulty: 2, prompt: 'How many hours sold fewer than 10 loaves?', answer: num(2), compute: () => loaves.filter((x) => x < 10).length, hints: ['Look for readings below 10.'], solution: '9 and 4: two hours.' }),
      item({
        id: 'cpp-loop.u4', competency: 'cpp.basics', difficulty: 3,
        prompt: 'The owner proposes to stop baking after hour 4 every day. What does this one day of data justify?',
        answer: choice(['A hypothesis to check over many days, including weekends', 'A firm rule: the last two hours always sell under 10', 'Nothing: a program cannot inform a decision', 'Stopping after hour 2, the busiest hour'], 0),
        feedback: { 1: 'One day cannot show “always”: weather, weekdays and promotions change sales.', 2: 'It informs the decision — as evidence to collect more of, not as proof.', 3: 'The busiest hour is when to bake most, not when to stop.' },
        solution: 'One day is one sample. Log a few weeks, look at each weekday separately, and only then set a rule.',
      }),
    ],
    limits: [
      'One day of sales is one sample: weather, weekdays and promotions change the pattern.',
      'Sales are not demand: if loaves ran out, the log undercounts what customers wanted.',
      'The numbers are illustrative, not from a real bakery.',
    ],
  },

  checkpoint: [
    item({ id: 'cpp-loop.c1', competency: 'cpp.basics', difficulty: 1, prompt: 'What does `int c = 0; for (int i = 0; i < 5; ++i) if (i % 2 == 0) ++c; std::cout << c;` print?', answer: num(3), compute: () => [0, 1, 2, 3, 4].filter((i) => i % 2 === 0).length, solution: '`i` = 0, 2 and 4 are even: it prints 3.', feedbackCorrect: 'Right.', feedbackIncorrect: 'List the values of `i` (0 to 4) and mark the even ones — 0 counts.' }),
    item({
      id: 'cpp-loop.c2', competency: 'cpp.debugging', difficulty: 2,
      prompt: 'This should print `1 2 3 4 5` but prints `1 2 3 4`: `for (int i = 1; i < 5; ++i) std::cout << i << " ";` Which change fixes it?',
      answer: choice(['Use `i <= 5`', 'Start at `i = 0`', 'Use `i++` instead of `++i`', 'Use `i += 2`'], 0),
      feedback: { 1: 'That prints 0 1 2 3 4.', 2: 'In the update of a for-loop, `i++` and `++i` do the same thing.', 3: 'That skips numbers.' },
      solution: 'The last value printed must be 5, so the condition must allow `i = 5`: `i <= 5`.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Which value of `i` is missing, and which part of the loop stops it?',
    }),
    item({
      id: 'cpp-loop.c3', competency: 'cpp.basics', difficulty: 3,
      prompt: 'A thermostat log `t = {19, 21, 24, 23, 18}` is scanned by `int rises = 0; for (std::size_t i = 1; i < t.size(); ++i) if (t[i] > t[i - 1]) ++rises;`. What does it print?',
      answer: num(2), compute: () => { const t = [19, 21, 24, 23, 18]; let r = 0; for (let i = 1; i < t.length; i += 1) if (t[i] > t[i - 1]) r += 1; return r; },
      solution: 'It compares neighbours: 21 > 19 yes, 24 > 21 yes, 23 > 24 no, 18 > 23 no. Two rises.',
      feedbackCorrect: 'Right — starting at `i = 1` is what makes `t[i - 1]` safe.', feedbackIncorrect: 'Write the four comparisons `t[1] > t[0]`, `t[2] > t[1]`, … and count the true ones.',
    }),
  ],

  cpp: {
    intro: 'The bakery program: one pass over the readings computes all three numbers.',
    file: 'bakery_hours.cpp',
    code: `#include <cstddef>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> loaves = {12, 30, 41, 28, 15, 9, 4};
    int total = 0;
    std::size_t busiest = 0;
    int slowHours = 0;
    for (std::size_t h = 0; h < loaves.size(); ++h) {
        total += loaves[h];
        if (loaves[h] > loaves[busiest]) busiest = h;
        if (loaves[h] < 10) ++slowHours;
    }
    std::cout << "total: " << total << "\\n";
    std::cout << "busiest hour: " << busiest << "\\n";
    std::cout << "hours under 10: " << slowHours << "\\n";
}`,
    output: 'total: 139\nbusiest hour: 2\nhours under 10: 2',
    explain: 'The index `h` is a `std::size_t`, the same unsigned type `size()` returns, so the comparison is warning-free. `busiest` remembers the index of the best hour seen so far, not the number of loaves.',
  },

  reading: [
    { title: 'for loop', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/language/for', note: 'The exact rules: init, condition, update, and scope of the loop variable.' },
    { title: 'Range-based for loop', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/language/range-for', note: 'The `for (int x : v)` form used in the practice questions.' },
  ],
};
