// Curriculum entry points for the rest of the app: search entries, page
// titles and breadcrumbs for course/lesson pages, and the instances the
// accessibility and English-only audits must visit.
import { SUBJECTS, COURSES, courseById, unitById, courseStatus } from './catalog.js';
import { LESSONS, lessonById } from './lessons/index.js';
import { CONCEPTS } from './concepts.js';
import { registerPageMeta } from '../../app/pageMeta.js';

export { SUBJECTS, COURSES, courseById, unitById, courseStatus, LESSONS, lessonById, CONCEPTS };

const conceptUnitCourse = (concept) => unitById[concept.unit]?.course;

export function searchEntries() {
  const out = [];
  for (const l of LESSONS) {
    const course = courseById[l.course];
    out.push({ kind: 'lesson', id: l.id, title: l.title, subtitle: `${course.title} · ${unitById[l.unit].title}`, keywords: [l.summary], target: { page: 'learn/lesson', params: { lessonId: l.id } } });
  }
  for (const c of COURSES) {
    out.push({ kind: 'course', id: c.id, title: c.title, subtitle: SUBJECTS.find((s) => s.id === c.subject).title + (courseStatus(c) === 'outline' ? ' · outline' : ''), keywords: [c.summary, ...c.units.map((u) => u.title)], target: { page: 'learn/course', params: { courseId: c.id } } });
  }
  for (const k of CONCEPTS) {
    const course = conceptUnitCourse(k);
    out.push({ kind: 'concept', id: k.id, title: k.title, subtitle: course ? courseById[course].title : 'Concept', keywords: [k.summary], target: { page: 'learn/concepts', params: { conceptId: k.id } } });
  }
  return out;
}

/** Parameterised pages the a11y and English-only audits visit: every course and every lesson. */
export function auditInstances() {
  return [
    ...COURSES.map((c) => ({ page: 'learn/course', params: { courseId: c.id } })),
    ...LESSONS.map((l) => ({ page: 'learn/lesson', params: { lessonId: l.id } })),
  ];
}

registerPageMeta('learn/course', ({ courseId }) => {
  const course = courseById[courseId];
  if (!course) return { title: 'Course not found', crumbs: [] };
  return { title: course.title, crumbs: [] };
});

registerPageMeta('learn/lesson', ({ lessonId }) => {
  const lesson = lessonById[lessonId];
  if (!lesson) return { title: 'Lesson not found', crumbs: [] };
  const course = courseById[lesson.course];
  return { title: lesson.title, crumbs: [{ label: course.title, page: 'learn/course', params: { courseId: course.id } }] };
});
