import { useEffect, useMemo, useState } from 'react';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { dueCards } from '../../lib/reviewSchedule.js';
import ItemCard from '../learn/lesson/ItemCard.jsx';
import { lessonItems } from '../../data/curriculum/lessonItems.js';

/**
 * Skills due for review (src/lib/reviewSchedule.js): one question per skill,
 * the one answered least recently. Moved from Home in V4 so "what should I
 * practise now?" has one answer, in Practice.
 */
export default function DueReview() {
  const cards = useLearningStore((s) => s.cards);
  const evidence = useLearningStore((s) => s.evidence);
  // The list is fixed when the session starts, so answering (which moves a
  // card to a later date) does not reshuffle the session under the learner.
  const [due, setDue] = useState(null);
  const liveDue = useMemo(() => dueCards(cards), [cards]);
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState(null);
  const list = due ?? liveDue;
  const comp = due ? due[index]?.id : null;

  useEffect(() => {
    if (!comp) return undefined;
    let live = true;
    setItems(null);
    const sources = LESSONS.filter((l) => l.competencies.includes(comp));
    Promise.all(sources.map((l) => l.load())).then((mods) => {
      if (!live) return;
      const pool = mods.flatMap((m) => lessonItems(m.default)).filter((it) => it.competency === comp);
      // Prefer the item answered least recently (never-answered first).
      const last = (id) => Math.max(0, ...evidence.filter((e) => e.item === id).map((e) => e.at));
      pool.sort((a, b) => last(a.id) - last(b.id));
      setItems(pool.slice(0, 1));
    });
    return () => { live = false; };
  }, [comp]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!due) {
    if (liveDue.length === 0) {
      return <p className="studio-muted">Nothing is due. Skills you practise come back on an expanding schedule (1, 3, 7, 14, 30, 60 days); missed days never reset anything.</p>;
    }
    return (
      <>
        <ul className="studio-list">{liveDue.slice(0, 5).map((c) => <li key={c.id} className="studio-muted">{competencyById[c.id]?.title}</li>)}</ul>
        <div className="studio-row">
          <button type="button" className="studio-btn studio-btn-primary" onClick={() => { setIndex(0); setDue(liveDue); }}>
            Review {liveDue.length} skill{liveDue.length > 1 ? 's' : ''} now
          </button>
        </div>
      </>
    );
  }

  if (!comp) {
    return (
      <div className="studio-callout studio-callout-ok" role="status">
        <p>Review finished. Each skill’s next date moved out (or in, if you missed it).</p>
        <button type="button" className="studio-btn studio-btn-small" onClick={() => setDue(null)}>Done</button>
      </div>
    );
  }

  return (
    <div className="review-session">
      <p className="studio-eyebrow">Review {index + 1} of {list.length}: {competencyById[comp]?.title}</p>
      {!items && <p className="studio-muted" role="status">Loading a question…</p>}
      {items?.length === 0 && <p className="studio-muted">No review question is available for this skill yet.</p>}
      {items?.map((it) => <ItemCard key={`${comp}-${it.id}`} item={it} source="review" />)}
      <div className="studio-row">
        <button type="button" className="studio-btn studio-btn-small" onClick={() => setIndex((i) => i + 1)}>
          {index + 1 < list.length ? 'Next skill' : 'Finish review'}
        </button>
      </div>
    </div>
  );
}
