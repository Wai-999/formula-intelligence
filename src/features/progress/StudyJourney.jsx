import { useMemo, useState } from 'react';
import { courseById } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { assessAll } from '../../lib/mastery.js';
import { resolveLocation, stepLabel, formatSavedAt } from '../../lib/studyResume.js';
import { courseJourney } from '../../lib/courseJourney.js';
import { hashFor } from '../../app/pages.js';

// My Progress → "Your study journey" (prompt §4.4): the saved place, the
// courses studied lately and, for each, three things kept apart — where the
// learner stopped, how many written lessons are checked, and which skills
// their answers show. Removing the saved place removes only that.

const SHOWN = 5;

export default function StudyJourney() {
  const pinned = useStudyResumeStore((s) => s.pinned);
  const recent = useStudyResumeStore((s) => s.recent);
  const requestResume = useStudyResumeStore((s) => s.requestResume);
  const removePin = useStudyResumeStore((s) => s.removePin);
  const lessons = useLearningStore((s) => s.lessons);
  const evidence = useLearningStore((s) => s.evidence);
  const status = useMemo(() => assessAll(evidence), [evidence]);
  const [removed, setRemoved] = useState(null);

  const pin = resolveLocation(pinned, lessonById);
  const courses = recent.map((loc) => resolveLocation(loc, lessonById)).filter((r) => r?.ok).slice(0, SHOWN);

  const remove = () => {
    const ok = removePin();
    setRemoved(ok ? 'Saved place removed. Your answers, checkpoints and notes are unchanged.' : 'Couldn’t update this browser’s storage, so the saved place may come back after a reload.');
  };

  return (
    <section className="studio-section" aria-labelledby="prog-journey">
      <h2 id="prog-journey" className="studio-h2">Your study journey</h2>

      <div className="journey-pin">
        <h3 className="studio-h3">Saved place</h3>
        {pin?.ok ? (
          <>
            <p>
              <strong>{pin.lesson.title}</strong> · {courseById[pin.lesson.course].title}
              <br />
              <span className="studio-muted">{stepLabel(pin.loc.sectionId) ?? 'Start of the lesson'}{formatSavedAt(pin.loc.at) ? ` · saved ${formatSavedAt(pin.loc.at)}` : ''}</span>
            </p>
            <div className="studio-row">
              <button type="button" className="studio-btn studio-btn-primary" onClick={() => requestResume(pin.loc)}>Resume where I stopped</button>
              <button type="button" className="studio-btn" onClick={remove}>Remove saved place</button>
            </div>
          </>
        ) : pin ? (
          <>
            <p className="studio-muted">Your saved place was in a lesson that is no longer in the course list (“{pin.loc.lessonId}”). Nothing else was lost.</p>
            <div className="studio-row"><button type="button" className="studio-btn" onClick={remove}>Remove saved place</button></div>
          </>
        ) : (
          <p className="studio-muted">No saved place. In any lesson, <strong>Save my place</strong> keeps your spot until you save another one; moving around the app does not change it.</p>
        )}
        <p className="studio-muted" role="status">{removed ?? ''}</p>
      </div>

      <h3 className="studio-h3">Courses you studied lately</h3>
      {courses.length === 0 ? (
        <p className="studio-muted">None yet. A course appears here once you have spent a little time in one of its lessons.</p>
      ) : (
        <ul className="journey-courses">
          {courses.map(({ loc, lesson }) => {
            const course = courseById[lesson.course];
            const j = courseJourney(course, lessons, status);
            return (
              <li key={course.id} className="journey-course">
                <div>
                  <p className="journey-course-title"><a href={hashFor('learn/course', { courseId: course.id })}>{course.title}</a></p>
                  <p className="studio-muted">
                    {lesson.title} · {stepLabel(loc.sectionId) ?? 'start of the lesson'}{formatSavedAt(loc.at) ? ` · ${formatSavedAt(loc.at)}` : ''}
                  </p>
                  <p className="studio-row">
                    <span className={`studio-chip ${j.availableFinished ? 'studio-chip-ok' : 'studio-chip-accent'}`}>
                      {j.availableFinished ? 'Available lessons finished' : 'In progress'}
                    </span>
                    <span className="studio-chip">{j.checked.length} of {j.authored.length} written lessons checked</span>
                    <span className="studio-chip">
                      {j.skills.assessed ? `${j.skills.demonstrated} of ${j.skills.total} skills proficient or mastered` : 'Skills not assessed yet'}
                    </span>
                  </p>
                </div>
                <button type="button" className="studio-btn" onClick={() => requestResume(loc)} aria-label={`Continue ${course.title}: ${lesson.title}`}>Continue</button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="studio-muted">
        Places are kept in this browser only — not synced to other devices, and a private window may discard them when it closes.
        To continue elsewhere, <a href={hashFor('progress/settings')}>export a backup</a> and restore it there.
      </p>
    </section>
  );
}
