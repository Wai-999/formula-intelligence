import { useState } from 'react';
import MLRelationshipMap from '../../../components/mlgraph/MLRelationshipMap.jsx';
import MLModelDetailPanel from '../../../components/mlgraph/MLModelDetailPanel.jsx';
import ModelOutline from './ModelOutline.jsx';
import '../../map/MapPage.css';
import MLCitation from '../../../components/ml/MLCitation.jsx';
import MisconceptionCallout from '../../../components/ml/learning/MisconceptionCallout.jsx';
import { MM_LEGEND_TITLE, MM_LEGEND_EXTENDS, MM_LEGEND_COMPETES, MM_LEGEND_COMBINES } from '../../../data/ml/models.js';
import { useT } from '../../../lib/mlContent.js';
import './ModelMapPage.css';

export default function ModelMapPage() {
  const [showMisconception, setShowMisconception] = useState(true);
  const [view, setView] = useState('graph');
  const legendTitle = useT(MM_LEGEND_TITLE);
  const legendExtends = useT(MM_LEGEND_EXTENDS);
  const legendCompetes = useT(MM_LEGEND_COMPETES);
  const legendCombines = useT(MM_LEGEND_COMBINES);

  return (
    <div className="mm-page">
      <div className="mm-canvas-area">
        <div className="map-view-toggle" role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'graph'} onClick={() => setView('graph')}><i className="ti ti-topology-star-3" aria-hidden="true" /> Graph</button>
          <button type="button" aria-pressed={view === 'outline'} onClick={() => setView('outline')}><i className="ti ti-list-tree" aria-hidden="true" /> Outline</button>
        </div>
        <div className="map-view" hidden={view !== 'graph'}><MLRelationshipMap /></div>
        {view === 'outline' && <ModelOutline />}
        <MLModelDetailPanel />
        {showMisconception && (
          <div className="mm-misconception-card">
            <button type="button" className="mm-misconception-close" onClick={() => setShowMisconception(false)} aria-label="Dismiss">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
            <MisconceptionCallout misconceptionId="programmedBehavior" />
          </div>
        )}
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
