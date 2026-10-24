import { useEffect, useState } from 'react';
import NavSidebar from '../../components/layout/NavSidebar.jsx';
import GraphCanvas from '../../components/graph/GraphCanvas.jsx';
import FormulaOutline from './FormulaOutline.jsx';
import DetailPanel from '../../components/detail/DetailPanel.jsx';
import { useUIStore } from '../../store/useUIStore.js';
import './MapPage.css';

export default function MapPage() {
  const linkedConcept = useUIStore((s) => s.linkedConcept);
  const clearLinkedConcept = useUIStore((s) => s.clearLinkedConcept);
  const selectNode = useUIStore((s) => s.selectNode);
  // Phone-only: the chapter sidebar becomes a slide-over so the graph gets
  // the full screen (see MapPage.css). Harmless on desktop, where the
  // sidebar is always a column and the toggle is not rendered.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Graph or a plain outline of the same content (F-04). The graph stays
  // mounted while the outline shows, so its zoom and selection survive.
  const [view, setView] = useState('graph');

  // Consumes Module 10's ML → Stats cross-link (e.g. the Bridge page's
  // "view reg on the Stats map" button), reusing the same linkedConcept
  // mechanism GoldLabPage already consumes for Module 9's cross-link.
  useEffect(() => {
    if (linkedConcept?.tab !== 'map' || !linkedConcept.payload?.nodeId) return;
    selectNode(linkedConcept.payload.nodeId);
    clearLinkedConcept();
  }, [linkedConcept, selectNode, clearLinkedConcept]);

  return (
    <div className={`map-page${sidebarOpen ? ' sidebar-open' : ''}`}>
      <button
        type="button"
        className="map-sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? 'Hide chapter list' : 'Show chapter list'}
      >
        <i className={`ti ${sidebarOpen ? 'ti-x' : 'ti-list'}`} aria-hidden="true" />
      </button>
      <NavSidebar />
      <div className="map-canvas-area">
        <div className="map-view-toggle" role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'graph'} onClick={() => setView('graph')}><i className="ti ti-topology-star-3" aria-hidden="true" /> Graph</button>
          <button type="button" aria-pressed={view === 'outline'} onClick={() => setView('outline')}><i className="ti ti-list-tree" aria-hidden="true" /> Outline</button>
        </div>
        <div className="map-view" hidden={view !== 'graph'}><GraphCanvas /></div>
        {view === 'outline' && <FormulaOutline />}
        <DetailPanel />
      </div>
    </div>
  );
}
