import { useState, useMemo } from 'react';
import { CHAPTERS, nodes } from '../../data/index.js';
import { useSRStore, getMasteryLevel, isDue } from '../../store/useSRStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import './FlashcardsPage.css';

const RING_R = 32;
const RING_CIRC = 2 * Math.PI * RING_R;
const DEFAULT_CARD = { ef: 2.5, interval: 1, reps: 0, due: 0, rating: 0, reviews: 0 };

function buildDeck(chFilter, mode, srData) {
  let pool = chFilter === 'all' ? [...nodes] : nodes.filter((n) => String(n.ch) === chFilter);
  if (mode === 'due') pool = pool.filter((n) => isDue(srData[n.id] || DEFAULT_CARD));
  else if (mode === 'unlearned') pool = pool.filter((n) => getMasteryLevel(srData[n.id] || DEFAULT_CARD) === 0);
  pool.sort((a, b) => {
    const da = srData[a.id] || DEFAULT_CARD;
    const db = srData[b.id] || DEFAULT_CARD;
    const dueA = isDue(da);
    const dueB = isDue(db);
    if (dueA && !dueB) return -1;
    if (!dueA && dueB) return 1;
    return da.ef - db.ef;
  });
  return pool;
}

export default function FlashcardsPage() {
  const srData = useSRStore((s) => s.srData);
  const rateCardAction = useSRStore((s) => s.rateCard);
  const pushSession = useSRStore((s) => s.pushSession);
  const resetAll = useSRStore((s) => s.resetAll);
  const addToast = useToastStore((s) => s.addToast);

  const [chFilter, setChFilter] = useState('all');
  const [mode, setMode] = useState('due');
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [hard, setHard] = useState(0);
  const [easy, setEasy] = useState(0);
  const [session, setSession] = useState(0);

  const dueCount = useMemo(() => {
    return nodes.filter((n) => isDue(srData[n.id] || DEFAULT_CARD)).length;
  }, [srData]);

  const current = started && !complete ? deck[idx] : null;
  const currentChapter = current ? CHAPTERS.find((c) => c.id === current.ch) : null;

  function handleStartDeck() {
    const newDeck = buildDeck(chFilter, mode, srData);
    if (newDeck.length === 0) {
      addToast('No cards in this selection.', 'error');
      return;
    }
    setDeck(newDeck);
    setIdx(0);
    setFlipped(false);
    setHard(0);
    setEasy(0);
    setSession(0);
    setStarted(true);
    setComplete(false);
    addToast(`Deck ready: ${newDeck.length} cards.`, 'info');
  }

  function handleResetProgress() {
    if (!window.confirm('Reset ALL spaced repetition progress?')) return;
    resetAll();
    addToast('Progress reset.', 'success');
  }

  function flipCard() {
    if (!current) return;
    setFlipped((f) => !f);
  }

  function rateCard(rating) {
    if (!current) return;
    rateCardAction(current.id, rating);
    if (rating === 1) setHard((h) => h + 1);
    else setEasy((e) => e + 1);
    const nextSession = session + 1;
    setSession(nextSession);

    const nextIdx = idx + 1;
    setFlipped(false);
    if (nextIdx >= deck.length) {
      setIdx(nextIdx);
      setComplete(true);
      pushSession({
        date: new Date().toLocaleString(),
        reviewed: nextSession,
        hard: rating === 1 ? hard + 1 : hard,
        easy: rating === 1 ? easy : easy + 1,
      });
      addToast('Deck complete!', 'success');
    } else {
      setIdx(nextIdx);
    }
  }

  const pct = deck.length ? Math.round((idx / Math.max(deck.length, 1)) * 100) : 0;
  const dashOffset = RING_CIRC - (RING_CIRC * pct) / 100;

  return (
    <div className="fc-page">
      <div className="fc-controls">
        <select value={chFilter} onChange={(e) => setChFilter(e.target.value)}>
          <option value="all">All chapters</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="due">Due for review</option>
          <option value="all">All cards</option>
          <option value="unlearned">Unlearned only</option>
        </select>
        <button type="button" className="big-btn purple" onClick={handleStartDeck}>Start deck</button>
        <button type="button" className="big-btn gray" onClick={handleResetProgress}>Reset progress</button>
      </div>

      <div className="fc-progress">
        {!started
          ? 'Card 0 of 0'
          : complete
          ? `Reviewed ${session} cards`
          : `Card ${idx + 1} of ${deck.length} • ${deck.length - idx - 1} remaining`}
      </div>

      <svg className="fc-ring" viewBox="0 0 80 80">
        <circle className="fc-ring-bg" cx="40" cy="40" r={RING_R} fill="none" strokeWidth="8" />
        <circle
          className="fc-ring-fg"
          cx="40"
          cy="40"
          r={RING_R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={dashOffset}
        />
        <text x="40" y="42" className="fc-ring-text" textAnchor="middle" dominantBaseline="middle">
          {pct}%
        </text>
      </svg>

      <div className="fc-card-wrap" onClick={flipCard}>
        <div className={`fc-card${flipped ? ' flipped' : ''}`}>
          <div className="fc-face fc-front">
            <div className="fc-ch-label">
              {complete ? '' : current ? currentChapter?.name : 'Chapter —'}
            </div>
            <div className="fc-name">
              {complete ? 'Deck complete' : current ? current.name : 'Select a deck above'}
            </div>
            {!complete && <div className="fc-hint">Click to reveal formula</div>}
          </div>
          <div className="fc-face fc-back">
            <div className="fc-ch-label">{currentChapter?.name}</div>
            <div className="fc-formula">{current?.formula}</div>
            <div className="fc-desc">{current?.desc}</div>
          </div>
        </div>
      </div>

      {current && flipped && (
        <div className="fc-rating">
          <button type="button" className="rate-btn rate-hard" onClick={() => rateCard(1)}>Hard — again</button>
          <button type="button" className="rate-btn rate-med" onClick={() => rateCard(2)}>Medium — soon</button>
          <button type="button" className="rate-btn rate-easy" onClick={() => rateCard(3)}>Easy — later</button>
        </div>
      )}

      <div className="fc-stats">
        {!started
          ? 'Start a deck to begin reviewing formulas.'
          : complete
          ? `Hard: ${hard} | Easy/med: ${easy} | ${dueCount} still due`
          : `Session: ${session} reviewed • ${hard} hard • ${easy} easy`}
      </div>
      {started && <div className="fc-queue-info">{dueCount} cards due for review</div>}
    </div>
  );
}
