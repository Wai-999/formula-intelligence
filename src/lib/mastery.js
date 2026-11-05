// Mastery from evidence (Master Prompt V3.1 §8, §6; docs/LEARNING_ASSESSMENT_SPEC.md).
//
// Mastery is computed, never stored: it is a pure function of the evidence
// log, so the rules can change (and be tested) without migrating anything,
// and a learner's status can always be explained by pointing at the
// evidence behind it. Principles, each enforced by a test:
//   - One correct answer is never mastery ("not one lucky guess").
//   - Evidence must come from DIFFERENT items; answering the same item again
//     after seeing its solution is not a second demonstration.
//   - Harder items and transfer items count for more, and are required for
//     the top levels.
//   - Old evidence fades (recency), so a status earned months ago softens
//     until it is demonstrated again — but it is never deleted.
//   - Clicks, page views and time on page are not evidence at all.

export const LEVELS = ['not-started', 'learning', 'proficient', 'mastered'];

export const LEVEL_LABEL = {
  'not-started': 'Not started',
  learning: 'Learning',
  proficient: 'Proficient',
  mastered: 'Mastered',
};

const DAY = 24 * 60 * 60 * 1000;
export const HALF_LIFE_DAYS = 60;

/** Weight of a piece of evidence by age: 1 today, ½ after HALF_LIFE_DAYS. */
export function recencyWeight(at, now) {
  const ageDays = Math.max(0, (now - at) / DAY);
  return 0.5 ** (ageDays / HALF_LIFE_DAYS);
}

/** Difficulty 1–3 weights a correct answer 1, 1.5, 2; transfer adds 0.5. */
function strength(e) {
  return 1 + 0.5 * ((e.d ?? 1) - 1) + (e.tr ? 0.5 : 0);
}

/**
 * Summarize one competency's evidence. `evidence` is the log filtered to the
 * competency: { item, ok, d (difficulty 1–3), tr (transfer), at (ms) }.
 * Returns { level, confidence, distinctItems, correctItems, accuracy, reasons }.
 */
export function assessCompetency(evidence, now = Date.now()) {
  if (!evidence.length) {
    return { level: 'not-started', confidence: 'none', distinctItems: 0, correctItems: 0, accuracy: null, reasons: ['No answers recorded yet.'], breakdown: evidenceBreakdown([]), nextStep: 'Start with the first practice question in the lesson.' };
  }
  // Latest attempt per item: re-answering an item replaces, not adds.
  const latest = new Map();
  for (const e of [...evidence].sort((a, b) => a.at - b.at)) latest.set(e.item, e);
  const attempts = [...latest.values()].sort((a, b) => a.at - b.at);

  let wSum = 0;
  let wCorrect = 0;
  for (const e of attempts) {
    const w = recencyWeight(e.at, now) * strength(e);
    wSum += w;
    if (e.ok) wCorrect += w;
  }
  const accuracy = wSum ? wCorrect / wSum : 0;
  const correct = attempts.filter((e) => e.ok);
  const correctItems = correct.length;
  const distinctItems = attempts.length;
  const hardCorrect = correct.some((e) => (e.d ?? 1) >= 2);
  const transferCorrect = correct.some((e) => e.tr);
  // Hints support learning but are not unassisted evidence (V5.1 §13.4): the
  // two-day rule counts only answers given without opening a hint first.
  const days = new Set(correct.filter((e) => !e.h).map((e) => Math.floor(e.at / DAY)));
  const lastOk = attempts[attempts.length - 1].ok;
  const freshest = Math.max(...attempts.map((e) => e.at));
  const stale = (now - freshest) / DAY > HALF_LIFE_DAYS;

  const reasons = [];
  let level = 'learning';
  const proficient = correctItems >= 3 && accuracy >= 0.7 && hardCorrect;
  if (proficient) {
    level = 'proficient';
    const mastered = transferCorrect && days.size >= 2 && lastOk && accuracy >= 0.8 && !stale;
    if (mastered) level = 'mastered';
    else {
      if (!transferCorrect) reasons.push('Mastery needs a correct transfer question — the idea used in a new setting.');
      if (days.size < 2) reasons.push('Mastery needs correct answers without a hint on two different days.');
      if (!lastOk) reasons.push('Your most recent answer was incorrect.');
      if (stale) reasons.push(`It has been more than ${HALF_LIFE_DAYS} days; a quick review will confirm it.`);
    }
  } else {
    if (correctItems < 3) reasons.push(`${correctItems} of the 3 different correct answers needed for “proficient”.`);
    if (!hardCorrect) reasons.push('Needs at least one correct answer on a harder (level 2+) question.');
    if (accuracy < 0.7) reasons.push(`Recent accuracy is ${Math.round(accuracy * 100)}%; proficient needs 70%.`);
  }

  const confidence = distinctItems >= 6 ? 'high' : distinctItems >= 3 ? 'medium' : 'low';
  const breakdown = evidenceBreakdown(evidence);
  return { level, confidence, distinctItems, correctItems, accuracy, reasons, breakdown, nextStep: nextStepFor({ level, correctItems, hardCorrect, accuracy, transferCorrect, days: days.size, lastOk, stale }) };
}

