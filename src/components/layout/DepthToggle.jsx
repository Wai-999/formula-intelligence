import { useMLUIStore } from '../../store/useMLUIStore.js';
import './DepthToggle.css';

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'researcher', label: 'Researcher' },
];

// Explanation depth — a property of the reader, not of a page, so one
// control drives every page (the store's file name is historical). It is a
// pair of pressed/unpressed buttons rather than tabs: choosing a depth
// changes how the current page explains things, it does not switch panels.
export default function DepthToggle({ labelledBy }) {
  const level = useMLUIStore((s) => s.level);
  const setLevel = useMLUIStore((s) => s.setLevel);

  return (
    <div
      className="depth-toggle"
      role="group"
      aria-label={labelledBy ? undefined : 'Explanation depth'}
      aria-labelledby={labelledBy}
    >
      {LEVELS.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={level === l.id}
          className={`depth-btn${level === l.id ? ' active' : ''}`}
          onClick={() => setLevel(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
