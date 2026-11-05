import { courseById } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useStudyResumeStore } from '../../store/useStudyResumeStore.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { resolveLocation, stepLabel, formatSavedAt } from '../../lib/studyResume.js';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import './learn.css';

// Where "Finish study session" lands (docs/study-continuity/USER_GUIDE.md):
// what was saved — or that it was not — and three ways on. Ending a session
// never completes a lesson, so the checkpoint's own state is shown as it is.
// Works offline: everything here is already in the browser.

export default function StudySessionPage() {
  const lastSession = useStudyResumeStore((s) => s.lastSession);
  const pinned = useStudyResumeStore((s) => s.pinned);
  const requestResume = useStudyResumeStore((s) => s.requestResume);
  const lessons = useLearningStore((s) => s.lessons);
  // After a reload the summary is gone (it was never stored); the saved place is not.
  const loc = lastSession?.loc ?? pinned;
  const place = resolveLocation(loc, lessonById);

  if (!place?.ok) {
    return (
      <div className="studio-scroll">
        <div className="studio-page studio-read">
          <p className="studio-lede">
            {place ? 'Your saved place points to a lesson that is no longer in the course list.' : 'There is no study session to show yet.'}{' '}
            In any lesson, <strong>Finish study session</strong> saves your place and brings you here.
          </p>
          <p><a className="studio-btn" href={hashFor('learn/courses')}>Browse courses</a></p>
        </div>
      </div>
    );
  }

  const { lesson } = place;
  const course = courseById[lesson.course];
  const failed = lastSession && !lastSession.ok;
  const checkpoint = lessons[lesson.id]?.checkpoint;
  const minutes = lastSession?.startedAt ? Math.max(1, Math.round((lastSession.finishedAt - lastSession.startedAt) / 60_000)) : null;

  return (
    <div className="studio-scroll">
      <div className="studio-page studio-read session-page">
        {failed ? (
          <div className="studio-callout studio-callout-bad" role="alert">
            <p><strong>Your place could not be saved in this browser.</strong></p>
            <p>
              The browser refused to store it (storage may be full, blocked, or this may be a private window). It is kept only
              until you close this tab. To keep your progress, allow storage for this site or <a href={hashFor('progress/settings')}>export a backup</a>.
            </p>
          </div>
        ) : (
          <div className="studio-callout studio-callout-ok" role="status">
            <p><strong>Your place is saved on this device.</strong> Next time, Home opens with <em>Resume where I stopped</em>.</p>
          </div>
        )}

        <dl className="session-facts">
          <div><dt>Course</dt><dd><a href={hashFor('learn/course', { courseId: course.id })}>{course.title}</a></dd></div>
          <div><dt>Lesson</dt><dd>{lesson.title}</dd></div>
          <div><dt>{failed ? 'Your place' : 'Saved place'}</dt><dd>{stepLabel(place.loc.sectionId) ?? 'Start of the lesson'}</dd></div>
          {!failed && formatSavedAt(place.loc.at) && <div><dt>Saved</dt><dd>{formatSavedAt(place.loc.at)}</dd></div>}
          {lastSession?.answered != null && (
            <div><dt>This session</dt><dd>{lastSession.answered} question{lastSession.answered === 1 ? '' : 's'} answered in this lesson{minutes ? `, about ${minutes} minute${minutes === 1 ? '' : 's'} in it` : ''}</dd></div>
          )}
          <div>
            <dt>Checkpoint</dt>
            <dd>{checkpoint ? `Answered: ${checkpoint.correct} of ${checkpoint.total} correct on the first try` : 'Not answered yet — finishing a session does not complete a lesson'}</dd>
          </div>
        </dl>

        <div className="studio-row" role="group" aria-label="What next">
          <a className="studio-btn studio-btn-primary" href={hashFor('home')}>Return Home</a>
          <button type="button" className="studio-btn" onClick={() => requestResume(place.loc)}>Continue now</button>
          <a className="studio-btn" href={hashFor('learn/course', { courseId: course.id })}>Open course outline</a>
        </div>

        <p className="studio-muted">
          Saved places live in this browser only: they are not synced to other devices, and a private window may discard them when it closes.
          To continue elsewhere, <a href={hashFor('progress/settings')}>export a backup</a> and restore it there.
        </p>
      </div>
    </div>
  );
}
