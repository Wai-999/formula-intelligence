import { ML_MODELS, ML_FAMILIES, ML_LINKS, mlNodeById } from '../../../data/ml/models.js';
import { useMLUIStore } from '../../../store/useMLUIStore.js';
import { resolveT } from '../../../lib/mlContent.js';

// The model map without the graph (baseline audit F-04): every model by
// family with its connections, as buttons that open the same detail panel.

const LABEL = { extends: 'extends', competes: 'competes with', combines: 'combines with' };

export default function ModelOutline() {
  const selected = useMLUIStore((s) => s.selectedModelId);
  const selectModel = useMLUIStore((s) => s.selectModel);
  return (
    <div className="formula-outline mm-outline" aria-label="Model outline">
      {ML_FAMILIES.map((fam) => {
        const list = ML_MODELS.filter((m) => m.ch === fam.id);
        if (!list.length) return null;
        return (
          <section key={fam.id} aria-labelledby={`mo-${fam.id}`}>
            <h2 id={`mo-${fam.id}`} className="fo-chapter">{resolveT(fam.name, 'beginner')}</h2>
            <ul className="fo-list">
              {list.map((m) => {
                const rel = ML_LINKS.filter((l) => (l.s === m.id || l.t === m.id) && mlNodeById[l.s] && mlNodeById[l.t]);
                return (
                  <li key={m.id} className={m.id === selected ? 'on' : ''}>
                    <button type="button" className="fo-btn" aria-pressed={m.id === selected} onClick={() => selectModel(m.id)}>{m.name}</button>
                    <span className="fo-formula">{m.short}</span>
                    {rel.length > 0 && (
                      <span className="fo-rel">
                        {rel.map((l) => (l.s === m.id ? `${LABEL[l.type] ?? l.type} ${mlNodeById[l.t].name}` : `${mlNodeById[l.s].name} ${LABEL[l.type] ?? l.type} this`)).join('; ')}
                      </span>
                    )}
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
