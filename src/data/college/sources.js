// Official sources behind every academic claim on Learn → Ohlone prep
// (V5.1 §2, §13.6). One record per document actually read, with the
// academic year it applies to and the date it was read. Only official
// institutional pages and ASSIST appear here. Nothing on this site is an
// articulation, a placement or credit (docs/major-prep/ACADEMIC_EVIDENCE.md).
//
// Statuses (V5.1 §2):
//   verified-current     official source for the applicable academic year
//   verified-prior-year  official, but for an earlier year
//   candidate            related study topics; articulation not established
//   unverified           insufficient authoritative source

export const STATUSES = ['verified-current', 'verified-prior-year', 'candidate', 'unverified'];

export const STATUS_LABEL = {
  'verified-current': 'Verified · current year',
  'verified-prior-year': 'Verified · earlier year',
  candidate: 'Study match only',
  unverified: 'Not yet verified',
};

/** When these sources were read (the learner's local date). Re-check before each term. */
export const CHECKED = '2026-10-24';

const S = (id, fields) => ({ id, accessedAt: CHECKED, ...fields });

export const SOURCES = [
  S('ohlone-catalog-2026-27', {
    institution: 'Ohlone College',
    title: 'Ohlone College 2026–2027 Catalog — Curriculum Guides (Data Science, A.S.) and Announcement of Courses',
    url: 'https://www.ohlone.edu/catalog/20262027',
    academicYear: '2026-2027',
    kind: 'catalog',
    access: 'Read in a web browser (the catalog PDFs are not served to scripts).',
  }),
  S('ohlone-counseling', {
    institution: 'Ohlone College',
    title: 'Ohlone College Counseling Department',
    url: 'https://www.ohlone.edu/counseling-department',
    academicYear: null,
    kind: 'advising',
  }),
  S('assist-home', {
    institution: 'ASSIST',
    title: 'ASSIST — official transfer and articulation system for California public colleges and universities',
    url: 'https://assist.org/',
    academicYear: null,
    kind: 'advising',
  }),
  S('sjsu-impaction-fall-2027', {
    institution: 'San José State University',
    title: 'Transfer Impaction Criteria — Program Specific Coursework (page updated Aug 28, 2026)',
    url: 'https://www.sjsu.edu/admissions/impaction/program-supplemental-criteria/program-impaction-transfer-coursework.php',
    academicYear: 'Fall 2027 admission',
    kind: 'admission',
  }),
  S('assist-ohlone-sjsu-ds-2026-27', {
    institution: 'ASSIST',
    title: 'Ohlone College → San José State University, Data Science, B.S. — major articulation agreement, 2026–2027',
    url: 'https://assist.org/transfer/results?year=77&institution=48&agreement=39&agreementType=to&view=agreement&viewBy=major',
    academicYear: '2026-2027',
    kind: 'articulation',
    access: 'Opened through the ASSIST search page (choose Data Science, B.S. in the list).',
  }),
  S('csueb-catalog-ds-2026-27', {
    institution: 'California State University, East Bay',
    title: 'CSU East Bay 2026–2027 Catalog — Data Science, B.S.',
    url: 'https://catalog.csueastbay.edu/preview_program.php?catoid=44&poid=20685',
    academicYear: '2026-2027',
    kind: 'catalog',
  }),
  S('assist-ohlone-csueb-ds-2026-27', {
    institution: 'ASSIST',
    title: 'Ohlone College → CSU East Bay, Data Science, B.S. — major articulation agreement, 2026–2027',
    url: 'https://assist.org/transfer/results?year=77&institution=48&agreement=21&agreementType=to&view=agreement&viewBy=major',
    academicYear: '2026-2027',
    kind: 'articulation',
    access: 'Opened through the ASSIST search page (choose Data Science, B.S. in the list).',
  }),
  S('uc-ds-transfer-pathway', {
    institution: 'University of California',
    title: 'UC Transfer Pathways — Data Science',
    url: 'https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/uc-transfer-programs/transfer-pathways/data-science.html',
    academicYear: null,
    kind: 'admission',
    access: 'The page states no academic year, so its expectations are shown as not yet verified for a specific term.',
  }),
  S('ucd-catalog-ds-2026-27', {
    institution: 'University of California, Davis',
    title: 'UC Davis 2026–2027 General Catalog — Data Science, B.S. (Preparatory Subject Matter)',
    url: 'https://catalog.ucdavis.edu/departments-programs-degrees/statistics/data-science-bs/',
    academicYear: '2026-2027',
    kind: 'catalog',
  }),
  S('assist-ohlone-ucd-2026-27', {
    institution: 'ASSIST',
    title: 'Ohlone College → UC Davis — Statistics, Mathematics and Computer Science department agreements, 2026–2027',
    url: 'https://assist.org/transfer/results?year=77&institution=48&agreement=89&agreementType=to&view=agreement&viewBy=dept',
    academicYear: '2026-2027',
    kind: 'articulation',
    access: 'Opened through the ASSIST search page (UC Davis lists agreements by department).',
  }),
  S('ucm-major-prep-fall-2027', {
    institution: 'University of California, Merced',
    title: 'UC Merced Undergraduate Admissions — Major Preparation (Fall 2027 major preparation requirements and transfer selection)',
    url: 'https://admissions.ucmerced.edu/transfer/major-preparation-schools',
    academicYear: 'Fall 2027 admission',
    kind: 'admission',
  }),
  S('assist-ohlone-ucm-dsc-2025-26', {
    institution: 'ASSIST',
    title: 'Ohlone College → UC Merced, Data Science and Computing (Applied Mathematics Emphasis), B.S. — major articulation agreement, 2025–2026 (the latest ASSIST offered on 2026-10-24)',
    url: 'https://assist.org/transfer/results?year=76&institution=48&agreement=144&agreementType=to&view=agreement&viewBy=major',
    academicYear: '2025-2026',
    kind: 'articulation',
    access: 'Opened through the ASSIST search page.',
  }),
];

export const sourceById = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