/**
 * The single most useful next action for a competency, in plain English
 * (V5.1 §4 "why this skill is not yet mastered"). Checked in the order a
 * learner would naturally meet the requirements.
 */
function nextStepFor({ level, correctItems, hardCorrect, accuracy, transferCorrect, days, lastOk, stale }) {
  if (level === 'mastered') return 'Mastered. Scheduled reviews will keep it fresh.';
  if (level === 'learning') {
    if (accuracy < 0.7 && correctItems >= 1) return 'Reread the worked example, then try new questions — the explanation after each answer shows where it went wrong.';
    if (correctItems < 3) return 'Solve a few more different questions, and try each one before opening a hint.';
    if (!hardCorrect) return 'Try a harder (level 2) question without opening a hint.';
    return 'Keep practising with different questions.';
  }
  if (!lastOk) return 'Your latest answer missed. Try one more question to confirm the idea.';
  if (stale) return 'It has been a while. One review question will confirm it.';
  if (!transferCorrect) return 'You have solved the standard problems. Try an unfamiliar (transfer) problem without a hint.';
  if (days < 2) return 'Come back on another day and answer one again without a hint — that shows it has stuck.';
  return 'Keep accuracy above 80% with a few more questions.';
}

/**
 * What one competency's evidence consists of (V5.1 §13.4), counted over every
 * recorded first attempt — not only the latest per question:
 *   attempted           first attempts recorded
 *   correctWithHints    right after opening a hint first
 *   correctUnassisted   right without a hint
 *   transferUnassisted  right, without a hint, on a transfer (unfamiliar) question
 *   delayedRetrieval    right without a hint, a day or more after the first right answer
 *   repeatExposures     attempts at a question already answered before
 * Records written before V4 have no hint flag and count as unassisted.
 */
export function evidenceBreakdown(evidence) {
  const out = { attempted: 0, correctWithHints: 0, correctUnassisted: 0, transferUnassisted: 0, delayedRetrieval: 0, repeatExposures: 0 };
  const seen = new Set();
  let firstCorrect = null;
  for (const e of [...evidence].sort((a, b) => a.at - b.at)) {
    out.attempted += 1;
    if (seen.has(e.item)) out.repeatExposures += 1;
    seen.add(e.item);
    if (!e.ok) continue;
    if (e.h) out.correctWithHints += 1;
    else {
      out.correctUnassisted += 1;
      if (e.x ?? e.tr) out.transferUnassisted += 1;
      if (firstCorrect !== null && e.at - firstCorrect >= DAY) out.delayedRetrieval += 1;
    }
    if (firstCorrect === null) firstCorrect = e.at;
  }
  return out;
}

/** Group an evidence log by competency and assess each. */
export function assessAll(log, now = Date.now()) {
  const byComp = new Map();
  for (const e of log) {
    if (!byComp.has(e.c)) byComp.set(e.c, []);
    byComp.get(e.c).push(e);
  }
  const out = {};
  for (const [c, ev] of byComp) out[c] = assessCompetency(ev, now);
  return out;
}
