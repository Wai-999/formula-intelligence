// The adaptive diagnostic (§8; docs/LEARNING_ASSESSMENT_SPEC.md §2–3).
//
// Procedure, in three rounds so screening is broad before it is deep:
//   round 1 — one middle-difficulty item in every domain (screening);
//   round 2 — per domain, a harder item after a correct answer, an easier
//             one after a miss (targeting);
//   round 3 — only where the first two disagree, one more middle item.
// At most three answered items per domain; any domain can be skipped
// ("I haven't studied this"), and the whole thing can be stopped at any time.
//
// Estimate per domain: a one-parameter logistic (Rasch) model with the
// AUTHORED difficulties (1, 2, 3 → −1, 0, +1 on the ability scale) and a
// standard-normal prior, evaluated on a grid. With three items the
// posterior stays wide; the report shows that width as low or moderate
// confidence and never claims more. No psychometric calibration has been
// done (none is possible without data) and the UI says so.

import { DOMAINS } from '../data/curriculum/competencies.js';
import { courseById } from '../data/curriculum/catalog.js';

const domainName = (id) => DOMAINS.find((d) => d.id === id)?.title ?? id;
const courseName = (id) => courseById[id]?.title ?? id;

export const ROUNDS = 3;
const B = { 1: -1, 2: 0, 3: 1 };
const GRID = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);

/** Posterior mean and SD of ability given answered items [{ d, ok }]. */
export function estimateAbility(answers) {
  const logPost = GRID.map((t) => {
    let lp = -0.5 * t * t;
    for (const a of answers) {
      const p = 1 / (1 + Math.exp(-(t - B[a.d])));
      lp += Math.log(a.ok ? p : 1 - p);
    }
    return lp;
  });
  const max = Math.max(...logPost);
  const w = logPost.map((l) => Math.exp(l - max));
  const z = w.reduce((s, v) => s + v, 0);
  const mean = GRID.reduce((s, t, i) => s + t * w[i], 0) / z;
  const sd = Math.sqrt(GRID.reduce((s, t, i) => s + (t - mean) ** 2 * w[i], 0) / z);
  return { mean, sd };
}

export const LEVEL_TEXT = {
  strong: 'Likely ready',
  developing: 'Partly there',
  gap: 'Likely gap',
  'not-assessed': 'Not assessed',
};

/** Summarize one domain’s responses into a provisional readiness statement. */
export function assessDomain(domain, responses, skipped) {
  const answered = responses.filter((r) => r.domain === domain && r.ok !== null);
  if (skipped || answered.length === 0) {
    return { domain, level: 'not-assessed', confidence: 'none', correct: 0, answered: 0, mean: null, sd: null };
  }
  const { mean, sd } = estimateAbility(answered.map((r) => ({ d: r.difficulty, ok: r.ok })));
  const level = mean >= 0.75 ? 'strong' : mean >= -0.5 ? 'developing' : 'gap';
  return {
    domain,
    level,
    confidence: sd < 0.8 ? 'moderate' : 'low',
    correct: answered.filter((r) => r.ok).length,
    answered: answered.length,
    mean,
    sd,
  };
}

/**
 * The next item to show, or null when the diagnostic is complete.
 * state: { responses: [{ item, domain, difficulty, ok (true/false/null = skipped item) }], skippedDomains: [] }
 */
export function nextItem(items, state) {
  const shown = new Set(state.responses.map((r) => r.item));
  const domains = DOMAINS.map((d) => d.id).filter((d) => !state.skippedDomains.includes(d));
  const pick = (domain, difficulty) => {
    const pool = items.filter((i) => i.domain === domain && !shown.has(i.id));
    return pool.find((i) => i.difficulty === difficulty) ?? null;
  };
  const fallback = (domain, prefer) => {
    for (const d of prefer) {
      const it = pick(domain, d);
      if (it) return it;
    }
    return null;
  };
  for (let round = 1; round <= ROUNDS; round++) {
    for (const domain of domains) {
      const mine = state.responses.filter((r) => r.domain === domain);
      const answered = mine.filter((r) => r.ok !== null);
      if (mine.length >= 4 || answered.length >= ROUNDS) continue; // cap, including skipped items
      if (round === 1 && answered.length === 0) {
        const it = fallback(domain, [2, 1, 3]);
        if (it) return it;
      }
      if (round === 2 && answered.length === 1) {
        const it = answered[0].ok ? fallback(domain, [3, 2]) : fallback(domain, [1, 2]);
        if (it) return it;
      }
      if (round === 3 && answered.length === 2 && answered[0].ok !== answered[1].ok) {
        const it = fallback(domain, [2, answered[0].ok ? 3 : 1, 1, 3]);
        if (it) return it;
      }
    }
  }
  return null;
}

const MATH_PATH = [
  { course: 'prealgebra', domain: 'arithmetic' },
  { course: 'algebra-1', domain: 'algebra' },
  { course: 'algebra-2', domain: 'functions' },
  { course: 'precalculus', domain: 'trig' },
  { course: 'calculus-1', domain: 'calculus' },
];

/**
 * A transparent recommendation from domain estimates:
 * { course, reasons: [..], strengths: [..], gaps: [..], alsoConsider: [{ course, why }] }
 */
export function recommend(estimates) {
  const by = Object.fromEntries(estimates.map((e) => [e.domain, e]));
  const reasons = [];
  let course = null;
  for (const step of MATH_PATH) {
    const e = by[step.domain];
    if (e?.level === 'strong') {
      reasons.push(`${domainName(step.domain)}: ${e.correct} of ${e.answered} correct, including harder items — likely ready to move past ${courseName(step.course)}.`);
      continue;
    }
    course = step.course;
    if (!e || e.level === 'not-assessed') reasons.push(`${domainName(step.domain)}: not assessed (skipped), so we assume it has not been studied yet. Retake, or choose a later course yourself, if that is wrong.`);
    else reasons.push(`${domainName(step.domain)}: ${e.correct} of ${e.answered} correct (${LEVEL_TEXT[e.level].toLowerCase()}, ${e.confidence} confidence) — this is where to start.`);
    break;
  }
  const strong = (d) => by[d]?.level === 'strong';
  const alsoConsider = [];
  if (strong('algebra') && !strong('linalg')) alsoConsider.push({ course: 'linear-algebra', why: 'Your algebra looks ready for vectors and matrices.' });
  if (strong('algebra') && !strong('statistics')) alsoConsider.push({ course: 'prob-stats', why: 'Your algebra looks ready for probability and statistics.' });
  if (!strong('python')) alsoConsider.push({ course: 'python-ds', why: 'Python can be learned alongside the mathematics from the start.' });
  if (!course) {
    course = strong('statistics') && strong('linalg') && strong('python') ? 'ml-foundations' : 'calculus-2';
    reasons.push('Every step of the mathematics path looked strong in this short screen.');
  }
  return {
    course,
    reasons,
    strengths: estimates.filter((e) => e.level === 'strong').map((e) => e.domain),
    gaps: estimates.filter((e) => e.level === 'gap').map((e) => e.domain),
    alsoConsider: alsoConsider.filter((a) => a.course !== course),
  };
}
