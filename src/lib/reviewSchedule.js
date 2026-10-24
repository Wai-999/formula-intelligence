// Spaced review of competencies (§8: "a documented, testable scheduling
// method; do not punish missed days"). Documented in
// docs/LEARNING_ASSESSMENT_SPEC.md §4.
//
// A Leitner schedule with fixed boxes. Rationale for choosing it over SM-2
// (which the formula flashcards already use): its behaviour is explainable
// in one sentence — "right moves a box up, wrong moves a box down" — and
// it has no hidden ease factor that a bad week can drive into the ground.
//
//   - Correct: up one box (interval grows).
//   - Incorrect: down ONE box, never back to the start.
//   - Late: no penalty. A review done 10 days late is scheduled exactly as
//     if done on time; overdue items simply wait, without multiplying.

export const BOX_DAYS = [1, 3, 7, 14, 30, 60];
const DAY = 24 * 60 * 60 * 1000;

export function newCard(now = Date.now()) {
  return { box: 0, due: now + BOX_DAYS[0] * DAY, reviews: 0 };
}

/** The card after a review. */
export function review(card, correct, now = Date.now()) {
  const current = card ?? newCard(now);
  const box = correct
    ? Math.min(current.box + 1, BOX_DAYS.length - 1)
    : Math.max(current.box - 1, 0);
  return { box, due: now + BOX_DAYS[box] * DAY, reviews: (current.reviews ?? 0) + 1, last: now };
}

/** Competencies due now, most overdue first. */
export function dueCards(cards, now = Date.now()) {
  return Object.entries(cards ?? {})
    .filter(([, c]) => c && typeof c.due === 'number' && c.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id, c]) => ({ id, ...c }));
}
