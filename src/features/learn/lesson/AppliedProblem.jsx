import { useState } from 'react';
import MathText from '../../../components/math/MathText.jsx';
import ItemCard from './ItemCard.jsx';
import { PROBLEM_DOMAINS } from '../../../data/curriculum/problems.js';

/**
 * One real-world problem from the bank (src/data/curriculum/problems.js): the
 * situation and the decision, an honest label on where the numbers come from,
 * the variables, units and assumptions on demand, and graded steps. Steps are
 * ItemCards, so the first attempt is the evidence and a hint makes it count as
 * assisted. The worked solution, common mistakes and interpretation appear
 * only once every step has been tried: reading an answer is not solving it.
 */
export default function AppliedProblem({ problem }) {
  const [tried, setTried] = useState(() => new Set());
  const allTried = tried.size === problem.items.length;
  const base = `problem-${problem.id.replace(/[^a-z0-9]+/gi, '-')}`;
  return (
    <article className="applied-problem" aria-labelledby={`${base}-h`}>
      <p className="studio-eyebrow">Real-world problem · {PROBLEM_DOMAINS[problem.domain]}</p>
      <h3 id={`${base}-h`} className="studio-h3">{problem.title}</h3>
      <MathText as="p" className="lesson-p" text={problem.scenario} />
      <p className="applied-question"><strong>The decision:</strong> <MathText text={problem.question} /></p>
      <p className="applied-data">
        <i className="ti ti-info-circle" aria-hidden="true" />{' '}
        {problem.data.kind === 'synthetic'
          ? <>Invented numbers, not measured data. <MathText text={problem.data.note} /></>
          : <>Data: <a href={problem.data.url} target="_blank" rel="noopener noreferrer">{problem.data.source}</a> ({problem.data.license}).</>}
      </p>
      <details className="lesson-disclosure">
        <summary>Variables, units and assumptions</summary>
        <div className="applied-table">
          <table className="applied-vars">
            <caption className="visually-hidden">Variables of “{problem.title}”</caption>
            <thead><tr><th scope="col">Quantity</th><th scope="col">Value</th><th scope="col">Units</th></tr></thead>
            <tbody>
              {problem.variables.map((v) => (
                <tr key={v.name}>
                  <th scope="row"><MathText text={v.name} /></th>
                  <td><MathText text={String(v.value)} /></td>
                  <td>{v.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="studio-muted">Units used: {problem.units.join(', ')}.</p>
        <h4 className="studio-h3">Assumptions</h4>
        <ul className="lesson-ul">{problem.assumptions.map((a) => <li key={a}><MathText text={a} /></li>)}</ul>
      </details>
      {problem.items.map((it, i) => (
        <ItemCard key={it.id} item={it} index={i} source="applied" onFirstAttempt={(id) => setTried((s) => new Set(s).add(id))} />
      ))}
      {allTried ? (
        <div className="applied-after">
          <h4 className="studio-h3">Worked solution</h4>
          <ol className="lesson-steps compact">{problem.solution.map((s) => <li key={s}><MathText text={s} /></li>)}</ol>
          <p><strong>Why it works.</strong> <MathText text={problem.explanation} /></p>
          <h4 className="studio-h3">Common mistakes</h4>
          <ul className="lesson-ul">{problem.commonMistakes.map((m) => <li key={m}><MathText text={m} /></li>)}</ul>
          <p><strong>What it means.</strong> <MathText text={problem.interpretation} /></p>
          <p><strong>Take it further.</strong> <MathText text={problem.extension} /></p>
        </div>
      ) : (
        <p className="studio-muted">Try every step first. The worked solution, the common mistakes and what the answer means for the decision appear once you have.</p>
      )}
      <p className="studio-muted applied-review">Draft problem, awaiting independent math review like the lessons.</p>
    </article>
  );
}
