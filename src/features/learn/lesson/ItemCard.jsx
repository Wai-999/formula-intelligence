import { useId, useRef, useState } from 'react';
import MathText from '../../../components/math/MathText.jsx';
import { checkAnswer } from '../../../lib/answers.js';
import { toPlainText } from '../../../lib/mathFormat.js';
import { useLearningStore } from '../../../store/useLearningStore.js';
import { lessonById } from '../../../data/curriculum/lessons/index.js';
import { hashFor } from '../../../app/pages.js';

const LEVEL_LABEL = { scaffolded: 'Scaffolded', independent: 'Independent', transfer: 'Transfer' };

/**
 * One assessable question: answer, check, feedback, hints, solution.
 *
 * Evidence (src/lib/mastery.js) is recorded for the FIRST attempt in a
 * visit only. Later attempts are still checked and explained — retrying is
 * how you learn — but a correct answer reached by trial and error after
 * seeing feedback is not a second demonstration of anything. Using a hint
 * before that first attempt records it as an easier item, never transfer.
 */
export default function ItemCard({ item, source, index, onFirstAttempt }) {
  const record = useLearningStore((s) => s.record);
  const [value, setValue] = useState(item.answer.type === 'multi' ? item.answer.values.map(() => '') : '');
  const [result, setResult] = useState(null); // { correct, reason, choice }
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const recorded = useRef(false);
  const id = useId();

  function submit(e) {
    e.preventDefault();
    const response = item.answer.type === 'choice' ? Number(value) : value;
    if (item.answer.type === 'choice' && value === '') {
      setResult({ correct: false, reason: 'Choose an answer first.' });
      return;
    }
    const r = checkAnswer(item.answer, response);
    if (r.reason && r.parsed === null) { setResult(r); return; }
    setResult({ ...r, choice: item.answer.type === 'choice' ? Number(value) : null });
    setAttempts((n) => n + 1);
    if (!recorded.current) {
      recorded.current = true;
      const hinted = hintsShown > 0;
      record({
        competency: item.competency,
        item: item.id,
        ok: r.correct,
        difficulty: hinted ? 1 : item.difficulty,
        transfer: !hinted && item.transfer,
        transferItem: !!item.transfer,
        hinted,
        source,
      });
      onFirstAttempt?.(item.id, r.correct);
    }
  }

  const choiceFeedback = result && !result.correct && result.choice != null ? item.feedback?.[result.choice] : null;
  const remedy = item.remedy && lessonById[item.remedy];
  const solved = result?.correct;
  const canSeeSolution = attempts > 0;

  return (
    <article className={`item-card${solved ? ' solved' : ''}`} aria-labelledby={`${id}-p`}>
      <div className="item-meta">
        {index != null && <span className="item-num">{index + 1}</span>}
        {item.level && <span className="studio-chip">{LEVEL_LABEL[item.level]}</span>}
        {item.transfer && !item.level && <span className="studio-chip">Transfer</span>}
        <span className="item-diff" aria-label={`Difficulty ${item.difficulty} of 3`}>{'●'.repeat(item.difficulty)}{'○'.repeat(3 - item.difficulty)}</span>
      </div>
      <div id={`${id}-p`} className="item-prompt"><MathText text={item.prompt} /></div>

      <form className="item-form" onSubmit={submit}>
        {item.answer.type === 'choice' && (
          <fieldset className="item-choices">
            <legend className="visually-hidden">Choose one answer</legend>
            {item.answer.choices.map((c, i) => (
              <label key={i} className={`item-choice${String(i) === String(value) ? ' on' : ''}`}>
                <input type="radio" name={`${id}-c`} value={i} aria-label={toPlainText(c)} checked={String(i) === String(value)} onChange={() => setValue(String(i))} />
                <MathText text={c} />
              </label>
            ))}
          </fieldset>
        )}
        {item.answer.type === 'numeric' && (
          <div className="item-input-row">
            <label htmlFor={`${id}-in`} className="visually-hidden">Your answer</label>
            <input id={`${id}-in`} className="studio-input item-input" inputMode="decimal" autoComplete="off" placeholder="Your answer" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        )}
        {item.answer.type === 'multi' && (
          <div className="item-input-row">
            {item.answer.values.map((_, i) => (
              <label key={i} className="item-multi">
                <span>{item.answer.labels?.[i] ?? `Value ${i + 1}`}</span>
                <input className="studio-input item-input" inputMode="decimal" autoComplete="off" value={value[i]} onChange={(e) => setValue((v) => v.map((x, j) => (j === i ? e.target.value : x)))} />
              </label>
            ))}
          </div>
        )}
        <div className="studio-row">
          <button type="submit" className="studio-btn studio-btn-small">Check</button>
          {item.hints?.length > 0 && hintsShown < item.hints.length && !solved && (
            <button type="button" className="studio-btn studio-btn-small" onClick={() => setHintsShown((n) => n + 1)}>
              {hintsShown === 0 ? 'Show a hint' : 'Another hint'}
            </button>
          )}
          {canSeeSolution && !showSolution && item.solution && (
            <button type="button" className="studio-btn studio-btn-small" onClick={() => setShowSolution(true)}>Show solution</button>
          )}
        </div>
      </form>

      {hintsShown > 0 && (
        <ul className="item-hints" aria-label="Hints">
          {item.hints.slice(0, hintsShown).map((h, i) => <li key={i}><MathText text={h} /></li>)}
        </ul>
      )}

      <div className="item-feedback" role="status" aria-live="polite">
        {result?.reason && <p className="studio-callout studio-callout-warn">{result.reason}</p>}
        {result && !result.reason && (
          <div className={`studio-callout ${result.correct ? 'studio-callout-ok' : 'studio-callout-bad'}`}>
            <p className="item-verdict">
              <i className={`ti ${result.correct ? 'ti-circle-check' : 'ti-circle-x'}`} aria-hidden="true" />
              {result.correct ? ' Correct.' : ' Not yet.'}
            </p>
            {result.correct && item.feedbackCorrect && <MathText as="p" text={item.feedbackCorrect} />}
            {!result.correct && (choiceFeedback || item.feedbackIncorrect) && <MathText as="p" text={choiceFeedback || item.feedbackIncorrect} />}
            {!result.correct && remedy && (
              <p>Worth a refresher: <a href={hashFor('learn/lesson', { lessonId: remedy.id })}>{remedy.title}</a>.</p>
            )}
          </div>
        )}
      </div>

      {showSolution && item.solution && (
        <div className="item-solution">
          <p className="studio-eyebrow">Solution</p>
          <MathText as="p" text={item.solution} />
        </div>
      )}
    </article>
  );
}
