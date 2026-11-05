import { describe, it, expect } from 'vitest';
import { PROJECTS, DATASETS, datasetById } from '../index.js';
import { pyExerciseById } from '../../python/exercises.js';
import { cppExerciseById } from '../../cpp/exercises.js';
import { lessonById } from '../../curriculum/lessons/index.js';

// Projects reference only things that exist, say whether their data are
// real or synthetic, and — for the three V5.1 §13.5 projects — carry a
// complete 0–2 rubric with a reason for every score and an unfamiliar
// extension question.

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sampleVar = (xs) => { const m = mean(xs); return xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1); };

describe('projects', () => {
  it('reference existing datasets, lessons and exercises', () => {
    for (const p of PROJECTS) {
      for (const d of p.datasets) expect(datasetById[d], `${p.id} dataset ${d}`).toBeTruthy();
      for (const l of p.lessons) expect(lessonById[l], `${p.id} lesson ${l}`).toBeTruthy();
      for (const st of p.steps) {
        if (st.exercise) expect(pyExerciseById[st.exercise], `${p.id} ${st.id}`).toBeTruthy();
        if (st.cppExercise) expect(cppExerciseById[st.cppExercise], `${p.id} ${st.id}`).toBeTruthy();
        if (!st.exercise && !st.cppExercise) expect(st.reflect, `${p.id} ${st.id} needs a prompt`).toBeTruthy();
      }
    }
  });

  it('mark every dataset as real (with a source link) or synthetic', () => {
    for (const d of DATASETS) {
      expect(['real', 'synthetic'], d.id).toContain(d.kind);
      if (d.kind === 'real') expect(d.url, d.id).toMatch(/^https:\/\//);
      expect(d.license, d.id).toBeTruthy();
    }
  });

  it('the three V5.1 projects carry a complete rubric and an extension', () => {
    for (const id of ['proj.restaurant', 'proj.weather', 'proj.sensor-log']) {
      const p = PROJECTS.find((x) => x.id === id);
      expect(p.extension?.length, id).toBeGreaterThan(40);
      expect(Object.keys(p.rubric).sort(), id).toEqual(['interpretation', 'method', 'problem', 'provenance', 'transfer']);
      for (const [k, [score, why]] of Object.entries(p.rubric)) {
        expect([0, 1, 2], `${id} ${k}`).toContain(score);
        expect(why.length, `${id} ${k} needs a reason`).toBeGreaterThan(20);
      }
      // A synthetic dataset cannot score full marks on provenance.
      if (p.datasets.every((d) => datasetById[d].kind === 'synthetic')) expect(p.rubric.provenance[0], id).toBeLessThan(2);
    }
  });

  it('Anscombe’s quartet matches the paper’s published summary statistics', () => {
    const { x, y1, y2, y3 } = datasetById['ds.anscombe'].data;
    expect(mean(x)).toBe(9);
    expect(sampleVar(x)).toBeCloseTo(11, 10);
    for (const y of [y1, y2, y3]) {
      expect(mean(y)).toBeCloseTo(7.5, 2);
      expect(sampleVar(y)).toBeCloseTo(4.125, 1);
      const mx = mean(x);
      const my = mean(y);
      const sxy = x.reduce((a, xi, i) => a + (xi - mx) * (y[i] - my), 0);
      const sxx = x.reduce((a, xi) => a + (xi - mx) ** 2, 0);
      const syy = y.reduce((a, yi) => a + (yi - my) ** 2, 0);
      expect(sxy / sxx).toBeCloseTo(0.5, 2);
      expect(my - (sxy / sxx) * mx).toBeCloseTo(3.0, 1);
      expect(sxy / Math.sqrt(sxx * syy)).toBeCloseTo(0.816, 2);
    }
  });
});
