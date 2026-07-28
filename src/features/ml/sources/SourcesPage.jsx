import { useEffect, useMemo, useRef, useState } from 'react';
import RESEARCH_MD from '../../../../docs/research/ML-Research-Reference.md?raw';
import PEDAGOGY_MD from '../../../../docs/research/ML-Mode-Pedagogy-Research.md?raw';
import DATA_SOURCES_MD from '../../../../docs/DATA_SOURCES.md?raw';
import { parseMarkdown, extractSections } from '../../../lib/miniMarkdown.js';
import { PROVENANCE_DOMAINS, PROVENANCE_KINDS, provenanceTotals } from '../../../data/ml/provenance.js';
import { useUIStore } from '../../../store/useUIStore.js';
import Markdown from './Markdown.jsx';
import '../mlPageShared.css';
import './SourcesPage.css';

// The research documents are imported with Vite's ?raw so the app renders
// the SAME files the repo ships — no transcribed copy to drift out of sync,
// which is the identical anti-duplication reasoning used for Stats mode's
// researcher depth (it joins the Python Hub corpus rather than restating it).
const DOCS = [
  { id: 'reference', label: 'Research Reference', icon: 'ti-file-text', md: RESEARCH_MD,
    blurb: 'The source every "Source: §N" citation in ML mode points at.' },
  { id: 'provenance', label: 'Data Provenance', icon: 'ti-database-search', md: null,
    blurb: 'Which numbers are research-sourced and which are illustrative — per lab, per parameter.' },
  { id: 'datasources', label: 'Data Sources Policy', icon: 'ti-license', md: DATA_SOURCES_MD,
    blurb: 'The module-by-module real-vs-synthetic breakdown, in full.' },
  { id: 'pedagogy', label: 'Pedagogy Research', icon: 'ti-school', md: PEDAGOGY_MD,
    blurb: 'The learning-science basis for Depth Ladders, Predict-gates and misconceptions.' },
];

