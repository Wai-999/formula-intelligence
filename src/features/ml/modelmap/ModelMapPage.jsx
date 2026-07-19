import MLRelationshipMap from '../../../components/mlgraph/MLRelationshipMap.jsx';
import MLModelDetailPanel from '../../../components/mlgraph/MLModelDetailPanel.jsx';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import './ModelMapPage.css';

export default function ModelMapPage() {
  return (
    <div className="mm-page">
      <div className="mm-canvas-area">
        <MLRelationshipMap />
        <MLModelDetailPanel />
        <div className="mm-legend">
          <p className="mm-legend-title">Connections</p>
          <div className="mm-legend-row"><span className="mm-legend-line mm-line-extends" />Extends (same family)</div>
          <div className="mm-legend-row"><span className="mm-legend-line mm-line-competes" />Competes with</div>
          <div className="mm-legend-row"><span className="mm-legend-line mm-line-combines" />Combines with</div>
          <div className="mm-legend-citation"><MLCitation section="3" /></div>
        </div>
      </div>
    </div>
  );
}
