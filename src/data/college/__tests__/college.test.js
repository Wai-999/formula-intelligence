import { describe, it, expect } from 'vitest';
import { validateCollegeData, checkRecord, summarize } from '../validate.js';
import { ARTICULATION, articulationFor } from '../articulation.js';
import { OHLONE_DS_AS } from '../requirements.js';
import { studyCoverage, STUDY_ALIGNMENT } from '../studyAlignment.js';
import { sourceById } from '../sources.js';

// V5.1 §2 and §13.6: academic claims must be traceable to an official,
// dated source, and study mappings must never pass for official ones.

describe('college data', () => {
  it('is valid', () => {
    expect(validateCollegeData()).toEqual([]);
  });

  it('rejects a verified-current record without a source or a year', () => {
    const base = { id: 't', institution: 'X', major: 'Y', requirementType: 'articulation', sendingCourse: 'CS-102', receivingCourse: 'Z', status: 'verified-current', sourceTitle: 't', accessedAt: '2026-10-24', notes: '', relation: 'officialArticulatesTo' };
    expect(checkRecord({ ...base, sourceUrl: null, academicYear: '2026-2027' }).join(' ')).toMatch(/official source URL/);
    expect(checkRecord({ ...base, sourceUrl: 'https://assist.org/', academicYear: null }).join(' ')).toMatch(/needs an academic year/);
    expect(checkRecord({ ...base, sourceUrl: 'https://assist.org/', academicYear: '2024-2025' }).join(' ')).toMatch(/not a current year/);
    expect(checkRecord({ ...base, sourceUrl: 'https://example.com/', academicYear: '2026-2027' }).join(' ')).toMatch(/official source URL/);
    expect(checkRecord({ ...base, sourceUrl: 'https://assist.org/', academicYear: '2026-2027' })).toEqual([]);
  });

  it('never lets a study mapping or a credit claim pose as official', () => {
    const r = { id: 't', institution: 'X', major: 'Y', requirementType: 'r', sendingCourse: null, receivingCourse: null, status: 'unverified', sourceUrl: null, sourceTitle: null, academicYear: null, accessedAt: null, notes: '' };
    expect(checkRecord({ ...r, relation: 'selfStudySupports' }).join(' ')).toMatch(/official record must have relation/);
    expect(checkRecord({ ...r, relation: 'officialRequirement', earnedCollegeCredit: true }).join(' ')).toMatch(/never records earned college credit/);
    for (const s of STUDY_ALIGNMENT) {
      expect(s.relation).toBe('selfStudySupports');
      expect(s).not.toHaveProperty('status');
    }
  });

  it('records the 2026–2027 SJSU agreement as read, including what does NOT articulate', () => {
    expect(articulationFor('sjsu', 'CS-116').map((a) => a.receivingCourse)).toEqual(['CS 46A Introduction to Programming']);
    expect(articulationFor('sjsu', 'CS-102')).toEqual([]);
    expect(articulationFor('sjsu', 'CS-113').map((a) => a.receivingCourse)).toEqual(['MATH 42 Discrete Mathematics']);
    expect(ARTICULATION.sjsu.find((a) => a.receivingCourse.startsWith('CS 48')).sending).toEqual([]);
    expect(ARTICULATION.sjsu.every((a) => a.status === 'verified-current' && a.academicYear === '2026-2027')).toBe(true);
  });

  it('marks an older agreement as an earlier year, never as current', () => {
    const merced = ARTICULATION.uc.filter((a) => a.sourceId === 'assist-ohlone-ucm-dsc-2025-26');
    expect(merced.length).toBeGreaterThan(0);
    expect(merced.every((a) => a.status === 'verified-prior-year' && a.academicYear === '2025-2026')).toBe(true);
    expect(sourceById['uc-ds-transfer-pathway'].academicYear).toBeNull();
  });

  it('lists the Ohlone Data Science A.S. as the 2026–2027 catalog does', () => {
    const core = OHLONE_DS_AS.filter((r) => r.requirementType === 'major-core').map((r) => r.sendingCourse);
    expect(core).toEqual(['CS-102', 'CS-108', 'CS-116', 'CS-124', 'MATH-101A', 'MATH-101B']);
    expect(OHLONE_DS_AS.filter((r) => r.requirementType === 'supporting-choose-two')).toHaveLength(7);
    expect(OHLONE_DS_AS.find((r) => r.requirementType === 'program-type').notes).toMatch(/not an Associate Degree for Transfer/);
  });

  it('computes honest study coverage: written lessons, outlines and gaps', () => {
    const calc = studyCoverage('MATH-101A');
    expect(calc.total).toBe(6);
    expect(calc.topics.find((t) => t.topic.startsWith('Limits')).status).toBe('taught');
    const asm = studyCoverage('CS-118');
    expect(asm.taught).toBe(0);
    expect(asm.topics.every((t) => t.status === 'none')).toBe(true);
    expect(summarize().byStatus['verified-current']).toBeGreaterThan(30);
  });
});
