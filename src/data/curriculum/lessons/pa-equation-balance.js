import { item, num, choice } from '../lessonKit.js';

export default {
  intuition: {
    question: 'On a balance, two identical bags of rice and a 1 kg weight exactly balance 9 kg of weights. How heavy is one bag — and what are you allowed to do to the scales while you find out?',
    body: [
      'An equation is a level balance: $2x + 1 = 9$ says the two sides weigh the same. Solving it means rearranging the weights until a single $x$ sits alone on one side — **without ever tipping the scales**.',
      'Take 1 kg off both pans: $2x = 8$. Split both pans in half: $x = 4$. Each move undoes something (subtracting undoes adding, dividing undoes multiplying), and each is done to both sides, so the balance stays level the whole time.',
    ],
  },

  glossary: [
    { term: 'equation', meaning: 'A statement that two expressions are equal, such as $2x + 1 = 9$.' },
    { term: 'solution', meaning: 'A value of the variable that makes the statement true. Here $x = 4$.' },
    { term: 'inverse operation', meaning: 'An operation that undoes another: $-$ undoes $+$, $\\div$ undoes $\\times$.' },
    { term: 'equivalent equations', meaning: 'Equations with exactly the same solutions, like $2x + 1 = 9$ and $x = 4$.' },
  ],

  priorCheck: [
    item({
      id: 'pa-eq.pre1', competency: 'arith.order-ops', difficulty: 1,
      prompt: 'Evaluate $2 \\cdot 4 + 1$.',
      answer: num(9), compute: () => 2 * 4 + 1, solution: 'Multiply first: $8 + 1 = 9$.',
    }),
    item({
      id: 'pa-eq.pre2', competency: 'arith.integers', difficulty: 1,
      prompt: 'Compute $-3 + 7$.',
      answer: num(4), compute: () => -3 + 7, solution: 'Start at −3 and move 7 to the right: 4.',
    }),
  ],

  visualization: {
    lab: 'equation-balance',
    intro: 'Solve each example with the fair moves. Then press the unfair move once and look at the table: the old solution no longer works.',
    textAlternative: 'The lab shows the equation on a balance, with boxes for x and circles for units. Buttons apply a move to both sides; a sentence states the equation after each move and whether the balance is level, and the table evaluates both sides at the original solution after every step.',
  },

  derivation: {
    intro: 'Why are “do the same thing to both sides” moves safe, and why is dividing by zero never one of them?',
    steps: [
      { say: 'If $a = b$, then $a$ and $b$ are the same number. Doing the same operation to the same number gives the same result, so for any number $c$:', math: 'a + c = b + c, \\quad a - c = b - c, \\quad ac = bc, \\quad \\frac{a}{c} = \\frac{b}{c}\\ (c \\ne 0)' },
      { say: 'Each of these moves can be undone (subtract $c$ back, divide by $c$ back), so no solution is lost or gained: the new equation is **equivalent** to the old one.' },
      { say: 'Applying two moves to the general equation $ax + b = c$ with $a \\ne 0$ solves it once and for all:', math: 'ax + b = c \\;\\Rightarrow\\; ax = c - b \\;\\Rightarrow\\; x = \\frac{c - b}{a}' },
      { say: 'Multiplying by $0$ is the move that cannot be undone: it turns any equation into $0 = 0$, which every $x$ satisfies. That is why division and multiplication require $c \\ne 0$.' },
    ],
    assumptions: [
      'A move is applied to the whole of each side, not to one term.',
      'Multiplication and division are by non-zero numbers.',
    ],
    domain: [
      'The formula $x = (c - b)/a$ needs $a \\ne 0$. If $a = 0$ the equation reads $b = c$: true for every $x$ when $b = c$, and never true when $b \\ne c$ (no solution).',
    ],
  },

  examples: [
    {
      title: 'Two moves',
      problem: 'Solve $2x + 1 = 9$ and check.',
      steps: ['Subtract 1 from both sides: $2x = 8$.', 'Divide both sides by 2: $x = 4$.', 'Check: $2 \\cdot 4 + 1 = 9$. ✓'],
      answer: '$x = 4$',
      check: { value: 4, compute: () => (9 - 1) / 2 },
    },
    {
      title: 'x on both sides',
      problem: 'Solve $3x + 2 = x + 10$.',
      steps: ['Subtract $x$ from both sides: $2x + 2 = 10$.', 'Subtract 2: $2x = 8$.', 'Divide by 2: $x = 4$. Check: $3 \\cdot 4 + 2 = 14$ and $4 + 10 = 14$. ✓'],
      answer: '$x = 4$',
      check: { value: 4, compute: () => (10 - 2) / (3 - 1) },
    },
  ],

  counterexample: {
    title: 'Moves that look fair but are not',
    body: [
      'Multiplying both sides of $x + 1 = 5$ by $0$ gives $0 = 0$ — true for every $x$. The move destroyed the information that $x = 4$, which is why it is never allowed.',
      'Adding 1 to the left side only turns $2x + 1 = 9$ into $2x + 2 = 9$, whose solution is $3.5$, not $4$. A one-sided move does not rearrange the equation; it replaces it with a different one.',
    ],
  },

  predict: {
    prompt: 'To solve $\\dfrac{x}{4} = 3$, which single move gets $x$ alone?',
    choices: ['Subtract 4 from both sides', 'Divide both sides by 4', 'Multiply both sides by 4', 'Add 4 to both sides'],
    answer: 2,
    reveal: '$x$ is being **divided** by 4, so the inverse operation — multiplying by 4 — undoes it: $x = 12$. Check: $12/4 = 3$. ✓',
    misconception: {
      belief: 'Do the operation you see: there is a ÷4, so divide by 4.',
      correction: 'You undo an operation with its inverse. Dividing again gives $x/16 = 3/4$ — true, but no closer to an answer.',
    },
  },

  practice: [
    item({ id: 'pa-eq.p1', competency: 'arith.equations', difficulty: 1, level: 'scaffolded', prompt: 'Solve $x + 6 = 15$. (Undo “add 6”.)', answer: num(9), compute: () => 15 - 6, hints: ['Subtract 6 from both sides.'], solution: '$x = 15 - 6 = 9$.' }),
    item({ id: 'pa-eq.p2', competency: 'arith.equations', difficulty: 1, level: 'scaffolded', prompt: 'Solve $4x = 28$. (Undo “multiply by 4”.)', answer: num(7), compute: () => 28 / 4, hints: ['Divide both sides by 4.'], solution: '$x = 28/4 = 7$.' }),
    item({ id: 'pa-eq.p3', competency: 'arith.equations', difficulty: 2, level: 'independent', prompt: 'Solve $3x - 5 = 16$.', answer: num(7), compute: () => (16 + 5) / 3, hints: ['Add 5 first, then divide.'], solution: '$3x = 21$, so $x = 7$.' }),
    item({ id: 'pa-eq.p4', competency: 'arith.equations', difficulty: 2, level: 'independent', prompt: 'Solve $5 - 2x = 11$.', answer: num(-3), compute: () => (11 - 5) / -2, hints: ['Subtract 5: $-2x = 6$.', 'Divide by $-2$, sign included.'], solution: '$-2x = 6$, so $x = -3$. Check: $5 - 2(-3) = 11$. ✓' }),
    item({ id: 'pa-eq.p5', competency: 'alg.linear-eq', difficulty: 2, level: 'independent', prompt: 'Solve $4x + 3 = 2x + 15$.', answer: num(6), compute: () => (15 - 3) / (4 - 2), hints: ['Subtract $2x$ from both sides first.'], solution: '$2x + 3 = 15$, $2x = 12$, $x = 6$.' }),
    item({ id: 'pa-eq.p6', competency: 'arith.equations', difficulty: 3, level: 'transfer', prompt: 'A plumber charges a \\$45 call-out fee plus \\$30 per hour. A bill came to \\$150. How many hours did the job take?', answer: num(3.5), compute: () => (150 - 45) / 30, hints: ['Write $45 + 30h = 150$.'], solution: '$30h = 105$, so $h = 3.5$ hours.' }),
    item({
      id: 'pa-eq.p7', competency: 'alg.linear-eq', difficulty: 3, level: 'transfer',
      prompt: 'Which equation has **no** solution?',
      answer: choice(['$2x + 3 = 2x + 5$', '$2x + 3 = 3 + 2x$', '$2x = 0$', '$x + 3 = 5$'], 0),
      feedback: { 1: 'Both sides are the same expression, so EVERY x works — infinitely many solutions.', 2: '$x = 0$ is a solution: zero is a number like any other.' },
      solution: 'Subtracting $2x$ from both sides of the first gives $3 = 5$, which is never true.',
    }),
  ],

  checkpoint: [
    item({ id: 'pa-eq.c1', competency: 'arith.equations', difficulty: 1, prompt: 'Solve $x - 7 = 12$.', answer: num(19), compute: () => 12 + 7, solution: 'Add 7 to both sides: $x = 19$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Undo “subtract 7” by adding 7 to both sides.' }),
    item({ id: 'pa-eq.c2', competency: 'alg.linear-eq', difficulty: 2, prompt: 'Solve $6x + 4 = 2x - 8$.', answer: num(-3), compute: () => (-8 - 4) / (6 - 2), solution: '$4x + 4 = -8$, $4x = -12$, $x = -3$.', feedbackCorrect: 'Right — negatives handled.', feedbackIncorrect: 'Collect x on one side first (subtract $2x$), then the numbers on the other: $4x = -12$.' }),
    item({ id: 'pa-eq.c3', competency: 'arith.equations', difficulty: 3, prompt: 'Concert tickets cost \\$12 each plus a single \\$9 order fee. You paid \\$81 in total. How many tickets did you buy?', answer: num(6), compute: () => (81 - 9) / 12, solution: '$12t + 9 = 81$, $12t = 72$, $t = 6$.', feedbackCorrect: 'Right: the fee is added once, not per ticket.', feedbackIncorrect: 'Write the equation first: $12t + 9 = 81$.' }),
  ],

  python: {
    intro: 'The derivation’s general solution, $x = (c - b)/a$, with the $a = 0$ case handled the way the derivation describes.',
    code: `def solve_linear(a, b, c):
    """Solve a*x + b = c for x."""
    if a == 0:
        return "every x" if b == c else "no solution"
    return (c - b) / a

print(solve_linear(2, 1, 9))
print(solve_linear(-2, 5, 11))
print(solve_linear(0, 3, 5))
x = solve_linear(30, 45, 150)
print(x, 30 * x + 45 == 150)`,
    output: '4.0\n-3.0\nno solution\n3.5 True',
    explain: 'The last line checks the plumber answer by substitution. An exact `==` is safe here only because 3.5 is exactly representable in binary; for computed decimals, compare with a tolerance instead.',
  },

  reading: [
    { title: 'Solve Equations Using the Subtraction and Addition Properties of Equality (§8.1)', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/8-1-solve-equations-using-the-subtraction-and-addition-properties-of-equality', note: 'The same balance idea, with more practice.' },
    { title: 'Solve Equations Using the Division and Multiplication Properties of Equality (§8.2)', source: 'OpenStax, Prealgebra 2e', url: 'https://openstax.org/books/prealgebra-2e/pages/8-2-solve-equations-using-the-division-and-multiplication-properties-of-equality', note: 'Undoing multiplication and division.' },
  ],
};
