import { useThemeStore } from '../../store/useThemeStore.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { SHORTCUTS } from '../../lib/shortcuts.js';
import BackupPanel from '../dashboard/BackupPanel.jsx';
import '../../styles/studio.css';
import './SettingsPage.css';

const THEME_CHOICES = [
  { id: 'system', label: 'Match my device', hint: 'Follows your operating system, and switches when it does.' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const MOTION_CHOICES = [
  { id: 'system', label: 'Match my device', hint: 'Animations play unless your operating system asks to reduce motion.' },
  { id: 'reduce', label: 'Reduce motion', hint: 'Turns transitions and animations off in this app, whatever your device says.' },
];

const DEPTH_CHOICES = [
  { id: 'beginner', label: 'Beginner', hint: 'Plain-language explanations first.' },
  { id: 'researcher', label: 'Researcher', hint: 'Technical explanations with notation and assumptions up front.' },
];

function Choices({ legend, name, choices, value, onChange }) {
  return (
    <fieldset className="studio-fieldset">
      <legend>{legend}</legend>
      {choices.map((c) => (
        <label key={c.id} className="studio-choice">
          <input type="radio" name={name} value={c.id} checked={value === c.id} onChange={() => onChange(c.id)} />
          <span>
            {c.label}
            {c.hint && <small>{c.hint}</small>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export default function SettingsPage() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const motion = useThemeStore((s) => s.motion);
  const setMotion = useThemeStore((s) => s.setMotion);
  const level = useMLUIStore((s) => s.level);
  const setLevel = useMLUIStore((s) => s.setLevel);

  return (
    <div className="studio-scroll">
      <div className="studio-page settings-page">
        <section className="studio-section" aria-labelledby="set-appearance">
          <h2 id="set-appearance" className="studio-h2">Appearance</h2>
          <div className="settings-grid">
            <Choices legend="Theme" name="theme" choices={THEME_CHOICES} value={preference} onChange={setPreference} />
            <Choices legend="Motion" name="motion" choices={MOTION_CHOICES} value={motion} onChange={setMotion} />
          </div>
        </section>

        <section className="studio-section" aria-labelledby="set-learning">
          <h2 id="set-learning" className="studio-h2">Learning</h2>
          <div className="settings-grid">
            <Choices legend="Explanation depth" name="depth" choices={DEPTH_CHOICES} value={level} onChange={setLevel} />
          </div>
        </section>

        <section className="studio-section" aria-labelledby="set-privacy">
          <h2 id="set-privacy" className="studio-h2">Privacy</h2>
          <div className="studio-read studio-muted settings-privacy">
            <p>
              Everything you do here — progress, diagnostic answers, notes, code — is stored only in this browser on
              this device. Nothing is sent to a server, there is no account, and there is no analytics or tracking.
            </p>
            <p>
              There is no AI tutor. If one is ever added it will be off until you turn it on, and will say exactly what
              it would send and to whom before it sends anything.
            </p>
          </div>
          <BackupPanel headingLevel={3} allowReset />
        </section>

        <section className="studio-section" aria-labelledby="set-offline">
          <h2 id="set-offline" className="studio-h2">Offline use</h2>
          <div className="studio-read studio-muted settings-privacy">
            <p>
              After one visit with a connection, the whole app — lessons, labs, maps, practice, the diagnostic, notes and
              progress — keeps working without one. You can also install it from your browser’s menu.
            </p>
            <p>
              Python is the exception: it is downloaded (about 10 MB) the first time you run code, and needs a connection
              then. Your browser may keep that copy for later, but this is not guaranteed. Links to external sources need
              a connection too.
            </p>
          </div>
        </section>

        <section className="studio-section" aria-labelledby="set-keys">
          <h2 id="set-keys" className="studio-h2">Keyboard shortcuts</h2>
          <p className="studio-muted">Press <kbd>?</kbd> anywhere to see these. They pause while you are typing in a field.</p>
          <div className="studio-table-wrap">
            <table className="studio-table">
              <thead><tr><th scope="col">Keys</th><th scope="col">Action</th></tr></thead>
              <tbody>
                {SHORTCUTS.map((s) => (
                  <tr key={s.label}>
                    <td>{s.keys.map((k) => (k === '–' ? ' – ' : <kbd key={k}>{k}</kbd>))}</td>
                    <td>{s.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
