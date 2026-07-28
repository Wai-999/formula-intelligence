#!/usr/bin/env node
// Author-time content validator. Run: npm run validate:content
//
// Answers the question a content author actually has — "is what I just
// wrote correctly shaped?" — with a precise path per problem, instead of
// leaving them to notice a blank card in the UI later. The same schemas
// run inside the Vitest suite (src/data/__tests__), so CI enforces what
// this command reports; this exists because a failing test is a worse
// authoring experience than a readable report.

import { nodes } from '../src/data/nodes.js';
import { ML_MODELS, ML_LINKS, ML_FAMILIES } from '../src/data/ml/models.js';
import { MODEL_DEPTH_LADDER } from '../src/data/ml/modelDepthLadder.js';
import { PY_ALL_ENTRIES } from '../src/data/python/index.js';
import {
  STATS_NODE, ML_MODEL, ML_FAMILY, ML_LINK, PY_ENTRY,
  validateCollection, checkUniqueIds, checkReferences,
} from '../src/data/schema.js';

const groups = [];
const add = (label, count, errors) => groups.push({ label, count, errors });

// —— Stats formulas ——
add('Stats formulas (nodes.js)', nodes.length, [
  ...checkUniqueIds(nodes, 'STATS_NODE'),
  ...validateCollection(STATS_NODE, nodes, 'STATS_NODE'),
]);

// —— ML models, families, edges ——
const modelIds = new Set(ML_MODELS.map((m) => m.id));
const familyIds = new Set(ML_FAMILIES.map((f) => f.id));

add('ML models (models.js)', ML_MODELS.length, [
  ...checkUniqueIds(ML_MODELS, 'ML_MODEL'),
  ...validateCollection(ML_MODEL, ML_MODELS, 'ML_MODEL'),
  ...ML_MODELS.filter((m) => !familyIds.has(m.ch))
    .map((m) => `ML_MODEL[${m.id}].ch — family ${m.ch} does not exist`),
]);

add('ML families', ML_FAMILIES.length, [
  ...validateCollection(ML_FAMILY, ML_FAMILIES, 'ML_FAMILY'),
]);

add('ML graph edges', ML_LINKS.length, [
  ...validateCollection(ML_LINK, ML_LINKS, 'ML_LINK', 's'),
  ...checkReferences(ML_LINKS, 's', modelIds, 'ML_LINK'),
  ...checkReferences(ML_LINKS, 't', modelIds, 'ML_LINK'),
  ...ML_LINKS.filter((l) => l.s === l.t).map((l) => `ML_LINK[${l.s}] — self-link`),
  ...(() => {
    const connected = new Set(ML_LINKS.flatMap((l) => [l.s, l.t]));
    return ML_MODELS.filter((m) => !connected.has(m.id))
      .map((m) => `ML_MODEL[${m.id}] — orphan: no edges connect it to the graph`);
  })(),
]);

// —— Depth ladders ——
const ladderIds = Object.keys(MODEL_DEPTH_LADDER);
add('Model depth ladders', ladderIds.length, [
  ...ML_MODELS.filter((m) => !MODEL_DEPTH_LADDER[m.id])
    .map((m) => `MODEL_DEPTH_LADDER[${m.id}] — model has no depth ladder`),
  ...ladderIds.filter((id) => !modelIds.has(id))
    .map((id) => `MODEL_DEPTH_LADDER[${id}] — ladder for a model that does not exist`),
]);

// —— Python Hub ——
const statsIds = new Set(nodes.map((n) => n.id));
add('Python Hub entries', PY_ALL_ENTRIES.length, [
  ...checkUniqueIds(PY_ALL_ENTRIES, 'PY_ENTRY'),
  ...validateCollection(PY_ENTRY, PY_ALL_ENTRIES, 'PY_ENTRY'),
  ...[...statsIds, ...modelIds]
    .filter((id) => !PY_ALL_ENTRIES.some((e) => e.id === id))
    .map((id) => `PY_ENTRY[${id}] — no Python Hub entry for this formula/model`),
  ...PY_ALL_ENTRIES.filter((e) => !statsIds.has(e.id) && !modelIds.has(e.id))
    .map((e) => `PY_ENTRY[${e.id}] — entry for an id that exists in neither nodes.js nor models.js`),
]);

// —— Report ——
const RED = '\x1b[31m', GREEN = '\x1b[32m', DIM = '\x1b[2m', BOLD = '\x1b[1m', OFF = '\x1b[0m';
let total = 0;
console.log(`${BOLD}Content validation${OFF}\n`);
for (const { label, count, errors } of groups) {
  total += errors.length;
  const mark = errors.length ? `${RED}✗${OFF}` : `${GREEN}✓${OFF}`;
  console.log(`${mark} ${label} ${DIM}(${count} records)${OFF}`);
  for (const e of errors.slice(0, 25)) console.log(`    ${RED}${e}${OFF}`);
  if (errors.length > 25) console.log(`    ${DIM}…and ${errors.length - 25} more${OFF}`);
}
console.log();
if (total === 0) {
  console.log(`${GREEN}All content valid.${OFF}`);
  process.exit(0);
}
console.log(`${RED}${BOLD}${total} problem(s) found.${OFF}`);
process.exit(1);
