import { useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { initHashSync } from '../../lib/hashRoute.js';
import StatsBody from './StatsBody.jsx';
import MLBody from './MLBody.jsx';
import ModeSwitcher from './ModeSwitcher.jsx';
import ToastStack from '../toast/ToastStack.jsx';
import './AppShell.css';

const SUBTITLES = {
  stats: 'Bluman Elementary Statistics — formula relationship map',
  ml: 'Estimation, prediction & real-world forecasting — machine learning mode',
};

export default function AppShell() {
  const mode = useUIStore((s) => s.mode);

  useEffect(() => initHashSync(), []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">Formula Intelligence</span>
        <span className="app-title-dot" aria-hidden="true" />
        <span className="app-subtitle">{SUBTITLES[mode]}</span>
        <div className="app-header-spacer" />
        <ModeSwitcher />
      </header>
      <div className="app-body">
        {mode === 'stats' ? <StatsBody /> : <MLBody />}
      </div>
      <ToastStack />
    </div>
  );
}
