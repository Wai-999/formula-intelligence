import { useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { initHashSync } from '../../lib/hashRoute.js';
import { blSame, useT } from '../../lib/mlContent.js';
import StatsBody from './StatsBody.jsx';
import MLBody from './MLBody.jsx';
import ModeSwitcher from './ModeSwitcher.jsx';
import ToastStack from '../toast/ToastStack.jsx';
import './AppShell.css';

// Stats mode's subtitle is plain English by original design (Stats mode
// predates and sits outside ML mode's Module 11 bilingual mandate). ML
// mode's was found still hardcoded during Module 11 verification — the
// shell renders it regardless of which page is open, so it's effectively
// the most-visible unfixed string in the whole audit once found.
const STATS_SUBTITLE = 'Bluman Elementary Statistics — formula relationship map';
const ML_SUBTITLE = blSame(
  'Estimation, prediction & real-world forecasting — machine learning mode',
  'ခန့်မှန်းခြင်း၊ ကြိုတင်ဟောကိန်းနှင့် လက်တွေ့ကမ္ဘာ့ ခန့်မှန်းချက် — machine learning mode'
);

export default function AppShell() {
  const mode = useUIStore((s) => s.mode);
  const mlSubtitle = useT(ML_SUBTITLE);

  useEffect(() => initHashSync(), []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">Formula Intelligence</span>
        <span className="app-title-dot" aria-hidden="true" />
        <span className="app-subtitle">{mode === 'stats' ? STATS_SUBTITLE : mlSubtitle}</span>
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
