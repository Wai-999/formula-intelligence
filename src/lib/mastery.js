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
    return { level: 'not-started', confidence: 'none', distinctItems: 0, correctItems: 0, accuracy: null, reasons: ['No answers recorded yet.'] };
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
  const days = new Set(correct.map((e) => Math.floor(e.at / DAY)));
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
      if (days.size < 2) reasons.push('Mastery needs correct answers on two different days.');
      if (!lastOk) reasons.push('Your most recent answer was incorrect.');
      if (stale) reasons.push(`It has been more than ${HALF_LIFE_DAYS} days; a quick review will confirm it.`);
    }
  } else {
    if (correctItems < 3) reasons.push(`${correctItems} of the 3 different correct answers needed for “proficient”.`);
    if (!hardCorrect) reasons.push('Needs at least one correct answer on a harder (level 2+) question.');
    if (accuracy < 0.7) reasons.push(`Recent accuracy is ${Math.round(accuracy * 100)}%; proficient needs 70%.`);
  }

  const confidence = distinctItems >= 6 ? 'high' : distinctItems >= 3 ? 'medium' : 'low';
  return { level, confidence, distinctItems, correctItems, accuracy, reasons };
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
