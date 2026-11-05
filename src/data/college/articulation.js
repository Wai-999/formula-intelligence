import { sourceById } from './sources.js';

// Official course articulation from ASSIST (V5.1 §2, §13.6):
// relation 'officialArticulatesTo'. Each record says which Ohlone course(s)
// ASSIST accepts for one university course, in one academic year — or that
// no Ohlone course is articulated. Copied from the agreements read on
// 2026-10-24; never inferred from course titles or content.
//
//   sending   alternatives, each a list of Ohlone courses that must ALL be
//             taken: [['MATH-103', 'MATH-104']] means "MATH-103 and
//             MATH-104"; [['CS-142'], ['CNET-142']] means "either"; []
//             means no course articulated.
//
// UC Merced's newest agreement on ASSIST was 2025–2026 when checked, so its
// records are 'verified-prior-year' and the page says so.

/** Ohlone courses that appear in agreements but are not described in ./ohloneCourses.js. */
export const OTHER_OHLONE_CODES = ['CNET-142', 'CS-125', 'CS-170', 'ENGL-C1001', 'ENGL-C1002'];

function A(sourceId, base, receivingCourse, sending, fields = {}) {
  const s = sourceById[sourceId];
  return {
    id: `${sourceId}:${receivingCourse}`,
    relation: 'officialArticulatesTo',
    requirementType: 'articulation',
    ...base,
    receivingCourse,
    sending,
    sendingCourse: sending.length ? sending.map((all) => all.join(' and ')).join(' or ') : null,
    status: s?.academicYear === '2026-2027' ? 'verified-current' : 'verified-prior-year',
    academicYear: s?.academicYear ?? null,
    sourceId,
    sourceUrl: s?.url ?? null,
    sourceTitle: s?.title ?? null,
    accessedAt: s?.accessedAt ?? null,
    group: '',
    notes: '',
    ...fields,
  };
}

const SJSU = { institution: 'San José State University', major: 'Data Science, B.S.' };
const sjsu = (rc, sending, fields) => A('assist-ohlone-sjsu-ds-2026-27', SJSU, rc, sending, fields);

const CSUEB = { institution: 'California State University, East Bay', major: 'Data Science, B.S.' };
const csueb = (rc, sending, fields) => A('assist-ohlone-csueb-ds-2026-27', CSUEB, rc, sending, fields);

const UCD = { institution: 'University of California, Davis', major: 'Statistics, Mathematics and Computer Science department agreements' };
const ucd = (rc, sending, fields) => A('assist-ohlone-ucd-2026-27', UCD, rc, sending, fields);

const UCM = { institution: 'University of California, Merced', major: 'Data Science and Computing (Applied Mathematics Emphasis), B.S.' };
const ucm = (rc, sending, fields) => A('assist-ohlone-ucm-dsc-2025-26', UCM, rc, sending, fields);

