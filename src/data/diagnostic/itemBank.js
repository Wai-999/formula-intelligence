import { item, num, choice, multi } from '../curriculum/lessonKit.js';

// The diagnostic item bank (§8; docs/LEARNING_ASSESSMENT_SPEC.md §2).
//
// Versioned: every attempt records BANK_VERSION, so results stay
// interpretable after items change. Difficulty 1–3 is the AUTHOR’S ESTIMATE
// (1 ≈ early in the domain, 3 ≈ ready for the next course). No item has been
// calibrated against learner data, so the engine treats difficulties as
// rough and reports wide uncertainty — and the UI says so.
//
// Blueprint: eight domains; every competency tested has at least two items.

export const BANK_VERSION = 'dx-2026.10-1';

const dx = (domain, fields) => item({ domain, ...fields });

export const DX_ITEMS = [
  // ——— Arithmetic & number sense ———
  dx('arithmetic', { id: 'dx.a1', competency: 'arith.integers', difficulty: 1, prompt: 'Compute $-7 + 12$.', answer: num(5), compute: () => -7 + 12, solution: '$5$.' }),
  dx('arithmetic', { id: 'dx.a2', competency: 'arith.integers', difficulty: 1, prompt: 'Compute $(-3) \\times (-4)$.', answer: num(12), compute: () => -3 * -4, solution: 'Negative times negative is positive: 12.' }),
  dx('arithmetic', { id: 'dx.a3', competency: 'arith.order-ops', difficulty: 1, prompt: 'Compute $3 + 4 \\times 2$.', answer: num(11), compute: () => 3 + 4 * 2, solution: 'Multiply first: $3 + 8 = 11$.' }),
  dx('arithmetic', { id: 'dx.a4', competency: 'arith.order-ops', difficulty: 2, prompt: 'Compute $20 - 2 \\times (3 + 4)$.', answer: num(6), compute: () => 20 - 2 * 7, solution: 'Brackets, then multiply: $20 - 14 = 6$.' }),
  dx('arithmetic', { id: 'dx.a5', competency: 'arith.fractions', difficulty: 2, prompt: 'Compute $\\tfrac{2}{3} + \\tfrac{1}{4}$. (A fraction like 11/12 or a decimal to three places.)', answer: num(11 / 12, 0.0006), compute: () => 2 / 3 + 1 / 4, solution: '$\\tfrac{8}{12} + \\tfrac{3}{12} = \\tfrac{11}{12}$.' }),
  dx('arithmetic', { id: 'dx.a6', competency: 'arith.fractions', difficulty: 3, prompt: 'What is 15% of 240?', answer: num(36), compute: () => 0.15 * 240, solution: '$0.15 \\times 240 = 36$.' }),
  dx('arithmetic', { id: 'dx.a7', competency: 'arith.ratios', difficulty: 2, prompt: 'Four pens cost \\$6. At the same price, what do ten pens cost, in dollars?', answer: num(15), compute: () => (6 / 4) * 10, solution: '\\$1.50 each, so \\$15.' }),
  dx('arithmetic', { id: 'dx.a8', competency: 'arith.ratios', difficulty: 3, prompt: 'On a 1 : 50,000 map, two points are 3 cm apart. How far apart are they in reality, in km?', answer: num(1.5), compute: () => (3 * 50000) / 100000, solution: '$3 \\times 50{,}000 = 150{,}000$ cm $= 1.5$ km.' }),
  dx('arithmetic', { id: 'dx.a9', competency: 'arith.equations', difficulty: 1, prompt: 'Solve $\\dfrac{x}{4} = 6$.', answer: num(24), compute: () => 24, solution: 'Multiply both sides by 4: $x = 24$.' }),
  dx('arithmetic', { id: 'dx.a10', competency: 'arith.equations', difficulty: 3, prompt: 'Solve $3x - 7 = 11$.', answer: num(6), compute: () => (11 + 7) / 3, solution: '$3x = 18$, $x = 6$.' }),

  // ——— Algebra ———
  dx('algebra', { id: 'dx.b1', competency: 'alg.linear-eq', difficulty: 1, prompt: 'Solve $5x + 2 = 3x + 10$.', answer: num(4), compute: () => 8 / 2, solution: '$2x = 8$, $x = 4$.' }),
  dx('algebra', { id: 'dx.b2', competency: 'alg.linear-eq', difficulty: 2, prompt: 'Solve $2(x - 3) = 10$.', answer: num(8), compute: () => 10 / 2 + 3, solution: '$x - 3 = 5$, $x = 8$.' }),
  dx('algebra', { id: 'dx.b3', competency: 'alg.slope', difficulty: 1, prompt: 'Find the slope of the line through $(1, 2)$ and $(3, 8)$.', answer: num(3), compute: () => 6 / 2, solution: '$6/2 = 3$.' }),
  dx('algebra', { id: 'dx.b4', competency: 'alg.slope', difficulty: 2, prompt: 'What is the slope of $y = 7 - 3x$?', answer: num(-3), compute: () => -3, solution: 'The coefficient of x: $-3$.' }),
  dx('algebra', { id: 'dx.b5', competency: 'alg.slope-intercept', difficulty: 1, prompt: 'What is the y-intercept of $y = 4x - 9$?', answer: num(-9), compute: () => -9, solution: '$-9$.' }),
  dx('algebra', { id: 'dx.b6', competency: 'alg.slope-intercept', difficulty: 2, prompt: 'A line has slope $-2$ and passes through $(1, 5)$. What is its y-intercept?', answer: num(7), compute: () => 5 - -2 * 1, solution: '$b = 5 - (-2)(1) = 7$.' }),
  dx('algebra', { id: 'dx.b7', competency: 'alg.systems', difficulty: 2, prompt: 'Solve $x + y = 10$ and $x - y = 4$. What is $x$?', answer: num(7), compute: () => 14 / 2, solution: 'Add the equations: $2x = 14$.' }),
  dx('algebra', { id: 'dx.b8', competency: 'alg.systems', difficulty: 3, prompt: 'Solve $2x + 3y = 12$ and $x - y = 1$. What is $y$?', answer: num(2), compute: () => 10 / 5, solution: '$x = y + 1$, so $2y + 2 + 3y = 12$, $y = 2$.' }),
  dx('algebra', { id: 'dx.b9', competency: 'alg.quadratics', difficulty: 3, prompt: 'Solve $x^2 - 5x + 6 = 0$. Enter the larger root.', answer: num(3), compute: () => (5 + 1) / 2, solution: '$(x - 2)(x - 3) = 0$: roots 2 and 3.' }),
  dx('algebra', { id: 'dx.b10', competency: 'alg.quadratics', difficulty: 3, prompt: 'Solve $x^2 + 2x - 15 = 0$. Enter the positive root.', answer: num(3), compute: () => (-2 + 8) / 2, solution: '$(x + 5)(x - 3) = 0$: roots $-5$ and 3.' }),
  dx('algebra', { id: 'dx.b11', competency: 'alg.exp-log', difficulty: 3, prompt: 'Solve $2^x = 32$.', answer: num(5), compute: () => Math.log2(32), solution: '$32 = 2^5$.' }),
  dx('algebra', { id: 'dx.b12', competency: 'alg.exp-log', difficulty: 3, prompt: 'What is $\\log_{10} 1000$?', answer: num(3), compute: () => Math.log10(1000), solution: '$10^3 = 1000$.' }),

  // ——— Functions ———
  dx('functions', { id: 'dx.f1', competency: 'func.notation', difficulty: 1, prompt: 'If $f(x) = 2x^2 - 1$, what is $f(3)$?', answer: num(17), compute: () => 2 * 9 - 1, solution: '$2 \\cdot 9 - 1 = 17$.' }),
  dx('functions', { id: 'dx.f2', competency: 'func.notation', difficulty: 1, prompt: 'If $f(x) = 3x - 4$, what is $f(-2)$?', answer: num(-10), compute: () => -6 - 4, solution: '$-6 - 4 = -10$.' }),
  dx('functions', { id: 'dx.f3', competency: 'func.transform', difficulty: 2, prompt: 'The graph of $y = (x - 2)^2$ is the graph of $y = x^2$…', answer: choice(['shifted right 2', 'shifted left 2', 'shifted up 2', 'shifted down 2'], 0), solution: 'Replacing x by x − 2 moves the graph right by 2.' }),
  dx('functions', { id: 'dx.f4', competency: 'func.transform', difficulty: 3, prompt: 'The graph of $y = -f(x)$ is the graph of $y = f(x)$…', answer: choice(['reflected in the x-axis', 'reflected in the y-axis', 'shifted down 1', 'unchanged'], 0), solution: 'Every y-value changes sign: a reflection in the x-axis.' }),
  dx('functions', { id: 'dx.f5', competency: 'func.compose-inverse', difficulty: 2, prompt: 'If $f(x) = x + 3$ and $g(x) = 2x$, what is $f(g(4))$?', answer: num(11), compute: () => 2 * 4 + 3, solution: '$g(4) = 8$, $f(8) = 11$.' }),
  dx('functions', { id: 'dx.f6', competency: 'func.compose-inverse', difficulty: 3, prompt: 'If $f(x) = \\dfrac{x - 1}{2}$, what is $f^{-1}(5)$?', answer: num(11), compute: () => 2 * 5 + 1, solution: '$f^{-1}(y) = 2y + 1$, so 11.' }),

  // ——— Trigonometry & precalculus ———
  dx('trig', { id: 'dx.t1', competency: 'trig.unit-circle', difficulty: 1, prompt: 'How many radians is 180°? (Three decimals.)', answer: num(Math.PI, 0.0006), compute: () => Math.PI, solution: '$\\pi \\approx 3.142$.' }),
  dx('trig', { id: 'dx.t2', competency: 'trig.unit-circle', difficulty: 2, prompt: 'What is $\\cos 60°$?', answer: num(0.5), compute: () => Math.cos(Math.PI / 3), solution: '$\\tfrac12$.' }),
  dx('trig', { id: 'dx.t3', competency: 'trig.vectors-plane', difficulty: 1, prompt: 'How long is the vector $(6, 8)$?', answer: num(10), compute: () => Math.hypot(6, 8), solution: '$\\sqrt{36 + 64} = 10$.' }),
  dx('trig', { id: 'dx.t4', competency: 'trig.vectors-plane', difficulty: 2, prompt: 'How far is it from $(1, 1)$ to $(4, 5)$?', answer: num(5), compute: () => Math.hypot(3, 4), solution: '$\\sqrt{9 + 16} = 5$.' }),
  dx('trig', { id: 'dx.t5', competency: 'trig.identities', difficulty: 3, prompt: 'If $\\sin\\theta = 0.6$ and $\\theta$ is acute, what is $\\cos\\theta$?', answer: num(0.8), compute: () => Math.sqrt(1 - 0.36), solution: '$\\sqrt{1 - 0.36} = 0.8$.' }),
  dx('trig', { id: 'dx.t6', competency: 'trig.identities', difficulty: 3, prompt: 'What is $\\tan 45°$?', answer: num(1), compute: () => Math.tan(Math.PI / 4), solution: '$\\sin 45° / \\cos 45° = 1$.' }),

  // ——— Vectors & matrices ———
  dx('linalg', { id: 'dx.l1', competency: 'la.vector-ops', difficulty: 1, prompt: 'Compute $(2, 3) + (4, -1)$.', answer: multi([6, 2], ['first component', 'second component']), solution: '$(6, 2)$.' }),
  dx('linalg', { id: 'dx.l2', competency: 'la.vector-ops', difficulty: 1, prompt: 'Compute $3 \\cdot (2, -1)$.', answer: multi([6, -3], ['first component', 'second component']), solution: '$(6, -3)$.' }),
  dx('linalg', { id: 'dx.l3', competency: 'la.dot-product', difficulty: 2, prompt: 'Compute $(1, 2, 3)\\cdot(4, 0, -1)$.', answer: num(1), compute: () => 4 + 0 - 3, solution: '$4 + 0 - 3 = 1$.' }),
  dx('linalg', { id: 'dx.l4', competency: 'la.dot-product', difficulty: 2, prompt: 'Are $(2, 3)$ and $(3, -2)$ perpendicular?', answer: choice(['Yes', 'No'], 0), solution: 'Their dot product is $6 - 6 = 0$.' }),
  dx('linalg', { id: 'dx.l5', competency: 'la.matrix-mult', difficulty: 2, prompt: 'Compute $\\begin{bmatrix}1 & 2\\\\ 0 & 1\\end{bmatrix}\\begin{bmatrix}3\\\\ 1\\end{bmatrix}$.', answer: multi([5, 1], ['first entry', 'second entry']), solution: '$(3 + 2, 1) = (5, 1)$.' }),
  dx('linalg', { id: 'dx.l6', competency: 'la.matrix-mult', difficulty: 3, prompt: 'Compute $\\det\\begin{bmatrix}2 & 1\\\\ 3 & 4\\end{bmatrix}$.', answer: num(5), compute: () => 8 - 3, solution: '$8 - 3 = 5$.' }),
  dx('linalg', { id: 'dx.l7', competency: 'la.elimination', difficulty: 3, prompt: 'How many solutions does $x + y = 2$, $2x + 2y = 5$ have?', answer: choice(['None', 'Exactly one', 'Infinitely many', 'Two'], 0), solution: 'Twice the first equation gives $2x + 2y = 4 \\ne 5$: inconsistent.' }),
  dx('linalg', { id: 'dx.l8', competency: 'la.elimination', difficulty: 3, prompt: 'Solve $x + y + z = 6$, $y + z = 5$, $z = 3$. What is $x$?', answer: num(1), compute: () => 6 - 5, solution: '$y = 2$, then $x = 6 - 2 - 3 = 1$.' }),

  // ——— Calculus readiness ———
  dx('calculus', { id: 'dx.c1', competency: 'calc.limits', difficulty: 1, prompt: 'What does $\\dfrac{x^2 - 4}{x - 2}$ approach as $x \\to 2$?', answer: num(4), compute: () => 2 + 2, solution: 'It equals $x + 2$ for $x \\ne 2$: the limit is 4.' }),
  dx('calculus', { id: 'dx.c2', competency: 'calc.limits', difficulty: 2, prompt: 'What does $\\dfrac{3x + 1}{x}$ approach as $x \\to \\infty$?', answer: num(3), compute: () => 3, solution: '$3 + 1/x \\to 3$.' }),
  dx('calculus', { id: 'dx.c3', competency: 'calc.derivative', difficulty: 2, prompt: 'What is the average rate of change of $x^2$ from $x = 1$ to $x = 3$?', answer: num(4), compute: () => (9 - 1) / 2, solution: '$(9 - 1)/2 = 4$.' }),
  dx('calculus', { id: 'dx.c4', competency: 'calc.derivative', difficulty: 3, prompt: 'What is the slope of the tangent to $y = x^2$ at $x = 5$?', answer: num(10), compute: () => 2 * 5, solution: 'The derivative $2x$ at 5: 10.' }),
  dx('calculus', { id: 'dx.c5', competency: 'calc.integral', difficulty: 3, prompt: 'What is the area under $y = 2x$ from $x = 0$ to $x = 3$?', answer: num(9), compute: () => 0.5 * 3 * 6, solution: 'A triangle: $\\tfrac12 \\cdot 3 \\cdot 6 = 9$.' }),
  dx('calculus', { id: 'dx.c6', competency: 'calc.integral', difficulty: 3, prompt: 'Compute $\\int_0^2 x^2\\,dx$. (Three decimals.)', answer: num(8 / 3, 0.0006), compute: () => 8 / 3, solution: '$\\tfrac{x^3}{3}\\Big|_0^2 = \\tfrac83$.' }),

  // ——— Statistics & probability ———
  dx('statistics', { id: 'dx.s1', competency: 'stats.descriptive', difficulty: 1, prompt: 'What is the mean of 4, 8, 6 and 2?', answer: num(5), compute: () => 20 / 4, solution: '$20/4 = 5$.' }),
  dx('statistics', { id: 'dx.s2', competency: 'stats.descriptive', difficulty: 2, prompt: 'What is the median of 3, 9, 1, 7, 5?', answer: num(5), compute: () => 5, solution: 'Sorted: 1, 3, 5, 7, 9 — the middle value is 5.' }),
  dx('statistics', { id: 'dx.s3', competency: 'stats.probability', difficulty: 1, prompt: 'Two fair coins are tossed. What is the probability of two heads?', answer: num(0.25), compute: () => 0.5 * 0.5, solution: '$\\tfrac12 \\cdot \\tfrac12 = \\tfrac14$.' }),
  dx('statistics', { id: 'dx.s4', competency: 'stats.probability', difficulty: 2, prompt: 'Two fair dice are rolled. What is the probability of at least one six? (Three decimals.)', answer: num(11 / 36, 0.0006), compute: () => 1 - (5 / 6) ** 2, solution: '$1 - (5/6)^2 = 11/36 \\approx 0.306$.' }),
  dx('statistics', { id: 'dx.s5', competency: 'stats.sampling', difficulty: 2, prompt: 'A population has standard deviation 12. What is the standard error of the mean for samples of 36?', answer: num(2), compute: () => 12 / 6, solution: '$12/\\sqrt{36} = 2$.' }),
  dx('statistics', { id: 'dx.s6', competency: 'stats.sampling', difficulty: 3, prompt: 'By what factor must the sample size grow to halve the standard error?', answer: num(4), compute: () => 4, solution: 'SE ∝ $1/\\sqrt n$: four times the data halves it.' }),
  dx('statistics', { id: 'dx.s7', competency: 'stats.bayes', difficulty: 3, prompt: 'A condition affects 1% of people. A test detects 90% of cases and gives false positives for 10% of others. If you test positive, what is the probability you have it? (Three decimals.)', answer: num(0.009 / 0.108, 0.0006), compute: () => 0.009 / (0.009 + 0.1 * 0.99), solution: '$0.009/(0.009 + 0.099) \\approx 0.083$.' }),
  dx('statistics', { id: 'dx.s8', competency: 'stats.bayes', difficulty: 3, prompt: 'Prior 0.5; a test has sensitivity 0.8 and false-positive rate 0.2. After a positive result, what is the probability?', answer: num(0.8), compute: () => 0.4 / (0.4 + 0.1), solution: '$0.4/(0.4 + 0.1) = 0.8$.' }),

  // ——— Python ———
  dx('python', { id: 'dx.p1', competency: 'py.basics', difficulty: 1, prompt: 'What does this print? `x = 3; x = x + 2; print(x * 2)`', answer: num(10), compute: () => (3 + 2) * 2, solution: 'x becomes 5; 5 × 2 = 10.' }),
  dx('python', { id: 'dx.p2', competency: 'py.basics', difficulty: 2, prompt: 'What does `print(7 // 2, 7 % 2)` print?', answer: choice(['3 1', '3.5 1', '3 0', '4 1'], 0), solution: '`//` is floor division (3) and `%` the remainder (1).' }),
  dx('python', { id: 'dx.p3', competency: 'py.collections', difficulty: 2, prompt: 'What does this print? `xs = [4, 1, 3]; xs.append(2); print(len(xs), xs[0])`', answer: choice(['4 4', '3 4', '4 1', '4 2'], 0), solution: 'Four items now; index 0 is still 4.' }),
  dx('python', { id: 'dx.p4', competency: 'py.collections', difficulty: 2, prompt: 'What does this print? `d = {"a": 1}; d["b"] = 2; print(sum(d.values()))`', answer: num(3), compute: () => 3, solution: 'Values 1 and 2 sum to 3.' }),
  dx('python', { id: 'dx.p5', competency: 'py.debugging', difficulty: 2, prompt: 'Which error does `int("3.5")` raise?', answer: choice(['ValueError', 'TypeError', 'NameError', 'SyntaxError'], 0), solution: 'The string is the right type but not a valid integer literal: ValueError.' }),
  dx('python', { id: 'dx.p6', competency: 'py.debugging', difficulty: 3, prompt: 'A loop `for i in range(len(xs)): total = total + xs[i+1]` crashes. Why?', answer: choice(['On the last pass, i + 1 is past the end of the list (IndexError)', 'range cannot take len(xs)', 'total is a string', 'Lists cannot be indexed'], 0), solution: 'When i is the last index, xs[i + 1] does not exist.' }),
  dx('python', { id: 'dx.p7', competency: 'py.numpy', difficulty: 3, prompt: 'What is `np.array([1, 2, 3]) * np.array([4, 5, 6])`?', answer: choice(['array([ 4, 10, 18])', '32', 'array([5, 7, 9])', 'an error'], 0), solution: 'Arithmetic on arrays is elementwise.' }),
  dx('python', { id: 'dx.p8', competency: 'py.numpy', difficulty: 3, prompt: 'What is `np.zeros((2, 3)).shape`?', answer: choice(['(2, 3)', '(3, 2)', '6', '(6,)'], 0), solution: 'Two rows, three columns.' }),
];

export const dxItemById = Object.fromEntries(DX_ITEMS.map((i) => [i.id, i]));
