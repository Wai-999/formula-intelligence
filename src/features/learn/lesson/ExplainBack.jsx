import { useId, useState } from 'react';
import MathText from '../../../components/math/MathText.jsx';
import { useLearningStore } from '../../../store/useLearningStore.js';
import { EXPLAIN_BACK } from '../../../data/curriculum/problems.js';

// Writing first is the point: comparing comes after.
const MIN_LENGTH = 20;

/**
 * "Explain it back" (the Feynman technique): the learner explains the idea in
 * their own words, then compares with the points a good explanation covers
 * and a model answer. A self-check, never recorded as evidence of mastery.
 * The explanation can be added to the lesson's notes.
 */
export default function ExplainBack({ lessonId }) {
  const e = EXPLAIN_BACK[lessonId];
  const saveNote = useLearningStore((s) => s.saveNote);
  const [text, setText] = useState('');
  const [shown, setShown] = useState(false);
  const [covered, setCovered] = useState({});
  const [saved, setSaved] = useState('');
  const id = useId();
  if (!e) return null;
  const ready = text.trim().length >= MIN_LENGTH;
  const addToNotes = () => {
    const before = useLearningStore.getState().notes[lessonId]?.text ?? '';
    const entry = `Explain it back: ${text.trim()}`;
    saveNote(lessonId, before ? `${before}\n\n${entry}` : entry);
    setSaved('Added to your notes for this lesson.');
  };
  return (
    <section className="explain-back" aria-labelledby={`${id}-h`}>
      <h3 id={`${id}-h`} className="studio-h3">Explain it back</h3>
      <MathText as="p" text={e.prompt} />
      <label htmlFor={`${id}-t`} className="visually-hidden">Your explanation</label>
      <textarea id={`${id}-t`} className="studio-textarea" value={text} onChange={(ev) => setText(ev.target.value)} placeholder="In your own words, as if to a friend who missed the lesson." />
      <div className="studio-row">
        <button type="button" className="studio-btn studio-btn-small" disabled={!ready} onClick={() => setShown(true)}>Compare with a model answer</button>
        <button type="button" className="studio-btn studio-btn-small" disabled={!ready} onClick={addToNotes}>Add to my notes</button>
      </div>
      {!ready && <p className="studio-muted">Write a sentence or two first: explaining before reading is what makes this work.</p>}
      <p className="studio-muted" role="status">{saved}</p>
      {shown && (
        <div className="explain-compare">
          <p className="studio-muted">Did your explanation cover these? This is a check for you; it is not recorded anywhere.</p>
          <ul className="explain-points">
            {e.points.map((p, i) => (
              <li key={p}>
                <label>
                  <input type="checkbox" checked={!!covered[i]} onChange={() => setCovered((c) => ({ ...c, [i]: !c[i] }))} />{' '}
                  <MathText text={p} />
                </label>
              </li>
            ))}
          </ul>
          <p className="studio-eyebrow">One good answer</p>
          <MathText as="p" text={e.model} />
        </div>
      )}
    </section>
  );
}
