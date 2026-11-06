import { item, num, choice } from '../lessonKit.js';

// Phase 5 of the 80/20 upgrade (docs/learning-8020/PHASE5_PREREQUISITES.md):
// the idea of a function, which 16 written lessons build on — composite and
// inverse functions (a2-composition) and limits (pc-limits) directly — and
// which the placement test asks about (dx.f1, dx.f2) with no lesson behind
// it until now. Written to the professor contract from the start. All
// numbers are illustrative.

const toF = (c) => 1.8 * c + 32;

export default {
  intuition: {
    question: 'A greenhouse thermostat logs one temperature every hour. Asked “what was the temperature at 3 pm?”, there is exactly one answer. Asked “when was it 20 °C?”, there may be none, one or several. Why does one question always have a single answer and the other not — and why does that matter before you write a formula?',
    body: [
      'A **function** is a rule that gives **exactly one output for each allowed input**. Temperature as a function of time works: each hour has one reading. Time as a function of temperature does not: 20 °C may happen at 10 am and again at 6 pm.',
      'Function notation names the rule and the input: $T(15) = 21$ means “at hour 15, the temperature was 21 °C”. The brackets hold the input — $T(15)$ is read “$T$ of 15”, and it is not $T$ times 15.',
      'The **domain** is the set of inputs the rule accepts — the hours the log covers, or $x \\ge 0$ for $\\sqrt{x}$ — and the **range** is the set of outputs it actually produces. A formula such as $f(x) = 2x + 3$ is one way to state a rule; a table, a graph or a few lines of code are others.',
    ],
    simpler: [
      'Think of a vending machine. Press one button and you get one snack, every time. That is a function: button in, snack out. A machine that sometimes gave crisps and sometimes chocolate for the same button would not be one.',
      'Two buttons may give the same snack; that is allowed. What is not allowed is one button giving two different snacks.',
    ],
  },

  outcomes: [
    'Decide whether a table, a rule or a graph is a function: one output for each input.',
    'Read and evaluate function notation, such as $f(3)$ and $f(a + 1)$, and say what it means in context.',
    'State a sensible domain and range, including the inputs a formula or a real situation rules out.',
  ],

  glossary: [
    { term: '$f(x)$', meaning: 'The output of the function $f$ for the input $x$. Read “$f$ of $x$”; it is not $f$ times $x$.' },
    { term: 'Domain', meaning: 'The inputs the function accepts. A formula can rule some out ($\\sqrt{x}$ needs $x \\ge 0$, $1/x$ needs $x \\ne 0$), and so can the situation (a ride cannot be $-2$ km).' },
    { term: 'Range', meaning: 'The outputs the function actually produces as the input runs over the domain.' },
    { term: 'Vertical line test', meaning: 'A graph is a function of $x$ when no vertical line crosses it more than once: each $x$ has at most one $y$.' },
  ],

  priorCheck: [
    item({
      id: 'a1-func.pre1', competency: 'alg.slope-intercept', difficulty: 1,
      prompt: 'A ride costs $y = 2x + 3$ dollars for $x$ kilometres. What does a 4 km ride cost?',
      answer: num(11), compute: () => 2 * 4 + 3, solution: '$2 \\cdot 4 + 3 = 11$ dollars.', remedy: 'a1-slope-intercept',
    }),
    item({
      id: 'a1-func.pre2', competency: 'alg.linear-eq', difficulty: 1,
      prompt: 'Solve $2x + 3 = 11$ for $x$.',
      answer: num(4), compute: () => (11 - 3) / 2, solution: '$2x = 8$, so $x = 4$.', remedy: 'pa-equation-balance',
    }),
  ],

  visualization: {
    lab: 'function-transformations',
    config: { mode: 'line' },
    intro: 'Start from the ride fare $y = 2x + 3$ and read the table: each distance gives exactly one fare, so the fare is a function of the distance. Set $m = 0$: every distance now costs the same, and it is still a function. Notice what the lab cannot draw — a vertical line, which would give one distance infinitely many fares.',
    textAlternative: 'A graph of the line $y = mx + b$ with sliders for $m$ and $b$, a sentence giving the equation and where the line crosses the $y$-axis, and a table of $x$ and $y$ values. Every row of the table has a single $y$ for its $x$, whatever the sliders say. A vertical line, which is not a function of $x$, cannot be drawn in this form.',
  },

  derivation: {
    intro: 'Why does the vertical line test work, and where do domains come from? Both follow from the definition.',
    steps: [
      { say: 'A graph is the set of points $(x, y)$ with $y = f(x)$. If $f$ is a function, each $x$ in its domain has exactly one point above or below it:', math: '(x, y_1) \\text{ and } (x, y_2) \\text{ on the graph} \\;\\Rightarrow\\; y_1 = y_2' },
      { say: 'A vertical line is every point with one particular $x$. So it meets the graph of a function at most once. If some vertical line meets a graph twice, that $x$ has two outputs, and the graph is not a function of $x$:', math: 'x = c \\text{ meets the graph only at } \\big(c, f(c)\\big)' },
      { say: 'The circle $x^2 + y^2 = 25$ fails: at $x = 3$, both $y = 4$ and $y = -4$ work. Solving for $y$ shows the two outputs:', math: 'y = \\pm\\sqrt{25 - x^2}' },
      { say: 'Keeping one sign gives a function: the top half, $y = \\sqrt{25 - x^2}$, has one output for each $x$. Its domain is where the square root is defined; its range is the outputs it reaches:', math: '25 - x^2 \\ge 0 \\iff -5 \\le x \\le 5, \\qquad 0 \\le y \\le 5' },
    ],
    assumptions: [
      'Inputs and outputs are numbers here. In general a function can take and return anything: a name, a list, an image.',
      'A graph shows only part of a function; the vertical line test applies to the part you can see.',
    ],
    domain: [
      'A formula’s natural domain leaves out inputs that break it: division by zero, or an even root of a negative number.',
      'A model’s domain is often smaller than its formula’s: the fare formula accepts $x = -2$, but no ride is $-2$ km long.',
      'One output for each input does not mean one input for each output: $f(x) = x^2$ gives 9 for both 3 and $-3$, and is still a function.',
    ],
  },

  examples: [
    {
      title: 'Evaluating with notation',
      problem: 'For $f(x) = x^2 - 3x$, find $f(4)$, $f(-2)$ and $f(a + 1)$.',
      steps: [
        '$f(4) = 16 - 12 = 4$.',
        '$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$. Brackets around a negative input keep its sign: $(-2)^2 = 4$, not $-4$.',
        '$f(a + 1) = (a + 1)^2 - 3(a + 1) = a^2 + 2a + 1 - 3a - 3 = a^2 - a - 2$. Check with $a = 3$: $f(4) = 4$, and $9 - 3 - 2 = 4$.',
      ],
      answer: '$f(4) = 4$, $f(-2) = 10$ and $f(a + 1) = a^2 - a - 2$',
      check: { value: 10, compute: () => (-2) ** 2 - 3 * -2, tolerance: 1e-12 },
      tempting: {
        wrong: 'Tempting: read $f(a + 1)$ as $f(a) + 1$, which gives $a^2 - 3a + 1$.',
        why: '$f(a + 1)$ means “put $a + 1$ wherever the rule has $x$”, so every $x$ becomes $(a + 1)$. With $a = 3$ the two readings disagree: $f(4) = 4$, but $f(3) + 1 = 0 + 1 = 1$.',
      },
    },
    {
      title: 'Is this table a function?',
      problem: 'A phone plan’s records list (minutes used, bill in dollars): (100, 20), (250, 20), (400, 32) and (400, 35). Is the bill a function of the minutes used?',
      steps: [
        'Look for an input that appears twice with different outputs.',
        '400 minutes appears with \\$32 and with \\$35, so this table does not make the bill a function of minutes: something else, perhaps data use, also affects the bill.',
        '100 and 250 minutes both give \\$20. Two inputs sharing an output is allowed.',
      ],
      answer: 'Not a function: one input, 400 minutes, has two bills',
      check: {
        value: 1,
        compute: () => {
          const seen = new Map();
          for (const [m, b] of [[100, 20], [250, 20], [400, 32], [400, 35]]) seen.set(m, new Set([...(seen.get(m) ?? []), b]));
          return [...seen.values()].filter((s) => s.size > 1).length;
        },
      },
    },
    {
      title: 'Domain and range of a model',
      problem: 'A cinema sells tickets at \\$12 and its hall has 150 seats, so revenue is $R(n) = 12n$ dollars for $n$ tickets. What are a sensible domain and range, and what is $R(150)$?',
      steps: [
        'The formula accepts any number; the situation does not. $n$ is a whole number of tickets from 0 to 150.',
        'So the domain is $\\{0, 1, 2, \\ldots, 150\\}$, and the range is $\\{0, 12, 24, \\ldots, 1800\\}$ dollars.',
        '$R(150) = 12 \\times 150 = 1800$: the most one show can bring in.',
      ],
      answer: '$R(150) = \\$1800$; the domain is the whole numbers from 0 to 150',
      check: { value: 1800, compute: () => 12 * 150 },
    },
  ],

  counterexample: {
    title: 'A rule that is not a function',
    body: [
      '“The square root of 9” is often said to be “3 or −3”. If $\\sqrt{x}$ meant both, $\\sqrt{9}$ would have two outputs and $\\sqrt{x}$ would not be a function. That is why $\\sqrt{x}$ is defined as the **non-negative** root: $\\sqrt{9} = 3$, while the equation $y^2 = 9$ has the two solutions $\\pm 3$.',
      'Graphs show the same thing. The sideways parabola $x = y^2$ fails the vertical line test — at $x = 4$ it passes through $(4, 2)$ and $(4, -2)$ — so $y$ is not a function of $x$, even though $x$ is a function of $y$.',
    ],
  },

  predict: {
    prompt: 'For $f(x) = 3x + 2$, what is $f(2x)$?',
    choices: ['$6x + 2$', '$6x + 4$', '$3x + 4$', '$2x + 2$'],
    answer: 0,
    reveal: 'Replace every $x$ in the rule by $2x$: $f(2x) = 3(2x) + 2 = 6x + 2$. Doubling the input is not doubling the output: $2f(x) = 6x + 4$, a different function. With $x = 1$: $f(2) = 8$, while $2f(1) = 10$.',
    misconception: {
      belief: '$f(2x)$ is the same as $2f(x)$: the 2 can be moved outside.',
      correction: 'The brackets hold the input. $f(2x)$ feeds $2x$ into the rule; $2f(x)$ doubles the output. They agree only for special rules, such as $f(x) = 3x$ with no constant term.',
    },
  },

  faded: {
    title: 'A parking fee',
    problem: 'A car park charges $P(h) = 4 + 2.5h$ dollars for a stay of $h$ hours, up to a maximum stay of 10 hours. Find $P(3)$, how much an extra hour adds, and the most the car park can charge.',
    steps: [
      { say: 'Name the rule, the input and the output: $P$ takes hours, $h$, and returns dollars. The domain is $0 < h \\le 10$.' },
      {
        say: 'Evaluate at a number:',
        item: item({ id: 'a1-func.f1', competency: 'func.notation', difficulty: 1, level: 'scaffolded', prompt: 'What is $P(3)$, in dollars?', answer: num(11.5), compute: () => 4 + 2.5 * 3, hints: ['Replace $h$ by 3: $4 + 2.5 \\times 3$.'], solution: '$4 + 7.5 = 11.5$ dollars.' }),
      },
      {
        say: 'Evaluate at an expression. One hour more than $h$ is $P(h + 1) = 4 + 2.5(h + 1) = 6.5 + 2.5h$.',
        item: item({ id: 'a1-func.f2', competency: 'func.notation', difficulty: 2, level: 'scaffolded', prompt: 'How much more is $P(h + 1)$ than $P(h)$, in dollars?', answer: num(2.5), compute: () => (4 + 2.5 * (3 + 1)) - (4 + 2.5 * 3), hints: ['Subtract: $(6.5 + 2.5h) - (4 + 2.5h)$.'], solution: '\\$2.50, the slope of the rule. It is not $P(h) + 1$, which would add one dollar.' }),
      },
      {
        say: 'The range is the fees the car park can actually charge as $h$ runs over the domain.',
        item: item({ id: 'a1-func.f3', competency: 'func.notation', difficulty: 2, level: 'scaffolded', prompt: 'What is the largest possible fee, in dollars?', answer: num(29), compute: () => 4 + 2.5 * 10, hints: ['The fee grows with $h$, so the largest fee is at the longest stay, $h = 10$.'], solution: '$P(10) = 4 + 25 = 29$ dollars. The range is $4 < P \\le 29$.' }),
      },
    ],
    answer: '$P(3) = \\$11.50$; each extra hour adds \\$2.50, so $P(h + 1) = P(h) + 2.5$; fees run from just over \\$4 up to \\$29.',
  },

  practice: [
    item({ id: 'a1-func.p1', competency: 'func.notation', difficulty: 1, level: 'scaffolded', prompt: 'If $g(x) = 5 - x^2$, what is $g(3)$?', answer: num(-4), compute: () => 5 - 3 ** 2, hints: ['Replace $x$ by 3: $5 - 3^2$.'], solution: '$5 - 9 = -4$.' }),
    item({ id: 'a1-func.p2', competency: 'func.notation', difficulty: 1, level: 'scaffolded', prompt: 'If $h(t) = 2t^2 + 1$, what is $h(-1)$?', answer: num(3), compute: () => 2 * (-1) ** 2 + 1, hints: ['Square first: $(-1)^2 = 1$.'], solution: '$2(-1)^2 + 1 = 2 + 1 = 3$.' }),
    item({ id: 'a1-func.p3', competency: 'func.notation', difficulty: 2, level: 'independent', prompt: 'For $f(x) = 4x - 7$, which input gives the output 13? (Solve $f(x) = 13$.)', answer: num(5), compute: () => (13 + 7) / 4, hints: ['$4x - 7 = 13$.'], solution: '$4x = 20$, so $x = 5$. Check: $f(5) = 13$.' }),
    item({ id: 'a1-func.p4', competency: 'func.notation', difficulty: 2, level: 'independent', prompt: 'For $f(x) = x^2 + 2x$, find $f(a + 2) - f(a)$ when $a = 1$.', answer: num(12), compute: () => (3 ** 2 + 2 * 3) - (1 ** 2 + 2 * 1), hints: ['Work out the input first: $a + 2 = 3$.', '$f(3) = 15$ and $f(1) = 3$.'], solution: '$f(3) - f(1) = 15 - 3 = 12$.' }),
    item({
      id: 'a1-func.p5', competency: 'func.notation', difficulty: 2, level: 'independent',
      prompt: 'Which of these makes $y$ a function of $x$?',
      answer: choice(['$y = |x - 2|$', '$x = y^2$', 'A table with the rows $(1, 4)$ and $(1, 6)$', 'The circle $x^2 + y^2 = 1$'], 0),
      hints: ['For each one, look for a single $x$ with two different $y$ values.'],
      feedback: { 1: 'At $x = 4$, both $y = 2$ and $y = -2$ satisfy $x = y^2$.', 2: 'The input 1 has two outputs, 4 and 6.', 3: 'At $x = 0$, both $y = 1$ and $y = -1$ are on the circle.' },
      solution: '$|x - 2|$ gives exactly one value for each $x$. Each of the others gives some $x$ two outputs.',
    }),
    item({
      id: 'a1-func.p6', competency: 'func.notation', difficulty: 3, level: 'transfer',
      prompt: 'A phone’s battery level is $B(t) = 100 - 8t$ percent, $t$ hours after it is unplugged, until it reaches 0. What is the largest sensible value of $t$ in the domain of $B$, in hours?',
      answer: num(12.5), compute: () => 100 / 8,
      hints: ['The model stops making sense when the battery reaches 0.', 'Solve $100 - 8t = 0$.'],
      solution: '$t = 12.5$ hours. The domain is $0 \\le t \\le 12.5$ and the range $0 \\le B \\le 100$: past 12.5 hours the formula gives negative percentages, which a battery cannot have.',
    }),
  ],

  apply: {
    scenario: 'The greenhouse sensor reports Celsius, but the grower’s controller wants Fahrenheit: $F(c) = 1.8c + 32$. The sensor is rated from −40 °C to 60 °C. You are writing the conversion step of the data pipeline.',
    steps: [
      'Convert a reading with function notation.',
      'Find the range of outputs the pipeline must accept.',
      'Read the rule backwards, and catch a notation mistake in a report.',
    ],
    items: [
      item({ id: 'a1-func.u1', competency: 'func.notation', difficulty: 1, prompt: 'What is $F(25)$, in °F?', answer: num(77), compute: () => toF(25), hints: ['$1.8 \\times 25 + 32$.'], solution: '$45 + 32 = 77$ °F.' }),
      item({ id: 'a1-func.u2', competency: 'func.notation', difficulty: 2, prompt: 'Over the sensor’s rated domain, −40 °C to 60 °C, the largest output is $F(60)$. What is it, in °F?', answer: num(140), compute: () => toF(60), hints: ['$F$ rises with $c$, so its largest value is at the top of the domain.'], solution: '$F(60) = 108 + 32 = 140$ °F. The range is −40 °F to 140 °F — and −40 is the one temperature that is the same on both scales.' }),
      item({ id: 'a1-func.u3', competency: 'func.notation', difficulty: 2, prompt: 'The controller logged 50 °F. Which Celsius reading produced it?', answer: num(10), compute: () => (50 - 32) / 1.8, hints: ['Solve $1.8c + 32 = 50$.'], solution: '$1.8c = 18$, so $c = 10$ °C. Each Fahrenheit value comes from exactly one Celsius value here, so the conversion can be undone.' }),
      item({
        id: 'a1-func.u4', competency: 'func.notation', difficulty: 3,
        prompt: 'A report says: “At noon the sensor read 20 °C and then rose 5 degrees, so the controller saw $F(20 + 5) = F(20) + 5 = 73$ °F.” What is wrong?',
        answer: choice(['$F(20 + 5)$ is $F(25) = 77$ °F: a rise of 5 °C is a rise of 9 °F', 'Nothing: $F(20) + 5 = 73$ is right', '$F(20 + 5)$ means $F(20) \\times 5$', 'Fahrenheit cannot be computed from a changing reading'], 0),
        feedback: { 1: '$F(20) + 5$ adds 5 to the output. The input changed by 5 °C, and each degree Celsius is 1.8 °F.', 2: 'The brackets hold the input, $20 + 5 = 25$; nothing is multiplied.', 3: 'Any reading can be converted; the question is which input goes into $F$.' },
        solution: '$F(25) = 77$ °F, not 73. Changing the input by 5 changes the output by $1.8 \\times 5 = 9$ — the same mistake as reading $f(a + 1)$ as $f(a) + 1$.',
      }),
    ],
    limits: [
      'Outside the rated range a reading is a sensor fault, not a temperature; the pipeline should reject it rather than convert it.',
      'A conversion is exact, but the reading it converts carries the sensor’s own error (often ±0.5 °C).',
      'Code that returns different outputs for the same input — a random number, a value read from a clock — is not a function in this sense, and is harder to test.',
    ],
  },

  checkpoint: [
    item({ id: 'a1-func.c1', competency: 'func.notation', difficulty: 1, prompt: 'If $f(x) = 7 - 2x$, what is $f(-3)$?', answer: num(13), compute: () => 7 - 2 * -3, solution: '$7 - 2(-3) = 7 + 6 = 13$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Replace $x$ by $(-3)$, brackets and all: $7 - 2(-3)$.' }),
    item({ id: 'a1-func.c2', competency: 'func.notation', difficulty: 2, prompt: 'For $f(x) = x^2 + 1$, what is $f(2x)$ when $x = 3$?', answer: num(37), compute: () => (2 * 3) ** 2 + 1, solution: 'The input is $2x = 6$, so $f(6) = 36 + 1 = 37$.', feedbackCorrect: 'Right — and $2f(3) = 20$ was the trap.', feedbackIncorrect: 'Work out the input first, $2x = 6$, then compute $f(6)$. Doubling $f(3)$ gives a different number.' }),
    item({
      id: 'a1-func.c3', competency: 'func.notation', difficulty: 2,
      prompt: 'A school list pairs each student ID with that student’s birthday. Which statement is right?',
      answer: choice(['Birthday is a function of ID; ID is not a function of birthday', 'Both are functions', 'Neither is a function', 'ID is a function of birthday; birthday is not a function of ID'], 0),
      feedback: { 1: 'Two students can share a birthday, so one birthday can have two IDs.', 2: 'Each student has exactly one birthday, so birthday is a function of ID.', 3: 'It is the other way round: a birthday can belong to several students.' },
      solution: 'Each ID has one birthday, so birthday is a function of ID. A birthday can belong to several students, so ID is not a function of birthday.',
      feedbackCorrect: 'Right.', feedbackIncorrect: 'For each direction, ask whether one input can ever have two outputs.',
    }),
    item({
      id: 'a1-func.c4', competency: 'func.notation', difficulty: 3,
      prompt: 'In Python, `def f(x): return 10 / (x - 4)` works for every number but one, which raises an error. Which input is outside the domain of $f(x) = \\dfrac{10}{x - 4}$?',
      answer: num(4), compute: () => 4,
      solution: 'At $x = 4$ the code divides by zero (Python raises `ZeroDivisionError`), so 4 is not in the domain; every other number is.',
      feedbackCorrect: 'Right — the domain is every number except 4.', feedbackIncorrect: 'The function divides by $x - 4$. Which $x$ makes that zero?',
    }),
  ],

  python: {
    intro: 'A rule written as code, and a check that finds the inputs of a table with more than one output.',
    code: `def fare(km):
    return 3 + 2 * km

print("fare(4) =", fare(4))
print("fare(4.5) =", fare(4.5))

rows = [(100, 20), (250, 20), (400, 32), (400, 35)]
outputs = {}
for minutes, bill in rows:
    outputs.setdefault(minutes, set()).add(bill)
clashes = {m: sorted(b) for m, b in outputs.items() if len(b) > 1}
print("inputs with more than one output:", clashes)
print("a function of minutes?", not clashes)`,
    output: 'fare(4) = 11\nfare(4.5) = 12.0\ninputs with more than one output: {400: [32, 35]}\na function of minutes? False',
    explain: 'A Python function behaves like a mathematical one when it always returns the same output for the same input. The table check collects every output seen for each input and reports the one input, 400 minutes, that has two.',
  },

  reading: [
    { title: '3.1 Functions and Function Notation', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/3-1-functions-and-function-notation', note: 'The definition, notation, tables and the vertical line test.' },
    { title: '3.2 Domain and Range', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/3-2-domain-and-range', note: 'Finding domains from formulas and from graphs.' },
  ],
};
