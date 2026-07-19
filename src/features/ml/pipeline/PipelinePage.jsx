import PipelineVisualizer from './PipelineVisualizer.jsx';
import EstimationPredictionCausal from './EstimationPredictionCausal.jsx';
import '../mlPageShared.css';

export default function PipelinePage() {
  return (
    <div className="ml-page">
      <PipelineVisualizer />
      <EstimationPredictionCausal />
    </div>
  );
}
