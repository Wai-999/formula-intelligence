import { useEffect, useMemo, useRef, useState } from 'react';
import { select, zoom as d3zoom, zoomIdentity } from 'd3';
import { buildKnowledgeGraph } from '../../data/curriculum/graph.js';
import { CONCEPTS } from '../../data/curriculum/concepts.js';
import { SUBJECTS, unitById, courseById } from '../../data/curriculum/catalog.js';
import { LESSONS } from '../../data/curriculum/lessons/index.js';
import { FORMULAS } from '../../data/curriculum/formulas.js';
import { APPLICATIONS } from '../../data/curriculum/applications.js';
import { competencyById } from '../../data/curriculum/competencies.js';
import { prerequisiteLayers, reach } from '../../lib/knowledgeGraph.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { assessCompetency, LEVEL_LABEL } from '../../lib/mastery.js';
import { hashFor } from '../../app/pages.js';
import { MathBlock } from '../../components/math/MathText.jsx';
import '../../styles/studio.css';
import './maps.css';

const graph = buildKnowledgeGraph();
const conceptById = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
const NODE_W = 176;
const NODE_H = 46;
const COL_GAP = 70;
const ROW_GAP = 16;

const RELATION_TYPES = [
  { id: 'generalizes', label: 'Generalizes', dash: '6 4' },
  { id: 'contrasts_with', label: 'Often confused with', dash: '2 4' },
  { id: 'used_in', label: 'Used in', dash: '10 4 2 4' },
];

const lessonsTeaching = (cid) => LESSONS.filter((l) => l.concepts.includes(cid));
const formulasFor = (cid) => FORMULAS.filter((f) => f.concept === cid);
const appsFor = (cid) => APPLICATIONS.filter((a) => a.concepts.includes(cid));
const reqsOf = (cid) => (graph.out.get(cid) ?? []).filter((e) => e.type === 'requires' && conceptById[e.target]).map((e) => e.target);
const nextOf = (cid) => (graph.inn.get(cid) ?? []).filter((e) => e.type === 'requires' && conceptById[e.source]).map((e) => e.source);

function wrap(title) {
  if (title.length <= 24) return [title];
  const words = title.split(' ');
  let a = '';
  while (words.length && (a + words[0]).length <= 24) a += `${words.shift()} `;
  const b = words.join(' ');
  return [a.trim(), b.length > 24 ? `${b.slice(0, 23)}…` : b];
}

/** Layered layout of the given concept ids: x by prerequisite depth, y ordered to reduce crossings. */
function layout(ids) {
  const layers = prerequisiteLayers(graph, ids);
  const cols = new Map();
  for (const id of ids) {
    const l = layers.get(id) ?? 0;
    if (!cols.has(l)) cols.set(l, []);
    cols.get(l).push(id);
  }
  const pos = new Map();
  const maxL = Math.max(0, ...cols.keys());
  for (let l = 0; l <= maxL; l++) {
    const col = cols.get(l) ?? [];
    // Barycentre ordering: sit each node near the average row of its prerequisites.
    const score = (id) => {
      const ys = reqsOf(id).map((r) => pos.get(r)?.row).filter((v) => v !== undefined);
      return ys.length ? ys.reduce((s, v) => s + v, 0) / ys.length : Infinity;
    };
    col.sort((a, b) => score(a) - score(b) || conceptById[a].title.localeCompare(conceptById[b].title));
    col.forEach((id, row) => pos.set(id, { col: l, row, x: l * (NODE_W + COL_GAP), y: row * (NODE_H + ROW_GAP) }));
  }
  const height = Math.max(...[...cols.values()].map((c) => c.length)) * (NODE_H + ROW_GAP);
  return { pos, width: (maxL + 1) * (NODE_W + COL_GAP) - COL_GAP, height, cols };
}

