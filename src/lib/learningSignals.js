// The four learning signals of the V4 brief (§7), computed for ONE learner
// from their own evidence log — personal trends, never population claims.
// Everything stays on this device; nothing is sent anywhere.
//
//   practice_success_rate   correct first attempts / attempted, by difficulty
//   application_completion  real-world tasks completed / started
//   unassisted_transfer     transfer items solved with no hint / attempted
//   retention_14d           skills recalled correctly ≥ 14 days after first
//                           getting them right / skills retested that late
//
// Every rate comes with its counts. Below MIN_N attempts the rate is null and
// the UI says "not enough data yet": a 100% from one answer is not a trend.

const DAY = 24 * 60 * 60 * 1000;
export const MIN_N = 5;
export const RETENTION_DAYS = 14;
const PRACTICE_SOURCES = new Set(['practice', 'checkpoint', 'review', 'mixed']);

const rate = (k, n) => ({ k, n, rate: n >= MIN_N ? k / n : null });

/** { 1: {k, n, rate}, 2: …, 3: … } — difficulty as recorded (a hint before answering records level 1). */
export function practiceSuccess(evidence) {
  const out = {};
  for (const d of [1, 2, 3]) {
    const xs = evidence.filter((e) => PRACTICE_SOURCES.has(e.s) && (e.d ?? 1) === d);
    out[d] = rate(xs.filter((e) => e.ok).length, xs.length);
  }
  return out;
}

/**
 * Transfer items solved without a hint. Only records written since this was
 * measured carry `x` (the item is a transfer item) and `h` (a hint was
 * opened first); older records are left out rather than guessed at.
 */
export function unassistedTransfer(evidence) {
  const xs = evidence.filter((e) => e.x === true);
  return { ...rate(xs.filter((e) => e.ok && !e.h).length, xs.length), since: xs.length ? Math.min(...xs.map((e) => e.at)) : null };
}

/**
 * Per skill: the first correct answer, then the first later attempt at least
 * RETENTION_DAYS after it. Eligible if that later attempt exists; retained
 * if it was correct.
 */
export function retention(evidence, days = RETENTION_DAYS) {
  const bySkill = new Map();
  for (const e of [...evidence].sort((a, b) => a.at - b.at)) {
    if (!bySkill.has(e.c)) bySkill.set(e.c, []);
    bySkill.get(e.c).push(e);
  }
  let k = 0;
  let n = 0;
  for (const list of bySkill.values()) {
    const first = list.find((e) => e.ok);
    if (!first) continue;
    const later = list.find((e) => e.at >= first.at + days * DAY);
    if (!later) continue;
    n += 1;
    if (later.ok) k += 1;
  }
  return rate(k, n);
}

/**
 * projects: [{ id, steps: [...] }]; isDone(project, step) → boolean.
 * Started = at least one step done; completed = every step done.
 */
export function applicationCompletion(projects, isDone) {
  const started = projects.filter((p) => p.steps.some((st) => isDone(p, st)));
  const completed = started.filter((p) => p.steps.every((st) => isDone(p, st)));
  // Few learners start many projects, so the minimum is one, not MIN_N: the
  // honest statement for a single learner is "2 of 3 started projects".
  return { k: completed.length, n: started.length, rate: started.length ? completed.length / started.length : null };
}
