import { item, num, choice } from '../lessonKit.js';

// Phase 5 of the 80/20 upgrade (docs/learning-8020/PHASE5_PREREQUISITES.md):
// the derivative rules the chain rule lesson (c1-chain-rule) used to state
// without teaching. Built on the limit definition (c1-derivative). Written to
// the professor contract from the start. All models are illustrative.

const cost = (q) => 20000 + 80 * q + 0.01 * q ** 2; // dollars per month, q panels
const marginal = (q) => 80 + 0.02 * q;

export default {
  intuition: {
    question: 'A café charges \\$4.00 a cup and raises the price by 10 cents a month, while sales of 300 cups a day fall by 5 cups a month. Is daily revenue rising or falling, and by how much each month?',
    body: [
      'Revenue is a **product**, price × cups, and both factors are changing. Over a month the extra 10 cents on each of 300 cups adds about \\$30 a day; the 5 lost cups, at \\$4 each, take away \\$20.',
      'So revenue rises by about \\$10 a day each month. That is the **product rule**: $(pq)\' = p\'q + pq\'$ — each factor’s rate, times the other factor as it stands now.',
      'Multiplying the two rates, $0.10 \\times (-5) = -0.5$, is the tempting shortcut, and it answers nothing: the derivative of a product is not the product of the derivatives. The **power rule** $\\frac{d}{dx} x^n = n x^{n-1}$ and the **quotient rule** come from the same kind of reasoning, and with them you can differentiate any polynomial or fraction of polynomials without taking a limit every time.',
    ],
    simpler: [
      'Picture revenue as the area of a rectangle: price across, cups up. If the width grows a little and the height shrinks a little, the area changes by a strip along each side — (change in width) × height, plus width × (change in height).',
      'There is also a tiny corner where both changes overlap. It shrinks much faster than the strips, so in the rate it disappears. Each change times the other side, added together; never the two changes multiplied.',
    ],
  },

  outcomes: [
    'Differentiate any polynomial term by term with the power rule, $\\frac{d}{dx} x^n = n x^{n-1}$.',
    "Differentiate a product with $(fg)' = f'g + fg'$ and a quotient with $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$.",
    'Check a derivative by expanding, with a difference quotient or with units, and use its sign to say whether a quantity is rising or falling.',
  ],

  glossary: [
    { term: '$\\dfrac{d}{dx} x^n = n x^{n-1}$', say: 'd by d x of x to the n equals n x to the n minus one', meaning: '**Power rule**: bring the exponent down as a factor, then lower the exponent by one. It holds for every real $n$ (for $x > 0$ when $n$ is not a whole number).' },
    { term: "$(cf)' = c\\,f'$ and $(f + g)' = f' + g'$", say: 'c f, prime, equals c f prime; f plus g, prime, equals f prime plus g prime', meaning: 'Constant multiples and sums: differentiate term by term. A constant on its own has derivative 0.' },
    { term: "$(fg)' = f'g + fg'$", say: 'f g, prime, equals f prime g plus f g prime', meaning: '**Product rule**: each factor’s rate times the other factor.' },
    { term: "$\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f'g - fg'}{g^2}$", say: 'f over g, prime, equals f prime g minus f g prime, all over g squared', meaning: '**Quotient rule**, wherever $g \\ne 0$. The order in the numerator matters: the top’s rate comes first.' },
  ],

  priorCheck: [
    item({
      id: 'c1-rules.pre1', competency: 'calc.derivative', difficulty: 1,
      prompt: 'From the definition, the derivative of $x^2$ is $2x$. What is the slope of $y = x^2$ at $x = 3$?',
      answer: num(6), compute: () => 2 * 3, solution: '$2 \\cdot 3 = 6$.', remedy: 'c1-derivative',
    }),
    item({
      id: 'c1-rules.pre2', competency: 'calc.derivative', difficulty: 1,
      prompt: 'For $f(x) = x^2$, what is the difference quotient $\\dfrac{f(3 + h) - f(3)}{h}$ when $h = 0.1$?',
      answer: num(6.1), compute: () => (3.1 ** 2 - 3 ** 2) / 0.1, solution: '$\\dfrac{9.61 - 9}{0.1} = 6.1$ — close to the slope 6, and closer still as $h$ shrinks.', remedy: 'c1-derivative',
    }),
  ],

  visualization: {
    lab: 'slope',
    config: { mode: 'secant' },
    intro: 'Choose $x^3 - 2x$. Before moving anything, use the rules to predict its tangent slope $3a^2 - 2$ at $a = 1$, $a = 0$ and $a = 2$. Then set each $a$, shrink $h$, and watch the secant slope settle on your prediction — no limit needed on paper.',
    textAlternative: 'A plot of the chosen function with the secant line through $(a, f(a))$ and $(a + h, f(a + h))$ and, where it exists, the tangent at $a$. A sentence gives the secant slope, the tangent slope and the gap between them, which shrinks as $h$ approaches 0. For $x^3 - 2x$ the rules predict a tangent slope of $3a^2 - 2$: 1 at $a = 1$, $-2$ at $a = 0$ and 10 at $a = 2$.',
  },

  derivation: {
    intro: 'Where do the rules come from? Each is the limit definition, worked out once so you never have to repeat it.',
    steps: [
      { say: 'Power rule, for a whole number $n$. Expand $(x + h)^n$: the first two terms are $x^n$ and $n x^{n-1} h$, and every other term contains $h^2$ or a higher power of $h$:', math: '(x + h)^n = x^n + n x^{n-1} h + h^2 \\cdot (\\text{terms in } x \\text{ and } h)' },
      { say: 'Subtract $x^n$, divide by $h$, and let $h \\to 0$. Every term that still holds an $h$ vanishes:', math: '\\frac{(x + h)^n - x^n}{h} = n x^{n-1} + h \\cdot (\\ldots) \\;\\to\\; n x^{n-1}' },
      { say: 'Product rule. When $x$ moves by $h$, $f$ changes by $\\Delta f$ and $g$ by $\\Delta g$. The product changes by two strips and a corner — the rectangle picture:', math: '(f + \\Delta f)(g + \\Delta g) - fg = \\Delta f \\cdot g + f \\cdot \\Delta g + \\Delta f \\cdot \\Delta g' },
      { say: "Divide by $h$. The strips approach $f'g$ and $fg'$; the corner $\\frac{\\Delta f}{h} \\cdot \\Delta g$ approaches $f' \\cdot 0 = 0$, because a differentiable $g$ is continuous:", math: "(fg)' = f'g + fg'" },
      { say: "Quotient rule. Write $q = f/g$, so $f = qg$. The product rule gives $f' = q'g + qg'$; solve for $q'$ and put $q = f/g$ back:", math: "q' = \\frac{f' - qg'}{g} = \\frac{f'g - fg'}{g^2}" },
    ],
    assumptions: [
      '$f$ and $g$ are differentiable at $x$.',
      'For the quotient rule, $g(x) \\ne 0$. The short argument above also assumes $f/g$ is differentiable; a full proof shows it instead.',
      'The derivation covers whole-number powers. The power rule holds for every real exponent (for $x > 0$); the general proof uses logarithms and comes later.',
    ],
    domain: [
      '$\\sqrt{x} = x^{1/2}$ has derivative $\\tfrac{1}{2}x^{-1/2}$ only for $x > 0$: at $x = 0$ its tangent is vertical.',
      'The quotient rule says nothing where $g(x) = 0$, because the quotient is not defined there.',
      "Units: with price in dollars and sales in cups per day, both $p'q$ and $pq'$ come out in dollars per day per month. Two terms with different units would mean a mistake.",
    ],
  },

  examples: [
    {
      title: 'A product, two ways',
      problem: 'Differentiate $y = (x^2 + 1)(3x - 2)$ and find the slope at $x = 1$.',
      steps: [
        "Name the factors: $f = x^2 + 1$ with $f' = 2x$, and $g = 3x - 2$ with $g' = 3$.",
        "Product rule: $y' = 2x(3x - 2) + (x^2 + 1) \\cdot 3$.",
        "At $x = 1$: $2 \\cdot 1 + 2 \\cdot 3 = 8$. Check by expanding: $y = 3x^3 - 2x^2 + 3x - 2$, so $y' = 9x^2 - 4x + 3$, which is $9 - 4 + 3 = 8$ at $x = 1$.",
      ],
      answer: "$y'(1) = 8$",
      check: { value: 8, compute: () => { const Y = (x) => (x * x + 1) * (3 * x - 2); return (Y(1 + 1e-6) - Y(1 - 1e-6)) / 2e-6; }, tolerance: 1e-5 },
      tempting: {
        wrong: "Tempting: multiply the two derivatives, $y' = 2x \\cdot 3 = 6x$, which gives 6 at $x = 1$.",
        why: 'That leaves out how big each factor is. A change in $3x - 2$ is multiplied by the whole of $x^2 + 1$, and a change in $x^2 + 1$ by the whole of $3x - 2$. Expanding settles it: the slope is 8, not 6.',
      },
    },
    {
      title: 'A polynomial, term by term',
      problem: 'Differentiate $f(x) = 4x^3 - 5x^2 + 7x - 2$ and find the slope at $x = 2$.',
      steps: [
        'Power rule on each term, keeping its constant: $12x^2$, $-10x$ and $7$. The constant $-2$ does not change, so its derivative is 0.',
        "So $f'(x) = 12x^2 - 10x + 7$.",
        "At $x = 2$: $48 - 20 + 7 = 35$. A difference quotient agrees: $\\dfrac{f(2.001) - f(1.999)}{0.002} \\approx 35.000$.",
      ],
      answer: "$f'(2) = 35$",
      check: { value: 35, compute: () => { const P = (x) => 4 * x ** 3 - 5 * x ** 2 + 7 * x - 2; return (P(2 + 1e-6) - P(2 - 1e-6)) / 2e-6; }, tolerance: 1e-5 },
    },
    {
      title: 'A quotient: average cost',
      problem: 'A print shop’s monthly cost for $q$ posters is $C(q) = 500 + 2q$ dollars, so the average cost per poster is $A(q) = \\dfrac{500 + 2q}{q}$. How fast is the average cost changing at $q = 100$?',
      steps: [
        "Quotient rule with top $500 + 2q$ (rate 2) and bottom $q$ (rate 1): $A'(q) = \\dfrac{2q - (500 + 2q)}{q^2} = -\\dfrac{500}{q^2}$.",
        "At $q = 100$: $A'(100) = -500 / 10\\,000 = -0.05$ dollars per poster, per extra poster.",
        "Check another way: $A(q) = 500q^{-1} + 2$, and the power rule with $n = -1$ gives $-500q^{-2}$, the same.",
      ],
      answer: "$A'(100) = -0.05$: each extra poster lowers the average cost by about 5 cents",
      check: { value: -0.05, compute: () => (2 * 100 - (500 + 2 * 100)) / 100 ** 2, tolerance: 1e-12 },
    },
  ],

  counterexample: {
    title: 'The tempting wrong rule',
    body: [
      "It is tempting to think the derivative of a product is the product of the derivatives. Try it on $x^2 = x \\cdot x$: the wrong rule gives $1 \\cdot 1 = 1$, but the slope of $x^2$ is $2x$ — which is $1 \\cdot x + x \\cdot 1$, exactly what the product rule says.",
      'Quotients fail the same way. $\\dfrac{x^3}{x}$ is $x^2$ (for $x \\ne 0$), with derivative $2x$; dividing the derivatives gives $\\dfrac{3x^2}{1} = 3x^2$, which disagrees almost everywhere — at $x = 1$, 3 against the true 2.',
    ],
  },

  predict: {
    prompt: 'A rectangle is 10 cm wide and growing 2 cm per second; it is 5 cm tall and growing 1 cm per second. How fast is its area growing right now?',
    choices: ['$2 \\times 1 = 2$ cm² per second', '$2 \\cdot 5 + 10 \\cdot 1 = 20$ cm² per second', '$2 + 1 = 3$ cm² per second', '$10 \\times 5 = 50$ cm² per second'],
    answer: 1,
    reveal: 'Each growing side sweeps out a strip: the widening adds $2 \\times 5 = 10$ cm² per second, and the extra height adds $10 \\times 1 = 10$ cm² per second. Together, 20. The corner where the strips overlap grows like $(\\Delta t)^2$, which is why $2 \\times 1$ does not appear in the rate.',
    misconception: {
      belief: 'The rate of a product is the product of the rates.',
      correction: "Each factor’s rate is multiplied by the other factor’s current size, and the two pieces are added: $(fg)' = f'g + fg'$.",
    },
  },

  faded: {
    title: 'Revenue from price and sales',
    problem: 'A bakery will charge $p(t) = 3 + 0.2t$ dollars a loaf $t$ months from now, and expects to sell $q(t) = 400 - 10t$ loaves a week. How fast is weekly revenue $R = pq$ changing at $t = 5$?',
    steps: [
      { say: "Name the factors and their rates: $p = 3 + 0.2t$ with $p' = 0.2$, and $q = 400 - 10t$ with $q' = -10$." },
      {
        say: 'Find the values at $t = 5$. Sales are $q(5) = 400 - 50 = 350$ loaves.',
        item: item({ id: 'c1-rules.f1', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: 'What is the price $p(5)$, in dollars?', answer: num(4), compute: () => 3 + 0.2 * 5, hints: ['Substitute $t = 5$ into $3 + 0.2t$.'], solution: '$p(5) = 3 + 1 = 4$ dollars.' }),
      },
      {
        say: "First strip: the price’s rate times the sales.",
        item: item({ id: 'c1-rules.f2', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: "What is $p'q$ at $t = 5$, in dollars of weekly revenue per month?", answer: num(70), compute: () => 0.2 * (400 - 10 * 5), hints: ["$p' = 0.2$ dollars per month and $q(5) = 350$ loaves a week."], solution: '$0.2 \\times 350 = 70$: the price rise alone adds \\$70 a week, per month.' }),
      },
      {
        say: 'Second strip, then add:',
        item: item({ id: 'c1-rules.f3', competency: 'calc.rules', difficulty: 2, level: 'scaffolded', prompt: "So what is $R' = p'q + pq'$ at $t = 5$?", answer: num(30), compute: () => 0.2 * (400 - 10 * 5) + (3 + 0.2 * 5) * -10, hints: ["$pq' = 4 \\times (-10) = -40$.", 'Add the two strips: $70 + (-40)$.'], solution: '$70 - 40 = 30$: revenue rises about \\$30 a week for each month, because the price rise more than makes up for the lost loaves.' }),
      },
    ],
    answer: "$R'(5) = 0.2 \\cdot 350 + 4 \\cdot (-10) = 30$ dollars of weekly revenue per month. Expanding checks it: $R(t) = (3 + 0.2t)(400 - 10t) = 1200 + 50t - 2t^2$, so $R'(t) = 50 - 4t$, which is 30 at $t = 5$.",
  },

  practice: [
    item({ id: 'c1-rules.p1', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: 'By the power rule, what is the slope of $y = x^4$ at $x = 2$?', answer: num(32), compute: () => 4 * 2 ** 3, hints: ['$\\frac{d}{dx} x^4 = 4x^3$.'], solution: '$4 \\cdot 2^3 = 32$.' }),
    item({ id: 'c1-rules.p2', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: "Differentiate $f(x) = 3x^2 - 4x + 9$ term by term. What is $f'(3)$?", answer: num(14), compute: () => 6 * 3 - 4, hints: ['$\\frac{d}{dx} 3x^2 = 6x$, $\\frac{d}{dx}(-4x) = -4$, and the constant 9 contributes nothing.'], solution: "$f'(x) = 6x - 4$, so $f'(3) = 14$." }),
    item({ id: 'c1-rules.p3', competency: 'calc.rules', difficulty: 2, level: 'independent', prompt: 'Write $\\sqrt{x}$ as $x^{1/2}$ and use the power rule. What is the slope of $y = \\sqrt{x}$ at $x = 9$? Give three decimal places.', answer: num(0.167, 0.0005), compute: () => 1 / (2 * Math.sqrt(9)), hints: ['$\\frac{d}{dx} x^{1/2} = \\tfrac12 x^{-1/2} = \\dfrac{1}{2\\sqrt{x}}$.'], solution: '$\\dfrac{1}{2\\sqrt{9}} = \\dfrac{1}{6} \\approx 0.167$.' }),
    item({ id: 'c1-rules.p4', competency: 'calc.rules', difficulty: 2, level: 'independent', prompt: 'Use the product rule on $y = x^2(x + 3)$. What is $dy/dx$ at $x = 2$?', answer: num(24), compute: () => 2 * 2 * (2 + 3) + 2 ** 2 * 1, hints: ["$f = x^2$, $f' = 2x$; $g = x + 3$, $g' = 1$.", 'Check by expanding first: $x^3 + 3x^2$.'], solution: '$2x(x + 3) + x^2 \\cdot 1 = 20 + 4 = 24$ at $x = 2$. Expanding, $3x^2 + 6x = 24$ too.' }),
    item({ id: 'c1-rules.p5', competency: 'calc.rules', difficulty: 2, level: 'independent', prompt: 'Use the quotient rule on $y = \\dfrac{x}{x + 1}$. What is $dy/dx$ at $x = 1$?', answer: num(0.25), compute: () => (1 * (1 + 1) - 1 * 1) / (1 + 1) ** 2, hints: ['Top $f = x$, bottom $g = x + 1$; both have derivative 1.', "Numerator $f'g - fg' = (x + 1) - x$."], solution: '$\\dfrac{(x + 1) - x}{(x + 1)^2} = \\dfrac{1}{(x + 1)^2}$, which is $\\tfrac14 = 0.25$ at $x = 1$.' }),
    item({
      id: 'c1-rules.p6', competency: 'calc.rules', difficulty: 3, level: 'transfer',
      prompt: 'In an illustrative model, a medicine’s concentration in the blood is $C(t) = \\dfrac{20t}{t^2 + 4}$ mg/L, $t$ hours after a dose. How fast is it changing at $t = 3$ hours, in mg/L per hour? Give three decimal places (negative if falling).',
      answer: num(-0.592, 0.0005), compute: () => (20 * (3 ** 2 + 4) - 20 * 3 * (2 * 3)) / (3 ** 2 + 4) ** 2,
      hints: ["Top $f = 20t$, $f' = 20$; bottom $g = t^2 + 4$, $g' = 2t$.", "$f'g - fg' = 20(t^2 + 4) - 20t \\cdot 2t = 20(4 - t^2)$."],
      solution: "$C'(t) = \\dfrac{20(4 - t^2)}{(t^2 + 4)^2}$; at $t = 3$ that is $-\\dfrac{100}{169} \\approx -0.592$ mg/L per hour, so the concentration is falling. It peaked at $t = 2$, where the numerator is zero. (A teaching model, not a dosing guide.)",
    }),
  ],

  apply: {
    scenario: 'A small factory’s monthly cost of making $q$ solar panels is $C(q) = 20\\,000 + 80q + 0.01q^2$ dollars: rent and salaries, materials, and overtime that grows with output. It makes 1,000 panels a month and wants to know whether making more would lower the cost of each panel.',
    steps: [
      'Marginal cost, with the power rule.',
      'How the average cost $A(q) = C(q)/q$ is changing, with the quotient rule.',
      'What the sign means for the next panels, and where the average bottoms out.',
    ],
    items: [
      item({ id: 'c1-rules.u1', competency: 'calc.rules', difficulty: 1, prompt: "What is the marginal cost $C'(q)$ at $q = 1000$, in dollars per panel?", answer: num(100), compute: () => marginal(1000), hints: ['$C\'(q) = 80 + 0.02q$ — the constant 20,000 drops out.'], solution: '$80 + 0.02 \\times 1000 = 100$ dollars for the next panel.' }),
      item({ id: 'c1-rules.u2', competency: 'calc.rules', difficulty: 2, prompt: "How fast is the average cost changing at $q = 1000$, $A'(q) = \\dfrac{C'(q)\\,q - C(q)}{q^2}$, in dollars per panel per extra panel?", answer: num(-0.01), compute: () => (marginal(1000) * 1000 - cost(1000)) / 1000 ** 2, hints: ['$C(1000) = 20\\,000 + 80\\,000 + 10\\,000 = 110\\,000$.', '$\\dfrac{100 \\times 1000 - 110\\,000}{1000^2}$'], solution: '$\\dfrac{100\\,000 - 110\\,000}{1\\,000\\,000} = -0.01$: the average cost is still falling, by about a cent per panel for each extra panel.' }),
      item({
        id: 'c1-rules.u3', competency: 'calc.rules', difficulty: 3,
        prompt: 'At 1,000 panels the next panel costs \\$100, while the average is \\$110. At what monthly output does the average cost stop falling? (Set $A\'(q) = 0$, that is, $C\'(q)\\,q = C(q)$.)',
        answer: num(1414.2, 0.5), compute: () => Math.sqrt(20000 / 0.01),
        hints: ['$(80 + 0.02q)q = 20\\,000 + 80q + 0.01q^2$.', 'The $80q$ terms cancel: $0.01q^2 = 20\\,000$.'],
        solution: '$0.01q^2 = 20\\,000$, so $q = \\sqrt{2\\,000\\,000} \\approx 1414$ panels. There the marginal cost ($\\approx \\$108.28$) equals the average cost: below that output each extra panel pulls the average down, above it each pushes it up.',
      }),
      item({
        id: 'c1-rules.u4', competency: 'calc.rules', difficulty: 2,
        prompt: 'The manager concludes: “We should make 1,414 panels a month, because that is where each panel is cheapest.” What is missing from that reasoning?',
        answer: choice(['Whether the extra panels can be sold, and at what price: lowest average cost is not the same as most profit', 'Nothing: the lowest average cost always maximises profit', 'The quotient rule only works for whole numbers of panels', 'Average cost can never rise once it has fallen'], 0),
        feedback: { 1: 'Profit depends on revenue too. If the extra 414 panels can only be sold at a loss, or not at all, the cheapest panel is not the best plan.', 2: 'The rule works for any $q > 0$; rounding to whole panels changes almost nothing here.', 3: 'Past 1,414 panels the overtime term makes each extra panel cost more than the average, so the average rises.' },
        solution: 'The derivative found where cost per panel is lowest. Whether to produce there depends on demand and price — the same question the pricing project asks of its demand line.',
      }),
    ],
    limits: [
      'The cost curve is illustrative, not a real factory’s accounts.',
      'Real costs jump in steps — a second shift, a new machine — and at a jump the derivative says nothing.',
      'Lowest average cost is not the most profitable output: that also needs the price and how many panels can be sold.',
    ],
  },

  checkpoint: [
    item({ id: 'c1-rules.c1', competency: 'calc.rules', difficulty: 1, prompt: 'What is the slope of $f(x) = 5x^3 - 2x$ at $x = 1$?', answer: num(13), compute: () => 15 * 1 ** 2 - 2, solution: "$f'(x) = 15x^2 - 2$, so $f'(1) = 13$.", feedbackCorrect: 'Right.', feedbackIncorrect: 'Term by term: $15x^2 - 2$, then substitute $x = 1$.' }),
    item({ id: 'c1-rules.c2', competency: 'calc.rules', difficulty: 2, prompt: "You know $f(2) = 3$, $f'(2) = 4$, $g(2) = 5$ and $g'(2) = -1$. What is $(fg)'(2)$?", answer: num(17), compute: () => 4 * 5 + 3 * -1, solution: "$(fg)'(2) = f'(2)g(2) + f(2)g'(2) = 20 - 3 = 17$.", feedbackCorrect: "Right — and $f'(2)\\,g'(2) = -4$ was the trap.", feedbackIncorrect: "Each rate times the other function’s value: $f'(2)\\,g(2) + f(2)\\,g'(2)$." }),
    item({ id: 'c1-rules.c3', competency: 'calc.rules', difficulty: 2, prompt: "With the same values, what is $\\left(\\dfrac{f}{g}\\right)'(2)$? Give a decimal.", answer: num(0.92), compute: () => (4 * 5 - 3 * -1) / 5 ** 2, solution: "$\\dfrac{f'g - fg'}{g^2} = \\dfrac{20 - (-3)}{25} = \\dfrac{23}{25} = 0.92$.", feedbackCorrect: 'Right.', feedbackIncorrect: "$\\dfrac{f'g - fg'}{g^2}$, in that order. $g'(2)$ is negative, so subtracting $f g'$ adds 3." }),
    item({
      id: 'c1-rules.c4', competency: 'calc.rules', difficulty: 3,
      prompt: 'A town has $P(t) = 50\\,000 + 1\\,000t$ residents, and each uses $w(t) = 150 - 2t$ litres of water a day, $t$ years from now. Total use is $P \\cdot w$. How fast is total daily water use changing at $t = 5$, in litres a day per year?',
      answer: num(30000), compute: () => 1000 * (150 - 2 * 5) + (50000 + 1000 * 5) * -2,
      solution: "At $t = 5$: $P = 55\\,000$ and $w = 140$. $(Pw)' = P'w + Pw' = 1000 \\times 140 + 55\\,000 \\times (-2) = 140\\,000 - 110\\,000 = 30\\,000$ litres a day, per year.",
      feedbackCorrect: 'Right — saving per person slows the growth but does not stop it.', feedbackIncorrect: "Product rule with $P' = 1000$ and $w' = -2$, each multiplied by the other factor’s value at $t = 5$.",
    }),
  ],

  python: {
    intro: 'The product rule against a measured slope, and what the tempting rule predicts instead.',
    code: `def slope(func, x, h=1e-6):
    return (func(x + h) - func(x - h)) / (2 * h)

def f(x):
    return x ** 2 + 1

def g(x):
    return 3 * x - 2

def product(x):
    return f(x) * g(x)

x = 1
rule = slope(f, x) * g(x) + f(x) * slope(g, x)
wrong = slope(f, x) * slope(g, x)
print("product rule f'g + fg':", round(rule, 6))
print("measured slope of f*g:", round(slope(product, x), 6))
print("tempting rule f'g':", round(wrong, 6))`,
    output: "product rule f'g + fg': 8.0\nmeasured slope of f*g: 8.0\ntempting rule f'g': 6.0",
    explain: "The product rule gives 8, matching the measured slope of $f \\cdot g$ at $x = 1$; multiplying the two slopes gives 6 — the mistake from the first worked example.",
  },

  reading: [
    { title: '3.3 Differentiation Rules', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules', note: 'The power, sum, product and quotient rules, with proofs and more examples.' },
  ],
};
