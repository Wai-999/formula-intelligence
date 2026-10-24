import { nodes, links, CHAPTERS, nodeById } from '../../data/index.js';
import { useUIStore } from '../../store/useUIStore.js';

// The formula map without the graph (§3 "an accessible non-graph outline";
// baseline audit F-04): every formula by chapter, with what it builds on and
// what it leads to, as ordinary buttons. Selecting one opens the same detail
// panel the graph does, and the sidebar’s search and chapter filter apply.

const LINK_LABEL = { prereq: 'prerequisite', extends: 'extends', applies: 'applies', nonparam: 'nonparametric alternative', family: 'same family' };

export default function FormulaOutline() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const selectNode = useUIStore((s) => s.selectNode);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const chapterFilter = useUIStore((s) => s.chapterFilter);
  const q = searchQuery.trim().toLowerCase();

  return (
    <div className="formula-outline" aria-label="Formula outline">
      {CHAPTERS.filter((c) => !chapterFilter || c.id === chapterFilter).map((ch) => {
        const list = nodes.filter((n) => n.ch === ch.id && (!q || n.name.toLowerCase().includes(q) || n.short?.toLowerCase().includes(q)));
        if (!list.length) return null;
        return (
          <section key={ch.id} aria-labelledby={`fo-${ch.id}`}>
            <h2 id={`fo-${ch.id}`} className="fo-chapter">{ch.name}</h2>
            <ul className="fo-list">
              {list.map((n) => {
                const ins = links.filter((l) => l.t === n.id && nodeById[l.s]);
                const outs = links.filter((l) => l.s === n.id && nodeById[l.t]);
                return (
                  <li key={n.id} className={n.id === selectedNodeId ? 'on' : ''}>
                    <button type="button" className="fo-btn" aria-pressed={n.id === selectedNodeId} onClick={() => selectNode(n.id)}>
                      {n.name}
                    </button>
                    <span className="fo-formula">{n.formula}</span>
                    {ins.length > 0 && <span className="fo-rel">From: {ins.map((l) => `${nodeById[l.s].name} (${LINK_LABEL[l.type] ?? l.type})`).join('; ')}</span>}
                    {outs.length > 0 && <span className="fo-rel">Leads to: {outs.map((l) => `${nodeById[l.t].name} (${LINK_LABEL[l.type] ?? l.type})`).join('; ')}</span>}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
