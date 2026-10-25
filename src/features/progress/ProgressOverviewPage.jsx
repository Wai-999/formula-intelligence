import { useMemo } from 'react';
import { DOMAINS, COMPETENCIES, competencyById } from '../../data/curriculum/competencies.js';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { courseById } from '../../data/curriculum/catalog.js';
import { PROJECTS } from '../../data/projects/index.js';
import { nodes } from '../../data/nodes.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useDiagnosticStore } from '../../store/useDiagnosticStore.js';
import { useWorkStore } from '../../store/useWorkStore.js';
import { useSRStore, getMasteryLevel } from '../../store/useSRStore.js';
import { assessAll, LEVEL_LABEL } from '../../lib/mastery.js';
import { practiceSuccess, unassistedTransfer, retention, applicationCompletion, MIN_N, RETENTION_DAYS } from '../../lib/learningSignals.js';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import '../learn/learn.css';
import './progress.css';

// My Progress → Overview (V4 §3, §7): skills, weak areas, this learner's own
// learning signals, the placement and the statistics-formula drills; the
// backup lives in Settings, one tab along. Every number states what it is counted from.

const pct = (r) => `${Math.round(r * 100)}%`;
const lessonFor = (comp) => LESSONS.find((l) => l.competencies.includes(comp));

function Signal({ title, value, detail, help }) {
  return (
    <div className="signal">
      <p className="signal-title">{title}</p>
      <p className="signal-value">{value}</p>
      <p className="studio-muted">{detail}</p>
      <p className="signal-help">{help}</p>
    </div>
  );
}

