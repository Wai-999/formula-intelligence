import { item, num, choice } from '../lessonKit.js';

// V5 vertical slice, step 3 of 3 (Algebra II → Precalculus → Calculus I).
// The chain rule as "rates multiply", built on composition (a2-composition)
// and the limit definition (pc-limits, c1-derivative). The power rule
// d/du uⁿ = n·uⁿ⁻¹ is stated, not derived, here. All models are illustrative.

const users = (t) => 2000 + 150 * t;
const storagePerUser = (n) => 0.5 + 0.0002 * n; // s'(n) for s(n) = 0.5n + 0.0001n²

export default {
  intuition: {
    question: 'A weather balloon rises at 5 metres per second, and the air cools by 0.0065 °C for every metre of height. How fast is the temperature around the balloon falling, per second?',
    body: [
      'Temperature depends on height, and height depends on time, so temperature is a **composite** function of time: $T(h(t))$.',
      'The rates multiply, and the units show why: $\\left(-0.0065\\ \\tfrac{^\\circ\\mathrm{C}}{\\mathrm{m}}\\right) \\times \\left(5\\ \\tfrac{\\mathrm{m}}{\\mathrm{s}}\\right) = -0.0325\\ \\tfrac{^\\circ\\mathrm{C}}{\\mathrm{s}}$. The metres cancel; the air around the balloon cools about 2 °C per minute.',
      "That is the **chain rule**: the derivative of $f(g(x))$ is the outer rate, read at the inner value, times the inner rate: $f'(g(x))\\,g'(x)$. When a rate is not constant, “read at the inner value” is the part people get wrong.",
    ],
    simpler: [
      'If one gear turns 3 times for each turn of a second gear, and the second turns 2 times for each turn of a third, the first turns $3 \\times 2 = 6$ times for each turn of the third. Rates along a chain multiply.',
      'The one catch: when a rate changes from place to place, read each rate where it actually is. The outer function works on $u = g(x)$, so its rate is read at $u$, not at $x$.',
    ],
  },

  outcomes: [
    'Differentiate a composite $f(g(x))$: the outer rate, read at the inner value, times the inner rate.',
    'Check a chain-rule answer with units, by expanding, or with a difference quotient.',
    'Turn one rate into another in a real setting — per metre into per second.',
  ],

  glossary: [
    { term: '$\\dfrac{d}{dx} f(g(x))$', meaning: 'The rate of change of the composite with respect to $x$.' },
    { term: "$g'(x)$", meaning: '**Inner rate**: how fast the inner value $u = g(x)$ changes per unit of $x$.' },
    { term: "$f'(g(x))$", meaning: '**Outer rate**: how fast $f$ changes per unit of its own input, read at $u = g(x)$ — not at $x$.' },
    { term: '$\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$', meaning: 'The chain rule in Leibniz notation. The $du$s appear to cancel, which is a good memory aid but not a proof.' },
  ],

  priorCheck: [
    item({
      id: 'c1-chain.pre1', competency: 'func.compose-inverse', difficulty: 1,
      prompt: 'For $f(u) = u^2$ and $g(x) = 3x + 1$, what is $f(g(2))$?',
      answer: num(49), compute: () => (3 * 2 + 1) ** 2, solution: '$g(2) = 7$ and $f(7) = 49$.', remedy: 'a2-composition',
    }),
    item({
      id: 'c1-chain.pre2', competency: 'calc.derivative', difficulty: 1,
      prompt: "The power rule says $\\dfrac{d}{du} u^n = n u^{n-1}$. If $f(u) = u^3$, what is $f'(2)$?",
      answer: num(12), compute: () => 3 * 2 ** 2, solution: "$f'(u) = 3u^2$, so $f'(2) = 12$.", remedy: 'c1-derivative',
    }),
  ],

  visualization: {
    lab: 'composition-chain',
    intro: 'Move $x$ and read three slopes: the inner function at $x$, the outer function at $u = g(x)$, and the composite at $x$. Then switch to the common mistake and watch its tangent miss the curve.',
    textAlternative: "Three plots show the inner function $u = g(x)$, the outer function $y = f(u)$ and the composite $y = f(g(x))$, each with its tangent at the current point. A sentence gives $g'(x)$, $f'(g(x))$, their product and a measured slope of the composite; the table lists them for five inputs.",
  },

  derivation: {
    intro: "Why do the rates multiply? A sketch for the case where $g$ does not repeat its value near $x$.",
    steps: [
      { say: 'Write $u = g(x)$ and $\\Delta u = g(x + h) - g(x)$, the change in the inner value when $x$ moves by $h$. Multiply and divide by $\\Delta u$:', math: '\\frac{f(g(x + h)) - f(g(x))}{h} = \\frac{f(u + \\Delta u) - f(u)}{\\Delta u} \\cdot \\frac{\\Delta u}{h}' },
      { say: 'As $h \\to 0$, $\\Delta u \\to 0$ too (a differentiable $g$ is continuous), so each factor approaches a derivative:', math: "\\frac{f(u + \\Delta u) - f(u)}{\\Delta u} \\to f'(u), \\qquad \\frac{\\Delta u}{h} \\to g'(x)" },
      { say: 'The limit of a product is the product of the limits:', math: "\\frac{d}{dx} f\\big(g(x)\\big) = f'\\big(g(x)\\big)\\, g'(x)" },
      { say: 'The sketch divides by $\\Delta u$, which fails if $g$ takes the value $g(x)$ again arbitrarily close to $x$ (then $\\Delta u = 0$ for some $h$). A full proof handles that case with a slightly different quotient and reaches the same rule.' },
    ],
    assumptions: [
      '$g$ is differentiable at $x$, and $f$ is differentiable at $u = g(x)$.',
    ],
    domain: [
      'Both derivatives must exist: $\\sqrt{u}$ has no derivative at $u = 0$, so the rule says nothing about $\\sqrt{x^2} = |x|$ at $x = 0$ — which indeed has a corner there.',
      'Units: (units of $y$ per unit of $u$) × (units of $u$ per unit of $x$) = units of $y$ per unit of $x$.',
    ],
  },

  examples: [
    {
      title: 'A power of a linear function',
      problem: 'Differentiate $y = (3x + 1)^2$ and evaluate the derivative at $x = 2$.',
      steps: ["Inner: $u = 3x + 1$, so $du/dx = 3$. Outer: $y = u^2$, so $dy/du = 2u$.", "Chain rule: $y' = 2(3x + 1) \\cdot 3 = 6(3x + 1)$.", "At $x = 2$: $u = 7$, so $y' = 2 \\cdot 7 \\cdot 3 = 42$. Check by expanding: $y = 9x^2 + 6x + 1$ gives $y' = 18x + 6 = 42$ at $x = 2$."],
      answer: "$y'(2) = 42$",
      check: { value: 42, compute: () => { const F = (x) => (3 * x + 1) ** 2; return (F(2 + 1e-6) - F(2 - 1e-6)) / 2e-6; }, tolerance: 1e-5 },
      tempting: {
        wrong: "Tempting: differentiate only the outside, $y' = 2(3x + 1)$, which gives 14 at $x = 2$.",
        why: 'That leaves out the inner rate. $u = 3x + 1$ changes 3 times as fast as $x$, so every change in $y$ is 3 times bigger: 42, as expanding confirms.',
      },
    },
    {
      title: 'The balloon, accelerating',
      problem: 'A balloon’s height is $h(t) = 4t + 0.1t^2$ metres after $t$ seconds, and $T(h) = 15 - 0.0065h$ °C. How fast is the temperature changing at $t = 10$ s?',
      steps: ["$h'(t) = 4 + 0.2t$, so $h'(10) = 6$ m/s.", "$T'(h) = -0.0065$ °C per metre, at every height.", "$\\dfrac{dT}{dt} = T'(h(10)) \\cdot h'(10) = -0.0065 \\cdot 6 = -0.039$ °C per second."],
      answer: '$-0.039$ °C per second',
      check: { value: -0.039, compute: () => -0.0065 * (4 + 0.2 * 10), tolerance: 1e-12 },
    },
  ],

  counterexample: {
    title: 'The tempting wrong rule',
    body: [
      "It is tempting to read both derivatives at the same point. For $y = (3x + 1)^2$ at $x = 2$ that gives $f'(2) \\cdot g'(2) = (2 \\cdot 2) \\cdot 3 = 12$ instead of 42.",
      'The outer rate must be read where the outer function actually is: at $u = g(2) = 7$, not at 2. In the lab, the “common mistake” setting draws the tangent this wrong rule predicts, and it visibly misses the curve. For the balloon the mistake happens to give the right answer — the outer rate is the same at every height.',
    ],
  },

  predict: {
    prompt: 'For $y = \\sqrt{x^2 + 9}$ at $x = 4$: the inner $u = x^2 + 9$ changes at $2x = 8$ per unit of $x$, and the outer $\\sqrt{u}$ changes at $\\dfrac{1}{2\\sqrt{u}}$ per unit of $u$. What is $dy/dx$ at $x = 4$?',
    choices: ['$8 \\cdot \\frac{1}{2\\sqrt{4}} = 2$', '$8 \\cdot \\frac{1}{2\\sqrt{25}} = 0.8$', '$\\frac{1}{2\\sqrt{25}} = 0.1$', '$8$'],
    answer: 1,
    reveal: 'At $x = 4$, $u = 16 + 9 = 25$, so the outer rate is $1/(2 \\cdot 5) = 0.1$ and $dy/dx = 0.1 \\cdot 8 = 0.8$. The first choice read the outer rate at $x = 4$ instead of at $u = 25$.',
    misconception: {
      belief: 'Evaluate every derivative at the same input $x$.',
      correction: 'The outer function never sees $x$; it sees $u = g(x)$. Its rate must be read at that inner value.',
    },
  },

  faded: {
    title: 'A cubed linear function',
    problem: 'Find the derivative of $y = (4x - 3)^3$ at $x = 1$.',
    steps: [
      { say: 'Name the parts: inner $u = 4x - 3$, outer $y = u^3$.' },
      {
        say: 'Inner rate:',
        item: item({ id: 'c1-chain.f1', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: 'What is $du/dx$ for $u = 4x - 3$?', answer: num(4), compute: () => ((4 * 2 - 3) - (4 * 1 - 3)) / (2 - 1), hints: ['It is the slope of the line $4x - 3$.'], solution: '$du/dx = 4$.' }),
      },
      {
        say: 'Outer rate, read at the inner value. At $x = 1$, $u = 4 - 3 = 1$.',
        item: item({ id: 'c1-chain.f2', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: 'What is $dy/du = 3u^2$ at that inner value?', answer: num(3), compute: () => 3 * (4 * 1 - 3) ** 2, hints: ['Use $u = 1$, not $x = 1$ — here they happen to be equal, but the rule is to use $u$.'], solution: '$3 \\cdot 1^2 = 3$.' }),
      },
      {
        say: 'Multiply the two rates:',
        item: item({ id: 'c1-chain.f3', competency: 'calc.rules', difficulty: 2, level: 'scaffolded', prompt: 'So what is $dy/dx$ at $x = 1$?', answer: num(12), compute: () => 3 * (4 * 1 - 3) ** 2 * 4, hints: ['Outer rate times inner rate.'], solution: '$3 \\times 4 = 12$.' }),
      },
    ],
    answer: "$\\dfrac{dy}{dx} = 3(4x - 3)^2 \\cdot 4$, which is $12$ at $x = 1$. A difference quotient agrees: $\\dfrac{(4.004 - 3)^3 - (3.996 - 3)^3}{0.002} \\approx 12.0$.",
  },

  practice: [
    item({ id: 'c1-chain.p1', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: 'For $y = (2x - 1)^3$ the inner rate is $2$ and the outer rate is $3u^2$, with $u = 2x - 1$. Find $dy/dx$ at $x = 1$.', answer: num(6), compute: () => 3 * (2 * 1 - 1) ** 2 * 2, hints: ['At $x = 1$, $u = 1$.', 'Outer rate $3 \\cdot 1^2 = 3$, times inner rate 2.'], solution: '$3 \\cdot 1^2 \\cdot 2 = 6$.' }),
    item({ id: 'c1-chain.p2', competency: 'calc.rules', difficulty: 1, level: 'scaffolded', prompt: 'A car uses 0.05 litres of fuel per km and drives at 90 km/h. How many litres per hour does it burn?', answer: num(4.5), compute: () => 0.05 * 90, hints: ['(litres per km) × (km per hour).'], solution: '$0.05 \\times 90 = 4.5$ litres per hour — the kilometres cancel.' }),
    item({ id: 'c1-chain.p3', competency: 'calc.rules', difficulty: 2, level: 'independent', prompt: 'Differentiate $y = (x^2 + 1)^2$ and evaluate at $x = 1$.', answer: num(8), compute: () => 2 * (1 ** 2 + 1) * (2 * 1), hints: ['Outer $u^2$ with $u = x^2 + 1$; inner rate $2x$.'], solution: "$y' = 2(x^2 + 1) \\cdot 2x$; at $x = 1$: $2 \\cdot 2 \\cdot 2 = 8$." }),
    item({ id: 'c1-chain.p4', competency: 'calc.rules', difficulty: 2, level: 'independent', prompt: 'Differentiate $y = (5 - x)^2$ and evaluate at $x = 2$.', answer: num(-6), compute: () => 2 * (5 - 2) * -1, hints: ['The inner rate is $-1$.'], solution: "$y' = 2(5 - x) \\cdot (-1)$; at $x = 2$: $-6$. The sign comes from the inner function." }),
    item({ id: 'c1-chain.p5', competency: 'calc.rules', difficulty: 2, level: 'independent', prompt: 'For $y = \\sqrt{3x + 4}$, find $dy/dx$ at $x = 4$.', answer: num(0.375), compute: () => 3 / (2 * Math.sqrt(3 * 4 + 4)), hints: ['At $x = 4$, $u = 16$; the outer rate is $1/(2\\sqrt{u})$.'], solution: '$\\dfrac{1}{2\\sqrt{16}} \\cdot 3 = \\dfrac{3}{8} = 0.375$.' }),
    item({
      id: 'c1-chain.p6', competency: 'calc.rules', difficulty: 3, level: 'transfer',
      prompt: 'An oil slick is a circle whose radius is $r(t) = 2\\sqrt{t}$ metres after $t$ minutes. Its area is $A = \\pi r^2$. How fast is the area growing at $t = 4$ minutes, in m² per minute? Give two decimal places.',
      answer: num(12.57, 0.005), compute: () => 2 * Math.PI * (2 * Math.sqrt(4)) * (1 / Math.sqrt(4)), hints: ["$dA/dr = 2\\pi r$ and $r'(t) = 1/\\sqrt{t}$.", 'At $t = 4$: $r = 4$ and $r\'(4) = 0.5$.'],
      solution: '$\\dfrac{dA}{dt} = 2\\pi r \\cdot r\'(t) = 2\\pi \\cdot 4 \\cdot 0.5 = 4\\pi \\approx 12.57$ m² per minute.',
    }),
  ],

  apply: {
    scenario: 'A photo-sharing start-up has $n(t) = 2000 + 150t$ users after $t$ months. Heavier users join as it grows, so storage is $s(n) = 0.5n + 0.0001n^2$ GB, and storage costs \\$0.023 per GB per month: the bill is $B(s) = 0.023s$ dollars. Find how fast the bill is rising at month 12.',
    steps: [
      'Chain the inner two rates: storage per month.',
      'Chain all three: dollars per month, per month.',
      'Judge a year-ahead forecast made from that rate.',
    ],
    items: [
      item({ id: 'c1-chain.u1', competency: 'calc.rules', difficulty: 2, prompt: "How fast is storage growing at month 12, in GB per month? ($ds/dt = s'(n)\\,n'(t)$, with $s'(n) = 0.5 + 0.0002n$.)", answer: num(189, 1e-6), compute: () => storagePerUser(users(12)) * 150, hints: ['At $t = 12$, $n = 3800$.', "$s'(3800) = 1.26$ GB per user, and $n'(t) = 150$ users per month."], solution: '$1.26 \\times 150 = 189$ GB per month.' }),
      item({ id: 'c1-chain.u2', competency: 'calc.rules', difficulty: 3, prompt: 'How fast is the monthly bill rising at month 12, in dollars per month? Give the answer to the cent.', answer: num(4.35, 0.005), compute: () => 0.023 * storagePerUser(users(12)) * 150, hints: ["$B'(s) = 0.023$ dollars per GB."], solution: '$0.023 \\times 189 = 4.347$, about \\$4.35 more each month.' }),
      item({
        id: 'c1-chain.u3', competency: 'calc.rules', difficulty: 3,
        prompt: 'A manager extrapolates: “The bill rises \\$4.35 a month, so a year from now it will be about \\$52 higher.” Is that likely too low, too high, or right?',
        answer: choice(['Too low: storage per user grows with users, so the rate itself keeps rising', 'Too high: growth always slows down', 'Right: the chain rule gives the change over a year', 'There is no way to tell from a derivative'], 0),
        feedback: { 1: "Here $s'(n) = 0.5 + 0.0002n$ rises as $n$ rises, so the bill accelerates.", 2: 'A derivative is the rate at one moment; over a year that rate changes.', 3: 'Whether the rate is rising or falling — here rising — tells you the direction of the error.' },
        solution: 'The rate grows with $n$, so a straight-line forecast undershoots. Exactly: storage goes from 3,344 GB at month 12 to 5,936 GB at month 24, so the bill rises by $0.023 \\times 2592 \\approx \\$59.62$, not \\$52.',
      }),
    ],
    limits: [
      'User growth is rarely a straight line; a launch or a lost customer changes $n(t)$ abruptly.',
      'The storage curve and the price per GB are illustrative, not measured or quoted.',
      'A derivative describes the rate now: use it for short-range estimates, not for year-ahead budgets.',
    ],
  },

  checkpoint: [
    item({ id: 'c1-chain.c1', competency: 'calc.rules', difficulty: 1, prompt: 'If $y = u^5$ and $u = 2x$, find $dy/dx$ at $x = 1$.', answer: num(160), compute: () => 5 * (2 * 1) ** 4 * 2, solution: 'At $x = 1$, $u = 2$: $dy/du = 5 \\cdot 2^4 = 80$, and $du/dx = 2$, so $dy/dx = 160$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Find $u$ at $x = 1$ first, evaluate $5u^4$ there, then multiply by $du/dx$.' }),
    item({ id: 'c1-chain.c2', competency: 'calc.rules', difficulty: 2, prompt: 'For $h(x) = f(g(x))$ you know $g(3) = 5$, $g\'(3) = 2$, $f\'(3) = 10$ and $f\'(5) = 4$. What is $h\'(3)$?', answer: num(8), compute: () => 4 * 2, solution: "$h'(3) = f'(g(3)) \\cdot g'(3) = f'(5) \\cdot 2 = 8$.", feedbackCorrect: 'Right — $f\'(3)$ was a distractor.', feedbackIncorrect: "Read the outer rate at the inner value: $f'(g(3)) = f'(5)$, not $f'(3)$." }),
    item({ id: 'c1-chain.c3', competency: 'calc.rules', difficulty: 2, prompt: 'Differentiate $y = \\sqrt{x^2 + 16}$ and evaluate at $x = 3$.', answer: num(0.6), compute: () => 3 / Math.sqrt(3 ** 2 + 16), solution: '$\\dfrac{1}{2\\sqrt{25}} \\cdot 2 \\cdot 3 = \\dfrac{6}{10} = 0.6$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Outer rate $1/(2\\sqrt{u})$ at $u = 25$, times the inner rate $2x = 6$.' }),
    item({
      id: 'c1-chain.c4', competency: 'calc.rules', difficulty: 3,
      prompt: 'A cyclist rides directly away from a phone mast at 6 m/s. Signal strength falls with distance as $S(r) = 1000/r^2$ (arbitrary units, $r$ in metres). How fast is the signal changing when the cyclist is 100 m away, in units per second?',
      answer: num(-0.012), compute: () => (-2000 / 100 ** 3) * 6,
      solution: "$S'(r) = -2000/r^3 = -0.002$ per metre at $r = 100$; times 6 m/s gives $-0.012$ units per second.",
      feedbackCorrect: 'Right — a negative rate: the signal weakens.', feedbackIncorrect: 'Signal change per metre ($dS/dr = -2000/r^3$ at $r = 100$) times metres per second.',
    }),
  ],

  python: {
    intro: 'The chain rule against a measured slope, and what the common mistake predicts instead.',
    code: `def g(x):
    return 3 * x + 1

def f(u):
    return u ** 2

def composite(x):
    return f(g(x))

def slope(func, x, h=1e-6):
    return (func(x + h) - func(x - h)) / (2 * h)

x = 2
inner = slope(g, x)
outer = slope(f, g(x))
print("inner rate:", round(inner, 6))
print("outer rate at u = g(x):", round(outer, 6))
print("product:", round(inner * outer, 6))
print("measured slope of composite:", round(slope(composite, x), 6))
print("mistake, outer rate at x:", round(slope(f, x) * inner, 6))`,
    output: 'inner rate: 3.0\nouter rate at u = g(x): 14.0\nproduct: 42.0\nmeasured slope of composite: 42.0\nmistake, outer rate at x: 12.0',
    explain: 'The product of the inner rate (3) and the outer rate read at $u = 7$ (14) matches the measured slope of the composite, 42. Reading the outer rate at $x = 2$ instead gives 12 — the mistake the lab draws.',
  },

  reading: [
    { title: '3.6 The Chain Rule', source: 'OpenStax, Calculus Volume 1', url: 'https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule', note: 'The rule, its proof, and combining it with the other derivative rules.' },
  ],
};
