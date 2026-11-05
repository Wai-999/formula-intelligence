import { useMemo } from 'react';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { CURRICULUM } from '../../data/curriculum/path.js';
import { problemsForLesson } from '../../data/curriculum/problems.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { dueCards } from '../../lib/reviewSchedule.js';
import { primaryTarget } from '../../lib/studyResume.js';
import { getNextLearningAction } from '../../lib/nextAction.js';
import { usePathState } from './usePathState.js';

/**
 * The next action for this place in the app (src/lib/nextAction.js), from
 * the same records everywhere: Home and My Progress pass nothing, a lesson's
 * end passes { lessonId }, a course page { courseId }.
 */
export function useNextAction({ lessonId = null, courseId = null } = {}) {
  const state = usePathState();
  const evidence = useLearningStore((s) => s.evidence);
  const cards = useLearningStore((s) => s.cards);
  const lastLesson = useLearningStore((s) => s.lastLesson);
  const pinned = useStudyResumeStore((s) => s.pinned);
  const current = useStudyResumeStore((s) => s.current);
  const recent = useStudyResumeStore((s) => s.recent);
  return useMemo(() => {
    const due = dueCards(cards).map((c) => c.id);
    const resume = primaryTarget({ pinned, current, recent }, { lessonById, lastLesson });
    const from = lessonId ? { lessonId } : courseId ? { courseId } : {};
    return getNextLearningAction(CURRICULUM, { state, from, resume, due, evidence, problemsFor: problemsForLesson });
  }, [state, evidence, cards, lastLesson, pinned, current, recent, lessonId, courseId]);
}
