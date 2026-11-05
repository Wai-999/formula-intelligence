// The logic behind the truth-table and induction labs, kept apart from the
// drawing so it can be tested (__tests__/labMath.test.js).

const implies = (a, b) => !a || b;

/** Two-variable propositions: a label in logic notation, the same in C++, and its truth function. */
export const EXPRESSIONS = [
  { id: 'and', label: 'p ∧ q', cpp: 'p && q', f: (p, q) => p && q },
  { id: 'or', label: 'p ∨ q', cpp: 'p || q', f: (p, q) => p || q },
  { id: 'not-and', label: '¬(p ∧ q)', cpp: '!(p && q)', f: (p, q) => !(p && q) },
  { id: 'not-or', label: '¬(p ∨ q)', cpp: '!(p || q)', f: (p, q) => !(p || q) },
  { id: 'nots-or', label: '¬p ∨ ¬q', cpp: '!p || !q', f: (p, q) => !p || !q },
  { id: 'nots-and', label: '¬p ∧ ¬q', cpp: '!p && !q', f: (p, q) => !p && !q },
  { id: 'implies', label: 'p → q', cpp: '!p || q', f: (p, q) => implies(p, q) },
  { id: 'converse', label: 'q → p', cpp: '!q || p', f: (p, q) => implies(q, p) },
  { id: 'contrapositive', label: '¬q → ¬p', cpp: 'q || !p', f: (p, q) => implies(!q, !p) },
  { id: 'xor', label: 'p ⊕ q (exactly one)', cpp: 'p != q', f: (p, q) => p !== q },
];

export const expressionById = Object.fromEntries(EXPRESSIONS.map((e) => [e.id, e]));

/** All four rows for two expressions: [{ p, q, left, right, same }], p and q from false to true. */
export function compareTable(leftId, rightId) {
  const l = expressionById[leftId].f;
  const r = expressionById[rightId].f;
  const rows = [];
  for (const p of [false, true]) {
    for (const q of [false, true]) {
      const left = l(p, q);
      const right = r(p, q);
      rows.push({ p, q, left, right, same: left === right });
    }
  }
  return rows;
}

/** 1 + 3 + … + (2n − 1). */
export const oddSum = (n) => Array.from({ length: n }, (_, i) => 2 * i + 1).reduce((a, b) => a + b, 0);

/** 1 + 2 + … + n. */
export const triangleSum = (n) => (n * (n + 1)) / 2;
