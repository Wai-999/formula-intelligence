import { useMemo } from 'react';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { assessAll } from '../../lib/mastery.js';
import { hashFor } from '../../app/pages.js';

/** Where a learning-path recommendation's target or alternative leads. */
export const hrefFor = (target) => (target ? hashFor(target.page, target.params) : null);

/**
 * Skills the learner's answers show as weak: at least two different items,
 * under half right. The one definition Home, My Progress and the learning
 * path use, so "weak" never means two things.
 */
export const weakSkills = (status) => Object.entries(status)
  .filter(([, x]) => x.distinctItems >= 2 && x.accuracy < 0.5)
  .map(([id]) => id);

/** The learner state the learning-path engine (src/lib/learningPath.js) reads. */
export function usePathState() {
  const lessons = useLearningStore((s) => s.lessons);
  const evidence = useLearningStore((s) => s.evidence);
  const placement = useDiagnosticStore((s) => s.placement);
  const path = useDiagnosticStore((s) => s.path);
  const status = useMemo(() => assessAll(evidence), [evidence]);
  return useMemo(
    () => ({ lessons, placement, pathId: path?.id ?? null, weak: weakSkills(status), status }),
    [lessons, placement, path, status],
  );
}