export const ARTICULATION = {
  sjsu: [
    sjsu('MATH 30 Calculus I', [['MATH-101A']], { group: 'Preparation for the major' }),
    sjsu('MATH 31 Calculus II', [['MATH-101B']], { group: 'Preparation for the major' }),
    sjsu('MATH 39 Linear Algebra I', [['MATH-103']], { group: 'Preparation for the major' }),
    sjsu('MATH 42 Discrete Mathematics', [['CS-113']], { group: 'Preparation for the major' }),
    sjsu('CS 46A Introduction to Programming', [['CS-116']], { group: 'Lower-division core', notes: 'SJSU’s introductory programming course is matched by Ohlone’s second C++ course, CS-116 — not by CS-102.' }),
    sjsu('CS 46B Introduction to Data Structures', [['CS-124']], { group: 'Lower-division core' }),
    sjsu('CS 22A Python for Everyone', [['CNET-142'], ['CS-142']], { group: 'Major electives' }),
    sjsu('CS 47 Introduction to Computer Systems', [['CS-118']], { group: 'Major electives' }),
    sjsu('CS 48 Applied Algorithms', [], { group: 'Major electives' }),
    sjsu('CS 49J Programming in Java', [], { group: 'Major electives' }),
    sjsu('MATH 32 Calculus III', [['MATH-101C']], { group: 'Major electives' }),
    sjsu('ENGL 1B Argument and Analysis', [['ENGL-C1002'], ['ENGL-C1001']], { group: 'Second course in English composition', notes: 'SJSU strongly recommends a second composition course before transfer (general education).' }),
    sjsu('ENGL 2 Critical Thinking and Writing', [['ENGL-C1001']], { group: 'Second course in English composition' }),
  ],
  csueb: [
    csueb('CS 100 Programming for Everyone', [['CS-102']], { group: 'Lower-division core' }),
    csueb('DATA 105 Math for Data Science 1', [], { group: 'Lower-division core' }),
    csueb('DATA 130 Data Science Profession', [], { group: 'Lower-division core' }),
    csueb('DATA 205 Math for Data Science 2', [], { group: 'Lower-division core' }),
    csueb('STAT 215 Introduction to Data Science', [], { group: 'Lower-division core' }),
  ],
  uc: [
    ucd('MAT 021A Calculus', [['MATH-101A']], { group: 'UC Davis — mathematics' }),
    ucd('MAT 021A + MAT 021B Calculus', [['MATH-101A', 'MATH-101B']], { group: 'UC Davis — mathematics', notes: 'Articulates as a sequence only; complete the whole sequence at the same college before transfer.' }),
    ucd('MAT 021B Calculus (alone)', [], { group: 'UC Davis — mathematics' }),
    ucd('MAT 021B + MAT 021C Calculus', [['MATH-101B', 'MATH-101C']], { group: 'UC Davis — mathematics', notes: 'Articulates as a sequence only; complete the whole sequence at the same college before transfer.' }),
    ucd('MAT 022A Linear Algebra', [['MATH-103']], { group: 'UC Davis — mathematics' }),
    ucd('MAT 067 Modern Linear Algebra', [], { group: 'UC Davis — mathematics' }),
    ucd('STA 035A Statistical Data Science I', [], { group: 'UC Davis — statistics' }),
    ucd('STA 035B Statistical Data Science II', [], { group: 'UC Davis — statistics' }),
    ucd('STA 035C Statistical Data Science III', [], { group: 'UC Davis — statistics' }),
    ucd('STA 013 Elementary Statistics', [['STAT-C1000']], { group: 'UC Davis — statistics', notes: 'Not part of the Data Science preparatory list.' }),
    ucd('ECS 017 Data, Logic, & Computing', [], { group: 'UC Davis — computer science' }),
    ucd('ECS 020 Discrete Mathematics For Computer Science', [['CS-113']], { group: 'UC Davis — computer science' }),
    ucd('ECS 032A Introduction to Programming', [['CS-125']], { group: 'UC Davis — computer science', notes: 'CS-125 is Ohlone’s Introduction to Java Programming.' }),
    ucd('ECS 032B Introduction to Data Structures', [], { group: 'UC Davis — computer science' }),
    ucd('ECS 036A Programming & Problem Solving', [['CS-102']], { group: 'UC Davis — computer science' }),
    ucd('ECS 036B Software Development & Object-Oriented Programming in C++', [['CS-116'], ['CS-170']], { group: 'UC Davis — computer science' }),
    ucd('ECS 036C Data Structures, Algorithms, & Programming', [['CS-124']], { group: 'UC Davis — computer science' }),
    ucm('MATH 021 Calculus I for Physical Sciences & Engineering', [['MATH-101A']], { group: 'UC Merced — required for admission' }),
    ucm('MATH 022 Calculus II for Physical Sciences & Engineering', [['MATH-101B']], { group: 'UC Merced — required for admission' }),
    ucm('MATH 011 Calculus I', [], { group: 'UC Merced — required for admission' }),
    ucm('MATH 012 Calculus II', [], { group: 'UC Merced — required for admission' }),
    ucm('MATH 024 Linear Algebra and Differential Equations', [['MATH-103', 'MATH-104']], { group: 'UC Merced — required for admission' }),
    ucm('MATH 041 Matrix Analysis and Linear Algebra for Data Science', [], { group: 'UC Merced — required for admission' }),
    ucm('MATH 023 Vector Calculus', [['MATH-101C']], { group: 'UC Merced — recommended before transfer' }),
    ucm('DSC 008 Introduction to Data Science', [], { group: 'UC Merced — recommended before transfer' }),
    ucm('DSC 011 Introductory Computing & Statistical Programming', [], { group: 'UC Merced — recommended before transfer' }),
    ucm('MATH 032 Probability and Statistics', [], { group: 'UC Merced — recommended before transfer' }),
  ],
};

export const ALL_ARTICULATION = Object.values(ARTICULATION).flat();

/** The records in one target where an Ohlone course is (part of) an accepted way to meet the university course. */
export function articulationFor(target, ohloneCode) {
  return (ARTICULATION[target] ?? []).filter((a) => a.sending.some((all) => all.includes(ohloneCode)));
}
