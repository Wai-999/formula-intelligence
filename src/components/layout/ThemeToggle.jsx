import { useThemeStore } from '../../store/useThemeStore.js';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      title={`Switch to ${next} mode`}
      aria-label={`Switch to ${next} mode`}
    >
      <i className={`ti ${theme === 'dark' ? 'ti-moon' : 'ti-sun'}`} aria-hidden="true" />
    </button>
  );
}
