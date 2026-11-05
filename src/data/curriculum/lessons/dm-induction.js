import { item, num, choice } from '../lessonKit.js';
import { oddSum, triangleSum } from '../../../features/labs/logic.js';

// V5 Computer Science track: Ohlone CS-113 preparation (mathematical
// induction). Induction is also the proof behind loop invariants and
// recursive functions. The savings plan is illustrative.

export default {
  intuition: {
    question: 'A loop adds up the first $n$ odd numbers. For $n$ = 1, 2, 3, 4 it returns 1, 4, 9, 16 — perfect squares. Will it return a perfect square for $n$ = 1,000,000? Checking examples, however many, cannot answer a question about every $n$. Induction can.',
    body: [
      'An induction proof has two parts. The **base case** shows the statement is true for the first value, say $n = 1$. The **inductive step** shows that whenever it is true for some $k$, it is also true for $k + 1$.',
      'Together they reach every $n$: true for 1; true for 1, so true for 2; true for 2, so true for 3; and so on, with no gaps. The step must work for an arbitrary $k$, not just the ones you tried.',
      'You have used induction already: a **loop invariant** is exactly this argument — true before the loop (base case), preserved by each pass (step), so true when the loop ends.',
    ],
  },

  glossary: [
    { term: '$P(n)$', meaning: 'The statement being proved, for the number $n$ — for example “$1 + 3 + \\cdots + (2n-1) = n^2$”.' },
    { term: '**base case**', meaning: 'A direct check that $P$ holds at the starting value, usually $P(1)$ or $P(0)$.' },
    { term: '**inductive hypothesis**', meaning: 'The assumption, inside the step, that $P(k)$ is true for one arbitrary $k$ at or past the base case.' },
    { term: '**inductive step**', meaning: 'A proof that $P(k)$ implies $P(k+1)$, for every such $k$.' },
  ],

  priorCheck: [
    item({
      id: 'dm-ind.pre1', competency: 'alg.quadratics', difficulty: 1,
      prompt: 'Which is the expansion of $(k + 1)^2$?',
      answer: choice(['$k^2 + 2k + 1$', '$k^2 + 1$', '$k^2 + k + 1$', '$2k + 1$'], 0),
      feedback: { 1: 'The middle term $2k$ is missing: $(k+1)(k+1) = k^2 + k + k + 1$.', 2: 'There are two $k$ terms, not one.', 3: 'That is $(k+1)^2 - k^2$, the difference.' },
      solution: '$(k + 1)(k + 1) = k^2 + 2k + 1$.',
    }),
    item({
      id: 'dm-ind.pre2', competency: 'arith.integers', difficulty: 1,
      prompt: 'What is $1 + 3 + 5 + 7$?',
      answer: num(16), compute: () => oddSum(4), solution: '16, which is $4^2$.',
    }),
  ],

  visualization: {
    lab: 'induction',
    intro: 'Choose a case $k$ (assumed true, in purple). The next term is the blue layer; together they form case $k + 1$. Then switch to Gauss’s sum.',
    textAlternative: 'For the odd numbers, case k is a k-by-k square of unit squares; the next odd number, 2k + 1, is an L-shaped layer that turns it into a (k+1)-by-(k+1) square. For Gauss’s sum, case k is a staircase of columns 1 to k, and the next term is a column of k + 1. The table lists, for n from 1 to 10, the term added, the sum and the formula — they agree in every row.',
  },

  derivation: {
    intro: 'A complete proof that $1 + 3 + 5 + \\cdots + (2n - 1) = n^2$ for every whole number $n \\ge 1$.',
    steps: [
      { say: 'Let $P(n)$ be the statement $1 + 3 + \\cdots + (2n-1) = n^2$.' },
      { say: 'Base case: for $n = 1$ the left side is just 1, and the right side is $1^2 = 1$. So $P(1)$ is true.' },
      { say: 'Inductive step: assume $P(k)$ for some $k \\ge 1$. The sum for $k + 1$ is the sum for $k$ plus the next odd number, $2k + 1$:', math: '\\underbrace{1 + 3 + \\cdots + (2k - 1)}_{=\\,k^2 \\text{ by } P(k)} + (2k + 1) = k^2 + 2k + 1 = (k + 1)^2' },
      { say: 'That is exactly $P(k + 1)$. With the base case, $P(1)$ gives $P(2)$, which gives $P(3)$, and so on: $P(n)$ holds for every $n \\ge 1$. The lab’s picture is this step: an L-shaped layer of $2k + 1$ squares grows a $k \\times k$ square into a $(k+1) \\times (k+1)$ one.' },
    ],
    assumptions: [
      '$n$ ranges over the whole numbers from the base case upward; the base case fixes where the chain starts.',
    ],
    domain: [
      'The step must hold for every $k$ from the base case on. A step that fails for one $k$ breaks the chain there.',
      'A true step with no true base case proves nothing: “the sum is $n^2 + 1$” passes the step ($k^2 + 1 + 2k + 1 = (k+1)^2 + 1$) but fails at $n = 1$.',
    ],
  },

  examples: [
    {
      title: 'Gauss’s sum',
      problem: 'Prove $1 + 2 + \\cdots + n = \\dfrac{n(n+1)}{2}$ by induction, and use it for $n = 100$.',
      steps: ['Base case: $n = 1$ gives $1 = \\tfrac{1 \\cdot 2}{2}$.', 'Step: $\\dfrac{k(k+1)}{2} + (k + 1) = \\dfrac{(k+1)(k+2)}{2}$, which is the formula for $k + 1$.', 'For $n = 100$: $\\tfrac{100 \\cdot 101}{2} = 5050$.'],
      answer: '5050',
      check: { value: 5050, compute: () => Array.from({ length: 100 }, (_, i) => i + 1).reduce((a, b) => a + b, 0) },
    },
    {
      title: 'Powers of two outgrow $n$',
      problem: 'Prove $2^n > n$ for every $n \\ge 1$, and check it at $n = 10$.',
      steps: ['Base case: $2^1 = 2 > 1$.', 'Step: if $2^k > k$, then $2^{k+1} = 2 \\cdot 2^k > 2k \\ge k + 1$, because $k \\ge 1$.', 'At $n = 10$: $2^{10} = 1024 > 10$.'],
      answer: '$2^{10} = 1024$',
      check: { value: 1024, compute: () => 2 ** 10 },
    },
  ],

  counterexample: {
    title: 'Forty checks, then failure',
    body: [
      'Euler noticed that $n^2 + n + 41$ is prime for every $n$ from 0 to 39 — forty cases in a row. At $n = 40$ it is $1681 = 41^2$, not prime.',
      'No number of examples proves “for every $n$”. A proof needs an argument that works for an arbitrary $n$ — which is what the inductive step supplies.',
    ],
  },

  predict: {
    prompt: 'You prove “if $P(k)$ then $P(k + 1)$” for every $k \\ge 1$, but never check any base case. What have you shown?',
    choices: ['Nothing yet about any particular $n$', '$P(n)$ for all $n \\ge 1$', '$P(1)$ only', '$P(n)$ for all $n \\ge 2$'],
    answer: 0,
    reveal: 'The step only says each case passes truth on to the next. Without a first true case, nothing is passed on — “the sum is $n^2 + 1$” has a perfect step and is false everywhere.',
    misconception: {
      belief: 'The inductive step is the whole proof; the base case is a formality.',
      correction: 'The base case starts the chain. A correct step attached to a false (or missing) base case proves nothing.',
    },
  },

  practice: [
    item({ id: 'dm-ind.p1', competency: 'dm.proof', difficulty: 1, level: 'scaffolded', prompt: 'Using $1 + 3 + \\cdots + (2n - 1) = n^2$, what is the sum of the first 12 odd numbers?', answer: num(144), compute: () => oddSum(12), hints: ['$n = 12$.'], solution: '$12^2 = 144$.' }),
    item({
      id: 'dm-ind.p2', competency: 'dm.proof', difficulty: 1, level: 'scaffolded',
      prompt: 'In the inductive step for the odd-number sum, what is added to $k^2$ to reach $(k + 1)^2$?',
      answer: choice(['$2k + 1$', '$2k - 1$', '$k + 1$', '$2k$'], 0),
      feedback: { 1: 'That is the last odd number of case $k$, already in the sum.', 2: '$k^2 + k + 1$ is not $(k+1)^2$.', 3: 'One short: $(k+1)^2 - k^2 = 2k + 1$.' },
      solution: '$(k+1)^2 - k^2 = 2k + 1$: the next odd number.',
    }),
    item({ id: 'dm-ind.p3', competency: 'dm.proof', difficulty: 2, level: 'independent', prompt: 'Using $1 + 2 + \\cdots + n = n(n + 1)/2$, what is $1 + 2 + \\cdots + 60$?', answer: num(1830), compute: () => triangleSum(60), hints: ['$60 \\times 61 / 2$.'], solution: '$60 \\cdot 61 / 2 = 1830$.' }),
    item({ id: 'dm-ind.p4', competency: 'dm.proof', difficulty: 2, level: 'independent', prompt: 'Using the same formula, what is $21 + 22 + \\cdots + 40$?', answer: num(610), compute: () => triangleSum(40) - triangleSum(20), hints: ['Take the sum up to 40 and subtract the sum up to 20.'], solution: '$820 - 210 = 610$.' }),
    item({
      id: 'dm-ind.p5', competency: 'dm.proof', difficulty: 2, level: 'independent',
      prompt: 'To prove “every postage of 8 cents or more can be made with 3- and 5-cent stamps”, the step adds one 3-cent stamp (from $n$ to $n + 3$). Which base cases are needed?',
      answer: choice(['8, 9 and 10', '8 only', '0', '3 and 5'], 0),
      feedback: { 1: 'From 8 the step reaches 11, 14, … but never 9 or 10.', 2: 'The claim starts at 8.', 3: 'The claim starts at 8, and 4 or 7 cannot be made at all.' },
      solution: 'A step of +3 needs three consecutive starting points so every later amount is reached: 8 = 3 + 5, 9 = 3 + 3 + 3, 10 = 5 + 5.',
    }),
    item({
      id: 'dm-ind.p6', competency: 'dm.proof', difficulty: 3, level: 'transfer',
      prompt: 'In a knockout tournament every game eliminates exactly one team, until one champion is left. How many games are played with 64 teams? (Induction on the number of teams gives the general rule.)',
      answer: num(63), compute: () => 64 - 1, hints: ['Every team except the champion loses exactly once.'],
      solution: 'Each game removes one team and $n - 1$ teams must be removed: 63 games. Induction: one team needs 0 games; adding a team adds one game.',
    }),
  ],

  apply: {
    scenario: 'A savings plan: deposit \\$10 in week 1, \\$20 in week 2, \\$30 in week 3, and so on, \\$10 more each week. A friend claims the total after $n$ weeks is $5n(n + 1)$ dollars and plans a year around it.',
    steps: [
      'Check the base case.',
      'Prove the step.',
      'Use the formula — and say what it does not promise.',
    ],
    items: [
      item({ id: 'dm-ind.u1', competency: 'dm.proof', difficulty: 2, prompt: 'Base case: what total does the formula give after week 1? (It should match the \\$10 deposited.)', answer: num(10), compute: () => 5 * 1 * 2, hints: ['Put $n = 1$ into $5n(n + 1)$.'], solution: '$5 \\cdot 1 \\cdot 2 = 10$. The base case holds.' }),
      item({
        id: 'dm-ind.u2', competency: 'dm.proof', difficulty: 3,
        prompt: 'Step: assume the total after $k$ weeks is $5k(k + 1)$. Week $k + 1$ adds $10(k + 1)$. Which expression is the new total?',
        answer: choice(['$5(k + 1)(k + 2)$', '$5k(k + 1) + 10$', '$5(k + 1)^2$', '$10(k + 1)(k + 2)$'], 0),
        feedback: { 1: 'The deposit in week $k + 1$ is $10(k + 1)$, not 10.', 2: 'Factor carefully: $5(k+1)(k + 2)$.', 3: 'Twice too large.' },
        solution: '$5k(k+1) + 10(k+1) = 5(k+1)(k + 2)$, which is the formula with $n = k + 1$.',
      }),
      item({ id: 'dm-ind.u3', competency: 'dm.proof', difficulty: 2, prompt: 'How much will be saved after 52 weeks?', answer: num(13780), compute: () => Array.from({ length: 52 }, (_, i) => 10 * (i + 1)).reduce((a, b) => a + b, 0), hints: ['$5 \\cdot 52 \\cdot 53$.'], solution: '$5 \\cdot 52 \\cdot 53 = \\$13{,}780$.' }),
      item({
        id: 'dm-ind.u4', competency: 'dm.proof', difficulty: 3,
        prompt: 'What does the proof NOT guarantee?',
        answer: choice(['That you can afford the larger deposits late in the year', 'The total after week 30', 'That the formula holds for every week', 'That week 1 matches'], 0),
        feedback: { 1: 'The formula gives week 30 exactly.', 2: 'That is precisely what was proved.', 3: 'That is the base case.' },
        solution: 'The proof is about arithmetic. Week 52 alone asks for \\$520 — whether that fits a budget is a different question.',
      }),
    ],
    limits: [
      'The proof covers the arithmetic, not behaviour: the last deposits are large.',
      'No interest is included; a real account would add a little.',
      'The plan is illustrative.',
    ],
  },

  checkpoint: [
    item({ id: 'dm-ind.c1', competency: 'dm.proof', difficulty: 1, prompt: 'What is $1 + 3 + 5 + \\cdots + 19$ (the first ten odd numbers)?', answer: num(100), compute: () => oddSum(10), solution: '$10^2 = 100$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Count the odd numbers from 1 to 19 — that is $n$ — then use $n^2$.' }),
    item({
      id: 'dm-ind.c2', competency: 'dm.proof', difficulty: 2,
      prompt: 'Inside the inductive step, what may you assume?',
      answer: choice(['That $P(k)$ is true for one arbitrary $k$ at or past the base case', 'That $P(n)$ is true for all $n$', 'That $P(k + 1)$ is true', 'Nothing at all'], 0),
      feedback: { 1: 'That is what you are proving — assuming it is circular.', 2: 'That is the goal of the step.', 3: 'The step is an implication: you assume its “if” part.' },
      solution: 'Assume $P(k)$ (the inductive hypothesis) and derive $P(k + 1)$.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'The step proves “if $P(k)$ then $P(k+1)$”: which part is assumed?',
    }),
    item({
      id: 'dm-ind.c3', competency: 'dm.proof', difficulty: 3,
      prompt: 'For `int f(int n) { return n == 0 ? 1 : 2 * f(n - 1); }`, induction on $n$ shows `f(n)` $= 2^n$ (base: `f(0)` = 1; step: `f(k+1)` $= 2 \\cdot 2^k$). What is `f(10)`?',
      answer: num(1024), compute: () => 2 ** 10,
      solution: '$2^{10} = 1024$. Recursive functions are proved correct by induction on their input.',
      feedbackCorrect: 'Right — recursion and induction are the same idea.', feedbackIncorrect: 'Use the proved formula $f(n) = 2^n$ with $n = 10$.',
    }),
  ],

  python: {
    intro: 'A thousand checks of the odd-number formula — evidence, not proof — and the polynomial that fooled forty checks.',
    code: `def odd_sum(n):
    return sum(2 * i - 1 for i in range(1, n + 1))

print(all(odd_sum(n) == n * n for n in range(1, 1001)))

def is_prime(m):
    if m < 2:
        return False
    d = 2
    while d * d <= m:
        if m % d == 0:
            return False
        d += 1
    return True

first_fail = next(n for n in range(100) if not is_prime(n * n + n + 41))
print(first_fail, first_fail ** 2 + first_fail + 41)`,
    output: 'True\n40 1681',
    explain: 'The first line is a thousand confirmations, still not a proof — the induction argument covers every $n$. The second finds where Euler’s polynomial first fails: $n = 40$, giving $1681 = 41^2$.',
  },

  reading: [
    { title: 'Mathematics for Computer Science, chapter 5: Induction', source: 'MIT OpenCourseWare (6.042J, Spring 2015)', url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/', note: 'Ordinary and strong induction, with many worked proofs.' },
  ],
};
