import { Suspense, lazy, useMemo } from 'react';
import ErrorBoundary from '../../components/error/ErrorBoundary.jsx';
import { LABS } from './registry.js';

const cache = {};
function labComponent(id) {
  cache[id] ??= lazy(LABS[id].load);
  return cache[id];
}

/** Mount a lab by id. A lab that fails to load or throws never takes its lesson down with it. */
export default function LabHost({ id, config = {} }) {
  const Lab = useMemo(() => (LABS[id] ? labComponent(id) : null), [id]);
  if (!Lab) return <p className="studio-callout studio-callout-warn">This lab ({id}) is not available.</p>;
  return (
    <ErrorBoundary label={`the ${LABS[id].title} lab`}>
      <Suspense fallback={<div className="page-loading" role="status">Loading the {LABS[id].title} lab…</div>}>
        <Lab {...config} />
      </Suspense>
    </ErrorBoundary>
  );
}
