import MetricsPanel from './MetricsPanel.jsx';
import BacktestAnimator from './BacktestAnimator.jsx';
import ShapLimePanel from './ShapLimePanel.jsx';
import ConceptDriftDemo from './ConceptDriftDemo.jsx';
import '../mlPageShared.css';
import './EvaluationPage.css';

export default function EvaluationPage() {
  return (
    <div className="ml-page">
      <MetricsPanel />
      <BacktestAnimator />
      <ShapLimePanel />
      <ConceptDriftDemo />
    </div>
  );
}
