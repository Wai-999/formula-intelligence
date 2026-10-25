import { item, num, choice } from '../lessonKit.js';
import { checkBrackets, longestWait } from '../../../features/labs/structures.js';

// V5 Computer Science track: Ohlone CS-124 preparation (stacks, queues and
// their costs). The C++ program is compiled and run by
// scripts/verify-cpp.mjs. The clinic times are illustrative.

const clinic = [0, 2, 3, 10];

/** Apply stack operations ('+x' pushes x, '-' pops) and return the stack. */
function stackAfter(ops) {
  const s = [];
  for (const o of ops) {
    if (o === '-') s.pop();
    else s.push(o.slice(1));
  }
  return s;
}

export default {
  intuition: {
    question: 'A browser’s Back button returns you to the page you saw most recently. A clinic’s front desk sees the patient who has waited longest. Both keep a list of waiting items — why does one take from the end and the other from the front, and what does each choice cost?',
    body: [
      'A **stack** hands back the item added most recently: last in, first out (LIFO). Back buttons, undo, and the computer’s own record of which function called which are stacks.',
      'A **queue** hands back the item that has waited longest: first in, first out (FIFO). Printer jobs, customer lines and network packets are queues.',
      'Both can add and remove in constant time — $O(1)$ — if they are built on the right storage. Removing from the front of a `std::vector` is the classic mistake: every remaining element moves, so serving $n$ customers costs about $n^2/2$ moves.',
    ],
  },

  glossary: [
    { term: '**stack** (LIFO)', meaning: 'Add with `push`, look with `top`, remove with `pop` — always at the same end. In C++: `std::stack`.' },
    { term: '**queue** (FIFO)', meaning: 'Add at the back with `push`, look at the `front`, remove from the front with `pop`. In C++: `std::queue`.' },
    { term: '$O(1)$', meaning: 'Constant time: the cost of one operation does not grow with the number of items stored.' },
    { term: '**amortized** $O(1)$', meaning: 'Constant on average over many operations, even if an occasional one is slow (a vector growing its storage).' },
  ],

  priorCheck: [
    item({
      id: 'ds-sq.pre1', competency: 'cpp.functions', difficulty: 1,
      prompt: 'After `std::vector<int> v = {1, 2}; v.push_back(3); v.pop_back();`, what is `v.back()` (the last element)?',
      answer: num(2), compute: () => { const v = [1, 2]; v.push(3); v.pop(); return v[v.length - 1]; }, solution: '`push_back` adds 3, `pop_back` removes it: `v` is {1, 2} and its last element is 2.', remedy: 'cpp-functions-vectors',
    }),
    item({
      id: 'ds-sq.pre2', competency: 'arith.exponents', difficulty: 1,
      prompt: 'What is $1 + 2 + 4 + 8 + 16$? (Compare it with $2 \\times 16$.)',
      answer: num(31), compute: () => 1 + 2 + 4 + 8 + 16, solution: '31, just under $2 \\times 16 = 32$: a doubling sum is less than twice its last term.',
    }),
  ],

  visualization: {
    lab: 'stack-queue',
    intro: 'The same operations go to a stack and a queue. Predict what each one returns at every removal, then step.',
    textAlternative: 'Seven operations — add 1, add 2, add 3, remove, add 4, remove, remove — applied to both containers. The stack gives back 3, then 4, then 2 and ends holding 1; the queue gives back 1, then 2, then 3 and ends holding 4. A table lists both containers after every operation, for three scenarios.',
  },

  derivation: {
    intro: 'Why is pushing onto a `std::vector`-based stack constant time on average, when the vector sometimes has to copy everything into bigger storage?',
    steps: [
      { say: 'A vector keeps spare capacity. When it is full, it allocates storage twice as large and copies its $k$ elements across — an expensive step, but a rare one.' },
      { say: 'Count every copy while pushing $n$ items. The copies happen when the size reaches 1, 2, 4, 8, … up to the largest power of two below $n$:', math: '1 + 2 + 4 + \\cdots + 2^{m} = 2^{m+1} - 1 < 2n' },
      { say: 'So $n$ pushes cost at most $n$ writes plus fewer than $2n$ copies: under $3n$ in total, a constant number per push on average. That is amortized $O(1)$.' },
      { say: 'Removing from the front is different: `v.erase(v.begin())` moves all $k - 1$ remaining elements, every time. Serving $n$ people that way moves $(n-1) + (n-2) + \\cdots + 0 = n(n-1)/2$ elements — $O(n^2)$. A queue avoids it by keeping a moving front index (as `std::deque` does).' },
    ],
    assumptions: [
      'The vector grows by doubling (implementations use a constant factor; the argument works for any factor above 1).',
      'Copying one element costs a constant amount of work.',
    ],
    domain: [
      'Amortized is an average over a sequence: one particular push can still take time proportional to $n$.',
      'Calling `top()`, `front()` or `pop()` on an empty container is undefined behaviour in C++ — check `empty()` first.',
    ],
  },

  examples: [
    {
      title: 'Checking brackets with a stack',
      problem: 'Scan `([{}])` left to right: push each opening bracket, and pop when a closing one arrives. What is the largest number of brackets on the stack at once, and is the string balanced?',
      steps: ['`(`, `[`, `{` are pushed: three on the stack.', '`}` matches the top `{`; then `]` matches `[`, `)` matches `(`.', 'The stack ends empty, so the string is balanced; the deepest point was 3.'],
      answer: 'depth 3; balanced',
      check: { value: 3, compute: () => checkBrackets('([{}])').maxDepth },
    },
    {
      title: 'A queue at a clinic',
      problem: 'Patients arrive at minutes 0, 2, 3 and 10; one doctor sees them in order, 5 minutes each. When does the fourth patient start?',
      steps: ['Patient 1: 0–5. Patient 2 arrives at 2 and starts at 5, ends at 10.', 'Patient 3 arrives at 3, starts at 10, ends at 15.', 'Patient 4 arrives at 10 and starts at 15.'],
      answer: 'minute 15',
      check: { value: 15, compute: () => { let free = 0; let start = 0; for (const a of clinic) { start = Math.max(a, free); free = start + 5; } return start; } },
    },
  ],

  counterexample: {
    title: 'A queue built on the front of a vector',
    body: [
      'Serving customers with `line.erase(line.begin())` works and passes small tests. With 10,000 people in line it moves about 50 million elements: the program slows down as the line grows, exactly when speed matters most.',
      'The behaviour (FIFO) was right; the data structure was wrong. Choose structures by the cost of their operations, not only by what they do.',
    ],
  },

  predict: {
    prompt: 'Push 1, 2 and 3 onto a stack; pop once; push 4; pop twice. What is left on the stack?',
    choices: ['1', '3', '4', '1 and 2'],
    answer: 0,
    reveal: 'After the pushes: 1, 2, 3. Pop removes 3. Push 4: 1, 2, 4. Two pops remove 4 and then 2. Only 1 is left.',
    misconception: {
      belief: 'A pop removes the item that was added first.',
      correction: 'That is a queue. A stack always removes from the end it adds to: the most recent item still present.',
    },
  },

  practice: [
    item({ id: 'ds-sq.p1', competency: 'ds.linear', difficulty: 1, level: 'scaffolded', prompt: 'A queue receives 5, then 7, then 9. After one removal, which number is at the front?', answer: num(7), compute: () => [5, 7, 9].slice(1)[0], hints: ['A queue removes the oldest item first.'], solution: '5 leaves first; 7 is now at the front.' }),
    item({ id: 'ds-sq.p2', competency: 'ds.linear', difficulty: 1, level: 'scaffolded', prompt: 'A stack receives 5, then 7, then 9. After two pops, which number is on top?', answer: num(5), compute: () => Number(stackAfter(['+5', '+7', '+9', '-', '-']).at(-1)), hints: ['Pops remove 9, then 7.'], solution: 'Only 5 is left, so it is on top.' }),
    item({ id: 'ds-sq.p3', competency: 'ds.linear', difficulty: 2, level: 'independent', prompt: 'Checking `{[()()]}` with a stack, what is the largest number of brackets on the stack at one time?', answer: num(3), compute: () => checkBrackets('{[()()]}').maxDepth, hints: ['`{`, `[`, `(` are open together before the first `)`.'], solution: 'Three: `{[(`. After `)`, the second `(` brings it back to three, never more.' }),
    item({
      id: 'ds-sq.p4', competency: 'ds.linear', difficulty: 2, level: 'independent',
      prompt: 'Which string does the bracket check reject?',
      answer: choice(['`(]`', '`()[]`', '`([])`', '`{}`'], 0),
      feedback: { 1: 'Each pair closes before the next opens: balanced.', 2: 'Properly nested: balanced.', 3: 'Balanced.' },
      solution: '`]` arrives while `(` is on top — the wrong kind — so the check fails at once.',
    }),
    item({ id: 'ds-sq.p5', competency: 'ds.complexity', difficulty: 2, level: 'independent', prompt: 'Removing the first element of a vector with $k$ elements moves $k - 1$ of them. Serving all 1,000 people in a line this way, one at a time, moves how many elements in total?', answer: num(499500), compute: () => (999 * 1000) / 2, hints: ['$999 + 998 + \\cdots + 1 + 0$.', 'Use $n(n-1)/2$ with $n = 1000$.'], solution: '$999 \\times 1000 / 2 = 499{,}500$ moves — versus none for a real queue.' }),
    item({
      id: 'ds-sq.p6', competency: 'ds.linear', difficulty: 3, level: 'transfer',
      prompt: 'A text editor keeps an undo stack of actions. You type “a”, “b”, “c” (three separate actions), undo twice, type “d”, then undo once. How many characters are on the screen?',
      answer: num(1), compute: () => stackAfter(['+a', '+b', '+c', '-', '-', '+d', '-']).length, hints: ['Each undo removes the most recent action still on the stack.'],
      solution: '“abc” → undo, undo → “a” → type d → “ad” → undo → “a”. One character.',
    }),
  ],

  apply: {
    scenario: 'A walk-in clinic has one doctor; patients are seen first come, first served, 5 minutes each. This morning they arrive at minutes 0, 2, 3 and 10. The manager asks how long people wait, and whether a different rule would be better.',
    steps: [
      'Simulate the queue by hand (or with the program below).',
      'Find the longest wait.',
      'Judge the alternative rule the manager suggests.',
    ],
    items: [
      item({ id: 'ds-sq.u1', competency: 'ds.linear', difficulty: 2, prompt: 'At what minute does the fourth patient start being seen?', answer: num(15), compute: () => { let free = 0; let start = 0; for (const a of clinic) { start = Math.max(a, free); free = start + 5; } return start; }, hints: ['The doctor is busy until 15 with the first three.'], solution: 'Starts at 5, 10 and 15 for patients 2–4; patient 4 starts at minute 15.' }),
      item({ id: 'ds-sq.u2', competency: 'ds.linear', difficulty: 2, prompt: 'What is the longest wait, in minutes?', answer: num(7), compute: () => longestWait(clinic, 5), hints: ['Patient 3 arrives at 3 and starts at 10.'], solution: 'Waits are 0, 3, 7 and 5 minutes: the longest is 7.' }),
      item({
        id: 'ds-sq.u3', competency: 'ds.linear', difficulty: 3,
        prompt: 'The manager suggests seeing the newest arrival first, “to keep the waiting room moving”. Why is a stack the wrong structure here?',
        answer: choice(['The newest arrival would always go first, so early arrivals could wait indefinitely', 'Stacks cannot store names', 'Stacks are slower than queues', 'A stack would see patients in arrival order anyway'], 0),
        feedback: { 1: 'A stack can store anything a queue can.', 2: 'Both are $O(1)$ per operation; the problem is fairness, not speed.', 3: 'A stack reverses the order.' },
        solution: 'LIFO is unfair to people who arrived first: on a busy day the first patient could wait until the room empties. Real clinics also triage by urgency — a priority queue, a later topic.',
      }),
    ],
    limits: [
      'Real visits vary in length; a fixed 5 minutes is a simplification.',
      'Clinics triage by urgency (a priority queue), and patients sometimes leave without being seen.',
      'The times are illustrative.',
    ],
  },

  checkpoint: [
    item({ id: 'ds-sq.c1', competency: 'ds.linear', difficulty: 1, prompt: 'A stack: push 2, push 8, pop, push 6. What is on top?', answer: num(6), compute: () => Number(stackAfter(['+2', '+8', '-', '+6']).at(-1)), solution: 'Pop removes 8; then 6 is pushed on top of 2.', feedbackCorrect: 'Right.', feedbackIncorrect: 'The pop removes the most recent item; then the new push goes on top.' }),
    item({
      id: 'ds-sq.c2', competency: 'ds.linear', difficulty: 2,
      prompt: 'A queue: add A, B, C; remove one; add D; remove one. Which item is at the front now?',
      answer: choice(['C', 'D', 'B', 'A'], 0),
      feedback: { 1: 'D joined at the back.', 2: 'B left in the second removal.', 3: 'A left first.' },
      solution: 'A leaves, D joins at the back (B, C, D), B leaves: C is at the front.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'Removals take from the front, additions go to the back. Write the queue after each step.',
    }),
    item({
      id: 'ds-sq.c3', competency: 'ds.linear', difficulty: 3,
      prompt: 'In a web server, `main` calls `handle`, which calls `parse`, which calls `readHeader`. When `readHeader` reports an error, how many functions — including `readHeader` — are on the call stack?',
      answer: num(4), compute: () => ['main', 'handle', 'parse', 'readHeader'].length,
      solution: 'Each call pushes a frame and each return pops one: main, handle, parse and readHeader are all waiting. That list, printed newest first, is the “stack trace” in an error message.',
      feedbackCorrect: 'Right — the call stack is a stack.', feedbackIncorrect: 'Each function that has been called and has not yet returned is still on the stack.',
    }),
  ],

  cpp: {
    intro: 'A bracket checker built on `std::stack`: the same idea that compilers use to match parentheses.',
    file: 'brackets.cpp',
    code: `#include <iostream>
#include <stack>
#include <string>

// True when every bracket is closed by the matching kind, in the right order.
bool balanced(const std::string& s) {
    std::stack<char> open;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            open.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (open.empty()) return false;
            char top = open.top();
            open.pop();
            if ((c == ')' && top != '(') || (c == ']' && top != '[') || (c == '}' && top != '{')) return false;
        }
    }
    return open.empty();
}

int main() {
    for (std::string s : {"([]{})", "(]", "((", "a[b(c)d]e"}) {
        std::cout << s << " -> " << (balanced(s) ? "balanced" : "not balanced") << "\\n";
    }
}`,
    output: '([]{}) -> balanced\n(] -> not balanced\n(( -> not balanced\na[b(c)d]e -> balanced',
    explain: 'The `empty()` check before `top()` matters: a closing bracket with nothing open would otherwise read from an empty stack, which is undefined behaviour. The final `open.empty()` rejects brackets left unclosed, like `((`.',
  },

  reading: [
    { title: 'std::stack', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/container/stack', note: 'The container adaptor and the cost of its operations.' },
    { title: 'std::queue', source: 'cppreference.com', url: 'https://en.cppreference.com/w/cpp/container/queue', note: 'FIFO on top of std::deque by default.' },
  ],
};