function Detail({ id, onSelect }) {
  const c = conceptById[id];
  const evidence = useLearningStore((s) => s.evidence);
  if (!c) return null;
  const unit = unitById[c.unit];
  const course = unit ? courseById[unit.course] : null;
  const teaching = lessonsTeaching(id);
  const formulas = formulasFor(id);
  const apps = appsFor(id);
  const comps = [...new Set(teaching.flatMap((l) => l.competencies))];
  const bridges = (graph.out.get(id) ?? []).filter((e) => e.target.startsWith('bluman:') || e.target.startsWith('model:'));
  return (
    <div className="cmap-detail-body">
      <p className="studio-eyebrow">{SUBJECTS.find((s) => s.id === c.subject)?.title}{course ? ` · ${course.title}` : ''}</p>
      <h2 className="studio-h2">{c.title}</h2>
      <p className="studio-muted">{c.summary}</p>
      {teaching.length > 0 ? (
        <div className="studio-row">
          {teaching.map((l) => <a key={l.id} className="studio-btn studio-btn-small studio-btn-primary" href={hashFor('learn/lesson', { lessonId: l.id })}>Lesson: {l.title}</a>)}
        </div>
      ) : (
        unit && <p className="studio-muted">Not yet taught by a written lesson. Its unit, <a href={hashFor('learn/course', { courseId: unit.course })}>{unit.title}</a>, is outlined.</p>
      )}
      {comps.length > 0 && (
        <ul className="cmap-list">
          {comps.map((k) => {
            const a = assessCompetency(evidence.filter((e) => e.c === k));
            return <li key={k} className="studio-muted">{competencyById[k]?.title}: <span className="studio-chip">{LEVEL_LABEL[a.level]}</span></li>;
          })}
        </ul>
      )}
      <div className="cmap-detail-lists">
        <div>
          <h3 className="studio-h3">Builds on</h3>
          {reqsOf(id).length ? <ul className="cmap-list">{reqsOf(id).map((r) => <li key={r}><button type="button" className="link-btn" onClick={() => onSelect(r)}>{conceptById[r].title}</button></li>)}</ul> : <p className="studio-muted">Nothing — a starting point.</p>}
        </div>
        <div>
          <h3 className="studio-h3">Leads to</h3>
          {nextOf(id).length ? <ul className="cmap-list">{nextOf(id).map((r) => <li key={r}><button type="button" className="link-btn" onClick={() => onSelect(r)}>{conceptById[r].title}</button></li>)}</ul> : <p className="studio-muted">Nothing further in this curriculum yet.</p>}
        </div>
      </div>
      {formulas.length > 0 && (
        <div>
          <h3 className="studio-h3">Formulas</h3>
          {formulas.map((f) => (
            <div key={f.id} className="cmap-formula">
              <p className="studio-muted">{f.title} <span className="studio-chip">{f.claim}</span></p>
              <MathBlock tex={f.latex} label={f.title} />
              <p className="studio-muted">{f.interpretation}</p>
            </div>
          ))}
        </div>
      )}
      {bridges.length > 0 && (
        <div>
          <h3 className="studio-h3">Connections elsewhere</h3>
          <ul className="cmap-list">
            {bridges.map((e) => {
              const node = graph.byId.get(e.target);
              const isModel = e.target.startsWith('model:');
              return (
                <li key={e.target}>
                  <button type="button" className="link-btn" onClick={() => {
                    if (isModel) { useUIStore.getState().goTo('learn/models'); useMLUIStore.getState().selectModel(e.target.slice(6)); }
                    else useUIStore.getState().viewOnMap(e.target.slice(7), null);
                  }}>{isModel ? 'Model map' : 'Formula map'}: {node?.title}</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {apps.length > 0 && (
        <p className="studio-muted">Applied in: {apps.map((a) => a.title).join(', ')} (<a href={hashFor('learn/careers')}>careers & applications</a>).</p>
      )}
    </div>
  );
}

export default function ConceptMapPage({ conceptId }) {
  const [scope, setScope] = useState(() => (conceptId && conceptById[conceptId] ? conceptById[conceptId].subject : 'linear-algebra'));
  const [view, setView] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 'outline' : 'graph'));
  const [selected, setSelected] = useState(conceptId && conceptById[conceptId] ? conceptId : null);
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [rels, setRels] = useState({ generalizes: true, contrasts_with: false, used_in: false });
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  const nodeRefs = useRef(new Map());

  // Opening #maps/concepts/<id> (from a lesson, search or a link) selects it.
  useEffect(() => {
    if (conceptId && conceptById[conceptId]) {
      setSelected(conceptId);
      setScope((s) => (s === 'all' ? s : conceptById[conceptId].subject));
    }
  }, [conceptId]);

  const ids = useMemo(() => {
    let list = scope === 'all' ? CONCEPTS.map((c) => c.id) : CONCEPTS.filter((c) => c.subject === scope).map((c) => c.id);
    if (focus && selected) {
      // Focus mode: the selection plus two steps of prerequisites and dependents — across subjects.
      const up = reach(graph, selected, 'requires', 'out', 2);
      const down = reach(graph, selected, 'requires', 'in', 2);
      list = [selected, ...up.keys(), ...down.keys()].filter((id) => conceptById[id]);
    }
    return list;
  }, [scope, focus, selected]);

  const lay = useMemo(() => layout(ids), [ids]);
  const idSet = useMemo(() => new Set(ids), [ids]);
  const q = query.trim().toLowerCase();
  const matches = useMemo(() => (q ? ids.filter((id) => conceptById[id].title.toLowerCase().includes(q)) : []), [ids, q]);
  const near = useMemo(() => (selected ? new Set([selected, ...reqsOf(selected), ...nextOf(selected)]) : null), [selected]);

  // Zoom and pan (d3-zoom handles wheel, drag and pinch).
  useEffect(() => {
    if (view !== 'graph' || !svgRef.current) return undefined;
    const z = d3zoom().scaleExtent([0.2, 2.5]).on('zoom', (ev) => { if (gRef.current) gRef.current.setAttribute('transform', ev.transform.toString()); });
    zoomRef.current = z;
    const sel = select(svgRef.current).call(z).on('dblclick.zoom', null);
    return () => sel.on('.zoom', null);
  }, [view]);

  const fit = () => {
    const svg = svgRef.current;
    if (!svg || !zoomRef.current) return;
    const { width, height } = svg.getBoundingClientRect();
    if (!width || !height) return;
    const k = Math.min(width / (lay.width + 80), height / (lay.height + 80), 1.2);
    const t = zoomIdentity.translate((width - lay.width * k) / 2, (height - lay.height * k) / 2).scale(k);
    select(svg).call(zoomRef.current.transform, t);
  };

  const centerOn = (id) => {
    const svg = svgRef.current;
    const p = lay.pos.get(id);
    if (!svg || !zoomRef.current || !p) return;
    const { width, height } = svg.getBoundingClientRect();
    const k = 0.9;
    select(svg).transition().duration(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 350)
      .call(zoomRef.current.transform, zoomIdentity.translate(width / 2 - (p.x + NODE_W / 2) * k, height / 2 - (p.y + NODE_H / 2) * k).scale(k));
  };

  // Refit when the visible set changes; centre on the selection when there is one.
  useEffect(() => {
    if (view !== 'graph') return;
    const id = requestAnimationFrame(() => (selected && lay.pos.has(selected) ? centerOn(selected) : fit()));
    return () => cancelAnimationFrame(id);
  }, [lay, view]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (id, { center = true, focusNode = false } = {}) => {
    setSelected(id);
    if (center && view === 'graph') centerOn(id);
    if (focusNode) {
      // Synchronously when the node is already drawn, so a quick Enter after
      // an arrow acts on the node the arrow moved to.
      const el = nodeRefs.current.get(id);
      if (el) el.focus({ preventScroll: true });
      else requestAnimationFrame(() => nodeRefs.current.get(id)?.focus({ preventScroll: true }));
    }
  };

  // Keyboard navigation through the graph: one tab stop, arrows move along
  // prerequisite edges (left/right) and within a layer (up/down).
  function onNodeKey(e, id) {
    const p = lay.pos.get(id);
    let target = null;
    if (e.key === 'ArrowLeft') target = reqsOf(id).find((r) => idSet.has(r));
    else if (e.key === 'ArrowRight') target = nextOf(id).find((r) => idSet.has(r));
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const col = lay.cols.get(p.col);
      target = col[p.row + (e.key === 'ArrowUp' ? -1 : 1)];
    } else if (e.key === 'Home') target = lay.cols.get(0)?.[0];
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(id); return; }
    if (target) { e.preventDefault(); choose(target, { focusNode: true }); }
  }

  const rovingId = selected && idSet.has(selected) ? selected : ids[0];

  return (
    <div className="cmap-page">
      <div className="cmap-toolbar">
        <label className="cmap-field">
          <span className="visually-hidden">Subject</span>
          <select value={scope} onChange={(e) => { setScope(e.target.value); setFocus(false); }}>
            {SUBJECTS.filter((s) => CONCEPTS.some((c) => c.subject === s.id)).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            <option value="all">All subjects (global map)</option>
          </select>
        </label>
        <label className="cmap-field cmap-search">
          <span className="visually-hidden">Find a concept</span>
          <input type="search" placeholder="Find a concept…" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && matches[0]) choose(matches[0], { focusNode: view === 'graph' }); }} />
        </label>
        <div className="cmap-seg" role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'graph'} onClick={() => setView('graph')}><i className="ti ti-topology-star-3" aria-hidden="true" /> Graph</button>
          <button type="button" aria-pressed={view === 'outline'} onClick={() => setView('outline')}><i className="ti ti-list-tree" aria-hidden="true" /> Outline</button>
        </div>
        {view === 'graph' && (
          <>
            <button type="button" className="studio-btn studio-btn-small" aria-pressed={focus} disabled={!selected} onClick={() => setFocus((f) => !f)} title="Show only the selection and its nearby prerequisites and dependents">
              <i className="ti ti-focus-2" aria-hidden="true" /> {focus ? 'Show all' : 'Focus on selection'}
            </button>
            <button type="button" className="studio-btn studio-btn-small" onClick={fit}><i className="ti ti-arrows-maximize" aria-hidden="true" /> Fit</button>
          </>
        )}
      </div>
      {view === 'graph' && (
        <fieldset className="cmap-filters">
          <legend>Show relationships</legend>
          <span className="cmap-legend-req">→ requires (always shown)</span>
          {RELATION_TYPES.map((r) => (
            <label key={r.id}>
              <input type="checkbox" checked={rels[r.id]} onChange={(e) => setRels((x) => ({ ...x, [r.id]: e.target.checked }))} />
              <svg width="26" height="8" aria-hidden="true"><line x1="0" y1="4" x2="26" y2="4" stroke="currentColor" strokeWidth="2" strokeDasharray={r.dash} /></svg>
              {r.label}
            </label>
          ))}
        </fieldset>
      )}
      {q && <p className="cmap-status" role="status">{matches.length ? `${matches.length} match${matches.length > 1 ? 'es' : ''} — press Enter to go to the first.` : 'No concept with that name in this view.'}</p>}

      <div className="cmap-body">
        {view === 'graph' ? (
          <div className="cmap-canvas">
            <p id="cmap-kbd-help" className="visually-hidden">Concept graph. Arrow left moves to a prerequisite, arrow right to a concept that builds on this one, arrow up and down within a column. Enter shows details. The Outline view lists the same information without the graph.</p>
            <svg ref={svgRef} className="cmap-svg" aria-label={`Concept map: ${ids.length} concepts`} role="group">
              <defs>
                <marker id="cm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
                </marker>
              </defs>
              <g ref={gRef}>
                {ids.flatMap((id) => reqsOf(id).filter((r) => idSet.has(r)).map((r) => {
                  const a = lay.pos.get(r);
                  const b = lay.pos.get(id);
                  const x1 = a.x + NODE_W;
                  const y1 = a.y + NODE_H / 2;
                  const x2 = b.x;
                  const y2 = b.y + NODE_H / 2;
                  const hot = near && (near.has(id) && near.has(r)) && (id === selected || r === selected);
                  return <path key={`${r}-${id}`} className={`cmap-edge${hot ? ' hot' : ''}`} d={`M${x1},${y1} C${x1 + COL_GAP / 2},${y1} ${x2 - COL_GAP / 2},${y2} ${x2 - 2},${y2}`} markerEnd="url(#cm-arrow)" />;
                }))}
                {graph.edges.filter((e) => rels[e.type] && idSet.has(e.source) && idSet.has(e.target)).map((e) => {
                  const a = lay.pos.get(e.source);
                  const b = lay.pos.get(e.target);
                  const dash = RELATION_TYPES.find((r) => r.id === e.type).dash;
                  return <path key={`${e.type}${e.source}${e.target}`} className="cmap-rel" strokeDasharray={dash} d={`M${a.x + NODE_W / 2},${a.y + NODE_H} Q${(a.x + b.x) / 2 + NODE_W / 2},${Math.max(a.y, b.y) + NODE_H + 60} ${b.x + NODE_W / 2},${b.y + NODE_H}`} />;
                })}
                {ids.map((id) => {
                  const p = lay.pos.get(id);
                  const c = conceptById[id];
                  const lines = wrap(c.title);
                  const taught = lessonsTeaching(id).length > 0;
                  const dim = near && !near.has(id);
                  const match = q && c.title.toLowerCase().includes(q);
                  return (
                    <g
                      key={id}
                      ref={(el) => { if (el) nodeRefs.current.set(id, el); else nodeRefs.current.delete(id); }}
                      className={`cmap-node${id === selected ? ' selected' : ''}${dim ? ' dim' : ''}${match ? ' match' : ''}${taught ? ' taught' : ''}`}
                      transform={`translate(${p.x},${p.y})`}
                      role="button"
                      tabIndex={id === rovingId ? 0 : -1}
                      aria-label={`${c.title}. ${reqsOf(id).length} prerequisites, ${nextOf(id).length} next.${taught ? ' Has a lesson.' : ''}`}
                      aria-describedby="cmap-kbd-help"
                      aria-pressed={id === selected}
                      onClick={() => choose(id, { center: false })}
                      onKeyDown={(e) => onNodeKey(e, id)}
                    >
                      <rect width={NODE_W} height={NODE_H} rx={9} />
                      {lines.map((t, i) => <text key={i} x={10} y={lines.length === 1 ? 28 : 19 + i * 15}>{t}</text>)}
                      {taught && <circle cx={NODE_W - 9} cy={9} r={4} className="cmap-taught-dot" />}
                    </g>
                  );
                })}
              </g>
            </svg>
            <p className="cmap-hint studio-muted">Drag to pan, scroll or pinch to zoom. A dot marks concepts with a written lesson. Keyboard: Tab to the graph, then arrow keys.</p>
          </div>
        ) : (
          <div className="cmap-outline">
            {SUBJECTS.filter((s) => (scope === 'all' || s.id === scope) && CONCEPTS.some((c) => c.subject === s.id)).map((s) => (
              <section key={s.id} aria-labelledby={`ol-${s.id}`}>
                <h2 id={`ol-${s.id}`} className="studio-h2">{s.title}</h2>
                <ol className="cmap-outline-list">
                  {CONCEPTS.filter((c) => c.subject === s.id && (!q || c.title.toLowerCase().includes(q))).map((c) => (
                    <li key={c.id}>
                      <button type="button" className={`cmap-outline-btn${c.id === selected ? ' on' : ''}`} aria-pressed={c.id === selected} onClick={() => setSelected(c.id)}>
                        {c.title}{lessonsTeaching(c.id).length > 0 && <span className="studio-chip">lesson</span>}
                      </button>
                      <span className="studio-muted cmap-outline-req">{c.requires.length ? `Requires: ${c.requires.map((r) => conceptById[r]?.title).join('; ')}` : 'No prerequisites'}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}

        <aside className="cmap-detail" aria-label="Concept details" aria-live="polite">
          {selected ? <Detail id={selected} onSelect={(id) => choose(id)} /> : (
            <div className="cmap-detail-body">
              <h2 className="studio-h2">Choose a concept</h2>
              <p className="studio-muted">Arrows point from what you need to what it unlocks. Select any concept to see what it builds on, where it leads, its formulas and the lesson that teaches it.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
