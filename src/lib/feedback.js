// What to say after a wrong answer (docs/learning-8020/LEARNING_FLOW_SPEC.md,
// "Feedback"): what went wrong, where to look, and — once the learner has
// tried again — the worked reasoning. An item's own feedback (for a chosen
// wrong option, or `feedbackIncorrect`) always comes first: it was written
// for that mistake. For numbers without it, a few checks that are safe to
// state because they follow from the numbers alone: the sign, a power of ten,
// a factor of two, rounding. Nothing here guesses at a misconception it
// cannot see.

const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);

/** A sentence about a wrong number, or null when the numbers alone say nothing useful. */
export function diagnoseNumber(expected, got) {
  if (!Number.isFinite(expected) || !Number.isFinite(got) || expected === 0) return null;
  if (near(-got, expected, 0.01)) return 'The size is right but the sign is not: check which way the quantity changes, or a subtraction done in the wrong order.';
  if (near(got, expected, 0.05)) return 'Close. Check your rounding: carry more digits until the last step.';
  const ratio = got / expected;
  if (ratio > 0) {
    const k = Math.round(Math.log10(ratio));
    if (k !== 0 && Math.abs(k) <= 3 && near(ratio, 10 ** k, 0.02)) {
      return `Your answer is ${10 ** Math.abs(k)} times too ${k > 0 ? 'large' : 'small'}: check the units, a percentage, or the place of the decimal point.`;
    }
    if (near(ratio, 2, 0.02) || near(ratio, 0.5, 0.02)) {
      return `Your answer is ${ratio > 1 ? 'twice' : 'half'} the expected size: check for a factor of 2, or a step that divides or multiplies by 2.`;
    }
  }
  return null;
}

/**
 * Feedback for a wrong attempt.
 *   item      a lessonKit item
 *   result    checkAnswer's result, plus `choice` (index) for a choice item
 *   attempts  attempts so far, this one included
 * Returns { what, look, showSolution }: `look` is the first hint when the
 * learner has not opened it, `showSolution` is true from the second miss.
 */
export function explainWrong(item, result, { attempts = 1, hintsShown = 0 } = {}) {
  const own = result.choice != null ? item.feedback?.[result.choice] : null;
  let what = own || item.feedbackIncorrect || null;
  if (!what && item.answer.type === 'numeric' && typeof result.parsed === 'number') what = diagnoseNumber(item.answer.value, result.parsed);
  if (!what) what = item.answer.type === 'choice' ? 'That option is not the one that fits.' : 'That is not the expected value.';
  const look = hintsShown === 0 && item.hints?.length ? item.hints[0] : null;
  return { what, look, showSolution: attempts >= 2 && !!item.solution };
}
