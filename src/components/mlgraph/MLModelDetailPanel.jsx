import {
  mlNodeById, ML_LINKS, mlFamilyColorMap, ML_FAMILIES, MM_EDGE_TYPE_LABEL,
  MM_HOW_IT_WORKS_LBL, MM_ADVANTAGES_LBL, MM_WEAKNESSES_LBL, MM_USAGE_AREAS_LBL, MM_COMPASS_LBL, MM_CONNECTIONS_LBL,
} from '../../data/ml/models.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { useT } from '../../lib/mlContent.js';
import CompassMeter from '../ml/CompassMeter.jsx';
import './MLModelDetailPanel.css';

function EdgeTypeLabel({ type }) {
  return <span className="ml-detail-conn-type">{useT(MM_EDGE_TYPE_LABEL[type])}</span>;
}

export default function MLModelDetailPanel() {
  const selectedModelId = useMLUIStore((s) => s.selectedModelId);
  const selectModel = useMLUIStore((s) => s.selectModel);
  const node = selectedModelId ? mlNodeById[selectedModelId] : null;

  const howItWorks = useT(node?.howItWorks);
  const advantages = useT(node?.advantages);
  const weaknesses = useT(node?.weaknesses);
  const usageAreas = useT(node?.usageAreas);
  const howItWorksLbl = useT(MM_HOW_IT_WORKS_LBL);
  const advantagesLbl = useT(MM_ADVANTAGES_LBL);
  const weaknessesLbl = useT(MM_WEAKNESSES_LBL);
  const usageAreasLbl = useT(MM_USAGE_AREAS_LBL);
  const compassLbl = useT(MM_COMPASS_LBL);
  const connectionsLbl = useT(MM_CONNECTIONS_LBL);

  if (!node) return <aside className="ml-detail-panel" />;

  const family = ML_FAMILIES.find((f) => f.id === node.ch);
  const relatedLinks = ML_LINKS.filter((l) => l.s === node.id || l.t === node.id).map((l) => ({
    type: l.type,
    otherId: l.s === node.id ? l.t : l.s,
    outgoing: l.s === node.id,
  }));

  return (
    <aside className="ml-detail-panel open">
      <button type="button" className="ml-detail-close" onClick={() => selectModel(null)} aria-label="Close detail panel">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
      <p className="ml-detail-name">{node.name}</p>
      <span className="ml-detail-family-badge" style={{ background: `${mlFamilyColorMap[node.ch]}22`, color: mlFamilyColorMap[node.ch] }}>
        {family?.name}
      </span>
      <div className="ml-detail-formula">{node.short}</div>

      <p className="ml-lbl">{howItWorksLbl}</p>
      <p className="ml-detail-desc">{howItWorks}</p>

      <p className="ml-lbl">{advantagesLbl}</p>
      <p className="ml-detail-desc ml-detail-adv">{advantages}</p>

      <p className="ml-lbl">{weaknessesLbl}</p>
      <p className="ml-detail-desc ml-detail-weak">{weaknesses}</p>

      <p className="ml-lbl">{usageAreasLbl}</p>
      <p className="ml-detail-desc">{usageAreas}</p>

      <p className="ml-lbl">{compassLbl}</p>
      <CompassMeter compass={node.compass} />

      {relatedLinks.length > 0 && (
        <>
          <p className="ml-lbl">{connectionsLbl}</p>
          {relatedLinks.map((rel, i) => {
            const other = mlNodeById[rel.otherId];
            if (!other) return null;
            return (
              <button key={i} type="button" className="ml-detail-conn" onClick={() => selectModel(other.id)}>
                <span className={`ml-detail-conn-dot ml-conn-${rel.type}`} />
                <EdgeTypeLabel type={rel.type} />
                <span>{other.name}</span>
              </button>
            );
          })}
        </>
      )}
    </aside>
  );
}