export default function ProgressOverviewPage() {
  const evidence = useLearningStore((s) => s.evidence);
  const attempts = useDiagnosticStore((s) => s.attempts);
  const placement = useDiagnosticStore((s) => s.placement);
  const projectState = useWorkStore((s) => s.projects);
  const results = useWorkStore((s) => s.results);
  const srData = useSRStore((s) => s.srData);

  const status = useMemo(() => assessAll(evidence), [evidence]);
  const practice = useMemo(() => practiceSuccess(evidence), [evidence]);
  const transfer = useMemo(() => unassistedTransfer(evidence), [evidence]);
  const kept = useMemo(() => retention(evidence), [evidence]);
  const apps = applicationCompletion(PROJECTS, (p, st) => !!(st.exercise ? results[st.exercise]?.passed : projectState[p.id]?.steps?.[st.id]?.done));
  const lastAttempt = attempts[attempts.length - 1];

  const weak = Object.entries(status).filter(([, s]) => s.distinctItems >= 2 && s.accuracy < 0.5).map(([c]) => c);
  const gaps = lastAttempt?.result.gaps ?? [];
  const started = COMPETENCIES.filter((c) => status[c.id]);
  const formulaMastered = nodes.filter((n) => getMasteryLevel(srData[n.id] || { reviews: 0 }) === 3).length;

  const practiceDetail = [1, 2, 3].map((d) => `level ${d}: ${practice[d].n ? `${practice[d].k} of ${practice[d].n}` : 'none yet'}`).join(' · ');
  const practiceAll = [1, 2, 3].reduce((a, d) => ({ k: a.k + practice[d].k, n: a.n + practice[d].n }), { k: 0, n: 0 });

  return (
    <div className="studio-scroll">
      <div className="studio-page">
        <section className="studio-section" aria-labelledby="prog-skills">
          <h2 id="prog-skills" className="studio-h2">Your skills</h2>
          <p className="studio-muted studio-read">
            Judged from your answers on different questions and days — never from time spent or pages opened. Open a skill to see why it has the level it has.
          </p>
          {started.length === 0 ? (
            <p className="studio-muted">No answers yet. Skills appear here as you answer questions in lessons and practice.</p>
          ) : DOMAINS.map((d) => {
            const comps = started.filter((c) => c.domain === d.id);
            if (!comps.length) return null;
            return (
              <div key={d.id} className="prog-domain">
                <h3 className="studio-h3">{d.title}</h3>
                <ul className="studio-list">
                  {comps.map((c) => {
                    const a = status[c.id];
                    return (
                      <li key={c.id}>
                        <details className="prog-skill">
                          <summary>
                            <span>{c.title}</span>
                            <span className={`studio-chip ${a.level === 'mastered' ? 'studio-chip-ok' : a.level === 'proficient' ? 'studio-chip-accent' : ''}`}>
                              {LEVEL_LABEL[a.level]} · {a.correctItems} of {a.distinctItems} different questions right
                            </span>
                          </summary>
                          <ul className="lesson-ul">{a.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                        </details>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>

        <section className="studio-section" aria-labelledby="prog-weak">
          <h2 id="prog-weak" className="studio-h2">Weak areas</h2>
          {weak.length === 0 && gaps.length === 0 ? (
            <p className="studio-muted">None found yet. A weak area is a skill where fewer than half of your answers (on at least two questions) are right, or an area the placement check flagged.</p>
          ) : (
            <ul className="lesson-ul">
              {gaps.map((g) => <li key={g}>{DOMAINS.find((d) => d.id === g)?.title} — flagged by your last placement check.</li>)}
              {weak.map((c) => {
                const l = lessonFor(c);
                return <li key={c}>{competencyById[c]?.title} — {Math.round(status[c].accuracy * 100)}% recently.{l && <> Revisit <a href={hashFor('learn/lesson', { lessonId: l.id })}>{l.title}</a>.</>}</li>;
              })}
            </ul>
          )}
        </section>

        <section className="studio-section" aria-labelledby="prog-signals">
          <h2 id="prog-signals" className="studio-h2">Your learning signals</h2>
          <p className="studio-muted studio-read">
            Four ways to see whether practice is turning into skill you can use. They describe you only, from your own answers on this device;
            a rate is shown once it rests on at least {MIN_N} answers.
          </p>
          <div className="signals">
            <Signal
              title="Practice success"
              value={practiceAll.n >= MIN_N ? pct(practiceAll.k / practiceAll.n) : 'Not enough data yet'}
              detail={practiceDetail}
              help="First attempts answered correctly, by difficulty. An item where you opened a hint first counts as level 1."
            />
            <Signal
              title="Unassisted transfer"
              value={transfer.rate === null ? 'Not enough data yet' : pct(transfer.rate)}
              detail={transfer.n ? `${transfer.k} of ${transfer.n} transfer questions solved without a hint` : 'No transfer questions answered yet'}
              help="Transfer questions use an idea in a setting the lesson did not show. Counted since this app began recording hint use."
            />
            <Signal
              title={`${RETENTION_DAYS}-day retention`}
              value={kept.rate === null ? 'Not enough data yet' : pct(kept.rate)}
              detail={kept.n ? `${kept.k} of ${kept.n} skills still right ${RETENTION_DAYS}+ days after you first got them right` : `No skill retested ${RETENTION_DAYS}+ days after you first got it right`}
              help="Reviews in Practice are what make this measurable: they bring skills back after days and weeks."
            />
            <Signal
              title="Applications completed"
              value={apps.n ? `${apps.k} of ${apps.n}` : 'None started'}
              detail={apps.n ? 'projects finished, of those you started' : 'Projects in Apply put a lesson to work on real or labelled synthetic data'}
              help="A project counts as started when one of its steps is done, and completed when all are."
            />
          </div>
        </section>

        <section className="studio-section" aria-labelledby="prog-place">
          <h2 id="prog-place" className="studio-h2">Starting point</h2>
          <p className="studio-muted">
            {placement ? <>Your starting point is <a href={hashFor('learn/course', { courseId: placement.course })}>{courseById[placement.course]?.title}</a> ({placement.source === 'manual' ? 'your choice' : placement.source === 'diagnostic' ? 'from a placement check' : 'chosen at start'}).</> : 'No starting point chosen yet.'}{' '}
            {lastAttempt ? `Last placement check: ${new Date(lastAttempt.finishedAt).toLocaleDateString()}.` : ''}{' '}
            <a href={hashFor('learn/placement')}>{lastAttempt ? 'See the reasons, retake or change it' : 'Take the placement check'}</a>
          </p>
        </section>

        <section className="studio-section" aria-labelledby="prog-formulas">
          <h2 id="prog-formulas" className="studio-h2">Statistics formula drills</h2>
          <p className="studio-muted">
            {formulaMastered} of {nodes.length} formulas mastered in flashcard review. <a href={hashFor('practice/formulas')}>Formula drills</a>
          </p>
        </section>

        <section className="studio-section" aria-labelledby="prog-data">
          <h2 id="prog-data" className="studio-h2">Your data</h2>
          <p className="studio-muted">
            Everything above is stored only in this browser. <a href={hashFor('progress/settings')}>Back it up, restore it or reset it in Settings</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
