import { sourceById } from './sources.js';

// Official requirements (V5.1 §2 record structure): what Ohlone's Data
// Science A.S. requires, and what each target university's Data Science
// major asks transfer students to complete. relation: 'officialRequirement'.
//
// Every record carries institution, major, requirementType, sendingCourse,
// receivingCourse, academicYear, status, sourceUrl, sourceTitle, accessedAt
// and notes. The source fields come from ./sources.js, so a record can only
// claim what a registered source says. Validated by
// scripts/validate-college-data.mjs (and the unit tests).

function R(sourceId, fields) {
  const s = sourceById[sourceId];
  return {
    relation: 'officialRequirement',
    sendingCourse: null,
    receivingCourse: null,
    notes: '',
    status: 'verified-current',
    academicYear: s?.academicYear ?? null,
    sourceId,
    sourceUrl: s?.url ?? null,
    sourceTitle: s?.title ?? null,
    accessedAt: s?.accessedAt ?? null,
    ...fields,
  };
}

const OHLONE = { institution: 'Ohlone College', major: 'Data Science, A.S.' };
const ohlone = (id, fields) => R('ohlone-catalog-2026-27', { id, ...OHLONE, ...fields });

export const OHLONE_DS_AS = [
  ...['CS-102', 'CS-108', 'CS-116', 'CS-124', 'MATH-101A', 'MATH-101B'].map((code) => ohlone(`ohlone.core.${code}`, { requirementType: 'major-core', sendingCourse: code })),
  ...['CS-142', 'CS-113', 'CS-118', 'CS-150', 'MATH-101C', 'MATH-103', 'MATH-104'].map((code) => ohlone(`ohlone.support.${code}`, {
    requirementType: 'supporting-choose-two',
    sendingCourse: code,
    notes: code === 'CS-142' ? 'Listed as “CNET-142 or CS-142”.' : '',
  })),
  ohlone('ohlone.rule.grades', { requirementType: 'degree-rule', notes: 'Major field and supporting courses completed with a grade of C or better.' }),
  ohlone('ohlone.rule.ge', { requirementType: 'degree-rule', notes: 'Ohlone College or Cal-GETC general education requirements.' }),
  ohlone('ohlone.rule.units', { requirementType: 'degree-rule', notes: 'At least 60 degree-applicable units with a 2.0 grade point average, at least 12 of them at Ohlone.' }),
  ohlone('ohlone.rule.total', { requirementType: 'degree-rule', notes: 'Major: 25 core units plus two supporting courses (7–10 units), 32–35 units in all.' }),
  ohlone('ohlone.rule.type', { requirementType: 'program-type', notes: 'The catalog lists an Associate in Science in Data Science — not an Associate Degree for Transfer (AS-T), so it carries no AS-T admission advantage.' }),
];

const SJSU = { institution: 'San José State University', major: 'Data Science, B.S.' };
const CSUEB = { institution: 'California State University, East Bay', major: 'Data Science, B.S.' };
const UCD = { institution: 'University of California, Davis', major: 'Data Science, B.S.' };
const UCM = { institution: 'University of California, Merced', major: 'Data Science and Computing, B.S.' };
const UC = { institution: 'University of California (systemwide)', major: 'Data Science Transfer Pathway' };

export const TARGET_REQUIREMENTS = {
  sjsu: [
    ...[
      ['MATH 30', 'Calculus I'],
      ['MATH 31', 'Calculus II'],
      ['MATH 42', 'Discrete Mathematics'],
      ['CS 46A', 'Introduction to Programming'],
      ['CS 46B or CS 22A', 'Introduction to Data Structures, or Python for Everyone'],
    ].map(([code, title]) => R('sjsu-impaction-fall-2027', {
      id: `sjsu.impaction.${code}`, ...SJSU, requirementType: 'impaction-coursework', receivingCourse: `${code} (${title})`,
      notes: 'Transfer applicants are ranked by GPA and by how many of these courses are complete (grade C or higher) — for Fall 2027 admission, by the end of Spring 2027.',
    })),
  ],
  csueb: [
    ...[
      ['CS 100', 'Programming for Everyone', 3],
      ['DATA 105', 'Math for Data Science 1', 5],
      ['DATA 130', 'Data Science Profession', 2],
      ['STAT 215', 'Introduction to Data Science', 3],
    ].map(([code, title, units]) => R('csueb-catalog-ds-2026-27', {
      id: `csueb.core.${code}`, ...CSUEB, requirementType: 'lower-division-core', receivingCourse: `${code} (${title}, ${units} units)`,
      notes: 'The catalog advises community-college students to finish the lower-division requirements before transferring.',
    })),
    R('csueb-catalog-ds-2026-27', {
      id: 'csueb.core.MATH 205', ...CSUEB, requirementType: 'upper-core', receivingCourse: 'MATH 205 (Math for Data Science 2, 3 units)',
      notes: 'Listed in the catalog’s advanced core; the 2026–2027 ASSIST agreement lists it as DATA 205 in the lower-division core.',
    }),
  ],
  uc: [
    ...[
      ['STA 035A, 035B and 035C', 'Statistical Data Science I–III'],
      ['MAT 021A, 021B and 021C', 'Calculus'],
      ['MAT 022A, MAT 067, MAT 027A or BIS 027A', 'one linear algebra course'],
      ['ECS 017 or ECS 020', 'Data, Logic & Computing, or Discrete Mathematics for Computer Science'],
      ['ECS 032A or ECS 036A', 'Introduction to Programming, or Programming & Problem Solving'],
      ['ECS 032B or ECS 036C', 'Introduction to Data Structures, or Data Structures, Algorithms & Programming'],
    ].map(([code, title]) => R('ucd-catalog-ds-2026-27', {
      id: `ucd.prep.${code}`, ...UCD, requirementType: 'preparatory-subject-matter', receivingCourse: `${code} (${title})`,
      notes: code.startsWith('ECS') ? 'The catalog says ECS 020, 036A and 036C are not usually available to Data Science majors at UC Davis; those enrolled there take ECS 017, 032A and 032B.' : '',
    })),
    R('ucm-major-prep-fall-2027', { id: 'ucm.prep.1-59', ...UCM, requirementType: 'major-preparation', receivingCourse: 'MATH 011 or MATH 021, and MATH 012 or MATH 022', notes: 'For applicants with 1–59 units, Fall 2027.' }),
    R('ucm-major-prep-fall-2027', { id: 'ucm.prep.60+', ...UCM, requirementType: 'major-preparation', receivingCourse: 'MATH 011 or MATH 021, MATH 012 or MATH 022, and MATH 024', notes: 'For applicants with 60 or more units, Fall 2027. The 2025–2026 ASSIST agreement (Applied Mathematics emphasis) also accepts MATH 041 in place of MATH 024 and requires a 2.8 transferable GPA.' }),
    ...['Introductory data science/statistics', 'Single-variable calculus (full sequence)', 'Multivariable calculus (one semester)', 'Linear algebra (one course)', 'Computer programming (two courses)'].map((topic) => R('uc-ds-transfer-pathway', {
      id: `uc.pathway.${topic}`, ...UC, requirementType: 'pathway-expectation', receivingCourse: topic, status: 'unverified',
      notes: 'The UC page states no academic year, and says minimum GPA and grade requirements vary by campus — check each campus.',
    })),
  ],
};

export const ALL_REQUIREMENTS = [...OHLONE_DS_AS, ...Object.values(TARGET_REQUIREMENTS).flat()];
