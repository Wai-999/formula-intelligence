// Checking learner answers (§9: "never use fragile exact-string matching for
// floating point"). Numeric answers are parsed, then compared with a
// tolerance the item declares; the learner may type an integer, a decimal,
// a fraction ("3/4"), a mixed sign ("-2.5") or scientific notation ("1e-3").

/** Parse a typed number. Returns a finite number or null. */
export function parseNumber(input) {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  const s = String(input ?? '')
    .trim()
    .replace(/[−–]/g, '-') // typographic minus signs
    .replace(/,/g, '')
    .replace(/\s+/g, '');
  if (!s) return null;
  const frac = s.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
  if (frac) {
    const den = Number(frac[2]);
    if (den === 0) return null;
    const v = Number(frac[1]) / den;
    return Number.isFinite(v) ? v : null;
  }
  const pct = s.match(/^([+-]?\d*\.?\d+)%$/);
  if (pct) return Number(pct[1]) / 100;
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return null;
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

/**
 * Compare a value with an expected answer. `tolerance` is absolute unless
 * `relative` is set; the default (1e-9 absolute) accepts exact answers typed
 * as fractions or decimals of the same value.
 */
export function numericMatches(value, expected, { tolerance = 1e-9, relative = false } = {}) {
  if (value === null || !Number.isFinite(expected)) return false;
  const err = Math.abs(value - expected);
  return relative ? err <= tolerance * Math.max(1, Math.abs(expected)) : err <= tolerance;
}

/**
 * Check a response against an item's answer spec.
 * Returns { correct, parsed, reason } — reason explains a rejection the
 * learner can act on ("not a number" differs from "wrong number").
 */
export function checkAnswer(answer, response) {
  if (!answer) return { correct: false, reason: 'This item has no answer key.' };
  if (answer.type === 'choice') {
    const correct = Number(response) === answer.correct;
    return { correct, parsed: Number(response) };
  }
  if (answer.type === 'numeric') {
    const parsed = parseNumber(response);
    if (parsed === null) return { correct: false, parsed: null, reason: 'Enter a number, like 2, -0.5 or 3/4.' };
    return { correct: numericMatches(parsed, answer.value, answer), parsed };
  }
  if (answer.type === 'multi') {
    // Several numeric blanks, all required (e.g. a vector's components).
    const values = Array.isArray(response) ? response.map(parseNumber) : [];
    if (values.length !== answer.values.length || values.some((v) => v === null)) {
      return { correct: false, parsed: values, reason: `Enter ${answer.values.length} numbers.` };
    }
    const correct = values.every((v, i) => numericMatches(v, answer.values[i], answer));
    return { correct, parsed: values };
  }
  return { correct: false, reason: `Unknown answer type ${answer.type}.` };
}
