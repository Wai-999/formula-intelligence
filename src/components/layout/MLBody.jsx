import { Suspense, lazy } from 'react';
import MLIconRail from './MLIconRail.jsx';
import { useUIStore } from '../../store/useUIStore.js';
import { ML_TABS } from '../../store/useMLUIStore.js';
import LevelLangToggle from '../ml/LevelLangToggle.jsx';
import { useT } from '../../lib/mlContent.js';
import './MLBody.css';

// Lazy-loaded so Stats mode's bundle doesn't grow for users who never open
// ML mode (Phase 1 §2 — "code-splittable" without adding a router).
const PipelinePage = lazy(() => import('../../features/ml/pipeline/PipelinePage.jsx'));
const ModelMapPage = lazy(() => import('../../features/ml/modelmap/ModelMapPage.jsx'));
const PlaygroundPage = lazy(() => import('../../features/ml/playground/PlaygroundPage.jsx'));
const EvaluationPage = lazy(() => import('../../features/ml/evaluation/EvaluationPage.jsx'));
const GoldLabPage = lazy(() => import('../../features/ml/gold/GoldLabPage.jsx'));
const MacroLabPage = lazy(() => import('../../features/ml/macro/MacroLabPage.jsx'));
const MicroLabPage = lazy(() => import('../../features/ml/micro/MicroLabPage.jsx'));
const PoliticsLabPage = lazy(() => import('../../features/ml/politics/PoliticsLabPage.jsx'));
const BridgePage = lazy(() => import('../../features/ml/bridge/BridgePage.jsx'));

const FEATURES = {
  pipeline: PipelinePage,
  modelmap: ModelMapPage,
  playground: PlaygroundPage,
  evaluation: EvaluationPage,
  gold: GoldLabPage,
  macro: MacroLabPage,
  micro: MicroLabPage,
  politics: PoliticsLabPage,
  bridge: BridgePage,
};

function MLLoading() {
  return <div className="ml-loading">Loading…</div>;
}

export default function MLBody() {
  const mlActiveTab = useUIStore((s) => s.mlActiveTab);
  const tabMeta = ML_TABS.find((t) => t.id === mlActiveTab);
  const tabTitle = useT(tabMeta?.title);

  return (
    <>
      <MLIconRail />
      <main className="app-main ml-main">
        <div className="ml-main-header">
          <span className="ml-main-title">{tabTitle}</span>
          <LevelLangToggle />
        </div>
        <div className="ml-main-content">
          {Object.entries(FEATURES).map(([id, Feature]) => (
            <div key={id} className="app-tab-keepalive" style={{ display: mlActiveTab === id ? 'flex' : 'none' }}>
              <Suspense fallback={<MLLoading />}>
                <Feature />
              </Suspense>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
