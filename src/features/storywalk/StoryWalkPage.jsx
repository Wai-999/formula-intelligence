import { useState } from 'react';
import { nodeById, CHAPTERS, chapterColorMap } from '../../data/index.js';
import { STORYLINES } from '../../data/storylines.js';
import { useStoryWalkStore } from '../../store/useStoryWalkStore.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import './StoryWalkPage.css';

const META = Object.fromEntries(
  STORYLINES.map((s) => {
    const formulaIds = new Set();
    s.steps.forEach((step) => (step.nodeIds || []).forEach((id) => formulaIds.add(id)));
    return [s.id, { steps: s.steps.length, decisions: s.steps.length, formulas: formulaIds.size }];
  })
);

const STORY_ICONS = {
  health: 'ti-heartbeat',
  business: 'ti-chart-bar',
  social: 'ti-school',
  sports: 'ti-ball-basketball',
  environment: 'ti-droplet',
  manufacturing: 'ti-settings',
  finance: 'ti-chart-line',
  psychology: 'ti-brain',
  product: 'ti-device-laptop',
  ecology: 'ti-leaf',
  aerospace: 'ti-rocket',
};

function StorySelectionScreen({ onBegin }) {
  const progress = useStoryWalkStore((s) => s.progress);
  const setProgress = useStoryWalkStore((s) => s.setProgress);

  function handleRestart(e, id) {
    e.stopPropagation();
    setProgress(id, { currentStep: 0, decisionsCorrect: 0, hintsUsed: 0 });
    onBegin(id);
  }

  return (
    <div className="sw-content">
      <div className="sw-sel-header">
        <h1>Choose your investigation</h1>
        <p>Statistics is a detective's toolkit. Pick a real-world case to solve — from raw data to defensible conclusion.</p>
      </div>
      <div className="sw-cards-grid">
        {STORYLINES.map((s) => {
          const sp = progress[s.id];
          const meta = META[s.id] || { steps: s.steps.length, decisions: s.steps.length, formulas: s.steps.length };
          const hasProgress = sp && sp.currentStep > 0;
          return (
            <div className="sw-story-card" key={s.id} onClick={() => onBegin(s.id)}>
              <div className="sw-sc-icon"><i className={`ti ${STORY_ICONS[s.id] || 'ti-file-search'}`} aria-hidden="true" /></div>
              <div className="sw-sc-title">{s.title}</div>
              <div className="sw-sc-desc">{s.intro}</div>
              <div className="sw-sc-meta">{meta.steps} chapters · {meta.decisions} decisions · {meta.formulas} formulas</div>
              {hasProgress ? (
                <>
                  <button type="button" className="sw-sc-btn sw-continue" onClick={() => onBegin(s.id)}>
                    Continue (Step {sp.currentStep + 1} of {s.steps.length})
                  </button>
                  <span className="sw-restart-link" onClick={(e) => handleRestart(e, s.id)}>Restart from beginning</span>
                </>
              ) : (
                <button type="button" className="sw-sc-btn">Begin investigation →</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActiveStoryScreen({ story, onExit }) {
  const getProgress = useStoryWalkStore((s) => s.getProgress);
  const setProgress = useStoryWalkStore((s) => s.setProgress);
  const viewOnMap = useUIStore((s) => s.viewOnMap);
  const addToast = useToastStore((s) => s.addToast);

  const [step, setStep] = useState(() => getProgress(story.id).currentStep || 0);
  const [answered, setAnswered] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [chosenIdx, setChosenIdx] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  const total = story.steps.length;
  const stepData = story.steps[step];
  const stepChId = stepData.chapter || nodeById[stepData.nodeIds?.[0]]?.ch || 2;
  const chColor = chapterColorMap[stepChId] || '#8b5cf6';

  function resetStepUI() {
    setAnswered(false);
    setWrongCount(0);
    setChosenIdx(null);
    setShowHint(false);
    setGaveUp(false);
  }

  function goToStep(newStep) {
    setStep(newStep);
    resetStepUI();
  }

  function answer(i) {
    if (answered) return;
    if (i === stepData.correct) {
      setAnswered(true);
      setChosenIdx(i);
      const curr = getProgress(story.id);
      setProgress(story.id, { currentStep: step, decisionsCorrect: (curr.decisionsCorrect || 0) + 1 });
    } else {
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);
      setChosenIdx(i);
      setTimeout(() => setChosenIdx((c) => (c === i ? null : c)), 500);
      if (nextWrong === 1) {
        setShowHint(true);
      } else {
        setAnswered(true);
        setGaveUp(true);
        const curr = getProgress(story.id);
        setProgress(story.id, { currentStep: step, hintsUsed: (curr.hintsUsed || 0) + 1 });
      }
    }
  }

  function nav(delta) {
    const newStep = step + delta;
    if (newStep < 0) return;
    if (newStep >= total) {
      addToast('Investigation complete! Great statistical thinking.', 'success');
      setProgress(story.id, { currentStep: 0, decisionsCorrect: 0, hintsUsed: 0 });
      onExit();
      return;
    }
    setProgress(story.id, { currentStep: newStep });
    goToStep(newStep);
  }

  return (
    <div className="sw-active-wrap">
      <div className="sw-active-bar">
        <span className="sw-active-title">{story.title}</span>
        <div className="sw-prog-track"><div className="sw-prog-fill" style={{ width: `${Math.round((step / total) * 100)}%` }} /></div>
        <span className="sw-prog-label">Step {step + 1} of {total}</span>
        <button type="button" className="sw-nav-btn" disabled={step === 0} onClick={() => nav(-1)}>← Prev</button>
        <button type="button" className="sw-nav-btn" disabled={!answered} onClick={() => nav(1)}>Next →</button>
        <button type="button" className="sw-exit-btn" onClick={onExit}>Exit</button>
      </div>

      <div className="sw-step-content">
        <div className="sw-ch-label">Chapter {step + 1}: {stepData.title}</div>
        <div className="sw-case-file" style={{ borderLeftColor: chColor }}>{stepData.narrative}</div>

        {(stepData.nodeIds || []).map((id) => {
          const n = nodeById[id];
          if (!n) return null;
          const ch = CHAPTERS.find((c) => c.id === n.ch);
          return (
            <div className="sw-formula-box" key={id}>
              <div className="sw-formula-lbl">Formula in use</div>
              <div className="sw-formula-name">
                {n.name}
                <span className="sw-formula-ch-dot" style={{ background: ch?.color || '#888' }} />
                <span style={{ fontSize: '10px', color: ch?.color || '#888' }}>Ch {n.ch}</span>
              </div>
              <div className="sw-formula-eq">{n.formula}</div>
              <button type="button" className="sw-vm-btn" onClick={() => viewOnMap(id, 'story')}>View on map →</button>
            </div>
          );
        })}

        {stepData.realData && (
          <div className="sw-real-data-block">
            <span className="sw-rd-lbl">In practice:</span>
            {Object.entries(stepData.realData).map(([k, v], i, arr) => (
              <span className="sw-rd-kv" key={k}>
                <b>{k}</b> = {String(v)}{i < arr.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        )}

        {stepData.interpretation && <div className="sw-interp-block">"{stepData.interpretation}"</div>}

        {stepData.analystNote && (
          <div className="sw-analyst-note">
            <div className="sw-analyst-note-lbl">Analyst thinking</div>
            <div className="sw-analyst-note-text">{stepData.analystNote}</div>
          </div>
        )}

        <div className="sw-decision-box">
          <div className="sw-decision-lbl">Analyst decision</div>
          <div className="sw-decision-q">{stepData.question}</div>
          {(stepData.choices || []).map((c, i) => {
            let cls = 'sw-choice';
            if (answered && i === stepData.correct) cls += ' sw-correct';
            if (i === chosenIdx && i !== stepData.correct) cls += ' sw-wrong';
            if (answered) cls += ' disabled';
            return (
              <button key={i} type="button" className={cls} disabled={answered} onClick={() => answer(i)}>
                {String.fromCharCode(65 + i)}) {c}
              </button>
            );
          })}
          {showHint && !answered && (
            <div className="sw-hint show">Hint: {stepData.hint || 'Re-read the narrative for key clues.'}</div>
          )}
          {answered && (
            <div className="sw-explanation show">
              {gaveUp ? 'The correct answer: ' : 'Correct. '}{stepData.explanation}
            </div>
          )}
          {answered && <div className="sw-outcome show">→ {stepData.outcome}</div>}
        </div>

        <div className="sw-step-nav">
          <button type="button" className="sw-step-next" disabled={!answered} onClick={() => nav(1)}>Next chapter →</button>
        </div>
      </div>
    </div>
  );
}

export default function StoryWalkPage() {
  const [activeId, setActiveId] = useState(null);
  const story = STORYLINES.find((s) => s.id === activeId);

  return story ? (
    <ActiveStoryScreen story={story} onExit={() => setActiveId(null)} />
  ) : (
    <StorySelectionScreen onBegin={setActiveId} />
  );
}
