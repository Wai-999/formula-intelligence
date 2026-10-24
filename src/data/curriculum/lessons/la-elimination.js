import { item, num, choice, multi } from '../lessonKit.js';

export default {
  intuition: {
    question: 'Three unknown masses $x, y, z$ (kg) are weighed in combinations: all three together weigh 6; $2x + 3y + z$ weighs 11; and with $y$ moved to the other pan, $x - y + 2z$ balances 5. Can a fixed procedure untangle any such set of equations — and tell you when it cannot?',
    body: [
      '**Gaussian elimination** does it. Use the first equation to remove $x$ from the others, the new second equation to remove $y$ from the third, and the last equation now has one unknown. Then work back up (**back substitution**).',
      'It is the algorithm behind every linear solver — fitting regressions, simulating circuits, rendering graphics — and the same steps reveal when a system has no solution or infinitely many.',
    ],
  },

  glossary: [
    { term: 'augmented matrix $[A \\mid \\mathbf b]$', meaning: 'The coefficients and right-hand sides, one row per equation.' },
    { term: '$R_i \\leftarrow R_i - k R_j$', meaning: 'Replace row $i$ by itself minus $k$ times row $j$.' },
    { term: 'pivot', meaning: 'The first non-zero entry of a row once the matrix is in echelon form; used to clear the entries below it.' },
    { term: 'echelon form', meaning: 'Each row’s pivot is to the right of the pivot above it; zero rows at the bottom.' },
    { term: 'free variable', meaning: 'An unknown with no pivot in its column: it can take any value.' },
  ],

  priorCheck: [
    item({ id: 'la-elim.pre1', competency: 'alg.linear-eq', difficulty: 1, prompt: 'Solve $2x + 2 = 10$.', answer: num(4), compute: () => (10 - 2) / 2, solution: '$2x = 8$, $x = 4$.', remedy: 'pa-equation-balance' }),
    item({ id: 'la-elim.pre2', competency: 'alg.systems', difficulty: 2, prompt: 'Solve $x + y = 5$ and $x - y = 1$. What is $x$?', answer: num(3), compute: () => (5 + 1) / 2, solution: 'Adding the equations: $2x = 6$, so $x = 3$ (and $y = 2$).' }),
  ],

  visualization: {
    lab: 'gaussian-elimination',
    intro: 'Solve “One solution” yourself with the row operation and “Suggest k”. Then let “Next step for me” solve “Needs a swap”, and read what the lab says about the last two.',
    textAlternative: 'The lab shows the augmented matrix with pivots marked. Controls choose rows i and j and a multiplier k for the replace and swap operations; a history lists every move. A sentence states each equation and what the matrix currently implies, and the table gives the matrix.',
  },

  derivation: {
    intro: 'Why do row operations never change the answer, and why does the procedure always finish?',
    steps: [
      { say: 'If $(x, y, z)$ satisfies equations $R_i$ and $R_j$, it satisfies $R_i - kR_j$ (subtract equal quantities from equal quantities). So no solution is lost.' },
      { say: 'The move is undone by $R_i \\leftarrow R_i + kR_j$, so no solution is gained either. Swapping two rows, or scaling a row by $c \\ne 0$, is reversible too. The new system has **exactly** the same solutions.' },
      { say: 'Choosing $k = \\dfrac{\\text{entry to clear}}{\\text{pivot}}$ makes that entry zero. Clearing column by column below each pivot leaves an upper-triangular system:', math: '\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 2 & 3 & 1 & 11 \\\\ 1 & -1 & 2 & 5 \\end{array}\\right] \\to \\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & 1 & -1 & -1 \\\\ 0 & 0 & -1 & -3 \\end{array}\\right]' },
      { say: 'Read from the bottom: $-z = -3$ gives $z = 3$; then $y - z = -1$ gives $y = 2$; then $x + y + z = 6$ gives $x = 1$. For $n$ equations this takes roughly $n^3/3$ multiplications — why a million-variable system needs special methods.' },
    ],
    assumptions: ['The equations are linear in the unknowns.', 'Exact arithmetic is assumed above; computers use floating point and swap rows to keep pivots large (partial pivoting).'],
    domain: ['A zero where a pivot should be: swap in a lower row with a non-zero entry. If the whole column below is zero, that variable is free.', 'A row $[0\\ 0\\ 0 \\mid c]$ with $c \\ne 0$ means $0 = c$: the system has no solution.'],
  },

  examples: [
    {
      title: 'The three masses',
      problem: 'Solve $x + y + z = 6$, $2x + 3y + z = 11$, $x - y + 2z = 5$.',
      steps: ['$R_2 \\leftarrow R_2 - 2R_1$: $(0, 1, -1 \\mid -1)$. $R_3 \\leftarrow R_3 - R_1$: $(0, -2, 1 \\mid -1)$.', '$R_3 \\leftarrow R_3 + 2R_2$: $(0, 0, -1 \\mid -3)$.', 'Back substitution: $z = 3$, $y = -1 + 3 = 2$, $x = 6 - 2 - 3 = 1$. Check in the original third equation: $1 - 2 + 6 = 5$. ✓'],
      answer: '$(x, y, z) = (1, 2, 3)$ kg.',
      check: { value: 1, compute: () => 6 - 2 - 3 },
    },
    {
      title: 'When there is no solution',
      problem: 'Solve $x + y + z = 6$, $2x + 2y + 2z = 10$, $x - y = 0$.',
      steps: ['$R_2 \\leftarrow R_2 - 2R_1$ gives $(0, 0, 0 \\mid -2)$.', 'That row says $0 = -2$.'],
      answer: 'No solution: the first two equations contradict each other (twice the first would be 12, not 10).',
      check: { value: -2, compute: () => 10 - 2 * 6 },
    },
  ],

  counterexample: {
    title: 'A correct procedure that gives a wrong answer',
    body: [
      'Solve $10^{-20}x + y = 1$ and $x + y = 2$ by eliminating with the tiny pivot $10^{-20}$, in ordinary double-precision arithmetic. The multiplier is $10^{20}$; $1 - 10^{20}$ and $2 - 10^{20}$ both round to $-10^{20}$, so $y = 1$ and then $x = (1 - y)/10^{-20} = 0$.',
      'The true solution is $x \\approx 1$, $y \\approx 1$. Swapping the rows first (using the larger pivot) gives the right answer. Exact algebra and finite-precision computing are different worlds; the Python section shows both.',
    ],
  },

  predict: {
    prompt: 'Elimination on a system of 3 equations in 3 unknowns ends with two pivots and a last row of all zeros, $[0\\ 0\\ 0 \\mid 0]$. How many solutions are there?',
    choices: ['Exactly one', 'None', 'Infinitely many', 'Exactly two'],
    answer: 2,
    reveal: 'The zero row says $0 = 0$ — true, but no new information. Two pivots for three unknowns leave one free variable, and each value of it gives a solution. Try “Infinitely many” in the lab.',
    misconception: {
      belief: 'A row of zeros means the system has no solution.',
      correction: 'Only $[0\\ 0\\ 0 \\mid c]$ with $c \\ne 0$ is a contradiction. A row that is entirely zero is an equation that was redundant — it repeated information from the others.',
    },
  },

  practice: [
    item({ id: 'la-elim.p1', competency: 'la.elimination', difficulty: 1, level: 'scaffolded', prompt: 'With $R_1 = [1\\ 1 \\mid 4]$ and $R_2 = [2\\ 5 \\mid 11]$, the operation $R_2 \\leftarrow R_2 - 2R_1$ gives $[0\\ 3 \\mid ?]$. What is the right-hand side?', answer: num(3), compute: () => 11 - 2 * 4, hints: ['$11 - 2 \\cdot 4$.'], solution: '$11 - 8 = 3$.' }),
    item({ id: 'la-elim.p2', competency: 'la.elimination', difficulty: 1, level: 'scaffolded', prompt: 'Back substitution: $z = 2$ and $y + z = 5$. What is $y$?', answer: num(3), compute: () => 5 - 2, solution: '$y = 5 - 2 = 3$.' }),
    item({ id: 'la-elim.p3', competency: 'la.elimination', difficulty: 2, level: 'independent', prompt: 'Solve $x + 2y = 8$ and $3x - y = 3$ by elimination. What is $x$?', answer: num(2), compute: () => 8 - 2 * 3, hints: ['$R_2 \\leftarrow R_2 - 3R_1$ gives $-7y = -21$.'], solution: '$y = 3$, then $x = 8 - 6 = 2$.' }),
    item({ id: 'la-elim.p4', competency: 'la.elimination', difficulty: 2, level: 'independent', prompt: 'Solve the triangular system $x + y + z = 4$, $y + 2z = 5$, $3z = 6$.', answer: multi([1, 1, 2], ['x', 'y', 'z']), solution: '$z = 2$, $y = 5 - 4 = 1$, $x = 4 - 1 - 2 = 1$.' }),
    item({ id: 'la-elim.p5', competency: 'la.elimination', difficulty: 2, level: 'independent', prompt: 'Elimination produces the row $[0\\ 0\\ 0 \\mid 7]$. The system has…', answer: choice(['one solution', 'no solution', 'infinitely many solutions', 'the solution x = 7'], 1), feedback: { 2: 'Infinitely many needs a zero row with a zero on the right too.', 3: 'The row has no x in it at all — it says 0 = 7.' }, solution: 'It says $0 = 7$: inconsistent.' }),
    item({ id: 'la-elim.p6', competency: 'la.elimination', difficulty: 3, level: 'transfer', prompt: 'A 10 kg coffee blend mixes arabica at \\$12/kg and robusta at \\$8/kg and costs \\$108 in total. How many kg of arabica are in it?', answer: num(7), compute: () => (108 - 8 * 10) / (12 - 8), hints: ['$a + r = 10$ and $12a + 8r = 108$.'], solution: 'Eliminate: $12a + 8(10 - a) = 108 \\Rightarrow 4a = 28 \\Rightarrow a = 7$ kg.' }),
    item({ id: 'la-elim.p7', competency: 'la.elimination', difficulty: 3, level: 'transfer', prompt: 'Elimination on 3 equations in 3 unknowns leaves two pivots and a final row $[0\\ 0\\ 0 \\mid 0]$. How many free variables are there?', answer: num(1), compute: () => 3 - 2, solution: 'Unknowns minus pivots: $3 - 2 = 1$.' }),
  ],

  checkpoint: [
    item({ id: 'la-elim.c1', competency: 'la.elimination', difficulty: 1, prompt: 'With $R_1 = [1\\ 2\\ 0 \\mid 5]$ and $R_3 = [3\\ 4\\ 1 \\mid 18]$, what is the right-hand side of $R_3 - 3R_1$?', answer: num(3), compute: () => 18 - 15, solution: '$18 - 3 \\cdot 5 = 3$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Apply the same operation to the right-hand side: $18 - 3 \\times 5$.' }),
    item({ id: 'la-elim.c2', competency: 'la.elimination', difficulty: 2, prompt: 'Solve $x + y = 7$ and $x - y = 1$.', answer: multi([4, 3], ['x', 'y']), solution: '$R_2 - R_1$: $-2y = -6$, so $y = 3$ and $x = 4$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Eliminate x by subtracting the equations.' }),
    item({ id: 'la-elim.c3', competency: 'la.elimination', difficulty: 3, prompt: 'Why do numerical solvers swap rows to put the largest available entry in the pivot position?', answer: choice(['To make the answer exact', 'To avoid dividing by tiny pivots, which magnify rounding errors', 'Because it is required to find free variables', 'To use fewer operations'], 1), solution: 'Partial pivoting keeps multipliers at most 1 in size, so rounding errors are not amplified (see the non-example).', feedbackCorrect: 'Right.', feedbackIncorrect: 'Recall the $10^{-20}$ non-example.' }),
  ],

  python: {
    intro: '`np.linalg.solve` performs elimination with partial pivoting. The second half re-creates the non-example by hand, without swapping rows.',
    code: `import numpy as np

A = np.array([[1.0, 1.0, 1.0], [2.0, 3.0, 1.0], [1.0, -1.0, 2.0]])
b = np.array([6.0, 11.0, 5.0])
print(np.round(np.linalg.solve(A, b), 10))

eps = 1e-20                  # elimination WITHOUT a row swap
m = 1 / eps
y = (2 - m * 1) / (1 - m * 1)
x = (1 - y) / eps
print(x, y)
print(np.linalg.solve(np.array([[eps, 1.0], [1.0, 1.0]]), np.array([1.0, 2.0])))`,
    output: '[1. 2. 3.]\n0.0 1.0\n[1. 1.]',
    explain: 'Without the swap, x comes out as 0.0 instead of about 1. With pivoting, NumPy gets it right.',
  },

  reading: [
    { title: 'Solving Systems with Gaussian Elimination (§7.6)', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/7-6-solving-systems-with-gaussian-elimination', note: 'Row operations and back substitution with many examples.' },
    { title: 'Lecture 2: Elimination with matrices', source: 'MIT OpenCourseWare 18.06, Gilbert Strang', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-2-elimination-with-matrices/', note: 'Elimination as multiplication by elimination matrices.' },
  ],
};
