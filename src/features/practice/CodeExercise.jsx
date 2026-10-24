import { useId, useRef, useState } from 'react';
import MathText from '../../components/math/MathText.jsx';
import { gradePython, runPython, stopPython } from '../../lib/pyodideRunner.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import './code.css';

const TYPE_LABEL = {
  implement: 'Implement', 'fill-gap': 'Fill the gap', 'predict-output': 'Predict the output', debug: 'Debug',
  'numpy-compare': 'Compare with NumPy', visualize: 'Visualize', interpret: 'Interpret', analyze: 'Analyze data',
};

/** The exercise as a standalone .py file: the local-run fallback (§9). */
function downloadPy(ex, code) {
  const body = ex.type === 'predict-output' || ex.type === 'interpret'
    ? `# ${ex.title}\n# Run with: python3 ${ex.id}.py\n${ex.code}\n`
    : `# ${ex.title}\n# Run with: python3 ${ex.id}.py   (needs: ${ex.packages.join(', ') || 'only the standard library'})\n# It prints ALL TESTS PASSED when your code is right.\n\n${ex.setup ?? ''}\n\n# ---- your code ----\n${code}\n\n# ---- tests ----\n${ex.tests.map((t) => `# ${t.name}\n${t.code}`).join('\n')}\nprint("ALL TESTS PASSED")\n`;
  const url = URL.createObjectURL(new Blob([body], { type: 'text/x-python' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ex.id}.py`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function ChoiceCheck({ ex, onResult }) {
  const [choice, setChoice] = useState(null);
  const [done, setDone] = useState(null);
  const id = useId();
  return (
    <div className="code-choice">
      <fieldset className="item-choices" disabled={done !== null}>
        <legend className="studio-h3">{ex.type === 'interpret' ? 'What should you conclude?' : 'What does it print?'}</legend>
        {ex.choices.map((c, i) => (
          <label key={i} className={`item-choice${choice === i ? ' on' : ''}${done !== null && i === ex.correct ? ' answer' : ''}`}>
            <input type="radio" name={id} aria-label={c} checked={choice === i} onChange={() => setChoice(i)} />
            {ex.type === 'predict-output' ? <pre className="code-inline-out">{c}</pre> : <span>{c}</span>}
          </label>
        ))}
      </fieldset>
      {done === null ? (
        <button type="button" className="studio-btn studio-btn-small" disabled={choice === null} onClick={() => { const ok = choice === ex.correct; setDone(ok); onResult(ok); }}>Check</button>
      ) : (
        <div className={`studio-callout ${done ? 'studio-callout-ok' : 'studio-callout-bad'}`} role="status">
          <p className="item-verdict">{done ? 'Correct.' : 'Not quite.'}</p>
          <MathText as="p" text={ex.explanation} />
        </div>
      )}
    </div>
  );
}

export default function CodeExercise({ ex }) {
  const draft = useWorkStore((s) => s.drafts[ex.id]);
  const result = useWorkStore((s) => s.results[ex.id]);
  const saveDraft = useWorkStore((s) => s.saveDraft);
  const recordResult = useWorkStore((s) => s.recordResult);
  const record = useLearningStore((s) => s.record);
  const [code, setCode] = useState(draft ?? ex.starter ?? '');
  const [state, setState] = useState(null); // { running, progress } | grade result | run result
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const recorded = useRef(false);
  const id = useId();
  const choiceType = ex.type === 'predict-output' || ex.type === 'interpret';

  const evidence = (ok) => {
    if (recorded.current) return;
    recorded.current = true;
    record({ competency: ex.competency, item: ex.id, ok, difficulty: hints ? 1 : 2, source: 'practice' });
  };

  async function check() {
    setState({ running: true, progress: 'Starting Python…' });
    const r = await gradePython(ex, code, { onProgress: (p) => setState({ running: true, progress: p }) });
    const passed = !r.error && r.tests.length === ex.tests.length && r.tests.every((t) => t.passed);
    setState(r);
    setAttempts((n) => n + 1);
    if (!r.timedOut && !(r.error && /Could not start|unexpectedly|runtime/i.test(r.error))) {
      recordResult(ex.id, passed);
      evidence(passed);
    }
  }

  async function runSnippet() {
    setState({ running: true, progress: 'Starting Python…' });
    const r = await runPython(ex.code, { onProgress: (p) => setState({ running: true, progress: p }), timeoutMs: 20_000 });
    setState({ run: r });
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); check(); return; }
    if (e.key !== 'Tab' || e.shiftKey) return;
    e.preventDefault();
    const el = e.target;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const next = `${value.slice(0, a)}    ${value.slice(b)}`;
    setCode(next);
    saveDraft(ex.id, next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = a + 4; });
  }

  const passedAll = state && state.tests && !state.error && state.tests.every((t) => t.passed) && state.tests.length === ex.tests.length;

  return (
    <article className="code-ex" aria-labelledby={`${id}-t`}>
      <div className="code-ex-head">
        <h3 id={`${id}-t`} className="studio-h3">{ex.title}</h3>
        <div className="studio-row">
          <span className="studio-chip">{TYPE_LABEL[ex.type]}</span>
          <span className="studio-chip">{competencyById[ex.competency]?.title}</span>
          {result?.passed && <span className="studio-chip studio-chip-ok"><i className="ti ti-check" aria-hidden="true" /> Solved</span>}
        </div>
      </div>
      <MathText as="p" className="code-prompt" text={ex.prompt} />

      {choiceType ? (
        <>
          <pre className="lesson-code" tabIndex={0} aria-label="Code">{ex.code}</pre>
          {ex.type === 'interpret' && (
            <div className="studio-row">
              <button type="button" className="studio-btn studio-btn-small" onClick={runSnippet} disabled={state?.running}><i className="ti ti-player-play" aria-hidden="true" /> Run it</button>
            </div>
          )}
          {state?.running && <p className="studio-muted" role="status">{state.progress}</p>}
          {state?.run && (
            <div role="status">
              {state.run.output && <pre className="lesson-code lesson-output">{state.run.output}</pre>}
              {state.run.error && <pre className="lesson-code code-err">{state.run.error}</pre>}
            </div>
          )}
          <ChoiceCheck ex={ex} onResult={(ok) => { recordResult(ex.id, ok); evidence(ok); }} />
        </>
      ) : (
        <>
          {ex.setup && (
            <details className="code-setup">
              <summary>Already defined for you</summary>
              <pre className="lesson-code">{ex.setup}</pre>
            </details>
          )}
          <label htmlFor={`${id}-ed`} className="visually-hidden">Your code</label>
          <textarea
            id={`${id}-ed`}
            className="code-editor"
            value={code}
            spellCheck={false}
            rows={Math.max(6, code.split('\n').length + 1)}
            onChange={(e) => { setCode(e.target.value); saveDraft(ex.id, e.target.value); }}
            onKeyDown={onKeyDown}
          />
          <div className="studio-row">
            <button type="button" className="studio-btn studio-btn-small studio-btn-primary" onClick={check} disabled={state?.running}>
              <i className="ti ti-player-play" aria-hidden="true" /> Check my code
            </button>
            {state?.running && <button type="button" className="studio-btn studio-btn-small" onClick={stopPython}><i className="ti ti-player-stop" aria-hidden="true" /> Stop</button>}
            {ex.hints?.length > 0 && hints < ex.hints.length && <button type="button" className="studio-btn studio-btn-small" onClick={() => setHints((n) => n + 1)}>{hints ? 'Another hint' : 'Hint'}</button>}
            {(attempts >= 2 || passedAll) && !showSolution && <button type="button" className="studio-btn studio-btn-small" onClick={() => setShowSolution(true)}>Reference solution</button>}
            <button type="button" className="studio-btn studio-btn-small" onClick={() => { setCode(ex.starter); saveDraft(ex.id, ex.starter); setState(null); }}>Reset</button>
            <button type="button" className="studio-btn studio-btn-small" onClick={() => downloadPy(ex, code)}><i className="ti ti-download" aria-hidden="true" /> .py</button>
          </div>
          {hints > 0 && <ul className="item-hints">{ex.hints.slice(0, hints).map((h) => <li key={h}><MathText text={h} /></li>)}</ul>}
          <div role="status" aria-live="polite">
            {state?.running && <p className="studio-muted">{state.progress}</p>}
            {state && !state.running && state.error && (
              <div className="studio-callout studio-callout-bad">
                <p className="item-verdict">{state.timedOut ? 'Stopped' : 'Your code raised an error'}</p>
                <pre className="code-inline-out">{state.error}</pre>
                {/Could not start|CDN|network|fetch/i.test(state.error) && (
                  <p>Python runs in your browser and needs a one-time download, so it is unavailable offline. Use “.py” to download this exercise with its tests and run it locally with <code className="mt-code">python3 {ex.id}.py</code>.</p>
                )}
              </div>
            )}
            {state && !state.running && state.tests && !state.error && (
              <div className={`studio-callout ${passedAll ? 'studio-callout-ok' : 'studio-callout-warn'}`}>
                <p className="item-verdict">{passedAll ? 'All checks passed.' : `${state.tests.filter((t) => t.passed).length} of ${ex.tests.length} checks passed.`}</p>
                <ul className="code-tests">
                  {state.tests.map((t) => (
                    <li key={t.name} className={t.passed ? 'pass' : 'fail'}>
                      <i className={`ti ${t.passed ? 'ti-circle-check' : 'ti-circle-x'}`} aria-hidden="true" /> {t.name}
                      {!t.passed && <span className="code-test-msg">{t.message}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {state?.output && !state.running && <pre className="lesson-code lesson-output" aria-label="What your code printed">{state.output}</pre>}
            {state?.figures?.map((src, i) => <img key={i} src={src} alt={`Figure ${i + 1} from your code`} className="code-fig" />)}
          </div>
          {showSolution && (
            <div className="item-solution">
              <p className="studio-eyebrow">Reference solution</p>
              <pre className="lesson-code">{ex.solution}</pre>
            </div>
          )}
        </>
      )}
    </article>
  );
}
