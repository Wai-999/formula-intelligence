import { OHLONE_COURSES, ohloneCourseByCode } from '../../data/college/ohloneCourses.js';
import { OHLONE_DS_AS, TARGET_REQUIREMENTS } from '../../data/college/requirements.js';
import { ARTICULATION, articulationFor } from '../../data/college/articulation.js';
import { studyAlignmentFor, studyCoverage } from '../../data/college/studyAlignment.js';
import { SOURCES, STATUS_LABEL, CHECKED, DISCLAIMER, sourceById } from '../../data/college/sources.js';
import { courseById, unitById } from '../../data/curriculum/catalog.js';
import { lessonById } from '../../data/curriculum/lessons/index.js';
import { useLearningStore } from '../../store/useLearningStore.js';
import { useStudyPlanStore } from '../../store/useStudyPlanStore.js';
import { hashFor } from '../../app/pages.js';
import '../../data/curriculum/index.js';
import '../../styles/studio.css';
import '../learn/learn.css';
import './majorPrep.css';

// Learn → Ohlone prep (V5.1 §7). Official facts (catalog, admission pages,
// ASSIST) and this site's self-study are kept visibly apart: every official
// claim shows its source, year and check date; every study link says it is
// study, not credit. The target only reorders and filters — it never
// changes what the facts are.

const TARGETS = [
  { id: 'sjsu', label: 'SJSU first', name: 'San José State University', short: 'SJSU', agreement: 'the SJSU agreement' },
  { id: 'csueb', label: 'CSU East Bay', name: 'CSU East Bay', short: 'CSU East Bay', agreement: 'the CSU East Bay agreement' },
  { id: 'uc', label: 'UC options', name: 'UC Davis and UC Merced', short: 'UC', agreement: 'the UC Davis or UC Merced agreements' },
];

// Study order per target: which Ohlone courses its published requirements
// lean on first. A provisional emphasis, explained on the page.
const PRIORITY = {
  sjsu: ['MATH-101A', 'CS-102', 'CS-116', 'CS-113', 'MATH-101B', 'CS-124', 'MATH-103', 'CS-108'],
  csueb: ['CS-102', 'CS-108', 'MATH-101A', 'CS-116', 'MATH-101B', 'CS-124'],
  uc: ['MATH-101A', 'CS-102', 'MATH-101B', 'CS-116', 'MATH-103', 'CS-124', 'MATH-101C', 'CS-113', 'CS-108'],
};

const STATUS_ICON = {
  'verified-current': ['studio-chip-ok', 'ti-circle-check'],
  'verified-prior-year': ['studio-chip-warn', 'ti-history'],
  candidate: ['studio-chip-accent', 'ti-book'],
  unverified: ['studio-chip-warn', 'ti-help-circle'],
};

function Status({ status }) {
  const [cls, icon] = STATUS_ICON[status];
  return <span className={`studio-chip ${cls}`}><i className={`ti ${icon}`} aria-hidden="true" /> {STATUS_LABEL[status]}</span>;
}

function SourceLine({ sourceId }) {
  const s = sourceById[sourceId];
  return (
    <span className="prep-source">
      Source: <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> · {s.academicYear ?? 'no year stated'} · checked {s.accessedAt}
    </span>
  );
}

const campus = (a) => (a.group.includes(' — ') ? `${a.group.split(' — ')[0]} ` : '');

/** The first written lesson, in target priority order, that is not finished yet. */
function nextStudy(target, lessons) {
  for (const code of PRIORITY[target]) {
    for (const t of studyCoverage(code).topics) {
      const id = t.lessons.find((l) => !lessons[l]?.completed);
      if (id) return { code, lessonId: id };
    }
  }
  return null;
}

