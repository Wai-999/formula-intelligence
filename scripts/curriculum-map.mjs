#!/usr/bin/env node
// Writes docs/CURRICULUM_MAP.md from the catalog itself, so the map can never
// claim a lesson that is not authored (§5, §17). Run: npm run docs:curriculum
import { writeFileSync } from 'node:fs';
import { SUBJECTS, COURSES, courseStatus, unitStatus } from '../src/data/curriculum/catalog.js';
import { LESSONS, lessonById } from '../src/data/curriculum/lessons/index.js';
import { COMPETENCIES, DOMAINS } from '../src/data/curriculum/competencies.js';
import { DX_ITEMS } from '../src/data/diagnostic/itemBank.js';
import { LABS } from '../src/features/labs/registry.js';

const authored = LESSONS.length;
const planned = COURSES.reduce((n, c) => n + c.units.reduce((m, u) => m + u.planned.length, 0), 0);
const dx = new Set(DX_ITEMS.map((i) => i.competency));
const cell = (s) => String(s).replace(/\|/g, '\\|');

const out = [];
out.push(`# Curriculum map

Generated from \`src/data/curriculum/catalog.js\` by \`npm run docs:curriculum\` — edit the catalog, not this file.

**Status words.** *Authored* means the lesson's content exists in \`src/data/curriculum/lessons/\` with all ten §6 elements. *Planned* means only a title exists. A course is **partial** when some of its lessons are authored and **outline** when none are; no course is complete. Every authored lesson is an **AI draft awaiting independent human math review** (\`review.status: 'awaiting-human-review'\`, reviewer \`null\`) — content-complete for this slice, not review-complete.

**Totals:** ${SUBJECTS.length} subjects · ${COURSES.length} courses · ${COURSES.reduce((n, c) => n + c.units.length, 0)} units · **${authored} authored lessons** · ${planned} planned lesson titles · ${COMPETENCIES.length} competencies in ${DOMAINS.length} domains · ${Object.keys(LABS).length} interactive labs.

**Algebra and Linear Algebra are separate subjects** (§5): Algebra I/II build symbolic fluency with one-variable functions; Linear Algebra starts from vectors and matrices and lists Algebra I as a prerequisite, never the other way round.

## Recommended path

Prealgebra → Algebra I → Algebra II → Precalculus → Calculus I → Calculus II → Calculus III. Linear Algebra and Probability & Statistics branch off after Algebra I; Calculus III also needs Linear Algebra; Machine Learning & Data Science needs Probability & Statistics and Linear Algebra; Python for Data Science has no prerequisite and runs alongside. (These are the \`prerequisites\` in the table below.) The diagnostic places a learner on the first five steps (\`MATH_PATH\` in \`src/lib/diagnostic.js\`).

## Courses
`);
out.push('| Course | Subject | Status | Units | Authored lessons | Planned titles | Prerequisites |');
out.push('|---|---|---|---|---|---|---|');
for (const c of COURSES) {
  const a = c.units.reduce((n, u) => n + u.lessons.length, 0);
  const p = c.units.reduce((n, u) => n + u.planned.length, 0);
  out.push(`| ${c.title} | ${SUBJECTS.find((s) => s.id === c.subject)?.title} | ${courseStatus(c)} | ${c.units.length} | ${a} | ${p} | ${c.prerequisites.join(', ') || '—'} |`);
}

for (const s of SUBJECTS) {
  const courses = COURSES.filter((c) => c.subject === s.id);
  if (!courses.length) continue;
  out.push(`\n## ${s.title}\n\n${s.summary}`);
  for (const c of courses) {
    out.push(`\n### ${c.title} — ${courseStatus(c)}\n\n${c.summary} About ${c.estimatedHours} hours when complete.\n`);
    out.push('| Unit | Status | Authored lessons | Planned lessons | Exit competencies |');
    out.push('|---|---|---|---|---|');
    for (const u of c.units) {
      const lessons = u.lessons.map((id) => `**${lessonById[id]?.title ?? id}**`).join('<br>') || '—';
      const comps = u.exitCompetencies.map((id) => `${id}${dx.has(id) ? '' : ' (no diagnostic item)'}`).join(', ');
      out.push(`| ${cell(u.title)} | ${unitStatus(u)} | ${lessons} | ${cell(u.planned.join('; ')) || '—'} | ${comps} |`);
    }
  }
}

out.push('\n## Authored lessons\n');
out.push('| Lesson | Course | Competencies | Labs | Minutes | Review |');
out.push('|---|---|---|---|---|---|');
for (const l of LESSONS) {
  out.push(`| ${l.title} (\`${l.id}\`) | ${COURSES.find((c) => c.id === l.course)?.title} | ${l.competencies.join(', ')} | ${l.labs.join(', ') || '—'} | ${l.minutes} | ${l.review.status} |`);
}

out.push(`\n## Diagnostic coverage\n\n${dx.size} of ${COMPETENCIES.length} competencies have diagnostic items (at least 2 each; ${DX_ITEMS.length} items). Not covered: ${COMPETENCIES.filter((c) => !dx.has(c.id)).map((c) => `\`${c.id}\``).join(', ')} — Calculus II–III and ML-course skills, past what placement decides (a hard calculus or statistics item stands for “ready to leave Calculus I / Probability & Statistics”); their lesson checkpoints measure them.\n`);

writeFileSync('docs/CURRICULUM_MAP.md', `${out.join('\n')}\n`);
console.log('wrote docs/CURRICULUM_MAP.md');
