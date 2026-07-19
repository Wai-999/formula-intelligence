import { useMLUIStore } from '../../store/useMLUIStore.js';
import './LevelLangToggle.css';

// Beginner/Researcher depth + English/Burmese language — the two toggles
// mandated by Module 11, rendered once in the ML shell header so every ML
// page shares the same pair (see BUILD_LOG.md Phase 1 §3).
export default function LevelLangToggle() {
  const level = useMLUIStore((s) => s.level);
  const setLevel = useMLUIStore((s) => s.setLevel);
  const lang = useMLUIStore((s) => s.lang);
  const setLang = useMLUIStore((s) => s.setLang);

  return (
    <div className="ll-toggle-group">
      <div className="ll-toggle" role="tablist" aria-label="Explanation depth">
        <button type="button" role="tab" aria-selected={level === 'beginner'} className={`ll-btn${level === 'beginner' ? ' active' : ''}`} onClick={() => setLevel('beginner')}>
          Beginner
        </button>
        <button type="button" role="tab" aria-selected={level === 'researcher'} className={`ll-btn${level === 'researcher' ? ' active' : ''}`} onClick={() => setLevel('researcher')}>
          Researcher
        </button>
      </div>
      <div className="ll-toggle" role="tablist" aria-label="Language">
        <button type="button" role="tab" aria-selected={lang === 'en'} className={`ll-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>
          EN
        </button>
        <button type="button" role="tab" aria-selected={lang === 'my'} className={`ll-btn${lang === 'my' ? ' active' : ''}`} onClick={() => setLang('my')}>
          မြန်မာ
        </button>
      </div>
    </div>
  );
}
