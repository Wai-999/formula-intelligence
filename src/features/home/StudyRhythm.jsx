import { useMemo, useState } from 'react';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useStudyPlanStore } from '../../store/useStudyPlanStore.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { hashFor } from '../../app/pages.js';
import {
  CUES, WEEKDAYS, BOX_MINUTES, WELCOME_BACK_DAYS,
  studyDays, weekView, daysAway, planSentence, nextPlannedDay, icsForPlan, rhythmMessage,
} from '../../lib/studyHabit.js';

// Building the study habit bit by bit (docs/learning-8020/STUDY_HABITS.md):
// a plan tied to an everyday moment, this week's days, the smallest possible
// start, and a calendar reminder the learner owns. No streaks, points or
// pressure — a skipped day costs nothing, and the page says so.

const BOX_LABEL = { 15: '15 minutes', '30-45': '30–45 minutes', '60-90': '60–90 minutes' };
const OTHER = 'Something else';

/** Offer text as a file download, created in the browser — nothing is fetched. */
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Make or change the plan: days, an everyday moment, an optional time, and how long. */
function PlanForm({ habit, timebox, onDone }) {
  const setHabit = useStudyPlanStore((s) => s.setHabit);
  const setTimebox = useStudyPlanStore((s) => s.setTimebox);
  const [days, setDays] = useState(habit?.days ?? []);
  const known = !habit?.cue || CUES.includes(habit.cue);
  const [cue, setCue] = useState(known ? habit?.cue ?? '' : OTHER);
  const [own, setOwn] = useState(known ? '' : habit.cue);
  const [time, setTime] = useState(habit?.time ?? '');
  const [box, setBox] = useState(timebox ?? '15');
  const [error, setError] = useState('');
  const toggle = (d) => setDays((v) => (v.includes(d) ? v.filter((x) => x !== d) : [...v, d]));

  const save = (e) => {
    e.preventDefault();
    const ok = setHabit({ days, cue: cue === OTHER ? own : cue, time });
    if (!ok) { setError('Pick at least one day.'); return; }
    setTimebox(box);
    onDone();
  };

  return (
    <form className="habit-form" onSubmit={save} aria-label="Your study plan">
      <fieldset className="habit-days">
        <legend>Which days? <span className="studio-muted">Three short sessions a week is a good start.</span></legend>
        {[1, 2, 3, 4, 5, 6, 0].map((d) => (
          <label key={d} className={days.includes(d) ? 'on' : ''}>
            <input type="checkbox" checked={days.includes(d)} onChange={() => toggle(d)} />
            {WEEKDAYS[d]}
          </label>
        ))}
      </fieldset>
      <div className="habit-row">
        <label className="habit-field">
          <span>After what everyday moment?</span>
          <select value={cue} onChange={(e) => setCue(e.target.value)}>
            <option value="">No fixed moment</option>
            {CUES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value={OTHER}>{OTHER}…</option>
          </select>
        </label>
        {cue === OTHER && (
          <label className="habit-field">
            <span>Your moment</span>
            <input type="text" maxLength={60} value={own} onChange={(e) => setOwn(e.target.value)} placeholder="After the kids are in bed" />
          </label>
        )}
        <label className="habit-field">
          <span>Time (optional)</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>
      <fieldset className="home-timebox-choices">
        <legend>How long is a session?</legend>
        {Object.keys(BOX_LABEL).map((b) => (
          <label key={b} className={box === b ? 'on' : ''}>
            <input type="radio" name="habit-box" value={b} checked={box === b} onChange={() => setBox(b)} />
            {BOX_LABEL[b]}
          </label>
        ))}
      </fieldset>
      {error && <p className="studio-callout studio-callout-warn" role="alert">{error}</p>}
      <div className="studio-row">
        <button type="submit" className="studio-btn">Save my plan</button>
        {habit && <button type="button" className="studio-btn" onClick={onDone}>Cancel</button>}
      </div>
    </form>
  );
}

/** Monday to Sunday: studied, planned, or a free day. Today is outlined. Never a run of days. */
function WeekStrip({ week }) {
  return (
    <ol className="habit-week" aria-label="This week">
      {week.map((d) => {
        const state = d.studied ? 'studied' : d.planned ? (d.future || d.today ? 'planned' : 'open') : 'free';
        const said = d.studied ? 'studied' : d.planned ? (d.future ? 'planned' : d.today ? 'planned for today' : 'planned, not studied') : 'free day';
        return (
          <li key={d.key} className={`habit-day is-${state}${d.today ? ' is-today' : ''}`} aria-label={`${d.name}: ${said}`}>
            <span className="habit-day-label" aria-hidden="true">{d.label}</span>
            <span className="habit-day-mark" aria-hidden="true">
              {d.studied ? <i className="ti ti-check" /> : d.planned ? <i className="ti ti-circle" /> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Home's study-habit section: make a plan; then this week, the next planned
 * day, the smallest useful start, a calendar reminder, and today's steps
 * sized to the session length.
 */
export default function StudyRhythm({ due, lessonId, project, now = Date.now() }) {
  const habit = useStudyPlanStore((s) => s.habit);
  const timebox = useStudyPlanStore((s) => s.timebox);
  const evidence = useLearningStore((s) => s.evidence);
  const lessons = useLearningStore((s) => s.lessons);
  const [editing, setEditing] = useState(false);
  const studied = useMemo(() => studyDays(evidence, lessons), [evidence, lessons]);
  const week = useMemo(() => weekView(studied, habit?.days ?? [], now), [studied, habit, now]);
  const away = daysAway(studied, now);
  const lesson = lessonId ? lessonById[lessonId] : null;
  const minutes = BOX_MINUTES[timebox] ?? 15;

  // The smallest useful start (two minutes, one question): a due review if
  // there is one — retrieval at spaced intervals — otherwise the lesson's own practice.
  const small = due.length
    ? { href: hashFor('practice/review'), text: 'Start small: one review question (about 2 minutes)' }
    : lesson && { href: hashFor('learn/lesson', { lessonId }), text: `Start small: one “Try it” question in “${lesson.title}”` };

  const review = due.length > 0 && { href: hashFor('practice/review'), text: `Review ${due.length} due skill${due.length > 1 ? 's' : ''} in Practice (about 10 minutes)` };
  const study = lesson && { href: hashFor('learn/lesson', { lessonId }), text: `Work through “${lesson.title}” (about ${lesson.minutes} minutes)` };
  const apply = { href: hashFor('apply/projects'), text: project ? `Do one step of the project “${project.title}”` : 'Start one step of a real-world project in Apply' };
  const steps = {
    15: [small].filter(Boolean),
    '30-45': [study, review].filter(Boolean),
    '60-90': [study, review, apply].filter(Boolean),
  }[timebox] ?? [];

  const welcomeBack = away !== null && away >= WELCOME_BACK_DAYS;
  const newWeek = !welcomeBack && habit && new Date(now).getDay() === 1 && !week.some((d) => d.studied);
  const next = habit ? nextPlannedDay(habit, studied, now) : null;
  const sentence = planSentence(habit, minutes);

  if (!habit || editing) {
    return (
      <section className="home-timebox habit" aria-labelledby="habit-h">
        <h2 id="habit-h" className="studio-eyebrow">{habit ? 'Change your study plan' : 'Build a study habit, a little at a time'}</h2>
        {!habit && (
          <p className="studio-muted">
            Pick the days, and an everyday moment to attach a short session to, such as “after dinner on Monday, Wednesday and Friday”.
            A plan with a when and a where is far more likely to happen than an intention, and small, regular sessions are what turn study into a habit.
          </p>
        )}
        <PlanForm habit={habit} timebox={timebox} onDone={() => setEditing(false)} />
      </section>
    );
  }

  return (
    <section className="home-timebox habit" aria-labelledby="habit-h">
      <h2 id="habit-h" className="studio-eyebrow">Your study plan</h2>
      {welcomeBack && (
        <p className="studio-callout habit-welcome" role="status">
          <strong>Welcome back.</strong> It has been {away} days — that is fine, and nothing was lost.
          Start small today: one question gets you going again.
        </p>
      )}
      {newWeek && <p className="studio-callout habit-welcome" role="status"><strong>A new week starts today.</strong> Last week does not count against this one.</p>}
      <p className="habit-sentence">{sentence}</p>
      <WeekStrip week={week} />
      <p className="studio-muted habit-message" aria-live="polite">{rhythmMessage(week, habit.days.length)}</p>
      {next && <p className="studio-muted">Next planned session: <strong>{next}</strong>{habit.time ? ` at ${habit.time}` : ''}.</p>}

      {steps.length > 0 && (
        <>
          <h3 className="studio-h3 habit-today-h">Today’s session ({BOX_LABEL[timebox] ?? BOX_LABEL[15]})</h3>
          <ol className="home-timebox-steps">{steps.map((s) => <li key={s.text}><a href={s.href}>{s.text}</a></li>)}</ol>
        </>
      )}

      <div className="studio-row">
        <button
          type="button"
          className="studio-btn"
          onClick={() => download('study-plan.ics', icsForPlan(habit, minutes, `${window.location.origin}${window.location.pathname}#home`, now), 'text/calendar')}
        >
          <i className="ti ti-calendar-plus" aria-hidden="true" /> Add to my calendar
        </button>
        <button type="button" className="studio-btn" onClick={() => setEditing(true)}>Change plan</button>
      </div>
      <p className="studio-muted home-timebox-note">
        The calendar file sets a weekly reminder in your own calendar app; this site sends no notifications and keeps nothing on a server.
        No streaks, no daily quota: a missed day costs nothing, and one spare day a week is built in.
      </p>
    </section>
  );
}
