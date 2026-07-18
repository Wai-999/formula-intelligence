import NavSidebar from '../../components/layout/NavSidebar.jsx';
import GraphCanvas from '../../components/graph/GraphCanvas.jsx';
import DetailPanel from '../../components/detail/DetailPanel.jsx';
import './MapPage.css';

export default function MapPage() {
  return (
    <div className="map-page">
      <NavSidebar />
      <div className="map-canvas-area">
        <GraphCanvas />
        <DetailPanel />
      </div>
    </div>
  );
}
