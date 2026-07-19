import MLRelationshipMap from '../../../components/mlgraph/MLRelationshipMap.jsx';
import MLModelDetailPanel from '../../../components/mlgraph/MLModelDetailPanel.jsx';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import { MM_LEGEND_TITLE, MM_LEGEND_EXTENDS, MM_LEGEND_COMPETES, MM_LEGEND_COMBINES } from '../../../data/ml/models.js';
import { useT } from '../../../lib/mlContent.js';
import './ModelMapPage.css';

export default function ModelMapPage() {
  const legendTitle = useT(MM_LEGEND_TITLE);
  const legendExtends = useT(MM_LEGEND_EXTENDS);
  const legendCompetes = useT(MM_LEGEND_COMPETES);
  const legendCombines = useT(MM_LEGEND_COMBINES);

  return (
    <div className="mm-page">
      <div className="mm-canvas-area">
        <MLRelationshipMap />
        <MLModelDetailPanel />
        <div className="mm-legend">
          <p className="mm-legend-title">{legendTitle}</p>
          <div className="mm-legend-row"><span className="mm-legend-line mm-line-extends" />{legendExtends}</div>
          <div className="mm-legend-row"><span className="mm-legend-line mm-line-competes" />{legendCompetes}</div>
          <div className="mm-legend-row"><span className="mm-legend-line mm-line-combines" />{legendCombines}</div>
          <div className="mm-legend-citation"><MLCitation section="3" /></div>
        </div>
      </div>
    </div>
  );
}
