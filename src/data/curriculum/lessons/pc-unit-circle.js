import { item, num, choice, multi } from '../lessonKit.js';

// V5 Phase 2B (Precalculus → Calculus I): radians and the unit circle, with
// the bridge the spec asks for — unit circle → derivatives of sine and
// cosine. Ohlone MATH-100 lists trigonometric functions; MATH-101A
// differentiates them. The Ferris wheel is illustrative.

const rad = (deg) => (deg * Math.PI) / 180;
const wheel = (t) => 22 - 20 * Math.cos((2 * Math.PI * t) / 8); // height (m) after t minutes

export default {
  intuition: {
    question: 'A Ferris wheel 40 m across turns once every 8 minutes, its centre 22 m above the ground. You board at the bottom. How high are you after 1 minute, and after 3? Trigonometry answers it — once angles are measured the way calculus and every programming language measure them: in radians.',
    body: [
      'Put a circle of radius 1 — the **unit circle** — at the origin. Walk anticlockwise from $(1, 0)$ through an angle $\\theta$. The point you reach is, by definition, $(\\cos\\theta, \\sin\\theta)$.',
      'Measure the angle by the distance walked along the circle: that is the angle in **radians**. A full turn walks the whole circumference, $2\\pi \\approx 6.283$, so $360^\\circ = 2\\pi$ radians and a right angle is $\\pi/2$.',
      'For the wheel, the angle after $t$ minutes is $2\\pi t / 8$, and your height is $22 - 20\\cos(2\\pi t/8)$. After 1 minute that is about 7.86 m; after 3, about 36.14 m.',
    ],
  },

  glossary: [
    { term: '**radian**', meaning: 'An angle measured by arc length on a circle of radius 1. $2\\pi$ radians $= 360^\\circ$; one radian $\\approx 57.3^\\circ$.' },
    { term: '**unit circle**', meaning: 'The circle of radius 1 centred at the origin: $x^2 + y^2 = 1$.' },
    { term: '$(\\cos\\theta, \\sin\\theta)$', meaning: 'The point on the unit circle at angle $\\theta$ from the positive $x$-axis, anticlockwise.' },
    { term: '**period**', meaning: 'How far the input moves before a function repeats. Sine and cosine have period $2\\pi$.' },
  ],

  priorCheck: [
    item({
      id: 'pc-uc.pre1', competency: 'arith.ratios', difficulty: 1,
      prompt: 'How many degrees are in three quarters of a full turn?',
      answer: num(270), compute: () => 0.75 * 360, solution: '$\\tfrac34 \\times 360 = 270$.',
    }),
    item({
      id: 'pc-uc.pre2', competency: 'arith.exponents', difficulty: 1,
      prompt: 'A circle has radius 5. What is its circumference, to two decimals? (Circumference $= 2\\pi r$.)',
      answer: num(31.42, 0.005), compute: () => 2 * Math.PI * 5, solution: '$10\\pi \\approx 31.42$.',
    }),
  ],

  visualization: {
    lab: 'unit-circle',
    intro: 'Move the angle around the circle and watch the arc (the angle in radians) and the point’s coordinates. The graph underneath is the same angle on the sine and cosine curves.',
    textAlternative: 'The lab shows the unit circle with the arc from angle 0 to θ, the radius to the point (cos θ, sin θ), and dotted lines to each axis. At 150° (5π/6 ≈ 2.618 radians) the point is (−0.866, 0.5). Below, the sine and cosine curves over one turn mark the same angle. The table lists degrees, radians, cosine and sine for the special angles.',
  },

  derivation: {
    intro: 'Why radians, and why calculus refuses to use degrees.',
    steps: [
      { say: 'A radian measures an angle by the arc it cuts from a circle of radius 1. A full turn is the whole circumference:', math: '360^\\circ = 2\\pi \\text{ rad}, \\qquad 1 \\text{ rad} = \\frac{180^\\circ}{\\pi} \\approx 57.3^\\circ' },
      { say: 'Arcs scale with the radius, so on a circle of radius $r$ the arc for angle $\\theta$ (in radians) is:', math: 's = r\\theta' },
      { say: 'The point reached defines sine and cosine; because it lies on the unit circle, Pythagoras gives the core identity:', math: '(x, y) = (\\cos\\theta, \\sin\\theta), \\qquad \\cos^2\\theta + \\sin^2\\theta = 1' },
      { say: 'For a small angle the arc ($\\theta$) and the height ($\\sin\\theta$) almost coincide, so $\\sin\\theta/\\theta \\to 1$ — the limit from the limits lesson. That single fact makes the derivative of $\\sin\\theta$ exactly $\\cos\\theta$. In degrees the same derivative carries an awkward factor $\\pi/180$.', math: '\\lim_{\\theta \\to 0} \\frac{\\sin\\theta}{\\theta} = 1 \\;\\Longrightarrow\\; \\frac{d}{d\\theta}\\sin\\theta = \\cos\\theta' },
    ],
    assumptions: [
      'Angles are measured anticlockwise from the positive $x$-axis.',
    ],
    domain: [
      'Any real angle is allowed: angles past $2\\pi$ or below 0 wrap around, because sine and cosine repeat every $2\\pi$.',
      'Code and calculators in calculus work in radians: `sin(1)` means one radian, about 0.8415, not one degree (0.0175).',
    ],
  },

  examples: [
    {
      title: 'Degrees to radians',
      problem: 'Write $150^\\circ$ in radians, exactly and as a decimal.',
      steps: ['Multiply by $\\pi/180$: $150 \\cdot \\pi/180$.', 'Simplify: $150/180 = 5/6$, so $5\\pi/6$.', 'As a decimal, about 2.618.'],
      answer: '$5\\pi/6 \\approx 2.618$',
      check: { value: (5 * Math.PI) / 6, compute: () => rad(150) },
    },
    {
      title: 'Arc length',
      problem: 'A bicycle wheel of radius 0.35 m turns through 3 radians without slipping. How far does the bike move?',
      steps: ['The distance rolled equals the arc turned: $s = r\\theta$.', '$s = 0.35 \\times 3$.', '1.05 m.'],
      answer: '1.05 m',
      check: { value: 1.05, compute: () => 0.35 * 3, tolerance: 1e-12 },
    },
  ],

  counterexample: {
    title: 'Degree mode breaks the formulas',
    body: [
      'A calculator in degree mode reports $\\sin 30 = 0.5$; in radian mode $\\sin 30 \\approx -0.988$ (30 radians is almost five turns). Neither is broken — they answer different questions.',
      'Formulas such as $s = r\\theta$ and $\\frac{d}{d\\theta}\\sin\\theta = \\cos\\theta$ are true only in radians. Mixing units gives answers that look reasonable and are wrong by a factor of about 57.',
    ],
  },

  predict: {
    prompt: 'Without a calculator: is $\\cos 2$ (2 radians, no degree sign) positive or negative?',
    choices: ['Negative', 'Positive', 'Zero', 'Undefined'],
    answer: 0,
    reveal: '2 radians is about $114.6^\\circ$, past a right angle ($\\pi/2 \\approx 1.571$). The point on the circle is to the left of the $y$-axis, so its $x$-coordinate, $\\cos 2 \\approx -0.416$, is negative.',
    misconception: {
      belief: '$\\cos 2$ means the cosine of 2 degrees, so it is almost 1.',
      correction: 'Without a degree sign, angles in mathematics (and in code) are radians. 2 radians is more than a right angle.',
    },
  },

  practice: [
    item({ id: 'pc-uc.p1', competency: 'trig.unit-circle', difficulty: 1, level: 'scaffolded', prompt: 'A quarter turn is a quarter of $2\\pi$. Write $90^\\circ$ in radians to three decimals.', answer: num(1.571, 0.0005), compute: () => rad(90), hints: ['$2\\pi / 4 = \\pi/2$.'], solution: '$\\pi/2 \\approx 1.571$.' }),
    item({ id: 'pc-uc.p2', competency: 'trig.unit-circle', difficulty: 1, level: 'scaffolded', prompt: 'Convert $\\pi/3$ radians to degrees (multiply by $180/\\pi$).', answer: num(60), compute: () => (Math.PI / 3) * (180 / Math.PI), hints: ['$\\tfrac{\\pi}{3} \\cdot \\tfrac{180}{\\pi}$.'], solution: '$180/3 = 60^\\circ$.' }),
    item({ id: 'pc-uc.p3', competency: 'trig.unit-circle', difficulty: 2, level: 'independent', prompt: 'What is $\\cos \\pi$? (Half a turn from $(1, 0)$.)', answer: num(-1), compute: () => Math.cos(Math.PI), hints: ['Half a turn lands on $(-1, 0)$.'], solution: 'The point is $(-1, 0)$, so $\\cos\\pi = -1$.' }),
    item({
      id: 'pc-uc.p4', competency: 'trig.unit-circle', difficulty: 2, level: 'independent',
      prompt: 'Give the point on the unit circle at angle $\\pi/6$, to three decimals.',
      answer: multi([0.866, 0.5], ['x = cos(π/6)', 'y = sin(π/6)'], 0.001), hints: ['$\\pi/6$ is $30^\\circ$.', '$\\cos 30^\\circ = \\sqrt{3}/2$, $\\sin 30^\\circ = 1/2$.'],
      solution: '$(\\sqrt3/2, 1/2) \\approx (0.866, 0.5)$.',
    }),
    item({ id: 'pc-uc.p5', competency: 'trig.unit-circle', difficulty: 2, level: 'independent', prompt: 'A clock’s minute hand is 12 cm long. How far does its tip travel in 20 minutes, to two decimals?', answer: num(25.13, 0.005), compute: () => 12 * ((2 * Math.PI) / 3), hints: ['20 minutes is a third of a turn: $2\\pi/3$ radians.', 'Use $s = r\\theta$.'], solution: '$12 \\cdot 2\\pi/3 = 8\\pi \\approx 25.13$ cm.' }),
    item({
      id: 'pc-uc.p6', competency: 'trig.unit-circle', difficulty: 3, level: 'transfer',
      prompt: 'On the Ferris wheel (height $22 - 20\\cos(2\\pi t/8)$ metres after $t$ minutes), how high are you after 3 minutes? Two decimals.',
      answer: num(36.14, 0.005), compute: () => wheel(3), hints: ['The angle is $2\\pi \\cdot 3/8 = 3\\pi/4$.', '$\\cos(3\\pi/4) = -\\sqrt2/2 \\approx -0.7071$.'],
      solution: '$22 - 20 \\cdot (-0.7071) \\approx 36.14$ m — past the halfway height of 22 m.',
    }),
  ],

  apply: {
    scenario: 'The wheel’s operator wants a model of rider height: $h(t) = 22 - 20\\cos\\left(\\tfrac{2\\pi t}{8}\\right)$ metres, $t$ in minutes after boarding at the bottom. Riders get the best view above 32 m.',
    steps: [
      'Use the model at a few times.',
      'Find how long each turn spends above 32 m.',
      'Explain why the model is written in radians.',
    ],
    items: [
      item({ id: 'pc-uc.u1', competency: 'trig.unit-circle', difficulty: 2, prompt: 'Height after 2 minutes?', answer: num(22, 1e-9), compute: () => wheel(2), hints: ['2 minutes is a quarter turn: $\\cos(\\pi/2) = 0$.'], solution: '$22 - 0 = 22$ m: level with the centre.' }),
      item({ id: 'pc-uc.u2', competency: 'trig.unit-circle', difficulty: 2, prompt: 'Height after 1 minute? Two decimals.', answer: num(7.86, 0.005), compute: () => wheel(1), hints: ['The angle is $\\pi/4$; $\\cos(\\pi/4) \\approx 0.7071$.'], solution: '$22 - 14.14 \\approx 7.86$ m.' }),
      item({ id: 'pc-uc.u3', competency: 'trig.unit-circle', difficulty: 3, prompt: 'For how many minutes of each 8-minute turn is a rider above 32 m? Two decimals.', answer: num(2.67, 0.005), compute: () => 8 * ((4 * Math.PI) / 3 - (2 * Math.PI) / 3) / (2 * Math.PI), hints: ['$h > 32$ means $\\cos\\theta < -1/2$.', 'That holds for $\\theta$ between $2\\pi/3$ and $4\\pi/3$ — a third of a turn.'], solution: 'A third of each turn: $8/3 \\approx 2.67$ minutes.' }),
      item({
        id: 'pc-uc.u4', competency: 'trig.unit-circle', difficulty: 3,
        prompt: 'Why is the model written with $2\\pi t / 8$ rather than $360 t / 8$?',
        answer: choice(['The cosine in calculators, spreadsheets and programming languages takes radians', 'Degrees are less accurate', 'It makes the wheel turn faster', 'No reason: both give the same heights'], 0),
        feedback: { 1: 'Both are exact; they are different units.', 2: 'The speed is set by the 8 in the denominator.', 3: '`cos(135)` in code treats 135 as radians and gives a different number.' },
        solution: 'Software trigonometry works in radians, and so do the calculus formulas the operator may need next (for example the rider’s vertical speed).',
      }),
    ],
    limits: [
      'A real wheel stops for boarding and speeds up and slows down; constant speed is a simplification.',
      'Heights are for the axle of the cabin, not a rider’s eyes.',
      'The dimensions are illustrative.',
    ],
  },

  checkpoint: [
    item({ id: 'pc-uc.c1', competency: 'trig.unit-circle', difficulty: 1, prompt: 'Write $270^\\circ$ as $k\\pi$ radians. What is $k$?', answer: num(1.5), compute: () => 270 / 180, solution: '$270/180 = 1.5$, so $270^\\circ = 1.5\\pi = 3\\pi/2$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Divide the degrees by 180: that is the multiple of $\\pi$.' }),
    item({ id: 'pc-uc.c2', competency: 'trig.unit-circle', difficulty: 2, prompt: 'What is $\\sin(5\\pi/6)$?', answer: num(0.5), compute: () => Math.sin((5 * Math.PI) / 6), solution: '$5\\pi/6 = 150^\\circ$; the point is $(-\\sqrt3/2, 1/2)$, so the sine is 0.5.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Convert to degrees (150°), find the point on the circle, and read its $y$-coordinate.' }),
    item({
      id: 'pc-uc.c3', competency: 'trig.unit-circle', difficulty: 3,
      prompt: 'A satellite dish of radius 1.2 m is turned through 0.5 radians. How far, in metres, does a point on its rim move?',
      answer: num(0.6), compute: () => 1.2 * 0.5,
      solution: '$s = r\\theta = 1.2 \\times 0.5 = 0.6$ m.',
      feedbackCorrect: 'Right — with radians, arc length is just radius times angle.', feedbackIncorrect: 'Use $s = r\\theta$ with $\\theta$ in radians.',
    }),
  ],

  python: {
    intro: 'Special angles in radians, the unit difference between sin(1) and sin(1°), and the limit that makes calculus work in radians.',
    code: `import math

for deg in [30, 60, 135, 180]:
    rad = math.radians(deg)
    print(deg, round(rad, 4), round(math.cos(rad), 4), round(math.sin(rad), 4))
print("sin(1) radians:", round(math.sin(1), 4))
print("sin(1) degrees:", round(math.sin(math.radians(1)), 4))
for h in [0.1, 0.01, 0.001]:
    print(h, round(math.sin(h) / h, 6))`,
    output: '30 0.5236 0.866 0.5\n60 1.0472 0.5 0.866\n135 2.3562 -0.7071 0.7071\n180 3.1416 -1.0 0.0\nsin(1) radians: 0.8415\nsin(1) degrees: 0.0175\n0.1 0.998334\n0.01 0.999983\n0.001 1.0',
    explain: '`math.sin` takes radians; `math.radians` converts. The last three lines show $\\sin h / h$ approaching 1 as $h$ shrinks — the limit behind $\\frac{d}{dx}\\sin x = \\cos x$.',
  },

  reading: [
    { title: '7.1 Angles', source: 'OpenStax, Precalculus 2e', url: 'https://openstax.org/books/precalculus-2e/pages/7-1-angles', note: 'Degrees, radians and arc length.' },
    { title: '7.3 Unit Circle', source: 'OpenStax, Precalculus 2e', url: 'https://openstax.org/books/precalculus-2e/pages/7-3-unit-circle', note: 'Sine and cosine as coordinates on the unit circle.' },
  ],
};
