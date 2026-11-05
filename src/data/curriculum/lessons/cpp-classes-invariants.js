import { item, num, choice } from '../lessonKit.js';

// V5 Computer Science track: Ohlone CS-116 preparation (classes,
// encapsulation, constructors and destructors). Every C++ program is
// compiled and run by scripts/verify-cpp.mjs. The café numbers are
// illustrative.

/** The lesson's Inventory rules, for recomputing the answers. */
function inventory(start) {
  let count = start;
  return {
    remove: (n) => (n >= 0 && n <= count ? ((count -= n), true) : false),
    add: (n) => { count += n; },
    get count() { return count; },
  };
}

export default {
  intuition: {
    question: 'A café’s stock program lets any line of code write `stock = stock - 3`. One morning the screen shows −2 croissants. Nobody can sell a negative croissant — so how do you make that number impossible, not just unlikely?',
    body: [
      'A **class** bundles data with the only functions allowed to change it. Make the count `private`, and the rest of the program must go through `remove(n)`, which can refuse a sale larger than the stock.',
      'The promise “the count is never negative” is the class’s **invariant**. The constructor establishes it — it rejects a negative starting stock — and every public member function preserves it. If it holds after construction and after every call, it holds always: the same reasoning as a loop invariant.',
      'Objects also have a lifetime. The **constructor** runs when an object is created and the **destructor** when it goes out of scope, in reverse order. C++ uses this to release resources automatically; the trace lab shows exactly when each runs.',
    ],
  },

  glossary: [
    { term: '**class**, **object**', meaning: 'A class is a type you define (data plus member functions); an object is one value of that type.' },
    { term: '`public:` / `private:`', meaning: 'Public members can be used anywhere; private members only inside the class’s own member functions.' },
    { term: '**invariant**', meaning: 'A condition on an object’s data that is true whenever code outside the class can look at it.' },
    { term: '**constructor**, **destructor**', meaning: 'Special member functions run automatically when an object is created (`Inventory(int)`) and destroyed (`~Inventory()`).' },
    { term: '`int count() const`', meaning: 'A `const` member function promises not to change the object, so it can be called on read-only objects.' },
  ],

  priorCheck: [
    item({
      id: 'cpp-cls.pre1', competency: 'cpp.functions', difficulty: 1,
      prompt: 'With `void reset(int& x) { x = 0; }`, what is `a` after `int a = 7; reset(a);`?',
      answer: num(0), compute: () => 0, solution: '`x` is a reference to `a`, so `a` becomes 0.', remedy: 'cpp-functions-vectors',
    }),
    item({
      id: 'cpp-cls.pre2', competency: 'cpp.basics', difficulty: 1,
      prompt: 'Is the C++ condition `5 - 7 >= 0` true or false?',
      answer: choice(['true', 'false'], 1), feedback: { 0: '$5 - 7 = -2$, which is less than 0.' },
      solution: '$-2 \\ge 0$ is false.',
    }),
  ],

  visualization: {
    lab: 'code-trace',
    config: { program: 'oven-lifetime' },
    intro: 'Two ovens: `a` lives for the whole program, `b` only inside a block. Step through and watch when each constructor and destructor runs.',
    textAlternative: 'Six steps. Creating `a` prints “heat A”; creating `b` prints “heat B”; the block prints “baking”; at the block’s closing brace `b` is destroyed (“cool B”); main prints “closing”; at the end of main `a` is destroyed (“cool A”). The table lists which ovens are alive after each step.',
  },

  derivation: {
    intro: 'Why can a private count never become negative, however large the rest of the program grows?',
    steps: [
      { say: 'Let $I$ be the invariant “`count_ >= 0`”. Because `count_` is private, only the class’s own member functions can change it.' },
      { say: 'The constructor checks its argument and throws an exception if it is negative. An object whose constructor throws never exists, so every object starts with $I$ true.' },
      { say: 'Each public member function is written so that if $I$ holds when it starts, $I$ holds when it returns: `remove(n)` refuses when `n > count_` or `n < 0`, and `add(n)` refuses negative `n`.', math: 'I \\text{ holds before a call} \\;\\Longrightarrow\\; I \\text{ holds after it}' },
      { say: 'By induction on the number of calls, $I$ holds every time outside code can observe the object. Make `count_` public and the argument collapses: any line, anywhere, could set it to −2.' },
    ],
    assumptions: [
      'No member function hands out a non-`const` reference or pointer to `count_`.',
      'One thread at a time. With several threads, each call would also need a lock.',
    ],
    domain: [
      'Inside a member function the invariant may be broken briefly; it only has to hold again before the function returns.',
      'Refusing is a design choice: `remove` returns `false` (the caller decides what to do); the constructor and `add` throw, because a negative number there is a programming error.',
    ],
  },

  examples: [
    {
      title: 'Refusing an impossible sale',
      problem: 'An `Inventory` starts with 5 croissants. The program calls `remove(3)`, then `remove(4)`. What is the count afterwards, and what did the second call return?',
      steps: ['First call: 3 ≤ 5, so the count becomes 2 and `remove` returns `true`.', 'Second call: 4 > 2, so it refuses — the count stays 2 and it returns `false`.', 'The caller must look at the result, for example to tell the customer.'],
      answer: 'count 2; the second call returns false',
      check: { value: 2, compute: () => { const s = inventory(5); s.remove(3); s.remove(4); return s.count; } },
    },
    {
      title: 'Order of construction and destruction',
      problem: 'In `int main() { Oven a("A"); { Oven b("B"); } }`, in what order are the four messages printed?',
      steps: ['`a` is constructed first: “heat A”.', '`b` is constructed in the inner block (“heat B”) and destroyed at its closing brace (“cool B”).', 'At the end of `main`, `a` is destroyed: “cool A”. Objects die in the reverse order of creation.'],
      answer: 'heat A, heat B, cool B, cool A',
      check: { value: 4, compute: () => ['heat A', 'heat B', 'cool B', 'cool A'].length },
    },
  ],

  counterexample: {
    title: 'Public data cannot keep a promise',
    body: [
      '`struct Stock { int count; };` lets any code write `s.count = -2;`. No amount of care inside one function prevents that, because the bad line can be anywhere in the program.',
      'Encapsulation shrinks “anywhere” to the class’s own member functions — a handful of places you can read and test.',
    ],
  },

  predict: {
    prompt: 'An `Inventory` holding 2 items receives `remove(5)`. With the invariant enforced, what happens?',
    choices: ['The count becomes −3', 'The call is refused: it returns false and the count stays 2', 'The count becomes 0', 'The program crashes'],
    answer: 1,
    reveal: '5 is more than the 2 in stock, so `remove` changes nothing and returns `false`; the caller decides what to tell the customer.',
    misconception: {
      belief: 'A function should always do what it is asked.',
      correction: 'A member function must keep the class’s promises. Refusing — returning false or throwing — is the correct behaviour when a request would break the invariant.',
    },
  },

  practice: [
    item({ id: 'cpp-cls.p1', competency: 'cpp.oop', difficulty: 1, level: 'scaffolded', prompt: 'An `Inventory` starts at 10. After `add(4)` and `remove(6)`, what is `count()`?', answer: num(8), compute: () => { const s = inventory(10); s.add(4); s.remove(6); return s.count; }, hints: ['10 + 4, then take 6 away.'], solution: '$10 + 4 - 6 = 8$.' }),
    item({
      id: 'cpp-cls.p2', competency: 'cpp.oop', difficulty: 1, level: 'scaffolded',
      prompt: 'Which member of `Inventory` must be `private` for the invariant to be enforceable?',
      answer: choice(['The data member `count_`', 'The constructor', 'The function `count()`', 'The function `remove()`'], 0),
      feedback: { 1: 'A private constructor would stop anyone creating an inventory.', 2: '`count()` only reads; it is safe to make public.', 3: '`remove()` is how other code is meant to change the stock.' },
      hints: ['What must outside code be unable to change directly?'],
      solution: 'Hide the data, expose the operations: `count_` private, the member functions public.',
    }),
    item({ id: 'cpp-cls.p3', competency: 'cpp.oop', difficulty: 2, level: 'independent', prompt: 'Starting at 3: `remove(2)`, `remove(2)`, `add(5)`, `remove(4)`. What is the final count?', answer: num(2), compute: () => { const s = inventory(3); s.remove(2); s.remove(2); s.add(5); s.remove(4); return s.count; }, hints: ['The second `remove(2)` asks for more than the 1 left.'], solution: '3 → 1 → (refused) 1 → 6 → 2.' }),
    item({ id: 'cpp-cls.p4', competency: 'cpp.oop', difficulty: 2, level: 'independent', prompt: 'How many lines does `int main() { Oven a("A"); Oven b("B"); }` print with the lesson’s `Oven` class?', answer: num(4), compute: () => 2 * 2, hints: ['Each oven prints once when built and once when destroyed.'], solution: 'heat A, heat B, cool B, cool A: four lines.' }),
    item({
      id: 'cpp-cls.p5', competency: 'cpp.oop', difficulty: 2, level: 'independent',
      prompt: 'In that program, in which order are `a` and `b` destroyed?',
      answer: choice(['`b`, then `a`', '`a`, then `b`', 'Both at the same moment', 'Never — destructors must be called by hand'], 0),
      feedback: { 1: 'Destruction is in reverse order of construction.', 2: 'One at a time, in reverse order.', 3: 'Local objects are destroyed automatically at the end of their scope.' },
      solution: 'Reverse order of construction: `b` was built last, so it is destroyed first.',
    }),
    item({
      id: 'cpp-cls.p6', competency: 'cpp.oop', difficulty: 3, level: 'transfer',
      prompt: 'A garage class keeps `free_` spaces with the invariant 0 ≤ `free_` ≤ 120; a group that does not fit is refused as a whole. It opens empty (120 free). Then 50 cars enter, 30 leave, a group of 110 tries to enter, and 20 leave. How many spaces are free at the end?',
      answer: num(120), compute: () => { let free = 120; const enter = (n) => { if (n <= free) free -= n; }; const leave = (n) => { if (free + n <= 120) free += n; }; enter(50); leave(30); enter(110); leave(20); return free; },
      hints: ['After 50 enter and 30 leave, 100 spaces are free.', 'Does a group of 110 fit into 100 spaces?'],
      solution: '120 → 70 → 100 → (110 refused) 100 → 120. The invariant’s upper bound is reached exactly, never exceeded.',
    }),
  ],

  apply: {
    scenario: 'A café tracks croissant stock with the `Inventory` class. The day starts with 24. In order: a sale of 10, a delivery of 12, a catering order of 30, and a sale of 6. The class refuses any order larger than the stock.',
    steps: [
      'Run the day through the class by hand.',
      'Count what the class refused.',
      'Decide what the café should do with that information.',
    ],
    items: [
      item({ id: 'cpp-cls.u1', competency: 'cpp.oop', difficulty: 2, prompt: 'How many croissants are left at closing?', answer: num(20), compute: () => { const s = inventory(24); s.remove(10); s.add(12); s.remove(30); s.remove(6); return s.count; }, hints: ['24 → 14 → 26; can 30 be taken from 26?'], solution: '24 → 14 → 26 → (30 refused) 26 → 20.' }),
      item({ id: 'cpp-cls.u2', competency: 'cpp.oop', difficulty: 2, prompt: 'How many of the four orders were refused?', answer: num(1), compute: () => { const s = inventory(24); return [s.remove(10), (s.add(12), true), s.remove(30), s.remove(6)].filter((ok) => !ok).length; }, hints: ['Only one order asked for more than the stock.'], solution: 'Only the catering order of 30.' }),
      item({
        id: 'cpp-cls.u3', competency: 'cpp.oop', difficulty: 3,
        prompt: 'Why should the program log the refused catering order instead of silently ignoring it?',
        answer: choice(['It is lost demand: the café could bake more, or offer a partial order', 'Logging makes the program faster', 'The invariant requires a log', 'There is no reason: a refused order cost nothing'], 0),
        feedback: { 1: 'Speed is not the point; information is.', 2: 'The invariant is about the count, not about logging.', 3: 'It cost a sale of 30 — the most valuable order of the day.' },
        solution: 'A refusal keeps the data correct, but the business still needs to know it happened.',
      }),
    ],
    limits: [
      'Whole croissants only; real stock also spoils, which the class does not model.',
      'Refusing the whole catering order is a policy; a café might sell part of it instead.',
      'The numbers are illustrative.',
    ],
  },

  checkpoint: [
    item({ id: 'cpp-cls.c1', competency: 'cpp.oop', difficulty: 1, prompt: 'Starting at 6: `remove(2)`, `add(1)`, `remove(10)`. What is `count()`?', answer: num(5), compute: () => { const s = inventory(6); s.remove(2); s.add(1); s.remove(10); return s.count; }, solution: '6 → 4 → 5 → (10 refused) 5.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Apply the calls in order, and check each `remove` against the stock at that moment.' }),
    item({
      id: 'cpp-cls.c2', competency: 'cpp.oop', difficulty: 2,
      prompt: 'Which design guarantees that a prepaid transit card’s balance is never below zero?',
      answer: choice(['`balance_` private; `pay(amount)` refuses when `amount > balance_`', '`balance_` public, with a comment asking callers to check', 'A global variable that a nightly job checks', 'Let `pay` go negative and correct it at the next top-up'], 0),
      feedback: { 1: 'A comment cannot stop a line of code from breaking the rule.', 2: 'A nightly check finds the problem after it happened.', 3: 'That allows the forbidden state.' },
      solution: 'Hide the data and check in the one function that changes it.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Which option makes a negative balance impossible rather than merely discouraged?',
    }),
    item({
      id: 'cpp-cls.c3', competency: 'cpp.oop', difficulty: 3,
      prompt: 'With the lesson’s `Oven` class, how many lines does `int main() { Oven a("A"); for (int i = 0; i < 2; ++i) { Oven t("T"); } }` print?',
      answer: num(6), compute: () => 2 + 2 * 2,
      solution: '“heat A”; then each pass builds and destroys `t` (“heat T”, “cool T”) — twice; finally “cool A”. Six lines.',
      feedbackCorrect: 'Right — a variable declared inside a loop body is created and destroyed on every pass.', feedbackIncorrect: 'An object declared inside the loop body lives for one pass only. Count the passes.',
    }),
  ],

  cpp: {
    intro: 'The café’s day, run through a class that enforces its invariant.',
    file: 'croissants.cpp',
    code: `#include <iostream>
#include <stdexcept>

// Stock of one product. Invariant: count_ is never negative.
class Inventory {
public:
    explicit Inventory(int start) : count_(start) {
        if (start < 0) throw std::invalid_argument("negative starting stock");
    }
    // Remove n items if there are enough; otherwise change nothing.
    bool remove(int n) {
        if (n < 0 || n > count_) return false;
        count_ -= n;
        return true;
    }
    void add(int n) {
        if (n < 0) throw std::invalid_argument("negative delivery");
        count_ += n;
    }
    int count() const { return count_; }

private:
    int count_;
};

int main() {
    Inventory croissants(24);
    croissants.remove(10);
    croissants.add(12);
    bool catering = croissants.remove(30);
    croissants.remove(6);
    std::cout << "catering order accepted: " << (catering ? "yes" : "no") << "\\n";
    std::cout << "left at closing: " << croissants.count() << "\\n";
}`,
    output: 'catering order accepted: no\nleft at closing: 20',
    explain: 'Nothing outside the class can touch `count_`, so the only way stock changes is through `remove` and `add` — the two places that check the rule.',
  },

  reading: [
    { title: 'Classes', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/language/classes', note: 'Members, access control and special member functions.' },
    { title: 'RAII', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/language/raii', note: 'Resource acquisition is initialization: why destructors matter.' },
  ],
};
