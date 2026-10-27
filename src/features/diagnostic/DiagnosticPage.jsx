import { useMemo, useState } from 'react';
import MathText from '../../components/math/MathText.jsx';
import { DX_ITEMS, BANK_VERSION, dxItemById } from '../../data/diagnostic/itemBank.js';
import { DOMAINS } from '../../data/curriculum/competencies.js';
import { COURSES, courseById } from '../../data/curriculum/catalog.js';
import { nextItem, assessDomain, recommend, placementChoices, LEVEL_TEXT } from '../../lib/diagnostic.js';
import { checkAnswer } from '../../lib/answers.js';
import { toPlainText } from '../../lib/mathFormat.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import '../learn/learn.css';
import './diagnostic.css';

const domainTitle = Object.fromEntries(DOMAINS.map((d) => [d.id, d.title]));

function Question({ item, onAnswer, onSkip, onSkipDomain, onStop, index }) {
  const [value, setValue] = useState(item.answer.type === 'multi' ? item.answer.values.map(() => '') : '');
  const [msg, setMsg] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (item.answer.type === 'choice' && value === '') { setMsg('Choose an answer, or skip this question.'); return; }
    const r = checkAnswer(item.answer, item.answer.type === 'choice' ? Number(value) : value);
    if (r.reason && r.parsed === null) { setMsg(r.reason); return; }
    onAnswer(r.correct);
  };
  return (
    <form className="dx-question" onSubmit={submit} aria-labelledby="dx-q">
      <p className="studio-eyebrow">Question {index + 1} · {domainTitle[item.domain]}</p>
      <div id="dx-q" className="item-prompt"><MathText text={item.prompt} /></div>
      {item.answer.type === 'choice' && (
        <fieldset className="item-choices">
          <legend className="visually-hidden">Choose one answer</legend>
          {item.answer.choices.map((c, i) => (
            <label key={i} className={`item-choice${String(i) === value ? ' on' : ''}`}>
              <input type="radio" name="dx" aria-label={toPlainText(c)} checked={String(i) === value} onChange={() => setValue(String(i))} />
              <MathText text={c} />
            </label>
          ))}
        </fieldset>
      )}
      {item.answer.type === 'numeric' && (
        <div className="item-input-row">
          <label className="visually-hidden" htmlFor="dx-in">Your answer</label>
          <input id="dx-in" className="studio-input item-input" inputMode="decimal" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Your answer" autoFocus />
        </div>
      )}
      {item.answer.type === 'multi' && (
        <div className="item-input-row">
          {item.answer.values.map((_, i) => (
            <label key={i} className="item-multi">
              <span>{item.answer.labels?.[i]}</span>
              <input className="studio-input item-input" inputMode="decimal" autoComplete="off" value={value[i]} onChange={(e) => setValue((v) => v.map((x, j) => (j === i ? e.target.value : x)))} />
            </label>
          ))}
        </div>
      )}
      {msg && <p className="studio-callout studio-callout-warn" role="alert">{msg}</p>}
      <div className="studio-row">
        <button type="submit" className="studio-btn studio-btn-primary">Submit answer</button>
        <button type="button" className="studio-btn" onClick={onSkip}>Skip this question</button>
        <button type="button" className="studio-btn" onClick={onSkipDomain}>I haven’t studied {domainTitle[item.domain].toLowerCase()}</button>
        <button type="button" className="studio-btn" onClick={onStop}>Stop and see results</button>
      </div>
    </form>
  );
}

