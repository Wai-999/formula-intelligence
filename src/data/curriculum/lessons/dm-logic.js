import { item, num, choice } from '../lessonKit.js';
import { compareTable } from '../../../features/labs/logic.js';

// V5 Computer Science track: Ohlone CS-113 preparation (propositional
// logic). Conditions in code are propositions; truth tables decide
// equivalence completely for a handful of variables. The access and fraud
// rules are illustrative.

/** Rows (of 2^n) where f is true, over all true/false combinations. */
function countTrue(n, f) {
  let c = 0;
  for (let m = 0; m < 2 ** n; m += 1) {
    const v = Array.from({ length: n }, (_, i) => Boolean((m >> (n - 1 - i)) & 1));
    if (f(...v)) c += 1;
  }
  return c;
}

export default {
  intuition: {
    question: 'An access rule says: deny the request unless the user is an admin or the owner. One teammate writes `if (!(isAdmin || isOwner)) deny();`, another `if (!isAdmin || !isOwner) deny();`. One of them just locked the owner out of their own account. Which one — and how can you be sure without testing every user?',
    body: [
      'A **proposition** is a statement that is true or false: “the user is an admin”. Conditions in code are propositions joined with **and** (`&&`, written $\\wedge$), **or** (`||`, $\\vee$) and **not** (`!`, $\\neg$).',
      'With two propositions there are only four cases (true/false for each). A **truth table** lists all four, so comparing two conditions row by row is a complete proof — no test suite needed.',
      'For the owner who is not an admin, `!isAdmin || !isOwner` is true (because `!isAdmin` is), so the owner is denied. The first version is right: by **De Morgan’s law**, $\\neg(a \\vee o) \\equiv \\neg a \\wedge \\neg o$ — deny only when the user is neither.',
    ],
  },

  glossary: [
    { term: '$p \\wedge q$ (`p && q`)', say: 'p and q', meaning: '**and**: true only when both are true.' },
    { term: '$p \\vee q$ (`p || q`)', say: 'p or q', meaning: '**or**: true when at least one is true.' },
    { term: '$\\neg p$ (`!p`)', say: 'not p', meaning: '**not**: true exactly when $p$ is false.' },
    { term: '$p \\to q$', say: 'if p then q', meaning: '**implies** (“if $p$ then $q$”): false only when $p$ is true and $q$ is false.' },
    { term: '$\\equiv$', say: 'is equivalent to', meaning: '**equivalent**: true in exactly the same rows of the truth table.' },
  ],

  priorCheck: [
    item({
      id: 'dm-logic.pre1', competency: 'cpp.basics', difficulty: 1,
      prompt: 'In C++, is `(3 > 2) && (1 > 4)` true or false?',
      answer: choice(['true', 'false'], 1), feedback: { 0: '`1 > 4` is false, and `&&` needs both sides true.' },
      solution: 'The left side is true, the right side false; “and” is false.',
    }),
    item({
      id: 'dm-logic.pre2', competency: 'arith.exponents', difficulty: 1,
      prompt: 'Each of two switches can be on or off. How many different on/off combinations are there?',
      answer: num(4), compute: () => 2 ** 2, solution: '$2 \\times 2 = 4$: off-off, off-on, on-off, on-on.',
    }),
  ],

  visualization: {
    lab: 'truth-table',
    intro: 'Compare two conditions on all four cases. Start with De Morgan’s law, then try the common bug and the converse of an implication.',
    textAlternative: 'The lab shows a four-row truth table for two chosen conditions and marks rows where they differ. ¬(p ∧ q) and ¬p ∨ ¬q agree in every row (equivalent); ¬(p ∧ q) and ¬p ∧ ¬q differ in two rows; p → q and q → p differ in two rows; p → q and ¬q → ¬p agree in every row.',
  },

  derivation: {
    intro: 'Why is $\\neg(p \\wedge q)$ the same as $\\neg p \\vee \\neg q$ — always, not just in the cases you tried?',
    steps: [
      { say: 'Two propositions have exactly $2^2 = 4$ combinations of truth values. A truth table checks all of them, so agreement in every row is a complete proof.' },
      { say: '$\\neg(p \\wedge q)$ is false only when $p \\wedge q$ is true — the single row where both $p$ and $q$ are true.' },
      { say: '$\\neg p \\vee \\neg q$ is false only when $\\neg p$ and $\\neg q$ are both false — that same single row. Same false row, same true rows:', math: '\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q, \\qquad \\neg(p \\vee q) \\equiv \\neg p \\wedge \\neg q' },
      { say: 'An implication is false in one row only ($p$ true, $q$ false). Its contrapositive $\\neg q \\to \\neg p$ is false in exactly that row too, so they are equivalent; the converse $q \\to p$ is false in a different row, so it is not:', math: 'p \\to q \\;\\equiv\\; \\neg q \\to \\neg p \\;\\equiv\\; \\neg p \\vee q' },
    ],
    assumptions: [
      'Two-valued logic: every proposition is either true or false.',
    ],
    domain: [
      'A table for $n$ propositions has $2^n$ rows: complete for a few, impractical for 40. Then algebraic laws (De Morgan, distributivity) do the work.',
      'Statements with “for all” or “there exists” over infinitely many values cannot be settled by a finite table.',
    ],
  },

  examples: [
    {
      title: 'Simplifying a condition with De Morgan',
      problem: 'Rewrite `!(x > 0 && y > 0)` without the outer `!`.',
      steps: ['De Morgan: $\\neg(A \\wedge B) \\equiv \\neg A \\vee \\neg B$.', '`!(x > 0)` is `x <= 0`, and `!(y > 0)` is `y <= 0`.', 'So the condition is `x <= 0 || y <= 0`: at least one of them is not positive.'],
      answer: '`x <= 0 || y <= 0`',
      check: { value: 4, compute: () => compareTable('not-and', 'nots-or').filter((r) => r.same).length },
    },
    {
      title: 'When is an implication broken?',
      problem: 'Rule: “if an order is over \\$50, shipping is free”. Which of these breaks it: (a) \\$60 order, free shipping; (b) \\$40, paid shipping; (c) \\$40, free shipping; (d) \\$60, paid shipping?',
      steps: ['$p$ = “over \\$50”, $q$ = “free shipping”. $p \\to q$ is false only when $p$ is true and $q$ false.', '(c) is allowed: the rule says nothing about small orders.', 'Only (d) breaks it.'],
      answer: 'only (d)',
      check: { value: 1, compute: () => countTrue(2, (p, q) => p && !q) },
    },
  ],

  counterexample: {
    title: 'The converse is a different claim',
    body: [
      '“If it rained, the street is wet” is true. “If the street is wet, it rained” is not — a street-cleaning truck also wets it.',
      'In code reviews this shows up as “every admin can see the page, so everyone who sees the page is an admin”: a converse, and a security bug.',
    ],
  },

  predict: {
    prompt: 'Which condition is equivalent to `!(a || b)`?',
    choices: ['`!a && !b`', '`!a || !b`', '`a && b`', '`!a || b`'],
    answer: 0,
    reveal: '`!(a || b)` is true only when neither is true: `!a && !b`. Negating swaps `||` for `&&` and negates each part.',
    misconception: {
      belief: 'The `!` can be pushed into the brackets unchanged: `!(a || b)` = `!a || !b`.',
      correction: 'Negation flips the connective as well: `||` becomes `&&` and `&&` becomes `||`. That is De Morgan’s law.',
    },
  },

  practice: [
    item({
      id: 'dm-logic.p1', competency: 'dm.logic', difficulty: 1, level: 'scaffolded',
      prompt: '$p$ is true and $q$ is false. Is $p \\vee q$ true or false? (“or” needs at least one true.)',
      answer: choice(['true', 'false'], 0), feedback: { 1: 'Only one side needs to be true, and $p$ is.' },
      solution: 'True: $p$ alone is enough.',
    }),
    item({ id: 'dm-logic.p2', competency: 'dm.logic', difficulty: 1, level: 'scaffolded', prompt: 'How many rows does a truth table for three propositions $p, q, r$ have? (Two choices for each.)', answer: num(8), compute: () => 2 ** 3, hints: ['$2 \\times 2 \\times 2$.'], solution: '$2^3 = 8$ rows.' }),
    item({
      id: 'dm-logic.p3', competency: 'dm.logic', difficulty: 2, level: 'independent',
      prompt: 'For which values is $p \\to q$ false?',
      answer: choice(['$p$ true, $q$ false', '$p$ false, $q$ true', '$p$ false, $q$ false', 'Never'], 0),
      feedback: { 1: 'A false premise makes the implication true (it promises nothing).', 2: 'Also true: nothing was promised.', 3: 'It is false in exactly one row.' },
      solution: 'Only when the promise is triggered ($p$) and not kept ($\\neg q$).',
    }),
    item({
      id: 'dm-logic.p4', competency: 'dm.logic', difficulty: 2, level: 'independent',
      prompt: 'Which C++ condition means “`x` is outside the range 10 to 20, inclusive”?',
      answer: choice(['`x < 10 || x > 20`', '`x < 10 && x > 20`', '`!(x < 10 || x > 20)`', '`x <= 10 || x >= 20`'], 0),
      feedback: { 1: 'No number is both below 10 and above 20: always false.', 2: 'That is “inside the range”.', 3: 'That also counts 10 and 20, which are inside.' },
      solution: 'Inside is `x >= 10 && x <= 20`; by De Morgan its negation is `x < 10 || x > 20`.',
    }),
    item({ id: 'dm-logic.p5', competency: 'dm.logic', difficulty: 2, level: 'independent', prompt: 'In how many of the four rows is $p \\wedge \\neg q$ true?', answer: num(1), compute: () => countTrue(2, (p, q) => p && !q), hints: ['It needs $p$ true and $q$ false.'], solution: 'One row: $p$ true, $q$ false.' }),
    item({
      id: 'dm-logic.p6', competency: 'dm.logic', difficulty: 3, level: 'transfer',
      prompt: 'Policy: “deny the request unless the user is an admin or the owner”. Which `condition` in `if (condition) deny();` implements it?',
      answer: choice(['`!(isAdmin || isOwner)`', '`!isAdmin || !isOwner`', '`!(isAdmin && isOwner)`', '`isAdmin || isOwner`'], 0),
      feedback: { 1: 'This denies the owner who is not an admin.', 2: 'Equivalent to the previous option — same bug.', 3: 'That denies exactly the people who should get in.' },
      hints: ['“Unless A” means “if not A”.'],
      solution: 'Deny when not (admin or owner), i.e. `!(isAdmin || isOwner)`, which by De Morgan is `!isAdmin && !isOwner`.',
    }),
  ],

  apply: {
    scenario: 'A bank flags a card payment for review when it is abroad and over \\$500, or when it is the third payment in ten minutes. The rule in the code reads `!( !(abroad && over500) && !thirdIn10 )`, and an engineer wants to simplify it before release.',
    steps: [
      'Simplify the condition with De Morgan’s law.',
      'Count how many input combinations it flags.',
      'Decide how to check the rewrite before shipping.',
    ],
    items: [
      item({
        id: 'dm-logic.u1', competency: 'dm.logic', difficulty: 2,
        prompt: 'Which simpler condition is equivalent?',
        answer: choice(['`(abroad && over500) || thirdIn10`', '`abroad && over500 && thirdIn10`', '`!abroad || !over500 || thirdIn10`', '`abroad || over500 || thirdIn10`'], 0),
        feedback: { 1: 'That needs all three at once.', 2: 'Only the inner part was negated here.', 3: 'This flags every payment abroad, of any size.' },
        solution: 'With $X$ = `abroad && over500` and $Y$ = `thirdIn10`: $\\neg(\\neg X \\wedge \\neg Y) \\equiv X \\vee Y$.',
      }),
      item({ id: 'dm-logic.u2', competency: 'dm.logic', difficulty: 2, prompt: 'Of the 8 combinations of the three yes/no inputs, how many are flagged?', answer: num(5), compute: () => countTrue(3, (a, o, t) => (a && o) || t), hints: ['Every combination with `thirdIn10` true is flagged: that is 4.', 'Plus the ones with abroad and over \\$500 but not third.'], solution: '4 with `thirdIn10`, plus 1 more (abroad, over \\$500, not third): 5.' }),
      item({
        id: 'dm-logic.u3', competency: 'dm.logic', difficulty: 3,
        prompt: 'A tester checks the simplified rule on three hand-picked payments and it agrees with the old one. Is that enough?',
        answer: choice(['No: with three inputs there are 8 cases — check all 8, or prove it with De Morgan', 'Yes: three tests are always enough', 'Yes, if all three payments were flagged', 'No: logic can never be fully checked'], 0),
        feedback: { 1: 'Three of eight cases leave five unchecked.', 2: 'Flagged cases say nothing about the unflagged ones.', 3: 'Eight rows can be checked exhaustively; that is the point.' },
        solution: 'Exhaustive checking is cheap here (8 rows), and the algebra proves it for certain.',
      }),
    ],
    limits: [
      'Logic shows two rules mean the same; it cannot show the rule is a good fraud policy.',
      'Real inputs need care too: amounts in several currencies, time zones in “ten minutes”.',
      'The rule is illustrative.',
    ],
  },

  checkpoint: [
    item({
      id: 'dm-logic.c1', competency: 'dm.logic', difficulty: 1,
      prompt: '$p$ is false and $q$ is true. Is $\\neg p \\wedge q$ true or false?',
      answer: choice(['true', 'false'], 0), feedback: { 1: '$\\neg p$ is true and $q$ is true, so “and” is true.' },
      solution: 'Both parts are true.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Work out $\\neg p$ first, then combine it with $q$.',
    }),
    item({
      id: 'dm-logic.c2', competency: 'dm.logic', difficulty: 2,
      prompt: 'Which is the contrapositive of “if a program compiles, it has no syntax errors”?',
      answer: choice(['If a program has syntax errors, it does not compile', 'If a program has no syntax errors, it compiles', 'If a program does not compile, it has syntax errors', 'A program compiles and has syntax errors'], 0),
      feedback: { 1: 'That is the converse ($q \\to p$).', 2: 'That is the inverse ($\\neg p \\to \\neg q$) — not equivalent either.', 3: 'That is the negation of the statement.' },
      solution: '$p \\to q$ becomes $\\neg q \\to \\neg p$: swap and negate both parts.',
      feedbackCorrect: 'Right — and it means the same as the original.', feedbackIncorrect: 'Swap the two parts and negate both.',
    }),
    item({
      id: 'dm-logic.c3', competency: 'dm.logic', difficulty: 3,
      prompt: 'For how many of the four combinations of `a` and `b` is `(a || b) && !(a && b)` true?',
      answer: num(2), compute: () => countTrue(2, (a, b) => (a || b) && !(a && b)),
      solution: 'True when at least one is true but not both: exactly one is true — 2 of the 4 rows. This is “exclusive or”, `a != b` for bools.',
      feedbackCorrect: 'Right — that is exclusive or.', feedbackIncorrect: 'Make the four-row table: work out `a || b` and `!(a && b)` in each row, then combine.',
    }),
  ],

  python: {
    intro: 'Check equivalences by brute force over every row — the same thing the truth table does.',
    code: `from itertools import product

def implies(p, q):
    return (not p) or q

rows = list(product([False, True], repeat=2))
print("De Morgan holds:", all((not (p and q)) == ((not p) or (not q)) for p, q in rows))
print("converse equivalent:", all(implies(p, q) == implies(q, p) for p, q in rows))
print("contrapositive equivalent:", all(implies(p, q) == implies(not q, not p) for p, q in rows))
for p, q in rows:
    print(p, q, implies(p, q), implies(q, p))`,
    output: 'De Morgan holds: True\nconverse equivalent: False\ncontrapositive equivalent: True\nFalse False True True\nFalse True True False\nTrue False False True\nTrue True True True',
    explain: '`product([False, True], repeat=2)` lists all four rows, so `all(...)` is a complete check. The last two columns show where an implication and its converse disagree.',
  },

  reading: [
    { title: 'Mathematics for Computer Science, chapter 3: Logical Formulas', source: 'MIT OpenCourseWare (6.042J, Spring 2015)', url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/', note: 'Propositional logic, truth tables and equivalence, with exercises.' },
  ],
};
