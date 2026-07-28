import PyCodeBlock from './PyCodeBlock.jsx';

function Pill({ icon, tone, children }) {
  return (
    <span className={`pyentry-pill pyentry-pill-${tone}`}>
      <i className={`ti ${icon}`} aria-hidden="true" /> {children}
    </span>
  );
}

function SectionHead({ icon, tone, children }) {
  return (
    <p className={`pyentry-sechead pyentry-sechead-${tone}`}>
      <i className={`ti ${icon}`} aria-hidden="true" /> {children}
    </p>
  );
}

// One formula/model. Fully data-driven from the entry schema in
// src/data/python/ — this component renders whichever sections the entry
// provides and silently skips the rest, so simple formulas and deep model
// entries share one renderer.
export default function PyEntry({ entry, open, onToggle, innerRef }) {
  const { thinking, scenario } = entry;
  return (
    <article className={`pyentry ${open ? 'open' : ''}`} ref={innerRef}>
      <button type="button" className="pyentry-header" onClick={onToggle} aria-expanded={open}>
        <i className={`ti ${open ? 'ti-chevron-down' : 'ti-chevron-right'} pyentry-caret`} aria-hidden="true" />
        <span className="pyentry-name">{entry.name}</span>
        {entry.formula && <code className="pyentry-formula-chip">{entry.formula}</code>}
        <span className="pyentry-grouplbl">{entry.groupLabel}</span>
      </button>

      {open && (
        <div className="pyentry-body">
          {/* 1 — Overview */}
          <section className="pyentry-sec pyentry-sec-concept">
            <SectionHead icon="ti-bulb" tone="concept">Overview</SectionHead>
            <p className="pyentry-text">{entry.overview}</p>
          </section>

          {/* 2 — Formula → variables (the formula-to-code mapping, top half) */}
          {entry.variables?.length > 0 && (
            <section className="pyentry-sec pyentry-sec-concept">
              <SectionHead icon="ti-math-function" tone="concept">Mathematical Formula → Variables</SectionHead>
              {entry.formula && <div className="pyentry-formula-big">{entry.formula}</div>}
              <table className="pyentry-vars">
                <tbody>
                  {entry.variables.map(([sym, meaning]) => (
                    <tr key={sym}>
                      <td className="pyentry-var-sym">{sym}</td>
                      <td className="pyentry-var-meaning">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* 3 — Thinking process */}
          {thinking && (
            <section className="pyentry-sec pyentry-sec-think">
              <SectionHead icon="ti-brain" tone="think">Thinking Process — how a data scientist decides</SectionHead>
              {thinking.workflow?.length > 0 && (
                <div className="pyentry-flow">
                  {thinking.workflow.map((step, i) => (
                    <div className="pyentry-flow-step" key={step}>
                      {i > 0 && <i className="ti ti-arrow-down pyentry-flow-arrow" aria-hidden="true" />}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="pyentry-think-grid">
                {thinking.when?.length > 0 && (
                  <div className="pyentry-think-card">
                    <Pill icon="ti-circle-check" tone="ok">Use it when</Pill>
                    <ul>{thinking.when.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
                {thinking.notWhen?.length > 0 && (
                  <div className="pyentry-think-card">
                    <Pill icon="ti-circle-x" tone="bad">Not when</Pill>
                    <ul>{thinking.notWhen.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
                {thinking.assumptions?.length > 0 && (
                  <div className="pyentry-think-card">
                    <Pill icon="ti-checklist" tone="warn">Assumptions</Pill>
                    <ul>{thinking.assumptions.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4 — Python implementation */}
          {entry.code && (
            <section className="pyentry-sec">
              <SectionHead icon="ti-code" tone="code">Python Implementation</SectionHead>
              <PyCodeBlock code={entry.code} entryId={entry.id} entryName={entry.name} />
            </section>
          )}

          {/* 5 — Real-world scenario */}
          {scenario && (
            <section className="pyentry-sec pyentry-sec-scenario">
              <SectionHead icon="ti-building-store" tone="scenario">Real-World Scenario — {scenario.title}</SectionHead>
              <dl className="pyentry-scenario">
                <dt>Business problem</dt><dd>{scenario.problem}</dd>
                <dt>Dataset</dt><dd>{scenario.dataset}</dd>
                <dt>Why this method</dt><dd>{scenario.why}</dd>
                <dt>Expected output</dt><dd>{scenario.output}</dd>
                <dt>Business interpretation</dt><dd>{scenario.interpretation}</dd>
                {scenario.pitfalls && <><dt>Pitfalls</dt><dd>{scenario.pitfalls}</dd></>}
              </dl>
            </section>
          )}

          {/* 6 — Mistakes / best practices */}
          <div className="pyentry-foot-grid">
            {entry.mistakes?.length > 0 && (
              <section className="pyentry-sec pyentry-sec-warn">
                <SectionHead icon="ti-alert-triangle" tone="warn">Common Mistakes</SectionHead>
                <ul className="pyentry-list">{entry.mistakes.map((x) => <li key={x}>{x}</li>)}</ul>
              </section>
            )}
            {entry.tips?.length > 0 && (
              <section className="pyentry-sec pyentry-sec-tip">
                <SectionHead icon="ti-star" tone="tip">Best Practices</SectionHead>
                <ul className="pyentry-list">{entry.tips.map((x) => <li key={x}>{x}</li>)}</ul>
              </section>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