function Results({ attempt, onRetake }) {
  const placement = useDiagnosticStore((s) => s.placement);
  const setPlacement = useDiagnosticStore((s) => s.setPlacement);
  const [manual, setManual] = useState(placement?.course ?? attempt.result.course);
  const rec = attempt.result;
  const choice = placementChoices(rec.course);
  return (
    <div className="studio-section">
      <div className="studio-callout">
        <p className="studio-eyebrow">Suggested starting point — provisional</p>
        <h2 className="studio-h2">{courseById[rec.course]?.title}</h2>
        <ul className="lesson-ul">{rec.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
        {/* V4 §6: the suggestion is reversible in one click, in either direction. */}
        <div className="studio-row dx-choices" role="group" aria-label="Where to start" style={{ marginTop: 10 }}>
          {choice.earlier && (
            <a className="studio-btn" href={hashFor('learn/course', { courseId: choice.earlier })} onClick={() => setPlacement(choice.earlier, 'manual')}>
              Start earlier: {courseById[choice.earlier]?.title}
            </a>
          )}
          <a className="studio-btn studio-btn-primary" href={hashFor('learn/course', { courseId: rec.course })} onClick={() => setPlacement(rec.course, 'diagnostic', attempt.id)}>
            Start here: {courseById[rec.course]?.title}
          </a>
          {choice.ahead && (
            <a className="studio-btn" href={hashFor('learn/course', { courseId: choice.ahead })} onClick={() => setPlacement(choice.ahead, 'manual')}>
              Skip ahead: {courseById[choice.ahead]?.title}
            </a>
          )}
        </div>
        <p className="studio-muted">Not sure? Start earlier: revisiting familiar ground costs a little time; a gap costs more later. <button type="button" className="link-btn" onClick={onRetake}>Retake the placement check</button></p>
      </div>

      {rec.alsoConsider.length > 0 && (
        <div>
          <h3 className="studio-h3">Also worth considering, in parallel</h3>
          <ul className="lesson-ul">
            {rec.alsoConsider.map((a) => <li key={a.course}><a href={hashFor('learn/course', { courseId: a.course })}>{courseById[a.course]?.title}</a> — {a.why}</li>)}
          </ul>
        </div>
      )}

      <h3 className="studio-h3">What your answers suggest, area by area</h3>
      <div className="dx-domains">
        {attempt.estimates.map((e) => (
          <div key={e.domain} className={`dx-domain dx-${e.level}`}>
            <p className="dx-domain-title">{domainTitle[e.domain]}</p>
            <p className="dx-domain-level">{LEVEL_TEXT[e.level]}</p>
            {e.level !== 'not-assessed' ? (
              <>
                <p className="studio-muted">{e.correct} of {e.answered} correct · {e.confidence} confidence</p>
                {/* Ability estimate ± 1 SD on a −3…3 scale: a wide bar means the screen could not tell. */}
                <div className="dx-range" aria-hidden="true">
                  <span className="dx-range-band" style={{ left: `${Math.max(0, ((e.mean - e.sd + 3) / 6) * 100)}%`, width: `${Math.min(100, ((2 * e.sd) / 6) * 100)}%` }} />
                  <span className="dx-range-dot" style={{ left: `${((Math.max(-3, Math.min(3, e.mean)) + 3) / 6) * 100}%` }} />
                </div>
              </>
            ) : <p className="studio-muted">Skipped — counted as not yet studied.</p>}
          </div>
        ))}
      </div>
      <p className="studio-muted">
        The bar shows the estimate with its uncertainty: wider means less sure. With at most three questions per area,
        every estimate is rough. Question difficulties are the author’s judgement and have not been calibrated against
        learners’ results, so treat this as a starting suggestion — not a placement test, a grade, or an official
        course placement.
      </p>

      <div className="studio-fieldset">
        <label htmlFor="dx-manual" className="studio-h3">Choose your own starting point instead</label>
        <div className="studio-row">
          <select id="dx-manual" className="studio-input" value={manual} onChange={(e) => setManual(e.target.value)}>
            {COURSES.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button type="button" className="studio-btn" onClick={() => setPlacement(manual, 'manual')}>Use this</button>
        </div>
        {placement && <p className="studio-muted" role="status">Current starting point: {courseById[placement.course]?.title} ({placement.source === 'manual' ? 'your choice' : placement.source === 'diagnostic' ? 'from a placement check' : 'chosen at start'}).</p>}
      </div>

      <details className="dx-review">
        <summary>Review your answers</summary>
        <ol className="lesson-ul">
          {attempt.responses.map((r) => {
            const it = dxItemById[r.item];
            return (
              <li key={r.item}>
                <MathText text={it.prompt} /> — <strong>{r.ok === null ? 'skipped' : r.ok ? 'correct' : 'not correct'}</strong>. <MathText text={it.solution} />
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}

export default function DiagnosticPage() {
  const attempts = useDiagnosticStore((s) => s.attempts);
  const saveAttempt = useDiagnosticStore((s) => s.saveAttempt);
  const chooseFirstRun = useDiagnosticStore((s) => s.chooseFirstRun);
  const record = useLearningStore((s) => s.record);
  const [run, setRun] = useState(null); // { responses, skippedDomains, startedAt }
  const [viewing, setViewing] = useState(null);
  const last = attempts[attempts.length - 1];
  const item = useMemo(() => (run ? nextItem(DX_ITEMS, run) : null), [run]);

  const finish = (state) => {
    const estimates = DOMAINS.map((d) => assessDomain(d.id, state.responses, state.skippedDomains.includes(d.id)));
    const attempt = {
      id: `dx-${Date.now().toString(36)}`,
      bankVersion: BANK_VERSION,
      startedAt: state.startedAt,
      finishedAt: Date.now(),
      responses: state.responses,
      skippedDomains: state.skippedDomains,
      estimates,
      result: recommend(estimates),
    };
    saveAttempt(attempt);
    chooseFirstRun('diagnostic');
    setRun(null);
    setViewing(attempt.id);
  };

  const advance = (next) => {
    if (!nextItem(DX_ITEMS, next)) finish(next);
    else setRun(next);
  };

  if (run && item) {
    const answeredCount = run.responses.length;
    return (
      <div className="studio-scroll">
        <div className="studio-page studio-read">
          <div className="dx-progress" aria-label={`${answeredCount} questions answered of at most 24`}>
            <span style={{ width: `${Math.min(100, (answeredCount / 24) * 100)}%` }} />
          </div>
          <Question
            key={item.id}
            item={item}
            index={answeredCount}
            onAnswer={(ok) => {
              record({ competency: item.competency, item: item.id, ok, difficulty: item.difficulty, source: 'diagnostic' });
              advance({ ...run, responses: [...run.responses, { item: item.id, domain: item.domain, difficulty: item.difficulty, ok }] });
            }}
            onSkip={() => advance({ ...run, responses: [...run.responses, { item: item.id, domain: item.domain, difficulty: item.difficulty, ok: null }] })}
            onSkipDomain={() => advance({ ...run, skippedDomains: [...run.skippedDomains, item.domain] })}
            onStop={() => finish(run)}
          />
          <p className="studio-muted">Answers are not marked as you go — this is a screen, not a test. You can review them at the end.</p>
        </div>
      </div>
    );
  }

  const shown = attempts.find((a) => a.id === viewing) ?? (viewing === null ? last : null);
  // A retake prefers questions earlier attempts did not ask (nextItem).
  const start = () => {
    setViewing(null);
    setRun({ responses: [], skippedDomains: [], startedAt: Date.now(), seenBefore: attempts.flatMap((a) => a.responses.map((r) => r.item)) });
  };

  return (
    <div className="studio-scroll">
      <div className="studio-page">
        {!shown && (
          <div className="studio-section studio-read">
            <p className="studio-lede">
              About 15–20 short questions across eight areas — arithmetic to Python — to suggest where to start. It adapts:
              a correct answer leads to a harder question, a miss to an easier one.
            </p>
            <ul className="lesson-ul">
              <li>Low stakes: nothing is graded, and answers are not marked as you go.</li>
              <li>Skip any question, or a whole area you have not studied. Stop whenever you like.</li>
              <li>Private: your answers are stored only in this browser on this device, and never sent anywhere.</li>
              <li>The result is a provisional suggestion with its uncertainty shown, not an official placement. You can override it or retake it any time.</li>
            </ul>
            <div className="studio-row">
              <button type="button" className="studio-btn studio-btn-primary" onClick={start}>Start the placement check</button>
              <a className="studio-btn" href={hashFor('learn/courses')}>Skip it and browse courses</a>
            </div>
          </div>
        )}
        {shown && <Results attempt={shown} onRetake={start} />}
        {attempts.length > 0 && (
          <section className="studio-section" aria-labelledby="dx-history">
            <h2 id="dx-history" className="studio-h2">Your attempts</h2>
            <p className="studio-muted">Every attempt is kept; a retake never overwrites an earlier one.</p>
            <ul className="studio-list">
              {[...attempts].reverse().map((a) => (
                <li key={a.id} className="studio-row">
                  <button type="button" className="link-btn" aria-pressed={shown?.id === a.id} onClick={() => setViewing(a.id)}>
                    {new Date(a.finishedAt).toLocaleString()}
                  </button>
                  <span className="studio-muted">suggested {courseById[a.result.course]?.title} · {a.responses.length} questions · item bank {a.bankVersion}</span>
                </li>
              ))}
            </ul>
            {shown && <button type="button" className="studio-btn" onClick={start}>Start a new attempt</button>}
          </section>
        )}
      </div>
    </div>
  );
}
