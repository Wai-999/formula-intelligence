import { useEffect, useMemo, useState } from 'react';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { courseById, subjectById } from '../../data/curriculum/catalog.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { interleave } from '../../lib/interleave.js';
import { hashFor } from '../../app/pages.js';
import ItemCard from '../learn/lesson/ItemCard.jsx';
import { lessonItems } from '../../data/curriculum/lessonItems.js';

const SET_SIZE = 6;
const subjectOf = (lesson) => courseById[lesson.course]?.subject;

/**
 * Mixed practice (decision D2): questions from different subjects, one at a
 * time and alternating, drawn from lessons the learner has opened. See
 * src/lib/interleave.js for the ordering rule. Part of Practice → Review.
 */
export default function MixedPractice() {
  const lessons = useLearningStore((s) => s.lessons);
  const [round, setRound] = useState(0);
  const [set, setSet] = useState(null);
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState({});

  const opened = useMemo(() => LESSONS.filter((l) => lessons[l.id]), [lessons]);
  const subjects = [...new Set(opened.map(subjectOf))];
  const ready = subjects.length >= 2;
  const openedKey = opened.map((l) => l.id).join(',');

  useEffect(() => {
    if (!ready) return undefined;
    let live = true;
    setSet(null);
    Promise.all(opened.map((l) => l.load().then((m) => ({ lesson: l, body: m.default })))).then((loaded) => {
      if (!live) return;
      // Read evidence once per set, not on every answer: the set must not
      // reshuffle under the learner while they work through it.
      const { evidence } = useLearningStore.getState();
      const latest = {};
      for (const e of evidence) latest[e.item] = Math.max(latest[e.item] ?? 0, e.at);
      const bySubject = {};
      for (const { lesson, body } of loaded) {
        const key = subjectOf(lesson);
        for (const item of lessonItems(body)) (bySubject[key] ??= []).push({ ...item, lessonId: lesson.id });
      }
      const pools = Object.entries(bySubject).map(([key, items]) => ({ key, items }));
      setSet(interleave(pools, { size: SET_SIZE, lastAnswered: (id) => latest[id] ?? 0 }));
      setIndex(0);
      setFirstTry({});
    });
    return () => { live = false; };
  }, [round, ready, openedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = set?.[index];
  const done = set && index >= set.length;
  const right = Object.values(firstTry).filter(Boolean).length;
  const starters = Object.values(
    LESSONS.reduce((acc, l) => ({ ...acc, [subjectOf(l)]: acc[subjectOf(l)] ?? l }), {}),
  ).filter((l) => !subjects.includes(subjectOf(l)));

  return (
    <>
        <p className="studio-muted studio-read">
          Questions from different subjects, mixed together, so each one starts with deciding which idea applies — the
          part a block of similar questions never makes you practise. Drawn from lessons you have opened, least recently
          answered first, never two in a row from the same subject.
        </p>

        {!ready && (
          <section className="studio-section studio-card" aria-labelledby="mixed-locked">
            <h3 id="mixed-locked" className="studio-h3">Open lessons from two subjects first</h3>
            <p className="studio-muted">
              {subjects.length === 0
                ? 'You have not opened a lesson yet.'
                : `So far your lessons are all in ${subjectById[subjects[0]]?.title}.`}{' '}
              Mixing needs at least two subjects to mix. Some places to start:
            </p>
            <ul className="studio-list">
              {starters.slice(0, 4).map((l) => (
                <li key={l.id}>
                  <a href={hashFor('learn/lesson', { lessonId: l.id })}>{l.title}</a>
                  <span className="studio-muted"> — {subjectById[subjectOf(l)]?.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {ready && !set && <p className="studio-muted" role="status">Mixing a set of questions…</p>}

        {current && (
          <section className="studio-section" aria-labelledby="mixed-q">
            <h3 id="mixed-q" className="studio-eyebrow">
              Question {index + 1} of {set.length} · {subjectById[current.key]?.title}
            </h3>
            <ItemCard
              key={`${round}-${current.item.id}`}
              item={current.item}
              source="mixed"
              onFirstAttempt={(id, ok) => setFirstTry((f) => ({ ...f, [id]: ok }))}
            />
            <div className="studio-row">
              {/* Named only after an answer: knowing the lesson first would
                  answer "which idea is this?" — the point of mixing. */}
              {current.item.id in firstTry && (
                <a className="link-btn" href={hashFor('learn/lesson', { lessonId: current.item.lessonId })}>
                  From the lesson “{LESSONS.find((l) => l.id === current.item.lessonId)?.title}”
                </a>
              )}
              <button type="button" className="studio-btn studio-btn-small" onClick={() => setIndex((i) => i + 1)}>
                {index + 1 < set.length ? 'Next question' : 'Finish the set'}
              </button>
            </div>
          </section>
        )}

        {done && (
          <section className="studio-section studio-card" aria-labelledby="mixed-done">
            <h3 id="mixed-done" className="studio-h3">Set finished</h3>
            <p className="studio-muted">
              {right} of {set.length} right on the first try
              {Object.keys(firstTry).length < set.length ? ` (${set.length - Object.keys(firstTry).length} skipped)` : ''}.
              A new set starts with the questions you have answered least recently.
            </p>
            <button type="button" className="studio-btn" onClick={() => setRound((r) => r + 1)}>Start a new mixed set</button>
          </section>
        )}
    </>
  );
}
