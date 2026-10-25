import { item, num, choice, multi } from '../lessonKit.js';

// V5 Computer Science track: Ohlone CS-102 preparation (functions, scope,
// vectors). Every C++ program is compiled and run by scripts/verify-cpp.mjs.
// The gym numbers are illustrative.

const raw = [12, -1, 30, 25, -1, 8];
const kept = raw.filter((c) => c !== -1);

export default {
  intuition: {
    question: 'You write a function that adds a \\$2 delivery fee to every price in a shopping cart. You call it, print the cart — and the prices have not changed. The function ran. What happened to its work?',
    body: [
      'A **function** packages steps under a name: give it inputs (parameters), it does its work, and it may return one value. Small functions are easier to test than one long `main`.',
      'How a parameter is declared decides what the function can touch. `std::vector<int> prices` makes a **copy** of the caller’s vector; changes vanish when the function returns. `std::vector<int>& prices` is a **reference** — another name for the caller’s own vector — so changes stick.',
      'The fee function received a copy. Declaring it `void addFee(std::vector<int>& prices)` fixes it. And when a function only reads a big vector, `const std::vector<int>&` avoids the copy and promises not to change it.',
    ],
  },

  glossary: [
    { term: '**parameter**, **argument**', meaning: 'The parameter is the name in the function’s definition; the argument is the value passed in a call.' },
    { term: 'pass by value: `T x`', meaning: 'The function gets its own copy of the argument. Changing `x` does not affect the caller.' },
    { term: 'pass by reference: `T& x`', meaning: 'The function works on the caller’s object itself, under another name.' },
    { term: '`const T& x`', meaning: 'A read-only reference: no copy is made, and the compiler rejects any change to `x`.' },
    { term: '`return`', meaning: 'Ends the function and hands one value back to the caller. A non-`void` function must return on every path.' },
  ],

  priorCheck: [
    item({
      id: 'cpp-fn.pre1', competency: 'cpp.basics', difficulty: 1,
      prompt: 'Given `int f(int x) { return 2 * x + 1; }`, what is `f(4)`?',
      answer: num(9), compute: () => 2 * 4 + 1, solution: '$2 \\times 4 + 1 = 9$.', remedy: 'cpp-loops-trace',
    }),
    item({
      id: 'cpp-fn.pre2', competency: 'func.notation', difficulty: 1,
      prompt: 'If $g(x) = x^2 - 1$, what is $g(3)$?',
      answer: num(8), compute: () => 3 ** 2 - 1, solution: '$9 - 1 = 8$ — a C++ function call works the same way.',
    }),
  ],

  visualization: {
    lab: 'code-trace',
    config: { program: 'fee-copy-vs-ref' },
    intro: 'Step through two calls: one that receives a copy of the cart, one that receives the cart itself. Watch `main.cart` while each function runs.',
    textAlternative: 'Nine steps. In the first call the parameter `prices` is a copy: it becomes {7,10} while main’s cart stays {5,8}, and the program prints 5 8. In the second call `prices` is an alias for the cart: both become {7,10}, and the program prints 7 10. The table lists the cart and the parameter after every step.',
  },

  derivation: {
    intro: 'What exactly happens in a call, and why a copy cannot change the caller?',
    steps: [
      { say: 'The call `addFee(cart)` creates the parameter `prices` and initialises it from the argument. For `std::vector<int> prices`, that means constructing a new vector with the same elements — a separate object in memory.' },
      { say: 'Inside the function, `prices` is the only name in scope. Every change is made to that new object; `cart` in `main` is not even visible here.' },
      { say: 'When the function returns, its parameters are destroyed. The copy, with its changes, is gone; `cart` is exactly as before.' },
      { say: 'For `std::vector<int>& prices`, no new object is made: `prices` is bound to `cart` itself, so every change through `prices` is a change to `cart`. The cost of the call no longer depends on how big the vector is.' },
    ],
    assumptions: [
      'Ordinary value types: `int`, `double`, `std::string`, `std::vector` copy their contents when copied.',
    ],
    domain: [
      'A reference must refer to a live object: never return a reference to a local variable, which dies when the function returns.',
      'Copying is not wrong — it is the safe default for small values such as `int` and `double`. Prefer `const&` for large read-only arguments.',
    ],
  },

  examples: [
    {
      title: 'A function with a return value',
      problem: 'With `int clamp(int x, int lo, int hi) { if (x < lo) return lo; if (x > hi) return hi; return x; }`, what is `clamp(212, 40, 200)`?',
      steps: ['212 is not below 40.', '212 is above 200, so the second `return` runs.', 'The result is 200; the rest of the function does not run.'],
      answer: '200',
      check: { value: 200, compute: () => Math.min(Math.max(212, 40), 200) },
    },
    {
      title: 'Copy or reference?',
      problem: '`void bump(int& x) { x += 10; }` is called twice on `int a = 5;`. What is `a`?',
      steps: ['`x` is a reference to `a`.', 'Each call adds 10 to `a` itself.', '$5 + 10 + 10 = 25$.'],
      answer: '25',
      check: { value: 25, compute: () => 5 + 10 + 10 },
    },
  ],

  counterexample: {
    title: 'A function that forgets to return',
    body: [
      '`int sum(const std::vector<int>& v) { int s = 0; for (int x : v) s += x; }` compiles with only a warning (“control reaches end of non-void function”) — and the caller receives whatever happens to be in the return slot.',
      'That is undefined behaviour, not a wrong answer you can rely on: it may print the right sum on one machine and garbage on another. Treat that warning as an error (`-Werror`).',
    ],
  },

  predict: {
    prompt: 'What does this print? `void f(std::vector<int> v) { v.push_back(9); }` then `std::vector<int> a = {1}; f(a); std::cout << a.size();`',
    choices: ['1', '2', '9', 'It does not compile'],
    answer: 0,
    reveal: '`f` receives a copy of `a` and adds 9 to the copy. `a` still has one element, so it prints 1.',
    misconception: {
      belief: 'Changing a parameter inside a function changes the variable that was passed in.',
      correction: 'Only for reference parameters (`&`). A plain parameter is a copy, and the copy is destroyed when the function returns.',
    },
  },

  practice: [
    item({ id: 'cpp-fn.p1', competency: 'cpp.functions', difficulty: 1, level: 'scaffolded', prompt: 'With `int square(int n) { return n * n; }`, what is `square(3) + square(4)`?', answer: num(25), compute: () => 9 + 16, hints: ['Evaluate each call first: 9 and 16.'], solution: '$9 + 16 = 25$.' }),
    item({ id: 'cpp-fn.p2', competency: 'cpp.functions', difficulty: 1, level: 'scaffolded', prompt: 'With `void bump(int x) { x += 10; }` — note: no `&` — what is `a` after `int a = 5; bump(a);`?', answer: num(5), compute: () => 5, hints: ['`x` is a copy of `a`.'], solution: 'The copy becomes 15 and is destroyed; `a` is still 5.' }),
    item({ id: 'cpp-fn.p3', competency: 'cpp.functions', difficulty: 2, level: 'independent', prompt: 'With `void scale(std::vector<int>& v, int k) { for (int& x : v) x *= k; }`, what is `d[1] + d[2]` after `std::vector<int> d = {1, 2, 3}; scale(d, 4);`?', answer: num(20), compute: () => 2 * 4 + 3 * 4, hints: ['`v` is a reference, so `d` itself becomes {4, 8, 12}.'], solution: '`d` = {4, 8, 12}, so $8 + 12 = 20$.' }),
    item({
      id: 'cpp-fn.p4', competency: 'cpp.functions', difficulty: 2, level: 'independent',
      prompt: 'After `std::vector<int> v = {3, 1, 4}; v.push_back(1); v.push_back(5);`, what are `v.size()` and `v[3]`?',
      answer: multi([5, 1], ['v.size()', 'v[3]']), hints: ['`push_back` appends at the end.', 'Indices start at 0.'],
      solution: '`v` = {3, 1, 4, 1, 5}: five elements, and `v[3]` is 1.',
    }),
    item({
      id: 'cpp-fn.p5', competency: 'cpp.debugging', difficulty: 2, level: 'independent',
      prompt: '`void addFee(std::vector<int> prices) { for (int& p : prices) p += 2; }` leaves the caller’s cart unchanged. What is the smallest fix?',
      answer: choice(['Declare the parameter `std::vector<int>& prices`', 'Use `p = p + 2` instead of `p += 2`', 'Return `prices` and ignore the result', 'Make the loop variable `int p` instead of `int& p`'], 0),
      feedback: { 1: 'Same operation; the problem is that `prices` is a copy.', 2: 'Returning the vector works only if the caller stores it — ignoring it changes nothing.', 3: 'That would stop even the copy from changing.' },
      hints: ['Which object does the loop change?'],
      solution: 'With `&` the parameter refers to the caller’s vector, so the fee is added to the cart itself.',
    }),
    item({
      id: 'cpp-fn.p6', competency: 'cpp.functions', difficulty: 3, level: 'transfer',
      prompt: 'A heart-rate monitor clamps readings to the range 40–200 with `clamp(x, 40, 200)` from the worked example. What is `clamp(212, 40, 200) + clamp(35, 40, 200) + clamp(72, 40, 200)`?',
      answer: num(312), compute: () => [212, 35, 72].map((x) => Math.min(Math.max(x, 40), 200)).reduce((a, b) => a + b, 0), hints: ['Clamp each reading separately: 212 → 200, 35 → 40.'],
      solution: '$200 + 40 + 72 = 312$. (Clamping hides sensor faults — a real monitor should also flag them.)',
    }),
  ],

  apply: {
    scenario: 'A gym’s door counter logs check-ins per hour, but a faulty sensor sometimes writes −1: `{12, −1, 30, 25, −1, 8}`. You write `clean(v)`, which removes the −1 entries (it must change the caller’s vector), and `peak(v)`, which returns the largest count (it only reads).',
    steps: [
      'Decide how each function should take its parameter.',
      'Predict what the program prints.',
      'Say what the cleaned numbers leave out.',
    ],
    items: [
      item({ id: 'cpp-fn.u1', competency: 'cpp.functions', difficulty: 2, prompt: 'How many readings are left after `clean`?', answer: num(4), compute: () => kept.length, hints: ['Two entries are −1.'], solution: '{12, 30, 25, 8}: four readings.' }),
      item({ id: 'cpp-fn.u2', competency: 'cpp.functions', difficulty: 2, prompt: 'What does `peak` return for the cleaned readings?', answer: num(30), compute: () => Math.max(...kept), hints: ['The largest of 12, 30, 25, 8.'], solution: '30 check-ins.' }),
      item({ id: 'cpp-fn.u3', competency: 'cpp.functions', difficulty: 2, prompt: 'What is the mean of the cleaned readings?', answer: num(18.75), compute: () => kept.reduce((a, b) => a + b, 0) / kept.length, hints: ['$(12 + 30 + 25 + 8) / 4$.'], solution: '$75 / 4 = 18.75$ check-ins per hour.' }),
      item({
        id: 'cpp-fn.u4', competency: 'cpp.functions', difficulty: 3,
        prompt: 'Next month the log has a million entries. Why should `peak` take `const std::vector<int>&` rather than `std::vector<int>`?',
        answer: choice(['It avoids copying a million entries on every call, and `const` stops accidental changes', 'References are shorter to type', 'Passing by value would change the caller’s vector', '`const` makes the loop run in parallel'], 0),
        feedback: { 1: 'Readability is not the point; cost and safety are.', 2: 'Passing by value copies; it never changes the caller.', 3: '`const` is a promise about changes, not about parallelism.' },
        solution: 'By value, every call copies the whole vector. A `const` reference reads the caller’s data directly and the compiler enforces read-only access.',
      }),
    ],
    limits: [
      'Removing the −1 readings hides how often the sensor fails; a real program should count and report them.',
      'One day’s peak is not a typical peak; compare many days before staffing to it.',
      'The numbers are illustrative.',
    ],
  },

  checkpoint: [
    item({ id: 'cpp-fn.c1', competency: 'cpp.functions', difficulty: 1, prompt: 'With `int twice(int x) { return x * 2; }`, what is `twice(twice(3))`?', answer: num(12), compute: () => 3 * 2 * 2, solution: 'Inner call first: `twice(3)` is 6, and `twice(6)` is 12.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Evaluate the inner call first, then pass its result to the outer one.' }),
    item({
      id: 'cpp-fn.c2', competency: 'cpp.functions', difficulty: 2,
      prompt: 'Which declaration lets a function add an item to the caller’s shopping list?',
      answer: choice(['`void add(std::vector<std::string>& list, const std::string& item)`', '`void add(std::vector<std::string> list, std::string item)`', '`void add(const std::vector<std::string>& list, std::string item)`', '`std::string add(std::vector<std::string> list)`'], 0),
      feedback: { 1: 'The list is a copy: the item is added to the copy.', 2: '`const` forbids adding anything.', 3: 'It takes a copy and returns a string, not the list.' },
      solution: 'Only a non-`const` reference to the list lets the function change the caller’s list; the item can be a `const&`, since it is only read.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'The list must be changed in place: which parameter is a non-const reference?',
    }),
    item({
      id: 'cpp-fn.c3', competency: 'cpp.functions', difficulty: 3,
      prompt: 'With `void runningTotal(std::vector<int>& v) { for (std::size_t i = 1; i < v.size(); ++i) v[i] += v[i - 1]; }`, what is `d[2]` after `std::vector<int> d = {2, 3, 5}; runningTotal(d);`?',
      answer: num(10), compute: () => { const d = [2, 3, 5]; for (let i = 1; i < d.length; i += 1) d[i] += d[i - 1]; return d[2]; },
      solution: '`d[1]` becomes 3 + 2 = 5, then `d[2]` becomes 5 + 5 = 10: each entry is the total so far.',
      feedbackCorrect: 'Right — and because `v` is a reference, `d` itself now holds the running totals.', feedbackIncorrect: 'Trace it: `i = 1` changes `d[1]` first, and `i = 2` uses that new value.',
    }),
  ],

  cpp: {
    intro: 'The gym program: `clean` changes the caller’s vector through a reference; `peak` only reads it, through a `const` reference.',
    file: 'gym_checkins.cpp',
    code: `#include <iostream>
#include <vector>

// Remove sensor errors (-1) in place: the caller's vector changes.
void clean(std::vector<int>& counts) {
    std::vector<int> kept;
    for (int c : counts) {
        if (c != -1) kept.push_back(c);
    }
    counts = kept;
}

// Read-only access, without copying the vector.
int peak(const std::vector<int>& counts) {
    int best = counts.empty() ? 0 : counts[0];
    for (int c : counts) {
        if (c > best) best = c;
    }
    return best;
}

int main() {
    std::vector<int> checkins = {12, -1, 30, 25, -1, 8};
    clean(checkins);
    std::cout << "readings kept: " << checkins.size() << "\\n";
    std::cout << "peak hour: " << peak(checkins) << "\\n";
}`,
    output: 'readings kept: 4\npeak hour: 30',
    explain: '`peak` starts from the first reading (not 0), so it also works when every count is negative — and it returns 0 for an empty vector instead of reading `counts[0]`, which would not exist.',
  },

  reading: [
    { title: 'Function declaration', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/language/function', note: 'Parameters, return types and the rules for returning.' },
    { title: 'Reference declaration', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/language/reference', note: 'What `T&` and `const T&` bind to.' },
  ],
};
