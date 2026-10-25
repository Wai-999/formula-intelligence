import { item, num, choice } from '../lessonKit.js';

// V5 vertical slice, step 1 of 3 (Algebra II → Precalculus → Calculus I).
// Composition is the idea the chain rule differentiates; inverses undo a
// chain in reverse order. Prices, rates and fees are illustrative.

const checkout = (p) => 0.92 * (1.08 * (p + 6)) + 1.5;

export default {
  intuition: {
    question: 'A store applies a \\$10 coupon and a 20% sale to a \\$100 jacket. Does it matter which comes first — and if the receipt shows only the final price, can you work back to the original?',
    body: [
      'Each step is a function: the coupon is $c(p) = p - 10$ and the sale is $s(p) = 0.8p$. Doing one and then the other is a **composite function**. Coupon first gives $s(c(100)) = s(90) = 72$; sale first gives $c(s(100)) = c(80) = 70$.',
      'So order matters: $s(c(p)) = 0.8(p - 10) = 0.8p - 8$, while $c(s(p)) = 0.8p - 10$. When the sale comes second it also takes 20% off the coupon, which is then worth only \\$8.',
      'Working backwards undoes each step in reverse order. A \\$70 receipt from the sale-first checkout came from $(70 + 10)/0.8 = 100$. In calculus, the chain rule finds the rate of change of a composite one link at a time — this lesson is its foundation.',
    ],
  },

  glossary: [
    { term: '$(f \\circ g)(x)$', meaning: 'The **composite** “$f$ after $g$”: apply $g$ to $x$ first, then apply $f$ to the result, $f(g(x))$.' },
    { term: 'inner, outer', meaning: 'In $f(g(x))$ the **inner** function $g$ acts first; its output is the input of the **outer** function $f$.' },
    { term: '$f^{-1}$', meaning: 'The **inverse** of $f$: the function that undoes it, so $f^{-1}(f(x)) = x$. It is not $1/f(x)$.' },
    { term: 'domain', meaning: 'The inputs a function accepts. $f(g(x))$ needs every value $g(x)$ to be an allowed input of $f$.' },
  ],

  priorCheck: [
    item({
      id: 'a2-comp.pre1', competency: 'func.notation', difficulty: 1,
      prompt: 'If $f(x) = 3x - 2$, what is $f(4)$?',
      answer: num(10), compute: () => 3 * 4 - 2, solution: 'Replace $x$ by 4: $3 \\cdot 4 - 2 = 10$.',
    }),
    item({
      id: 'a2-comp.pre2', competency: 'arith.equations', difficulty: 1,
      prompt: 'Solve $5y + 3 = 23$ for $y$.',
      answer: num(4), compute: () => (23 - 3) / 5, solution: 'Subtract 3, then divide by 5: $y = 20/5 = 4$.', remedy: 'pa-equation-balance',
    }),
  ],

  visualization: {
    lab: 'composition-chain',
    intro: 'Pick a chain of two functions and move the input. The inner output becomes the outer input; the top plot is the whole chain. (The slopes are for the chain-rule lesson — for now, follow the values.)',
    textAlternative: 'Three plots: the inner function, the outer function, and the composite. A sentence gives the input, the inner value it produces, and the composite value; the table lists the inner value and the slopes for five inputs. The same lab returns in the chain-rule lesson.',
  },

  derivation: {
    intro: 'Why does undoing a composite reverse the order of the steps?',
    steps: [
      { say: 'A composite applies $g$ first, then $f$:', math: 'y = (f \\circ g)(x) = f\\big(g(x)\\big)' },
      { say: 'The step done last must be undone first. Apply $f^{-1}$ to both sides:', math: 'f^{-1}(y) = g(x)' },
      { say: 'Then undo $g$:', math: 'x = g^{-1}\\big(f^{-1}(y)\\big) \\quad\\Longrightarrow\\quad (f \\circ g)^{-1} = g^{-1} \\circ f^{-1}' },
      { say: 'Like socks and shoes: what goes on last comes off first. For the sale-first checkout, $c^{-1}(y) = y + 10$ and $s^{-1}(y) = y/0.8$, so a receipt $y$ came from $s^{-1}(c^{-1}(y)) = (y + 10)/0.8$.' },
    ],
    assumptions: [
      'Each function is one-to-one on the inputs used, so it has an inverse there.',
      'Every output of the inner function is an allowed input of the outer one.',
    ],
    domain: [
      '$f \\circ g$ is defined only where $g(x)$ lies in the domain of $f$: for $f(u) = \\sqrt{u}$ and $g(x) = x - 3$, only $x \\ge 3$.',
      'A function that is not one-to-one, such as $x^2$ on all real numbers, has an inverse only after its domain is restricted (for example to $x \\ge 0$).',
    ],
  },

  examples: [
    {
      title: 'Building a composite',
      problem: 'Let $f(x) = x^2$ and $g(x) = 3x + 1$. Find $f(g(2))$, $g(f(2))$ and a formula for $f(g(x))$.',
      steps: ['$g(2) = 7$, so $f(g(2)) = 7^2 = 49$.', '$f(2) = 4$, so $g(f(2)) = 3 \\cdot 4 + 1 = 13$ — a different number: order matters.', '$f(g(x)) = (3x + 1)^2 = 9x^2 + 6x + 1$.'],
      answer: '$f(g(2)) = 49$ and $g(f(2)) = 13$',
      check: { value: 49, compute: () => (3 * 2 + 1) ** 2 },
    },
    {
      title: 'Inverting a conversion',
      problem: 'Fahrenheit from Celsius is $F(C) = 1.8C + 32$. Find the inverse and convert $77^\\circ$F to Celsius.',
      steps: ['Write $y = 1.8C + 32$ and solve for $C$: $C = (y - 32)/1.8$.', 'So $F^{-1}(y) = (y - 32)/1.8$: undo “add 32” first, then undo “multiply by 1.8”.', '$F^{-1}(77) = 45/1.8 = 25$. Check: $F(25) = 45 + 32 = 77$.'],
      answer: '$25^\\circ$C',
      check: { value: 25, compute: () => (77 - 32) / 1.8, tolerance: 1e-9 },
    },
  ],

  counterexample: {
    title: 'An inverse is not a reciprocal — and not every function has one',
    body: [
      'For $f(x) = 2x + 6$ the inverse is $f^{-1}(y) = (y - 6)/2$, so $f^{-1}(10) = 2$. But $1/f(10) = 1/26$. The superscript $-1$ means “undo”, not “one over”.',
      '$f(x) = x^2$ has no inverse on all real numbers: $f(3) = f(-3) = 9$, so from 9 you cannot tell which input you started with. Restricted to $x \\ge 0$, its inverse is $\\sqrt{y}$.',
    ],
  },

  predict: {
    prompt: 'A store takes 20% off and then applies a \\$10 coupon — or applies the coupon first and then takes 20% off. For a \\$100 jacket, which order gives the lower price?',
    choices: ['Coupon first, then 20% off', 'Sale first, then the coupon', 'Both give the same price', 'It depends on the sales tax'],
    answer: 1,
    reveal: 'Sale first: $0.8 \\cdot 100 - 10 = 70$. Coupon first: $0.8(100 - 10) = 72$. Taking 20% off after the coupon also takes 20% off the coupon.',
    misconception: {
      belief: 'Order cannot matter: the same two discounts are applied either way.',
      correction: 'Composites usually depend on order: $f(g(x))$ and $g(f(x))$ are different functions. A percentage step scales everything that came before it, including a coupon.',
    },
  },

  practice: [
    item({ id: 'a2-comp.p1', competency: 'func.compose-inverse', difficulty: 1, level: 'scaffolded', prompt: 'Let $f(x) = 2x + 1$ and $g(x) = x - 4$. First find $g(10)$, then apply $f$ to it: what is $f(g(10))$?', answer: num(13), compute: () => 2 * (10 - 4) + 1, hints: ['$g(10) = 6$.', 'Now $f(6) = 2 \\cdot 6 + 1$.'], solution: '$g(10) = 6$ and $f(6) = 13$.' }),
    item({ id: 'a2-comp.p2', competency: 'func.compose-inverse', difficulty: 1, level: 'scaffolded', prompt: '$f(x) = 2x + 1$ means “double, then add 1”. Its inverse is “subtract 1, then halve”. What is $f^{-1}(15)$?', answer: num(7), compute: () => (15 - 1) / 2, hints: ['$15 - 1 = 14$.'], solution: '$(15 - 1)/2 = 7$. Check: $f(7) = 15$.' }),
    item({ id: 'a2-comp.p3', competency: 'func.compose-inverse', difficulty: 2, level: 'independent', prompt: 'Let $f(x) = x^2 + 1$ and $g(x) = 2x - 3$. Find $g(f(3))$.', answer: num(17), compute: () => 2 * (3 ** 2 + 1) - 3, hints: ['Inner first: here the inner function is $f$.'], solution: '$f(3) = 10$, then $g(10) = 17$.' }),
    item({ id: 'a2-comp.p4', competency: 'func.compose-inverse', difficulty: 2, level: 'independent', prompt: 'With the same $f(x) = x^2 + 1$ and $g(x) = 2x - 3$, find $f(g(3))$.', answer: num(10), compute: () => (2 * 3 - 3) ** 2 + 1, hints: ['Now $g$ acts first.'], solution: '$g(3) = 3$, then $f(3) = 10$ — not 17: the order changed the answer.' }),
    item({ id: 'a2-comp.p5', competency: 'func.compose-inverse', difficulty: 2, level: 'independent', prompt: 'Find the inverse of $h(x) = 4x - 7$ and evaluate $h^{-1}(9)$.', answer: num(4), compute: () => (9 + 7) / 4, hints: ['Undo “subtract 7” first, then undo “multiply by 4”.'], solution: '$h^{-1}(y) = (y + 7)/4$, so $h^{-1}(9) = 4$. Check: $h(4) = 9$.' }),
    item({
      id: 'a2-comp.p6', competency: 'func.compose-inverse', difficulty: 3, level: 'transfer',
      prompt: 'A baking site converts cups of flour to grams with $g(c) = 120c$, and a kitchen scale shows ounces with $o(m) = m / 28.35$ for $m$ grams. How many ounces is 2.5 cups of flour, $o(g(2.5))$? Give one decimal place.',
      answer: num(10.6, 0.05), compute: () => (120 * 2.5) / 28.35, hints: ['Grams first: $g(2.5) = 300$.'], solution: '$g(2.5) = 300$ g, and $o(300) = 300/28.35 \\approx 10.6$ oz.',
    }),
  ],

  apply: {
    scenario: 'You order a \\$80 jacket from a US shop and pay in euros. The checkout adds \\$6 shipping, then 8% sales tax on the total, and your card converts at 0.92 euros per dollar plus a flat €1.50 fee: $e(t(s(p)))$ with $s(p) = p + 6$, $t(x) = 1.08x$, $e(d) = 0.92d + 1.50$.',
    steps: [
      'Run the chain forwards to find what you pay.',
      'Undo it in reverse order to find the most you can spend from a budget.',
      'Check how the order of the steps changes the bill.',
    ],
    items: [
      item({ id: 'a2-comp.u1', competency: 'func.compose-inverse', difficulty: 3, prompt: 'What do you pay in euros for the \\$80 jacket? Give the answer to the cent.', answer: num(86.95, 0.005), compute: () => checkout(80), hints: ['$s(80) = 86$, then $t(86) = 92.88$.'], solution: '$86 \\to 92.88 \\to 0.92 \\cdot 92.88 + 1.50 = 86.9496$, about €86.95.' }),
      item({ id: 'a2-comp.u2', competency: 'func.compose-inverse', difficulty: 3, prompt: 'Your budget is €100. Undo the chain in reverse order: what is the most expensive jacket (price before shipping) you can afford, to the cent?', answer: num(93.13, 0.005), compute: () => (100 - 1.5) / 0.92 / 1.08 - 6, hints: ['Undo the card first: $(100 - 1.50)/0.92$.', 'Then undo the tax (divide by 1.08), then the shipping (subtract 6).'], solution: '$(100 - 1.5)/0.92 \\approx 107.07$; $/1.08 \\approx 99.13$; $-6 \\approx 93.13$. So up to about \\$93.13.' }),
      item({
        id: 'a2-comp.u3', competency: 'func.compose-inverse', difficulty: 3,
        prompt: 'The shop changes its checkout so that shipping is added **after** tax (shipping is not taxed). For the \\$80 jacket, what happens to your euro total?',
        answer: choice(['It goes down — the \\$6 is no longer taxed', 'It goes up', 'It does not change — the same steps are applied', 'You cannot tell without a new exchange rate'], 0),
        feedback: { 1: 'Compute both: €86.51 now, against €86.95 before.', 2: 'The steps are the same but in a different order — and the tax scales whatever comes before it.', 3: 'The rate is the same either way; only whether the \\$6 is taxed changes.' },
        solution: '$t(80) = 86.40$, plus \\$6 is \\$92.40, and $0.92 \\cdot 92.40 + 1.50 = 86.508$: about €86.51, 44 cents less.',
      }),
    ],
    limits: [
      'Exchange rates and card fees change daily; 0.92 and €1.50 are illustrative, not quotes.',
      'Real checkouts round at each step, which can move the total by a cent.',
      'Some cards charge a percentage instead of a flat fee — a different function, with a different inverse.',
    ],
  },

  checkpoint: [
    item({ id: 'a2-comp.c1', competency: 'func.compose-inverse', difficulty: 1, prompt: 'Let $f(x) = 5x$ and $g(x) = x + 2$. What is $f(g(1))$?', answer: num(15), compute: () => 5 * (1 + 2), solution: '$g(1) = 3$, then $f(3) = 15$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Work from the inside out: find $g(1)$ first, then feed it to $f$.' }),
    item({ id: 'a2-comp.c2', competency: 'func.compose-inverse', difficulty: 2, prompt: 'Find $k^{-1}(20)$ for $k(x) = 3x - 4$.', answer: num(8), compute: () => (20 + 4) / 3, solution: '$k^{-1}(y) = (y + 4)/3$, so $k^{-1}(20) = 8$. Check: $k(8) = 20$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Undo the steps in reverse: add 4 first, then divide by 3.' }),
    item({
      id: 'a2-comp.c3', competency: 'func.compose-inverse', difficulty: 2,
      prompt: 'For $f(u) = \\sqrt{u}$ and $g(x) = 10 - x$, for which inputs $x$ is $f(g(x))$ defined (as a real number)?',
      answer: choice(['$x \\le 10$', '$x \\ge 10$', '$x \\ge 0$', 'All real numbers'], 0),
      feedback: { 1: 'For $x = 12$, $g(12) = -2$ and $\\sqrt{-2}$ is not real.', 2: 'For $x = 12 \\ge 0$, the square root receives $-2$.', 3: 'The square root needs $10 - x \\ge 0$.' },
      solution: 'The outer function needs $g(x) = 10 - x \\ge 0$, so $x \\le 10$.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'The inner output must be an allowed input of the outer function.',
    }),
    item({
      id: 'a2-comp.c4', competency: 'func.compose-inverse', difficulty: 3,
      prompt: 'A thermostat app converts a set point in °C to °F with $F(C) = 1.8C + 32$ and then subtracts a 2 °F “eco offset”. A user wants the screen to read 68 °F. Which set point in °C should they choose? Give one decimal place.',
      answer: num(21.1, 0.05), compute: () => (68 + 2 - 32) / 1.8,
      solution: 'Undo the last step first: $68 + 2 = 70$ °F. Then undo the conversion: $(70 - 32)/1.8 \\approx 21.1$ °C.',
      feedbackCorrect: 'Right — the offset is undone in °F, before converting back.', feedbackIncorrect: 'The offset was the last step, so undo it first (add 2 °F), then convert back to °C.',
    }),
  ],

  python: {
    intro: 'The jacket checkout as a chain of functions, run in both orders, then undone.',
    code: `def coupon(p):
    return p - 10

def sale(p):
    return 0.8 * p

def compose(f, g):
    return lambda x: f(g(x))

coupon_first = compose(sale, coupon)
sale_first = compose(coupon, sale)
print("coupon first:", round(coupon_first(100), 2))
print("sale first:", round(sale_first(100), 2))

def undo_sale_first(y):
    return (y + 10) / 0.8

print("receipt 70 came from:", round(undo_sale_first(70), 2))
print("check:", round(sale_first(undo_sale_first(70)), 2))`,
    output: 'coupon first: 72.0\nsale first: 70.0\nreceipt 70 came from: 100.0\ncheck: 70.0',
    explain: '`compose(f, g)` returns a new function that runs `g` and then `f`. The two orders differ by \\$2, and the undo function — the inverse, steps reversed — takes the receipt back to the original price.',
  },

  reading: [
    { title: '3.4 Composition of Functions', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/3-4-composition-of-functions', note: 'Composites, their domains, and decomposing a function into a chain.' },
    { title: '3.7 Inverse Functions', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/3-7-inverse-functions', note: 'Finding inverses, restricting domains, and the graph of an inverse.' },
  ],
};
