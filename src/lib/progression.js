// XP, levels and badges — a PURE derivation over data the app already
// stores. Nothing here tracks anything new: every input is a value the
// spaced-repetition, quiz, journal, practice and understanding stores were
// already computing for their own purposes.
//
// That constraint is deliberate. Gamification bolted onto its own parallel
// event log would be a second source of truth about the same learning, free
// to disagree with the mastery dashboard sitting next to it. Deriving means
// the XP number can never contradict the progress it claims to summarize —
// and that awarding XP retroactively for work done before this feature
// existed is automatic rather than a migration.
//
// Every function is pure and takes plain data, which is why they are here
// rather than in a store: they are the part worth testing.

/** What each kind of real, already-recorded work is worth. */
export const XP_RULES = {
  masteredFormula: 50,   // SR level 3 — the strongest evidence of retention
  reviewedFormula: 10,   // a card with review history but not yet mastered
  quizCorrect: 5,
  practiceCorrect: 5,
  journalEntry: 15,      // reflection is effortful; weight it above a single answer
  depthLayer: 8,         // one Depth Ladder layer genuinely engaged in ML mode
  domainVisited: 20,     // opening a forecasting lab and interacting with it
};

/**
 * Level curve. Deliberately front-loaded: the first few levels arrive
 * quickly so a new learner sees motion, then each subsequent level costs
 * proportionally more. threshold(n) = 100 * n * (n-1) / 2, i.e. level 2 at
 * 100 XP, 3 at 300, 4 at 600, 5 at 1000 …
 */
export function levelThreshold(level) {
  return (100 * level * (level - 1)) / 2;
}

export function levelFromXp(xp) {
  const safe = Math.max(0, Math.floor(xp || 0));
  let level = 1;
  while (levelThreshold(level + 1) <= safe) level++;
  return level;
}

/** Level plus progress toward the next one, for a progress bar. */
export function levelProgress(xp) {
  const safe = Math.max(0, Math.floor(xp || 0));
  const level = levelFromXp(safe);
  const floor = levelThreshold(level);
  const ceil = levelThreshold(level + 1);
  const span = ceil - floor;
  return {
    level,
    xp: safe,
    intoLevel: safe - floor,
    neededForNext: ceil - safe,
    span,
    pct: span > 0 ? Math.min(100, Math.round(((safe - floor) / span) * 100)) : 100,
  };
}

/**
 * Total XP with a per-source breakdown, so the UI can show WHERE it came
 * from — an unexplained number is a slot machine, an explained one is
 * feedback.
 */
export function computeXp(stats) {
  const s = {
    mastered: 0, reviewed: 0, quizCorrect: 0, practiceCorrect: 0,
    journalEntries: 0, depthLayers: 0, domainsVisited: 0, ...stats,
  };
  const breakdown = [
    { key: 'mastered', label: 'Formulas mastered', count: s.mastered, each: XP_RULES.masteredFormula },
    { key: 'reviewed', label: 'Formulas in review', count: s.reviewed, each: XP_RULES.reviewedFormula },
    { key: 'quiz', label: 'Quiz answers correct', count: s.quizCorrect, each: XP_RULES.quizCorrect },
    { key: 'practice', label: 'Practice answers correct', count: s.practiceCorrect, each: XP_RULES.practiceCorrect },
    { key: 'journal', label: 'Journal reflections', count: s.journalEntries, each: XP_RULES.journalEntry },
    { key: 'depth', label: 'Depth Ladder layers explored', count: s.depthLayers, each: XP_RULES.depthLayer },
    { key: 'domains', label: 'Forecasting labs explored', count: s.domainsVisited, each: XP_RULES.domainVisited },
  ].map((b) => ({ ...b, xp: Math.max(0, b.count) * b.each }));

  return { total: breakdown.reduce((a, b) => a + b.xp, 0), breakdown };
}

/**
 * Badges for milestones that are already observable. Each has an explicit
 * `progress` so a locked badge shows how close it is rather than just
 * being greyed out — a locked achievement with no distance reads as noise.
 */
export const BADGES = [
  { id: 'first-recall', name: 'First recall', icon: 'ti-seeding',
    hint: 'Review your first formula', of: 1, get: (s) => s.reviewed + s.mastered },
  { id: 'ten-reviewed', name: 'Getting started', icon: 'ti-cards',
    hint: 'Put 10 formulas into review', of: 10, get: (s) => s.reviewed + s.mastered },
  { id: 'first-mastery', name: 'First mastery', icon: 'ti-award',
    hint: 'Master a formula', of: 1, get: (s) => s.mastered },
  { id: 'ten-mastered', name: 'Ten mastered', icon: 'ti-medal',
    hint: 'Master 10 formulas', of: 10, get: (s) => s.mastered },
  { id: 'quarter-mastered', name: 'Quarter of the map', icon: 'ti-map-check',
    hint: 'Master 24 formulas', of: 24, get: (s) => s.mastered },
  { id: 'chapter-complete', name: 'Chapter complete', icon: 'ti-book-2',
    hint: 'Master every formula in one chapter', of: 1, get: (s) => s.chaptersComplete },
  { id: 'streak-3', name: '3-day streak', icon: 'ti-flame',
    hint: 'Journal three days running', of: 3, get: (s) => s.journalStreak },
  { id: 'streak-7', name: '7-day streak', icon: 'ti-flame',
    hint: 'Journal seven days running', of: 7, get: (s) => s.journalStreak },
  { id: 'quiz-50', name: 'Quiz veteran', icon: 'ti-help-octagon',
    hint: 'Answer 50 quiz questions correctly', of: 50, get: (s) => s.quizCorrect },
  { id: 'sharpshooter', name: 'Sharpshooter', icon: 'ti-target-arrow',
    hint: 'Reach 80% quiz accuracy over 20+ answers', of: 1,
    get: (s) => (s.quizTotal >= 20 && s.quizAccuracy >= 80 ? 1 : 0) },
  { id: 'depth-diver', name: 'Depth diver', icon: 'ti-stairs-down',
    hint: 'Explore 20 Depth Ladder layers', of: 20, get: (s) => s.depthLayers },
  { id: 'all-domains', name: 'Four labs', icon: 'ti-world',
    hint: 'Explore all four forecasting labs', of: 4, get: (s) => s.domainsVisited },
];

export function computeBadges(stats) {
  const s = {
    mastered: 0, reviewed: 0, quizCorrect: 0, quizTotal: 0, quizAccuracy: 0,
    journalStreak: 0, depthLayers: 0, domainsVisited: 0, chaptersComplete: 0, ...stats,
  };
  return BADGES.map((b) => {
    const have = Math.max(0, b.get(s) || 0);
    return {
      id: b.id, name: b.name, icon: b.icon, hint: b.hint,
      earned: have >= b.of,
      have: Math.min(have, b.of),
      of: b.of,
      pct: Math.min(100, Math.round((have / b.of) * 100)),
    };
  });
}
