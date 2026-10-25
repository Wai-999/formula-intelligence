// Integrity rules for the academic data (V5.1 §2, §13.6). Used by
// scripts/validate-college-data.mjs and src/data/college/__tests__.
// Returns a list of problems; an empty list means valid.
//
// The rules that matter most:
//   - a 'verified-current' record needs an official source URL AND an
//     academic year that is current; otherwise it fails
//   - 'verified-prior-year' is only for an older year, never a current one
//   - sources must be official (institution or ASSIST domains)
//   - official relations and study relations never mix, and nothing on the
//     site may claim earned college credit

import { SOURCES, STATUSES, sourceById } from './sources.js';
import { OHLONE_COURSES, ohloneCourseByCode } from './ohloneCourses.js';
import { ALL_REQUIREMENTS } from './requirements.js';
import { ALL_ARTICULATION, OTHER_OHLONE_CODES } from './articulation.js';
import { STUDY_ALIGNMENT } from './studyAlignment.js';
import { unitById, courseById } from '../curriculum/catalog.js';

/** Academic years that count as current for a learner starting at Ohlone in Spring 2027. */
export const CURRENT_YEARS = ['2026-2027', 'Fall 2027 admission'];

export const OFFICIAL_DOMAINS = ['ohlone.edu', 'assist.org', 'sjsu.edu', 'csueastbay.edu', 'universityofcalifornia.edu', 'ucdavis.edu', 'ucmerced.edu'];

export const RECORD_FIELDS = ['institution', 'major', 'requirementType', 'sendingCourse', 'receivingCourse', 'academicYear', 'status', 'sourceUrl', 'sourceTitle', 'accessedAt', 'notes'];

const RELATIONS = { officialRequirement: true, officialArticulatesTo: true, selfStudySupports: true };

const isOfficialUrl = (url) => {
  try {
    const host = new URL(url).hostname;
    return new URL(url).protocol === 'https:' && OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
};

/** Problems with one requirement or articulation record. */
export function checkRecord(r) {
  const where = r.id ?? JSON.stringify(r).slice(0, 60);
  const out = [];
  for (const f of RECORD_FIELDS) if (!(f in r)) out.push(`${where}: missing field ${f}`);
  if (!STATUSES.includes(r.status)) out.push(`${where}: unknown status ${r.status}`);
  if (!RELATIONS[r.relation] || r.relation === 'selfStudySupports') out.push(`${where}: an official record must have relation officialRequirement or officialArticulatesTo, not ${r.relation}`);
  if (r.earnedCollegeCredit) out.push(`${where}: the site never records earned college credit`);
  if (r.status === 'verified-current') {
    if (!r.sourceUrl || !isOfficialUrl(r.sourceUrl)) out.push(`${where}: verified-current needs an official source URL`);
    if (!r.academicYear) out.push(`${where}: verified-current needs an academic year`);
    else if (!CURRENT_YEARS.includes(r.academicYear)) out.push(`${where}: verified-current, but ${r.academicYear} is not a current year`);
  }
  if (r.status === 'verified-prior-year') {
    if (!r.sourceUrl || !isOfficialUrl(r.sourceUrl)) out.push(`${where}: verified-prior-year needs an official source URL`);
    if (!r.academicYear || CURRENT_YEARS.includes(r.academicYear)) out.push(`${where}: verified-prior-year needs an earlier academic year`);
  }
  if (r.sourceId && !sourceById[r.sourceId]) out.push(`${where}: unknown source ${r.sourceId}`);
  if (r.sourceId && sourceById[r.sourceId] && r.sourceUrl !== sourceById[r.sourceId].url) out.push(`${where}: source URL does not match source ${r.sourceId}`);
  if (r.accessedAt && !/^\d{4}-\d{2}-\d{2}$/.test(r.accessedAt)) out.push(`${where}: accessedAt must be YYYY-MM-DD`);
  return out;
}

export function validateCollegeData() {
  const problems = [];
  const known = new Set([...OHLONE_COURSES.map((c) => c.code), ...OTHER_OHLONE_CODES]);

  // Sources
  for (const s of SOURCES) {
    if (!isOfficialUrl(s.url)) problems.push(`source ${s.id}: not an official https URL (${s.url})`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.accessedAt)) problems.push(`source ${s.id}: accessedAt must be YYYY-MM-DD`);
  }
  if (new Set(SOURCES.map((s) => s.id)).size !== SOURCES.length) problems.push('duplicate source ids');

  // Ohlone courses
  for (const c of OHLONE_COURSES) {
    if (!sourceById[c.source]) problems.push(`${c.code}: unknown source ${c.source}`);
    if (!(c.units > 0)) problems.push(`${c.code}: units must be positive`);
    if (!c.topics?.length) problems.push(`${c.code}: no topics`);
  }

  // Requirements and articulation
  const records = [...ALL_REQUIREMENTS, ...ALL_ARTICULATION];
  if (new Set(records.map((r) => r.id)).size !== records.length) problems.push('duplicate requirement/articulation ids');
  for (const r of records) problems.push(...checkRecord(r));
  for (const r of ALL_REQUIREMENTS) {
    if (r.sendingCourse && !known.has(r.sendingCourse)) problems.push(`${r.id}: unknown Ohlone course ${r.sendingCourse}`);
  }
  for (const a of ALL_ARTICULATION) {
    if (a.relation !== 'officialArticulatesTo') problems.push(`${a.id}: articulation must be officialArticulatesTo`);
    if (!a.sourceId?.startsWith('assist-')) problems.push(`${a.id}: articulation must come from an ASSIST agreement`);
    for (const code of a.sending.flat()) if (!known.has(code)) problems.push(`${a.id}: unknown Ohlone course ${code}`);
  }

  // Study alignment: our mapping, never official
  for (const s of STUDY_ALIGNMENT) {
    const course = ohloneCourseByCode[s.code];
    if (!course) { problems.push(`study alignment: unknown course ${s.code}`); continue; }
    if (s.relation !== 'selfStudySupports') problems.push(`${s.code}: study alignment must be selfStudySupports`);
    if ('status' in s || 'sourceUrl' in s) problems.push(`${s.code}: a study mapping must not carry an official status or source`);
    const topics = Object.keys(s.topics);
    if (topics.join('|') !== course.topics.join('|')) problems.push(`${s.code}: alignment topics must list the catalog topics exactly, in order`);
    for (const units of Object.values(s.topics)) for (const u of units) if (!unitById[u]) problems.push(`${s.code}: unknown site unit ${u}`);
    for (const c of s.readiness) if (!courseById[c]) problems.push(`${s.code}: unknown site course ${c}`);
  }
  const aligned = new Set(STUDY_ALIGNMENT.map((s) => s.code));
  for (const c of OHLONE_COURSES) if (!aligned.has(c.code)) problems.push(`${c.code}: no study alignment`);

  return problems;
}

/** Counts for reports: records by status, sources by year. */
export function summarize() {
  const records = [...ALL_REQUIREMENTS, ...ALL_ARTICULATION];
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, records.filter((r) => r.status === s).length]));
  return { records: records.length, byStatus, articulation: ALL_ARTICULATION.length, noArticulation: ALL_ARTICULATION.filter((a) => a.sending.length === 0).length, sources: SOURCES.length };
}
