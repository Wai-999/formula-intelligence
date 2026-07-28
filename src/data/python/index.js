// ————— Python Hub content registry —————
// Every statistical formula (94, mirroring src/data/nodes.js) and every ML
// model (32, mirroring src/data/ml/models.js) gets an entry. Entries reuse
// the SAME ids as their map counterparts so cross-links can address them.
//
// Entry schema (all prose sections optional — the renderer skips missing
// ones; `code` should avoid triple-quoted strings so the lightweight
// per-line highlighter in PyCodeBlock.jsx stays exact):
// {
//   id, name, formula, tags: [..],
//   overview: '…',
//   variables: [['symbol', 'meaning'], …],
//   thinking: { workflow: [..], when: [..], notWhen: [..], assumptions: [..] },
//   code: '…python…',
//   scenario: { title, problem, dataset, why, output, interpretation, pitfalls },
//   mistakes: [..], tips: [..],
// }
import { PY_STATS_DESCRIPTIVE } from './pyStatsDescriptive.js';
import { PY_STATS_PROBABILITY } from './pyStatsProbability.js';
import { PY_STATS_INFERENCE } from './pyStatsInference.js';
import { PY_STATS_RELATIONSHIPS } from './pyStatsRelationships.js';
import { PY_STATS_ANOVA_NONPARAM } from './pyStatsAnovaNonparam.js';
import { PY_ML_CLASSIC } from './pyMLClassic.js';
import { PY_ML_UNSUP_TS } from './pyMLUnsupTs.js';
import { PY_ML_DEEP_BAYES_RL } from './pyMLDeepBayesRl.js';

const STATS_GROUPS = [
  { id: 'ch2', label: 'Ch 2 — Frequency Distributions' },
  { id: 'ch3', label: 'Ch 3 — Data Description' },
  { id: 'ch4', label: 'Ch 4 — Probability' },
  { id: 'ch5', label: 'Ch 5 — Discrete Distributions' },
  { id: 'ch6', label: 'Ch 6 — Normal Distribution' },
  { id: 'ch7', label: 'Ch 7 — Confidence Intervals' },
  { id: 'ch8', label: 'Ch 8 — Hypothesis Testing' },
  { id: 'ch9', label: 'Ch 9 — Two-Sample Tests' },
  { id: 'ch10', label: 'Ch 10 — Correlation & Regression' },
  { id: 'ch11', label: 'Ch 11 — Chi-Square Tests' },
  { id: 'ch12', label: 'Ch 12 — ANOVA' },
  { id: 'ch13', label: 'Ch 13 — Nonparametric' },
  { id: 'ch14', label: 'Ch 14 — Monte Carlo' },
];

const ML_GROUPS = [
  { id: 'fam1', label: 'Linear & Regularized' },
  { id: 'fam2', label: 'Instance-Based & Probabilistic' },
  { id: 'fam3', label: 'Tree-Based Models & Ensembles' },
  { id: 'fam4', label: 'Support Vector Machines' },
  { id: 'fam5', label: 'Unsupervised Learning' },
  { id: 'fam6', label: 'Classical Time-Series / Econometric' },
  { id: 'fam7', label: 'Modern Applied Time-Series Tools' },
  { id: 'fam8', label: 'Deep Learning' },
  { id: 'fam9', label: 'Bayesian Machine Learning' },
  { id: 'fam10', label: 'Reinforcement Learning' },
];

const ALL_STATS = [
  ...PY_STATS_DESCRIPTIVE,
  ...PY_STATS_PROBABILITY,
  ...PY_STATS_INFERENCE,
  ...PY_STATS_RELATIONSHIPS,
  ...PY_STATS_ANOVA_NONPARAM,
];

const ALL_ML = [...PY_ML_CLASSIC, ...PY_ML_UNSUP_TS, ...PY_ML_DEEP_BAYES_RL];

function buildGroups(groupDefs, entries, key) {
  return groupDefs
    .map((g) => ({
      ...g,
      entries: entries
        .filter((e) => e[key] === g.id)
        .map((e) => ({ ...e, groupLabel: g.label })),
    }))
    .filter((g) => g.entries.length > 0);
}

export const PY_SECTIONS = [
  {
    id: 'stats',
    label: 'Statistics',
    icon: 'ti-chart-bar',
    groups: buildGroups(STATS_GROUPS, ALL_STATS, 'group'),
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    icon: 'ti-robot',
    groups: buildGroups(ML_GROUPS, ALL_ML, 'group'),
  },
];

export const PY_ALL_ENTRIES = [...ALL_STATS, ...ALL_ML];

/**
 * id → entry lookup. Lets other surfaces (Stats mode's DetailPanel at
 * Researcher depth) reuse this corpus instead of duplicating assumptions,
 * caveats and variable glossaries that already exist here for all 126
 * topics — the ids are deliberately identical to nodes.js / models.js.
 */
export const PY_ENTRY_BY_ID = Object.fromEntries(PY_ALL_ENTRIES.map((e) => [e.id, e]));
