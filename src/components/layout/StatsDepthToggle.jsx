import { useMLUIStore } from '../../store/useMLUIStore.js';
import '../ml/LevelLangToggle.css';

// Stats mode's half of the depth control. It intentionally reads and writes
// the SAME `level` state as ML mode's LevelLangToggle rather than
// introducing a parallel `statsLevel`: "how deep do you want explanations"
// is a property of the reader, not of the mode, so splitting it would mean
// a user who set Researcher in ML mode silently gets Beginner in Stats.
// (The store's name is historical — level/lang were always documented as
// cross-cutting; only its file location is ML-specific.)
//
// The language half is deliberately NOT rendered here. ML mode's content is
// authored in both English and Burmese; Stats mode's is English-only, so
// offering a မြန်မာ button would promise a translation that doesn't exist.
export default function StatsDepthToggle() {
  const level = useMLUIStore((s) => s.level);
  const setLevel = useMLUIStore((s) => s.setLevel);

  return (
    <div className="ll-toggle-group">
      <div className="ll-toggle" role="tablist" aria-label="Explanation depth">
        <button
          type="button" role="tab" aria-selected={level === 'beginner'}
          className={`ll-btn${level === 'beginner' ? ' active' : ''}`}
          onClick={() => setLevel('beginner')}
        >
          Beginner
        </button>
        <button
          type="button" role="tab" aria-selected={level === 'researcher'}
          className={`ll-btn${level === 'researcher' ? ' active' : ''}`}
          onClick={() => setLevel('researcher')}
        >
          Researcher
        </button>
      </div>
    </div>
  );
}
