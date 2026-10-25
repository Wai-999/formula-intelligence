#!/usr/bin/env node
// Validates the academic data behind Learn → Ohlone prep (V5.1 §2, §13.6):
// required fields, official sources, current versus earlier academic
// years, and the separation of official records from study mappings.
// Run: npm run validate:college

import { validateCollegeData, summarize, CURRENT_YEARS } from '../src/data/college/validate.js';
import { SOURCES } from '../src/data/college/sources.js';

const problems = validateCollegeData();
const s = summarize();

console.log(`Sources: ${s.sources} (current years: ${CURRENT_YEARS.join(', ')})`);
for (const src of SOURCES) console.log(`  ${src.academicYear ?? 'no year stated'} · read ${src.accessedAt} · ${src.institution} — ${src.url}`);
console.log(`Records: ${s.records} (${Object.entries(s.byStatus).map(([k, v]) => `${v} ${k}`).join(', ')})`);
console.log(`Articulation rows: ${s.articulation}, of which ${s.noArticulation} have no Ohlone course articulated`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\nCollege data valid.');