function CourseRow({ code, target, lessons }) {
  const c = ohloneCourseByCode[code];
  const t = TARGETS.find((x) => x.id === target);
  const matches = articulationFor(target, code);
  const cov = studyCoverage(code);
  const align = studyAlignmentFor[code];
  const studyLessons = [...new Set(cov.topics.flatMap((x) => x.lessons))];
  const done = studyLessons.filter((l) => lessons[l]?.completed).length;

  return (
    <li>
      <details className="prep-course">
        <summary>
          <span className="prep-course-title"><strong>{c.code}</strong> {c.title} <span className="studio-muted">· {c.units} units</span></span>
          <span className="studio-row prep-chips">
            {matches.length > 0
              ? matches.slice(0, 2).map((a) => <span key={a.id} className="studio-chip studio-chip-ok"><i className="ti ti-arrow-right" aria-hidden="true" /> {campus(a)}{a.receivingCourse.split(' ').slice(0, 2).join(' ')}{a.sending.some((all) => all.length > 1) ? ' (with another course)' : ''}</span>)
              : <span className="studio-chip">Not in {t.agreement}</span>}
            <span className="studio-chip">{cov.written} lesson{cov.written === 1 ? '' : 's'} written here · {cov.planned} planned</span>
          </span>
        </summary>

        <div className="prep-course-body">
          <h4 className="studio-h3">Ohlone catalog, 2026–2027</h4>
          <ul className="lesson-ul">
            <li>Prerequisite: {c.prerequisite ?? 'none listed'}{c.advisory ? `. Advisory: ${c.advisory}` : ''}.</li>
            <li>Offered: {c.offered}. Accepted for credit at: {c.transferable} — transferable credit, which is not the same as counting toward a major.</li>
            {c.cid && <li>C-ID: {c.cid}.</li>}
            {c.note && <li>{c.note}</li>}
          </ul>
          <SourceLine sourceId={c.source} />

          <h4 className="studio-h3">Official equivalence at {t.name}</h4>
          {matches.length === 0 ? (
            <p className="studio-muted">
              {code} is not used to meet any course in {t.agreement} recorded here.
              That says nothing about its value for the Ohlone degree or for general transfer units.
            </p>
          ) : (
            <ul className="prep-list">
              {matches.map((a) => (
                <li key={a.id}>
                  <span><strong>{campus(a)}{a.receivingCourse}</strong> ← Ohlone {a.sendingCourse}</span>
                  <Status status={a.status} />
                  {a.notes && <span className="studio-muted">{a.notes}</span>}
                  <SourceLine sourceId={a.sourceId} />
                </li>
              ))}
            </ul>
          )}

          <h4 className="studio-h3">Study for it here <span className="studio-muted">(self-study — no credit)</span></h4>
          <p className="studio-muted">
            Readiness first: {align.readiness.map((r, i) => <span key={r}>{i ? ', ' : ''}<a href={hashFor('learn/course', { courseId: r })}>{courseById[r].title}</a></span>)}.
            {` ${cov.taught} of the ${cov.total} catalog topics have at least one written lesson here; ${cov.planned} more lessons are planned.`}
            {studyLessons.length > 0 && ` You have completed ${done} of the ${studyLessons.length} written.`}
          </p>
          <ul className="prep-topics">
            {cov.topics.map((x) => (
              <li key={x.topic} className={`is-${x.status}`}>
                <span className="prep-topic">{x.topic}</span>
                {x.status === 'taught' && (
                  <span>{x.lessons.map((l, i) => <span key={l}>{i ? ' · ' : ''}<a href={hashFor('learn/lesson', { lessonId: l })}>{lessonById[l].title}</a>{lessons[l]?.completed ? ' ✓' : ''}</span>)}</span>
                )}
                {x.status === 'outline' && (
                  <span className="studio-muted">Outline only: {x.units.map((u) => unitById[u].title).join('; ')}</span>
                )}
                {x.status === 'none' && <span className="studio-muted">Not taught on this site.</span>}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}

export default function MajorPrepPage() {
  const target = useStudyPlanStore((s) => s.target);
  const setTarget = useStudyPlanStore((s) => s.setTarget);
  const lessons = useLearningStore((s) => s.lessons);
  const t = TARGETS.find((x) => x.id === target);
  const next = nextStudy(target, lessons);
  const core = OHLONE_DS_AS.filter((r) => r.requirementType === 'major-core');
  const support = OHLONE_DS_AS.filter((r) => r.requirementType === 'supporting-choose-two');
  const rules = OHLONE_DS_AS.filter((r) => r.requirementType === 'degree-rule' || r.requirementType === 'program-type');
  const byPriority = (a, b) => {
    const pa = PRIORITY[target].indexOf(a.sendingCourse);
    const pb = PRIORITY[target].indexOf(b.sendingCourse);
    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
  };
  const groups = [...new Set(ARTICULATION[target].map((a) => a.group))];

  return (
    <div className="studio-scroll">
      <div className="studio-page prep">
        <p className="studio-callout prep-disclaimer" role="note"><i className="ti ti-info-circle" aria-hidden="true" /> {DISCLAIMER}</p>

        <section className="studio-section" aria-labelledby="prep-target">
          <h2 id="prep-target" className="studio-h2">Ohlone Data Science A.S., with an eye on transfer</h2>
          <p className="studio-muted studio-read">
            Study for the Ohlone courses in the Data Science A.S. and see what each target university asks for. Official facts carry their source, year and
            the date they were checked ({CHECKED}); study links are self-study only. Choosing a target changes the order and the comparisons — never the facts.
          </p>
          <fieldset className="prep-targets">
            <legend className="studio-eyebrow">Compare with</legend>
            {TARGETS.map((x) => (
              <label key={x.id} className={target === x.id ? 'on' : ''}>
                <input type="radio" name="prep-target" value={x.id} checked={target === x.id} onChange={() => setTarget(x.id)} />
                {x.label}
              </label>
            ))}
          </fieldset>
          {next ? (
            <div className="studio-callout prep-next">
              <p className="studio-eyebrow">Your next study step for {t.short}</p>
              <p>Preparing for <strong>{next.code}</strong>: {lessonById[next.lessonId].title}</p>
              <a className="studio-btn studio-btn-primary" href={hashFor('learn/lesson', { lessonId: next.lessonId })}>Open the lesson</a>
              <span className="studio-muted"> Not sure where your math stands? <a href={hashFor('learn/placement')}>Take the placement check</a> — a study suggestion, not Ohlone’s placement.</span>
            </div>
          ) : (
            <p className="studio-callout">Every written lesson aligned with these courses is complete. New lessons appear as they are written.</p>
          )}
        </section>

        <section className="studio-section" aria-labelledby="prep-core">
          <h2 id="prep-core" className="studio-h2">Major core — required <span className="studio-muted">(25 units)</span></h2>
          <ul className="prep-courses">{[...core].sort(byPriority).map((r) => <CourseRow key={r.id} code={r.sendingCourse} target={target} lessons={lessons} />)}</ul>
          <h2 className="studio-h2">Supporting courses — choose two <span className="studio-muted">(7–10 units)</span></h2>
          <p className="studio-muted">Listed as CNET-142 or CS-142, CS-113, CS-118, CS-150, MATH-101C, MATH-103 and MATH-104.</p>
          <ul className="prep-courses">{[...support].sort(byPriority).map((r) => <CourseRow key={r.id} code={r.sendingCourse} target={target} lessons={lessons} />)}</ul>
          <details className="lesson-disclosure">
            <summary>Degree requirements</summary>
            <ul className="lesson-ul">{rules.map((r) => <li key={r.id}>{r.notes}</li>)}</ul>
            <SourceLine sourceId="ohlone-catalog-2026-27" />
          </details>
        </section>

        <section className="studio-section" aria-labelledby="prep-uni">
          <h2 id="prep-uni" className="studio-h2">What {t.name} {target === 'uc' ? 'ask' : 'asks'} for</h2>
          <ul className="prep-list">
            {TARGET_REQUIREMENTS[target].map((r) => (
              <li key={r.id}>
                <span><strong>{r.receivingCourse}</strong> <span className="studio-muted">— {r.institution}, {r.major}</span></span>
                <Status status={r.status} />
                {r.notes && <span className="studio-muted">{r.notes}</span>}
                <SourceLine sourceId={r.sourceId} />
              </li>
            ))}
          </ul>
          <details className="lesson-disclosure">
            <summary>Course-by-course ASSIST agreement{target === 'uc' ? 's' : ''}: which Ohlone course counts for each university course</summary>
            {groups.map((g) => (
              <div key={g} className="prep-agreement">
                <h4 className="studio-h3">{g}</h4>
                <ul className="prep-list">
                  {ARTICULATION[target].filter((a) => a.group === g).map((a) => (
                    <li key={a.id}>
                      <span><strong>{a.receivingCourse}</strong> ← {a.sendingCourse ? `Ohlone ${a.sendingCourse}` : <em>No Ohlone course articulated</em>}</span>
                      <Status status={a.status} />
                      {a.notes && <span className="studio-muted">{a.notes}</span>}
                    </li>
                  ))}
                </ul>
                <SourceLine sourceId={ARTICULATION[target].find((a) => a.group === g).sourceId} />
              </div>
            ))}
          </details>
        </section>

        <section className="studio-section" aria-labelledby="prep-plan">
          <h2 id="prep-plan" className="studio-h2">Planning notes</h2>
          <details className="lesson-disclosure" open>
            <summary>Which two supporting courses? A provisional view</summary>
            {target === 'sjsu' && <p className="lesson-p">For SJSU, <strong>CS-113</strong> and <strong>MATH-103</strong> are worth investigating first: the 2026–2027 ASSIST agreement matches them to SJSU MATH 42 (on SJSU’s Fall 2027 ranking list) and MATH 39 (preparation for the major).</p>}
            {target === 'csueb' && <p className="lesson-p">No supporting course is matched to a CSU East Bay Data Science course in the 2026–2027 agreement — only CS-102 (to CS 100) is. Choose with your other targets in mind, and ask CSU East Bay advising about DATA 105, DATA 130, DATA 205 and STAT 215, which have no Ohlone match.</p>}
            {target === 'uc' && <p className="lesson-p">For UC, <strong>MATH-101C</strong> and <strong>MATH-103</strong> deserve priority: the UC pathway expects multivariable calculus and linear algebra; UC Davis matches MATH-103 to MAT 022A and needs MATH-101C to complete its calculus sequence; UC Merced matches MATH-103 with MATH-104 to MATH 024.</p>}
            <p className="studio-muted">Two supporting courses complete the A.S.; they do not exhaust transfer preparation. Confirm every choice with a counselor.</p>
          </details>
          <details className="lesson-disclosure">
            <summary>Prerequisite chains (Ohlone catalog)</summary>
            <ul className="lesson-ul">
              <li>MATH-100 (or placement) → MATH-101A → MATH-101B → MATH-101C, MATH-103 or MATH-104</li>
              <li>CS-102 → CS-116 → CS-124; CS-102 → CS-113; CS-102 → CS-118</li>
              <li>CS-102, CS-142 or CNET-142 → CS-150; CS-108 lists no prerequisite</li>
            </ul>
            <p className="studio-muted">Your actual first math course depends on Ohlone’s own placement process, not on this site.</p>
          </details>
          <details className="lesson-disclosure">
            <summary>Working 30–40 hours a week</summary>
            <p className="lesson-p">
              A semester unit is usually planned as about three hours of work a week, in and out of class — so 8–11 units is roughly 24–33 hours a week on top of your job.
              Treat 8–11 units as a provisional load to discuss with a counselor, and avoid three heavy STEM courses in one term (for example calculus, a C++ course and linear algebra together) unless your hours allow it.
            </p>
            <p className="studio-muted">Your Monday–Wednesday preference is noted as a preference only: the Spring 2027 class schedule (days, modality, seats) has not been checked here. Use Ohlone’s official class schedule.</p>
          </details>
          <details className="lesson-disclosure">
            <summary>General education and what this site does not cover</summary>
            <ul className="lesson-ul">
              <li>The A.S. needs Ohlone or Cal-GETC general education; transfer needs its own GE pattern. This site teaches none of it.</li>
              <li>SJSU strongly recommends a second English composition course before transfer (see its agreement).</li>
              <li>CS-118 (assembly language) is not taught here.</li>
              <li>Study hours shown in Learn are estimates for self-study, not accredited semester units.</li>
            </ul>
          </details>
        </section>

        <section className="studio-section" aria-labelledby="prep-sources">
          <h2 id="prep-sources" className="studio-h2">Sources and next steps</h2>
          <p className="lesson-p">
            Before you enroll or apply, confirm with an <a href="https://www.ohlone.edu/counseling-department" target="_blank" rel="noopener noreferrer">Ohlone counselor</a> and
            check the latest agreements on <a href="https://assist.org/" target="_blank" rel="noopener noreferrer">ASSIST</a>. Agreements and requirements change every year;
            a record checked on {CHECKED} can be out of date by the time you read it.
          </p>
          <ul className="prep-list">
            {SOURCES.filter((s) => s.kind !== 'advising').map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
                <span className="studio-muted">{s.institution} · {s.academicYear ?? 'no academic year stated'} · checked {s.accessedAt}</span>
              </li>
            ))}
          </ul>
          <p className="studio-muted">{OHLONE_COURSES.length} Ohlone courses described · statuses: {Object.values(STATUS_LABEL).join(' / ')}.</p>
        </section>
      </div>
    </div>
  );
}
