import { useMemo, useState } from 'react';
import { APPLICATIONS, CAREERS } from '../../data/curriculum/applications.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { hashFor } from '../../app/pages.js';
import '../../styles/studio.css';
import './maps.css';

// The Data Science Career / Application map (§3): roles → the kinds of work
// they do → the concepts that work leans on. Three linked columns rather than
// a force graph: every link is visible as a highlight, and the whole map is
// ordinary buttons, so it needs no separate accessible outline.

const conceptById = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
const appById = Object.fromEntries(APPLICATIONS.map((a) => [a.id, a]));
const lessonFor = (cid) => LESSONS.find((l) => l.concepts.includes(cid));
const usedConcepts = [...new Set([...APPLICATIONS.flatMap((a) => a.concepts), ...CAREERS.flatMap((k) => k.concepts)])]
  .filter((id) => conceptById[id])
  .sort((a, b) => conceptById[a].title.localeCompare(conceptById[b].title));

export default function KnowledgeMapPage() {
  const [sel, setSel] = useState(null); // { kind, id }

  const linked = useMemo(() => {
    if (!sel) return null;
    const careers = new Set();
    const apps = new Set();
    const concepts = new Set();
    if (sel.kind === 'career') {
      const k = CAREERS.find((x) => x.id === sel.id);
      careers.add(k.id);
      k.applications.forEach((a) => apps.add(a));
      k.concepts.forEach((c) => concepts.add(c));
      k.applications.forEach((a) => appById[a].concepts.forEach((c) => concepts.add(c)));
    } else if (sel.kind === 'app') {
      apps.add(sel.id);
      appById[sel.id].concepts.forEach((c) => concepts.add(c));
      CAREERS.filter((k) => k.applications.includes(sel.id)).forEach((k) => careers.add(k.id));
    } else {
      concepts.add(sel.id);
      APPLICATIONS.filter((a) => a.concepts.includes(sel.id)).forEach((a) => apps.add(a.id));
      CAREERS.filter((k) => k.concepts.includes(sel.id) || k.applications.some((a) => apps.has(a))).forEach((k) => careers.add(k.id));
    }
    return { careers, apps, concepts };
  }, [sel]);

  const cls = (kind, id, set) => {
    if (!linked) return 'kmap-item';
    if (sel.kind === kind && sel.id === id) return 'kmap-item on';
    return set.has(id) ? 'kmap-item linked' : 'kmap-item dim';
  };
  const toggle = (kind, id) => setSel((s) => (s?.kind === kind && s.id === id ? null : { kind, id }));

  return (
    <div className="cmap-page">
      <div className="cmap-toolbar">
        <p className="studio-muted" role="status">
          {sel
            ? `Showing what connects to “${sel.kind === 'career' ? CAREERS.find((k) => k.id === sel.id).title : sel.kind === 'app' ? appById[sel.id].title : conceptById[sel.id].title}”. Select it again to clear.`
            : 'Select a role, a kind of work or a concept to see how they connect. Roles and their emphases are illustrative, not a hiring guide.'}
        </p>
      </div>
      <div className="kmap-cols">
        <section className="kmap-col" aria-labelledby="km-careers">
          <h2 id="km-careers" className="studio-h2">Roles</h2>
          {CAREERS.map((k) => (
            <button key={k.id} type="button" className={cls('career', k.id, linked?.careers)} aria-pressed={sel?.kind === 'career' && sel.id === k.id} onClick={() => toggle('career', k.id)}>
              <strong>{k.title}</strong>
              <small>{k.summary}</small>
            </button>
          ))}
        </section>
        <section className="kmap-col" aria-labelledby="km-apps">
          <h2 id="km-apps" className="studio-h2">Kinds of work</h2>
          {APPLICATIONS.map((a) => (
            <button key={a.id} type="button" className={cls('app', a.id, linked?.apps)} aria-pressed={sel?.kind === 'app' && sel.id === a.id} onClick={() => toggle('app', a.id)}>
              <strong>{a.title}</strong>
              <small>{a.summary}</small>
            </button>
          ))}
        </section>
        <section className="kmap-col" aria-labelledby="km-concepts">
          <h2 id="km-concepts" className="studio-h2">Mathematics it leans on</h2>
          {usedConcepts.map((id) => {
            const lesson = lessonFor(id);
            return (
              <div key={id} className={cls('concept', id, linked?.concepts)}>
                <button type="button" className="link-btn kmap-concept-btn" aria-pressed={sel?.kind === 'concept' && sel.id === id} onClick={() => toggle('concept', id)}>
                  <strong>{conceptById[id].title}</strong>
                </button>
                <small>
                  <a href={hashFor('learn/concepts', { conceptId: id })}>On the concept map</a>
                  {lesson && <> · <a href={hashFor('learn/lesson', { lessonId: lesson.id })}>Lesson</a></>}
                </small>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
