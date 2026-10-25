// Global search (§10 "quick search"; §3 "global search ... discoverable").
//
// Loaded on first open, never with the shell: it imports every formula,
// model and lesson title, which the landing page has no use for.
import { PAGES } from '../app/pages.js';
import { nodes } from '../data/nodes.js';
import { CHAPTERS } from '../data/chapters.js';
import { ML_MODELS } from '../data/ml/models.js';
import { ML_LESSONS } from '../data/ml/lessons.js';
import { resolveT } from './mlContent.js';
import { searchEntries as curriculumEntries } from '../data/curriculum/index.js';
import { PY_EXERCISES } from '../data/python/exercises.js';
import { PROJECTS } from '../data/projects/index.js';

const chapterTitle = Object.fromEntries(CHAPTERS.map((c) => [c.id, c.name ?? c.title ?? `Chapter ${c.id}`]));

export const KIND_LABEL = {
  lesson: 'Lessons',
  exercise: 'Code exercises',
  project: 'Projects',
  course: 'Courses',
  concept: 'Concepts',
  formula: 'Formulas',
  model: 'Models',
  page: 'Pages',
};

export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function entry(kind, id, title, subtitle, keywords, target) {
  return { kind, id: `${kind}:${id}`, title, subtitle, target, _title: normalize(title), _all: normalize([title, subtitle, ...(keywords ?? [])].join(' ')) };
}

export function buildIndex() {
  const out = [];
  for (const p of PAGES) {
    if (p.hidden) continue;
    out.push(entry('page', p.id, p.title, p.section ? p.section[0].toUpperCase() + p.section.slice(1) : 'App', [p.id], { page: p.id }));
  }
  for (const n of nodes) {
    out.push(entry('formula', n.id, n.name, `${n.formula ?? n.short ?? ''} · ${chapterTitle[n.ch] ?? `Chapter ${n.ch}`}`, [n.desc, n.use, ...(n.tags ?? [])], { page: 'learn/formulas', formula: n.id }));
  }
  for (const m of ML_MODELS) {
    out.push(entry('model', m.id, m.name, m.short ?? 'Model map', [resolveT(m.howItWorks, 'beginner'), resolveT(m.usageAreas, 'beginner')], { page: 'learn/models', model: m.id }));
  }
  for (const l of ML_LESSONS) {
    out.push(entry('lesson', `ml-${l.id}`, l.title, 'Machine Learning · ML pipeline', [l.summary, ...(l.topics ?? [])], { page: 'learn/ml', mlLesson: l.id }));
  }
  for (const x of PY_EXERCISES.filter((e) => !e.project)) {
    out.push(entry('exercise', x.id, x.title, 'Practice · Code exercises', [x.prompt, x.type], { page: 'apply/exercises' }));
  }
  for (const pr of PROJECTS) {
    out.push(entry('project', pr.id, pr.title, 'Projects', [pr.summary], { page: 'apply/projects' }));
  }
  for (const e of curriculumEntries()) {
    out.push(entry(e.kind, e.id, e.title, e.subtitle, e.keywords, e.target));
  }
  return out;
}

const KIND_WEIGHT = { lesson: 6, course: 5, concept: 4, project: 4, exercise: 3, page: 3, formula: 2, model: 2 };

/** Every query word must match; titles outrank descriptions. */
export function search(index, query, limit = 40) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  const scored = [];
  for (const e of index) {
    if (!words.every((w) => e._all.includes(w))) continue;
    let score = KIND_WEIGHT[e.kind] ?? 0;
    for (const w of words) {
      if (e._title.startsWith(w)) score += 12;
      else if (e._title.split(' ').some((t) => t.startsWith(w))) score += 8;
      else if (e._title.includes(w)) score += 4;
    }
    if (e._title === words.join(' ')) score += 20;
    scored.push({ e, score });
  }
  scored.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title));
  return scored.slice(0, limit).map((s) => s.e);
}
