import MathText, { MathBlock } from './MathText.jsx';
import SayIt from './SayIt.jsx';
import './FormulaBreakdown.css';

/**
 * A curriculum formula (src/data/curriculum/formulas.js) broken into its
 * parts: the formula, how to read it aloud, and a row for each symbol with
 * how to say it, what it means and its units.
 */
export default function FormulaBreakdown({ formula }) {
  const vars = formula.variables ?? [];
  return (
    <>
      <MathBlock tex={formula.latex} label={formula.title} />
      <SayIt text={formula.say} />
      {vars.length > 0 && (
        <div className="formula-symbols-wrap">
          <table className="formula-symbols">
            <caption>Each symbol in this formula</caption>
            <thead>
              <tr><th scope="col">Symbol</th><th scope="col">Say it</th><th scope="col">Meaning</th></tr>
            </thead>
            <tbody>
              {vars.map((v) => (
                <tr key={v.symbol}>
                  <th scope="row"><MathText text={`$${v.symbol}$`} /></th>
                  <td><SayIt text={v.say} compact label={false} /></td>
                  <td>
                    <MathText text={v.meaning} />
                    {v.units && <span className="formula-symbols-units"> ({v.units})</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
