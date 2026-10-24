// Assembles the app's knowledge graph from every content source
// (docs/FORMULA_GRAPH_SCHEMA.md). Node id prefixes keep the spaces apart:
//   c.*  concept          f.*  curriculum formula   bluman:*  Formula-map formula
//   lesson:*  lesson      model:*  Model-map model   proj.*  project
//   ds.*  dataset         app.*  application        career.*  career
//   ex:*  exercise (added by tests from lesson bodies; not built at runtime)
import { makeGraph } from '../../lib/knowledgeGraph.js';
import { CONCEPTS, RELATIONS } from './concepts.js';
import { FORMULAS } from './formulas.js';
import { LESSONS } from './lessons/index.js';
import { APPLICATIONS, CAREERS } from './applications.js';
import { PROJECTS, DATASETS } from '../projects/index.js';
import { nodes as BLUMAN } from '../nodes.js';
import { ML_MODELS } from '../ml/models.js';

// Formula-to-formula derivations (source derived_from target).
const FORMULA_DERIVATIONS = [
  ['f.cos-angle', 'f.dot'],
  ['f.norm', 'f.dot'],
  ['f.projection', 'f.dot'],
  ['f.ls-intercept', 'f.ls-slope'],
  ['f.intercept-from-point', 'f.slope'],
  ['f.slope-intercept', 'f.slope'],
  ['f.integral-def', 'f.riemann'],
  ['f.lagrange-remainder', 'f.taylor'],
  ['f.directional-derivative', 'f.gradient'],
  ['f.gradient', 'f.partial-def'],
  ['f.gd-limit', 'f.gd-update'],
  ['f.clt-z', 'f.standard-error'],
  ['f.bayes-odds', 'f.bayes'],
  ['f.ppv', 'f.bayes'],
  ['f.f1', 'f.precision'],
  ['f.f1', 'f.recall'],
  ['f.explained-variance', 'f.directional-variance'],
  ['f.svd-eigen', 'f.directional-variance'],
  ['f.partial-def', 'f.derivative-def'],
  ['f.unit-rate', 'f.proportion'],
];

export function buildKnowledgeGraph({ exercises = [] } = {}) {
  const nodes = [];
  const edges = [];
  const e = (source, type, target) => edges.push({ source, target, type });

  for (const c of CONCEPTS) {
    nodes.push({ id: c.id, kind: 'concept', title: c.title, subject: c.subject, unit: c.unit, summary: c.summary });
    for (const r of c.requires) e(c.id, 'requires', r);
  }
  for (const [s, t, o] of RELATIONS) e(s, t, o);

  for (const f of FORMULAS) {
    nodes.push({ id: f.id, kind: 'formula', title: f.title, latex: f.latex, claim: f.claim });
    e(f.id, 'derived_from', f.concept);
    e(f.id, 'used_in', `lesson:${f.lesson}`);
  }
  for (const [s, t] of FORMULA_DERIVATIONS) e(s, 'derived_from', t);

  for (const n of BLUMAN) nodes.push({ id: `bluman:${n.id}`, kind: 'formula', title: n.name, text: n.formula, chapter: n.ch, source: 'Bluman' });
  for (const m of ML_MODELS) nodes.push({ id: `model:${m.id}`, kind: 'model', title: m.name });

  for (const l of LESSONS) {
    nodes.push({ id: `lesson:${l.id}`, kind: 'lesson', title: l.title, course: l.course });
    for (const p of l.prerequisites) e(`lesson:${l.id}`, 'requires', p);
    for (const c of l.concepts) e(c, 'used_in', `lesson:${l.id}`);
    for (const b of l.formulaMap) e(`bluman:${b}`, 'used_in', `lesson:${l.id}`);
    for (const m of l.models) e(`lesson:${l.id}`, 'applies_to', `model:${m}`);
  }

  for (const d of DATASETS) nodes.push({ id: d.id, kind: 'dataset', title: d.title, synthetic: d.kind === 'synthetic' });
  for (const p of PROJECTS) {
    nodes.push({ id: p.id, kind: 'project', title: p.title });
    for (const d of p.datasets) e(d, 'used_in', p.id);
    for (const c of p.concepts) e(p.id, 'requires', c);
    for (const l of p.lessons) e(`lesson:${l}`, 'used_in', p.id);
  }

  for (const a of APPLICATIONS) {
    nodes.push({ id: a.id, kind: 'application', title: a.title, summary: a.summary });
    for (const c of a.concepts) e(c, 'applies_to', a.id);
  }
  for (const k of CAREERS) {
    nodes.push({ id: k.id, kind: 'career', title: k.title, summary: k.summary });
    for (const a of k.applications) e(a, 'used_in', k.id);
    for (const c of k.concepts) e(c, 'used_in', k.id);
  }

  for (const x of exercises) {
    nodes.push({ id: `ex:${x.id}`, kind: 'exercise', title: x.id });
    e(`ex:${x.id}`, 'used_in', `lesson:${x.lesson}`);
  }

  return makeGraph(nodes, edges);
}
