import { useUIStore } from '../../store/useUIStore.js';
import './ModeSwitcher.css';

export default function ModeSwitcher() {
  const mode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);

  return (
    <div className="mode-switcher" role="tablist" aria-label="App mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'stats'}
        className={`mode-switcher-btn${mode === 'stats' ? ' active stats' : ''}`}
        onClick={() => setMode('stats')}
      >
        Stats
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'ml'}
        className={`mode-switcher-btn${mode === 'ml' ? ' active ml' : ''}`}
        onClick={() => setMode('ml')}
      >
        ML
      </button>
    </div>
  );
}
