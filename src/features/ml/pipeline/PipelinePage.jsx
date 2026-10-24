import PipelineVisualizer from './PipelineVisualizer.jsx';
import EstimationPredictionCausal from './EstimationPredictionCausal.jsx';
import MLLessons from './MLLessons.jsx';
import '../mlPageShared.css';

export default function PipelinePage() {
  return (
    <div className="ml-page">
      <PipelineVisualizer />
      <EstimationPredictionCausal />
      <MLLessons host="pipeline" />
    </div>
  );
}
