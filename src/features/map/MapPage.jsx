import { useEffect, useState } from 'react';
import NavSidebar from '../../components/layout/NavSidebar.jsx';
import GraphCanvas from '../../components/graph/GraphCanvas.jsx';
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
        <GraphCanvas />
        <DetailPanel />
      </div>
    </div>
  );
}
