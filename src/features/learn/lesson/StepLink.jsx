import { lessonById } from '../../../data/curriculum/lessons/index.js';
import { useStudyResumeStore } from '../../../store/useStudyResumeStore.js';
import { hashFor } from '../../../app/pages.js';

/**
 * A link to one step of a lesson. The href opens the lesson (so it can be
 * copied or opened in a new tab); a click goes straight to the step, the way
 * "Resume" does, without touching the learner's saved place.
 */
export default function StepLink({ lessonId, sectionId = null, className, children }) {
  const lesson = lessonById[lessonId];
  const href = hashFor('learn/lesson', { lessonId });
  if (!lesson || !sectionId) return <a className={className} href={href}>{children}</a>;
  const go = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    useStudyResumeStore.getState().requestResume({ courseId: lesson.course, lessonId, sectionId, fraction: 0, at: Date.now() });
  };
  return <a className={className} href={href} onClick={go}>{children}</a>;
}
