#!/usr/bin/env node
// Fetches every source URL cited by the curriculum (lesson reading lists,
// formula references, dataset provenance) and records the HTTP status and
// page title (§12: "link to the actual relevant resource"; §16: never
// fabricate citations). Run: npm run check:citations
//
// Needs network access, so it is not part of CI; its last result is
// committed to docs/audits/evidence/citations.json and summarised in
// docs/CONTENT_QA.md. A publisher page that refuses automated requests is
// reported as UNVERIFIED, never as passing.

import { writeFileSync, mkdirSync } from 'node:fs';
import { LESSONS } from '../src/data/curriculum/lessons/index.js';
import { FORMULAS } from '../src/data/curriculum/formulas.js';
import { DATASETS } from '../src/data/projects/index.js';

const cited = new Map(); // url → [where]
const add = (url, where) => {
  if (!url) return;
  if (!cited.has(url)) cited.set(url, []);
  cited.get(url).push(where);
};

for (const l of LESSONS) {
  const body = (await l.load()).default;
  for (const r of body.reading) add(r.url, `lesson ${l.id}: ${r.title}`);
}
for (const f of FORMULAS) for (const u of f.references) add(u, `formula ${f.id}`);
for (const d of DATASETS) { add(d.url, `dataset ${d.id}`); add(d.secondaryUrl, `dataset ${d.id} (secondary)`); }

const results = [];
for (const [url, where] of cited) {
  let status = 0;
  let finalUrl = url;
  let title = '';
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (citation check; formula-intelligence)' }, signal: AbortSignal.timeout(25_000) });
    status = res.status;
    finalUrl = res.url;
    const html = await res.text();
    title = (html.match(/<title[^>]*>([^<]*)/i)?.[1] ?? '').replace(/\s+/g, ' ').trim().slice(0, 140);
  } catch (err) {
    title = `request failed: ${err.message}`;
  }
  const verdict = status >= 200 && status < 300 ? 'OK' : status === 403 || status === 406 ? 'UNVERIFIED (refuses automated requests)' : 'BROKEN';
  results.push({ url, finalUrl, status, title, verdict, citedBy: where });
  console.log(`${verdict.padEnd(10)} ${status} ${url}\n           ${title}`);
}

mkdirSync('docs/audits/evidence', { recursive: true });
writeFileSync('docs/audits/evidence/citations.json', `${JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
const broken = results.filter((r) => r.verdict === 'BROKEN');
const unverified = results.filter((r) => r.verdict.startsWith('UNVERIFIED'));
console.log(`\n${results.length - broken.length - unverified.length} OK, ${unverified.length} unverified, ${broken.length} broken.`);
process.exit(broken.length ? 1 : 0);
