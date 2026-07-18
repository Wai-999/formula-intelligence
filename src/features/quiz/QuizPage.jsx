import { useState } from 'react';
import { CHAPTERS, nodes } from '../../data/index.js';
import { useSRStore, getMasteryLevel } from '../../store/useSRStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import { fireConfetti } from '../../lib/confetti.js';
import './QuizPage.css';

const DEFAULT_CARD = { ef: 2.5, interval: 1, reps: 0, due: 0, rating: 0, reviews: 0 };
const MASTERY_WEIGHTS = [3, 4, 2, 1];

function getQuestionMeta(type, node) {
  if (type === 'name2formula') return { label: 'What is the formula for:', text: node.name, key: 'formula' };
  if (type === 'formula2name') return { label: 'Which formula is this:', text: node.short || node.formula, key: 'name' };
  return { label: 'Name this concept:', text: `${node.desc.slice(0, 120)}…`, key: 'name' };
}

export default function QuizPage() {
  const srData = useSRStore((s) => s.srData);
  const rateCard = useSRStore((s) => s.rateCard);
  const recordQuizAnswer = useSRStore((s) => s.recordQuizAnswer);
  const addToast = useToastStore((s) => s.addToast);

  const [chFilter, setChFilter] = useState('all');
  const [qType, setQType] = useState('mixed');

  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [chosenId, setChosenId] = useState(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  function nextQuestion() {
    const pool = chFilter === 'all' ? nodes : nodes.filter((n) => String(n.ch) === chFilter);
    if (pool.length < 4) {
      addToast('Need at least 4 formulas.', 'error');
      return;
    }
    const weighted = [];
    pool.forEach((n) => {
      const w = MASTERY_WEIGHTS[getMasteryLevel(srData[n.id] || DEFAULT_CARD)];
      for (let i = 0; i < w; i++) weighted.push(n);
    });
    const node = weighted[Math.floor(Math.random() * weighted.length)];
    const type = qType === 'mixed' ? ['name2formula', 'formula2name', 'desc2name'][Math.floor(Math.random() * 3)] : qType;
    const meta = getQuestionMeta(type, node);

    const others = pool.filter((n) => n.id !== node.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const newChoices = [node, ...others].sort(() => Math.random() - 0.5);

    setQuestion({ node, ...meta });
    setChoices(newChoices);
    setAnswered(false);
    setChosenId(null);
  }

  function answerQuiz(choice) {
    if (!question || answered) return;
    const isCorrect = choice.id === question.node.id;
    setAnswered(true);
    setChosenId(choice.id);

    const nextTotal = totalCount + 1;
    setTotalCount(nextTotal);

    let nextCorrect = correctCount;
    let nextBest = best;

    if (isCorrect) {
      nextCorrect = correctCount + 1;
      const nextStreak = streak + 1;
      nextBest = Math.max(best, nextStreak);
      setCorrectCount(nextCorrect);
      setStreak(nextStreak);
      setBest(nextBest);
      rateCard(question.node.id, 3);
    } else {
      setStreak(0);
      rateCard(question.node.id, 1);
    }

    recordQuizAnswer(isCorrect, nextBest);

    if (isCorrect && nextTotal >= 10 && nextCorrect === nextTotal) fireConfetti();
  }

  const stepperPct = Math.min(100, totalCount * 10);
  const correctText = question ? question.node[question.key] : '';

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <select value={chFilter} onChange={(e) => setChFilter(e.target.value)}>
          <option value="all">All chapters</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        <select value={qType} onChange={(e) => setQType(e.target.value)}>
          <option value="name2formula">Name → formula</option>
          <option value="formula2name">Formula → name</option>
          <option value="desc2name">Description → name</option>
          <option value="mixed">Mixed</option>
        </select>
        <button type="button" className="big-btn purple" onClick={nextQuestion}>New quiz</button>
      </div>

      <div className="quiz-score-bar">
        <span>Score: <b>{correctCount}</b> / <b>{totalCount}</b></span>
        <span>Streak: <b>{streak}</b></span>
        <span>Best: <b>{best}</b></span>
      </div>

      <div className="quiz-stepper"><div className="quiz-stepper-fill" style={{ width: `${stepperPct}%` }} /></div>

      <div className="quiz-area">
        <div className="quiz-q">
          {!question ? (
            <>
              <div className="q-label">Click "New quiz" to begin</div>
              <div className="q-text">Ready to test your knowledge?</div>
            </>
          ) : (
            <>
              <div className="q-label">{question.label}</div>
              <div className="q-text">{question.text}</div>
            </>
          )}
        </div>

        {question && (
          <div className="quiz-choices">
            {choices.map((c) => {
              const isThisCorrect = c.id === question.node.id;
              let cls = 'choice-btn';
              if (answered) {
                cls += ' disabled';
                if (isThisCorrect) cls += ' correct';
                else if (c.id === chosenId) cls += ' wrong';
              }
              return (
                <button key={c.id} type="button" className={cls} disabled={answered} onClick={() => answerQuiz(c)}>
                  {c[question.key]}
                </button>
              );
            })}
          </div>
        )}

        {answered && (
          <div className="quiz-feedback">
            {chosenId === question.node.id ? (
              <span className="fb-text fb-correct">Correct!</span>
            ) : (
              <span className="fb-text fb-wrong">Correct answer: {correctText}</span>
            )}
          </div>
        )}

        {answered && (
          <button type="button" className="big-btn purple quiz-next" onClick={nextQuestion}>Next →</button>
        )}
      </div>
    </div>
  );
}
