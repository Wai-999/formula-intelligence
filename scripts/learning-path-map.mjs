#!/usr/bin/env node
// Writes docs/LEARNING_PATH_MAP.md from the learning-path engine itself, so the
// map shows exactly what the app recommends — including what is not written
// yet. Run: npm run docs:path
import { writeFileSync } from 'node:fs';
import { CURRICULUM as cur } from '../src/data/curriculum/path.js';
import { CSU_PREP, OUTLINE_ALTERNATIVES } from '../src/data/curriculum/pathways.js';
import { PAGES } from '../src/app/pages.js';
import { STATUS, walkPath, recommend, validateCurriculum, courseNeighbours } from '../src/lib/learningPath.js';

const cell = (s) => String(s).replace(/\|/g, '\\|');
const title = (id) => cur.courseById[id]?.title ?? id;
const lesson = (id) => cur.lessonById[id]?.title ?? id;
const planned = (id) => cur.courseById[id].units.reduce((n, u) => n + u.planned.length, 0);
const route = cur.pathById[cur.defaultPath];
const pageTitle = Object.fromEntries(PAGES.map((p) => [p.id, p.title]));
const out = [];

out.push(`# Learning path map

Generated from \`src/data/curriculum/pathways.js\` and the learning-path engine (\`src/lib/learningPath.js\`) by \`npm run docs:path\`. Edit the data, not this file.

These are **self-study paths**. They are not degree, transfer or certification requirements, and nothing here claims an equivalence with any college course. "Written" means a lesson exists in the app; "planned" means only its title does. Finishing the written lessons of a course is reported as exactly that, never as finishing the course or mastering it.

## Default route: ${route.title}

${route.summary}

| # | Course | Written lessons | Planned lessons | Prerequisites | Note |
|---|---|---|---|---|---|`);
route.courses.forEach((id, i) => {
  const c = cur.courseById[id];
  const w = cur.courseLessons[id].length;
  out.push(`| ${i + 1} | ${cell(c.title)} | ${w || '— (outline only)'} | ${planned(id)} | ${c.prerequisites.map(title).join(', ') || '—'} | ${cell(route.parallel?.[id] ?? '')} |`);
});

const walk = walkPath(cur);
out.push(`
## What “Continue” does, lesson by lesson

A learner who starts at the beginning and always takes the primary action sees this sequence (\`walkPath\`). Every written lesson appears once, course by course; course changes show the reasons and warnings the app displays.
`);
let prevCourse = null;
walk.steps.forEach((s, i) => {
  const c = cur.courseOf[s.lessonId];
  if (c !== prevCourse) {
    out.push(`\n**${title(c)}**${i === 0 ? '' : ` — ${s.status === STATUS.TRANSITION ? 'course transition' : s.status}`}`);
    if (i > 0) {
      for (const r of s.reasons) out.push(`> ${r}`);
      for (const w of s.warnings) out.push(`> ⚠ ${w}`);
      out.push('');
    }
    prevCourse = c;
  }
  out.push(`${i + 1}. ${lesson(s.lessonId)} (\`${s.lessonId}\`, ${s.status})`);
});
out.push(`\n**End of the route** — ${walk.end.status}.`);
for (const r of walk.end.reasons) out.push(`> ${r}`);
for (const w of walk.end.warnings) out.push(`> ⚠ ${w}`);

out.push(`
## After each course

What the course page, the last lesson of the course and Home all offer once every written lesson of a course is done (with the earlier courses done too).

| Finished course | Next | Passed over (not written) | Warnings |
|---|---|---|---|`);
route.courses.forEach((id, i) => {
  if (!cur.courseLessons[id].length) return;
  const lessons = Object.fromEntries(route.courses.slice(0, i + 1).flatMap((c) => cur.courseLessons[c]).map((l) => [l, { completed: 1 }]));
  const rec = recommend(cur, { lessons }, { courseId: id });
  const next = rec.status === STATUS.END ? 'End of the path' : `${title(rec.nextCourseId)}: ${lesson(rec.nextLessonId)}`;
  const skipped = rec.skipped.map(title).join(', ') || '—';
  const warnings = rec.warnings.filter((w) => !/full course is not complete/.test(w) && !/passed over for now/.test(w)).join(' ') || '—';
  out.push(`| ${cell(title(id))} | ${cell(next)} | ${cell(skipped)} | ${cell(warnings)} |`);
});

out.push(`
## Outline-only courses

A course with no written lesson never dead-ends: its page names what is planned and offers the nearest useful alternative.

| Course | Planned lessons | Offered instead |
|---|---|---|`);
for (const id of route.courses.filter((c) => !cur.courseLessons[c].length)) {
  const rec = recommend(cur, { lessons: {} }, { courseId: id });
  const alt = OUTLINE_ALTERNATIVES[id];
  const offer = alt ? `${alt.label} (${pageTitle[alt.page]})` : rec.label;
  const n = courseNeighbours(cur, null, id);
  out.push(`| ${cell(title(id))} | ${planned(id)} | ${cell(offer)}${alt && n.next ? `; or continue on the path: ${cell(title(n.next))}` : ''} |`);
}

out.push(`
## Optional tracks

Applied sequences of written lessons across courses. A learner can follow one from **Learn → Courses → Your learning path**; Home and the end of each track lesson then recommend the next step of the track. Planned topics are listed by their exact planned titles in the catalog and are never offered as lessons.
`);
for (const t of cur.paths.filter((p) => p.kind === 'track')) {
  const written = t.steps.filter((s) => s.lesson).length;
  out.push(`### ${t.title}\n\n${t.summary} (${written} written lessons, ${t.steps.length - written} planned topics.)\n`);
  t.steps.forEach((s, i) => {
    out.push(s.lesson
      ? `${i + 1}. ${lesson(s.lesson)} — ${title(cur.courseOf[s.lesson])}. ${s.why}`
      : `${i + 1}. *Planned, not written:* ${s.planned} — ${title(s.course)}. ${s.why}`);
  });
  out.push(t.project ? `\nFinal project: **${cur.projectById[t.project].title}** (Apply → Projects).\n` : `\nFinal project: none yet. ${t.projectNote}\n`);
}

out.push(`## ${CSU_PREP.title}

${CSU_PREP.disclaimer}

| Area | Courses here | Written lessons | Note |
|---|---|---|---|`);
for (const a of CSU_PREP.areas) {
  const w = a.courses.reduce((n, c) => n + cur.courseLessons[c].length, 0);
  out.push(`| ${a.title} | ${a.courses.map(title).join(', ') || '—'} | ${w} | ${cell(a.note ?? '')} |`);
}

const problems = validateCurriculum(cur, { pages: new Set(PAGES.map((p) => p.id)) });
out.push(`
## Validation

\`validateCurriculum\` (also run by \`npm run validate:content\` and the test suite) checks: known ids; no prerequisite cycles; the route lists every course once, prerequisites first; tracks name written lessons or real planned titles, and a project or a note; every written lesson has a next step or an honest end; and taking "Continue" from the start reaches every written lesson once, in route order.

Result when this file was generated: ${problems.length ? `**${problems.length} problem(s)**:\n\n${problems.map((p) => `- ${p}`).join('\n')}` : '**no problems**.'}
`);

writeFileSync(new URL('../docs/LEARNING_PATH_MAP.md', import.meta.url), `${out.join('\n')}\n`);
console.log(`docs/LEARNING_PATH_MAP.md written (${walk.steps.length} lessons on the route, ${problems.length} problems).`);
