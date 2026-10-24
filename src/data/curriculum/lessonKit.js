// Constructors for lesson content, so every lesson file states items the
// same way and the validator (src/data/curriculum/validate.js) can check
// them uniformly.

/** A numeric answer; `tolerance` is absolute unless `relative` is true. */
export const num = (value, tolerance = 1e-9, relative = false) => ({ type: 'numeric', value, tolerance, relative });

/** A multiple-choice answer: `correct` is the index into `choices`. */
export const choice = (choices, correct) => ({ type: 'choice', choices, correct });

/** Several numeric blanks answered together (e.g. vector components). */
export const multi = (values, labels, tolerance = 1e-9) => ({ type: 'multi', values, labels, tolerance });

/**
 * An assessable item.
 *   id          stable, unique across the curriculum (evidence refers to it)
 *   competency  the competency id this item is evidence for
 *   difficulty  1 (direct), 2 (multi-step), 3 (transfer / unfamiliar)
 *   level       'scaffolded' | 'independent' | 'transfer' (practice only)
 *   prompt      authored text (MathText format)
 *   answer      num(...) | choice(...) | multi(...)
 *   hints       progressively stronger hints
 *   solution    worked solution shown after an attempt
 *   feedback    { [choiceIndex]: why that choice is tempting and wrong }
 *   compute     optional () => number — an independent recomputation that
 *               the test suite compares against answer.value
 */
export function item(fields) {
  return { difficulty: 1, hints: [], feedback: {}, transfer: fields.level === 'transfer' || fields.difficulty === 3, ...fields };
}

/** Dot product, for independent recomputation of vector answers in tests. */
export const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