function ProvenanceView() {
  const setMLActiveTab = useUIStore((s) => s.setMLActiveTab);
  const totals = useMemo(provenanceTotals, []);

  return (
    <div className="src-prov">
      <div className="src-prov-summary">
        <p className="src-prov-lede">
          This app makes <strong>zero live API calls</strong>. Every figure is frozen into
          the source at build time, and is one of exactly two things — traceable to the
          research document, or an illustrative value chosen to demonstrate a mechanism.
          Nothing in between, and nothing undisclosed.
        </p>
        <div className="src-prov-chips">
          <span className="src-chip src-chip-real">
            <i className="ti ti-file-text" aria-hidden="true" /> {totals.real} research-sourced elements
          </span>
          <span className="src-chip src-chip-derived">
            <i className="ti ti-arrow-narrow-right" aria-hidden="true" /> {totals.derived} derived from a cited range
          </span>
          <span className="src-chip src-chip-illustrative">
            <i className="ti ti-flask" aria-hidden="true" /> {totals.illustrative} illustrative parameters
          </span>
        </div>
      </div>

      {PROVENANCE_DOMAINS.map((d) => (
        <section className="src-prov-domain" key={d.id}>
          <header className="src-prov-head">
            <h3>{d.label}</h3>
            <span className="src-prov-sec">Reference §{d.section}</span>
            <button type="button" className="src-prov-open" onClick={() => setMLActiveTab(d.tab)}>
              <i className="ti ti-external-link" aria-hidden="true" /> Open the lab
            </button>
          </header>

          {d.realParts.length > 0 && (
            <>
              <p className="src-prov-lbl"><i className="ti ti-file-text" aria-hidden="true" /> Research-sourced here</p>
              <ul className="src-prov-list">{d.realParts.map((r) => <li key={r}>{r}</li>)}</ul>
            </>
          )}

          {(d.baseline.length > 0 || d.drivers.length > 0) && (
            <>
              <p className="src-prov-lbl"><i className="ti ti-flask" aria-hidden="true" /> Simulation parameters</p>
              <table className="src-prov-table">
                <thead>
                  <tr><th>Parameter</th><th>Value</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {d.baseline.map((b) => (
                    <tr key={b.name}>
                      <td>{b.name}{b.note && <span className="src-prov-note">{b.note}</span>}</td>
                      <td className="src-prov-val">{b.value}</td>
                      <td><KindTag kind={b.kind} /></td>
                    </tr>
                  ))}
                  {d.drivers.map((dr) => (
                    <tr key={dr.key}>
                      <td>{dr.key}{dr.note && <span className="src-prov-note">{dr.note}</span>}</td>
                      <td className="src-prov-val">{dr.coefficient > 0 ? '+' : ''}{dr.coefficient}</td>
                      <td><KindTag kind={dr.kind} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {d.note && <p className="src-prov-footnote">{d.note}</p>}
        </section>
      ))}
    </div>
  );
}

function KindTag({ kind }) {
  const meta = PROVENANCE_KINDS[kind] || PROVENANCE_KINDS.illustrative;
  return (
    <span className={`src-chip src-chip-${meta.tone}`}>
      <i className={`ti ${meta.icon}`} aria-hidden="true" /> {meta.label}
    </span>
  );
}

export default function SourcesPage() {
  const [activeDoc, setActiveDoc] = useState('reference');
  const [query, setQuery] = useState('');
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);
  const bodyRef = useRef(null);

  // Parsing 29KB of markdown is cheap but not free, and this component
  // re-renders on every search keystroke — memo per document, not per render.
  const parsed = useMemo(() => {
    const out = {};
    for (const d of DOCS) if (d.md) out[d.id] = parseMarkdown(d.md);
    return out;
  }, []);

  const sections = useMemo(
    () => (parsed[activeDoc] ? extractSections(parsed[activeDoc]) : []),
    [parsed, activeDoc]
  );

  // Consumes citation clicks from anywhere in ML mode: MLCitation sends
  // {section:'6.1'}, which resolves to the top-level section it lives under.
  useEffect(() => {
    if (linkedConcept?.tab !== 'sources') return undefined;
    const wanted = String(linkedConcept.payload?.section ?? '').split('.')[0];
    setActiveDoc('reference');
    const timer = setTimeout(() => {
      const target = extractSections(parseMarkdown(RESEARCH_MD)).find((s) => s.section === wanted);
      if (target) document.getElementById(target.slug)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      else bodyRef.current?.scrollTo({ top: 0 });
      clearLinkedConcept();
    }, 80);
    return () => clearTimeout(timer);
  }, [linkedConcept, clearLinkedConcept]);

  const doc = DOCS.find((d) => d.id === activeDoc);
  const blocks = parsed[activeDoc];

  // Search filters blocks to those containing the query, keeping the
  // heading above each match so a hit is never shown without its context.
  const shown = useMemo(() => {
    if (!blocks) return null;
    const q = query.trim().toLowerCase();
    if (!q) return blocks;
    const keep = new Set();
    blocks.forEach((b, i) => {
      const text = JSON.stringify(b).toLowerCase();
      if (text.includes(q)) {
        keep.add(i);
        for (let j = i - 1; j >= 0; j--) {
          if (blocks[j].type === 'heading') { keep.add(j); break; }
        }
      }
    });
    return blocks.filter((_, i) => keep.has(i));
  }, [blocks, query]);

  return (
    <div className="ml-page src-page">
      <aside className="src-nav">
        {DOCS.map((d) => (
          <button
            key={d.id} type="button"
            className={`src-doc-btn${activeDoc === d.id ? ' active' : ''}`}
            onClick={() => { setActiveDoc(d.id); setQuery(''); bodyRef.current?.scrollTo({ top: 0 }); }}
          >
            <i className={`ti ${d.icon}`} aria-hidden="true" />
            <span>
              <span className="src-doc-label">{d.label}</span>
              <span className="src-doc-blurb">{d.blurb}</span>
            </span>
          </button>
        ))}

        {sections.length > 0 && (
          <div className="src-toc">
            <p className="src-toc-title">Sections</p>
            {sections.map((s) => (
              <button
                key={s.slug} type="button" className="src-toc-link"
                onClick={() => document.getElementById(s.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {s.title}
              </button>
            ))}
          </div>
        )}
      </aside>

      <div className="src-body" ref={bodyRef}>
        <div className="src-header">
          <div>
            <h2 className="src-title"><i className={`ti ${doc.icon}`} aria-hidden="true" /> {doc.label}</h2>
            <p className="src-blurb">{doc.blurb}</p>
          </div>
          {blocks && (
            <div className="src-search">
              <i className="ti ti-search" aria-hidden="true" />
              <input
                type="search" value={query} placeholder="Search this document…"
                onChange={(e) => setQuery(e.target.value)} aria-label="Search this document"
              />
            </div>
          )}
        </div>

        {activeDoc === 'provenance'
          ? <ProvenanceView />
          : (shown?.length ? <Markdown blocks={shown} />
            : <p className="src-empty">No matches for “{query}” in this document.</p>)}
      </div>
    </div>
  );
}

