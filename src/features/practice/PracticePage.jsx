import { useState } from 'react';
import { CHAPTERS, nodes } from '../../data/index.js';
import { getPracProblems } from '../../data/practiceProblems.js';
import { useMasteryStore } from '../../store/useMasteryStore.js';
import { usePracticeStore } from '../../store/usePracticeStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import { logError } from '../../lib/errorLog.js';
import './PracticePage.css';

const STEP_TOLERANCE = 0.011;
const BLANK_TOLERANCE = 0.02;

function emptyAttempt(problem) {
  return {
    identifyChosen: null,
    identifyCorrect: null,
    showSolve: false,
    stepInputs: problem.steps.map(() => ''),
    stepOk: problem.steps.map(() => null),
    solveChecked: false,
    solveAllOk: false,
    showInterp: false,
    interpInputs: (problem.interpretation?.blanks || []).map(() => ''),
    blankOk: (problem.interpretation?.blanks || []).map(() => null),
    interpChecked: false,
    showNext: false,
  };
}

function splitTemplate(template) {
  return template.split(/_+/);
}

export default function PracticePage() {
  const recallData = useMasteryStore((s) => s.recallData);
  const score = usePracticeStore((s) => s.score);
  const recordAnswer = usePracticeStore((s) => s.recordAnswer);
  const addToast = useToastStore((s) => s.addToast);

  const [mode, setMode] = useState('mixed');
  const [chFilter, setChFilter] = useState('all');
  const [current, setCurrent] = useState(null);
  const [attempt, setAttempt] = useState(null);

  function pickNode() {
    let pool = nodes.slice();
    if (mode === 'weak') {
      const weak = nodes.filter((n) => recallData[n.id]?.needsReview);
      if (weak.length) pool = weak;
      else addToast('No weak spots found — try Review Queue first!', 'info');
    }
    if (chFilter !== 'all') pool = pool.filter((n) => String(n.ch) === chFilter);
    if (!pool.length) pool = nodes.slice();
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function newProblem() {
    const node = pickNode();
    const problems = getPracProblems(node.id);
    const problem = problems[Math.floor(Math.random() * problems.length)];
    setCurrent({ node, problem });
    setAttempt(emptyAttempt(problem));
  }

  function identify(idx) {
    const { problem } = current;
    const isCorrect = idx === problem.correctIndex;
    if (!isCorrect) {
      logError({
        nodeId: current.node.id,
        myAnswer: problem.identifyOptions[idx],
        correctAnswer: problem.identifyOptions[problem.correctIndex],
        scenario: problem.scenario,
      });
    }
    recordAnswer(isCorrect);
    setAttempt((a) => ({ ...a, identifyChosen: idx, identifyCorrect: isCorrect }));
    setTimeout(() => setAttempt((a) => ({ ...a, showSolve: true })), isCorrect ? 400 : 900);
  }

  function updateStepInput(i, value) {
    setAttempt((a) => {
      const stepInputs = [...a.stepInputs];
      stepInputs[i] = value;
      return { ...a, stepInputs };
    });
  }

  function checkSolve() {
    const { problem } = current;
    let allOk = true;
    let firstWrongIdx = -1;
    const stepOk = problem.steps.map((step, i) => {
      const val = parseFloat(attempt.stepInputs[i]);
      const ok = !Number.isNaN(val) && Math.abs(val - step.answer) <= STEP_TOLERANCE;
      if (!ok) {
        allOk = false;
        if (firstWrongIdx === -1) firstWrongIdx = i;
      }
      return ok;
    });

    if (!allOk && firstWrongIdx >= 0) {
      const lastStep = problem.steps[problem.steps.length - 1];
      logError({
        nodeId: current.node.id,
        myAnswer: `Step ${firstWrongIdx + 1}: ${attempt.stepInputs[firstWrongIdx] || '?'}`,
        correctAnswer: String(lastStep?.answer ?? '—'),
        scenario: problem.scenario,
      });
    }

    setAttempt((a) => ({ ...a, stepOk, solveChecked: true, solveAllOk: allOk }));
    if (allOk) {
      setTimeout(() => setAttempt((a) => ({ ...a, showInterp: true })), 600);
    }
  }

  function updateInterpInput(i, value) {
    setAttempt((a) => {
      const interpInputs = [...a.interpInputs];
      interpInputs[i] = value;
      return { ...a, interpInputs };
    });
  }

  function submitInterp() {
    const { problem } = current;
    const blanks = problem.interpretation?.blanks || [];
    if (!blanks.length) {
      setAttempt((a) => ({ ...a, showNext: true }));
      return;
    }
    let allOk = true;
    const blankOk = blanks.map((expected, i) => {
      const userVal = (attempt.interpInputs[i] || '').trim().toLowerCase();
      const expectedVal = String(expected).toLowerCase();
      const numUser = parseFloat(userVal);
      const numExp = parseFloat(expectedVal);
      const ok = userVal === expectedVal || (Number.isFinite(numUser) && Number.isFinite(numExp) && Math.abs(numUser - numExp) <= BLANK_TOLERANCE);
      if (!ok) allOk = false;
      return ok;
    });
    setAttempt((a) => ({ ...a, blankOk, interpChecked: true, interpAllOk: allOk, showNext: true }));
  }

  const ch = current ? CHAPTERS.find((c) => c.id === current.node.ch) : null;
  const templateParts = current?.problem.interpretation?.template ? splitTemplate(current.problem.interpretation.template) : [];

  return (
    <div className="prac-page">
      <div className="prac-controls">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="mixed">Mode: Mixed</option>
          <option value="chapter">By chapter</option>
          <option value="weak">Weak spots</option>
        </select>
        <select value={chFilter} onChange={(e) => setChFilter(e.target.value)}>
          <option value="all">Chapters: All</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        <button type="button" className="prac-new-btn" onClick={newProblem}>New problem</button>
        <div className="prac-score">Score: <b>{score.correct}/{score.total}</b> today</div>
      </div>

      <div className="prac-main">
        {!current ? (
          <div className="prac-empty">Click <b>New problem</b> to begin.</div>
        ) : (
          <div className="prac-card">
            <div>
              <div className="prac-node-hdr">
                <span className="prac-ch-name" style={{ color: ch?.color || '#a78bfa' }}>{ch?.name}</span>
                <span className="prac-hdr-sep">·</span>
                <span className="prac-node-name">{current.node.name}</span>
              </div>
              <div className="prac-scenario-lbl">Scenario</div>
              <div className="prac-scenario">{current.problem.scenario}</div>
            </div>

            <div className="prac-zone">
              <div className="prac-zone-lbl">Phase 1 — Identify</div>
              <div className="prac-id-q">Which formula applies here?</div>
              <div className="prac-opts">
                {current.problem.identifyOptions.map((opt, i) => {
                  let cls = 'prac-opt';
                  if (attempt.identifyChosen !== null) {
                    cls += ' disabled';
                    if (i === current.problem.correctIndex) cls += ' correct';
                    else if (i === attempt.identifyChosen) cls += ' wrong';
                  }
                  return (
                    <button key={i} type="button" className={cls} disabled={attempt.identifyChosen !== null} onClick={() => identify(i)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {attempt.identifyChosen !== null && (
                <div className={`prac-why show ${attempt.identifyCorrect ? 'ok' : 'bad'}`}>
                  {attempt.identifyCorrect
                    ? `Correct — ${current.problem.whyCorrect}`
                    : `Not quite — ${current.problem.whyWrong} Correct: ${current.problem.identifyOptions[current.problem.correctIndex]}.`}
                </div>
              )}
            </div>

            <div className={`prac-zone prac-solve-zone${attempt.showSolve ? ' show' : ''}`}>
              <div className="prac-zone-lbl">Phase 2 — Solve</div>
              <div className="prac-formula-tag">{current.node.formula}</div>
              <div className="prac-steps">
                {current.problem.steps.map((step, i) => (
                  <div className="prac-step-row" key={i}>
                    <span className="prac-step-lbl">Step {i + 1}: {step.label}</span>
                    {step.display && <span className="prac-val">{step.display} =</span>}
                    <input
                      className={`prac-inp${attempt.solveChecked ? (attempt.stepOk[i] ? ' inp-ok' : ' inp-err') : ''}`}
                      type="number"
                      step="any"
                      placeholder="?"
                      value={attempt.stepInputs[i]}
                      disabled={attempt.solveChecked}
                      onChange={(e) => updateStepInput(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') checkSolve(); }}
                      aria-label={step.label}
                    />
                    {attempt.solveChecked && !attempt.stepOk[i] && (
                      <div className="prac-inp-hint">Answer: {step.answer}</div>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="prac-check-btn" disabled={attempt.solveChecked} onClick={checkSolve}>Check answer</button>
              {attempt.solveChecked && (
                <div className={`prac-solve-fb show ${attempt.solveAllOk ? 'ok' : 'bad'}`}>
                  {attempt.solveAllOk
                    ? `Correct! ${current.problem.steps[current.problem.steps.length - 1].label} = ${current.problem.steps[current.problem.steps.length - 1].answer}`
                    : 'Some steps need correction — see the correct values above.'}
                </div>
              )}
            </div>

            <div className={`prac-zone prac-interp-zone${attempt.showInterp ? ' show' : ''}`}>
              <div className="prac-zone-lbl">Phase 3 — Interpret</div>
              <div className="prac-interp-q">
                {templateParts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < templateParts.length - 1 && (
                      <input
                        className={`prac-blank-inp${attempt.interpChecked ? (attempt.blankOk[i] ? ' ok' : ' err') : ''}`}
                        type="text"
                        value={attempt.interpInputs[i] || ''}
                        disabled={attempt.interpChecked}
                        onChange={(e) => updateInterpInput(i, e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') submitInterp(); }}
                        aria-label={`blank ${i + 1}`}
                      />
                    )}
                  </span>
                ))}
              </div>
              <button type="button" className="prac-submit-btn" disabled={attempt.interpChecked} onClick={submitInterp}>Submit interpretation</button>
              {attempt.interpChecked && (
                <div className={`prac-interp-fb show ${attempt.blankOk.every(Boolean) ? 'ok' : 'bad'}`}>
                  {attempt.blankOk.every(Boolean) ? 'Correct interpretation!' : 'Some blanks need correction — check the highlighted fields.'}
                </div>
              )}
            </div>

            {attempt.showNext && (
              <button type="button" className="prac-next-btn show" onClick={newProblem}>Next problem →</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
