import { Suspense } from 'react';
import ErrorBoundary from '../error/ErrorBoundary.jsx';
import { useUIStore } from '../../store/useUIStore.js';
import { pageById, hashFor } from '../../app/pages.js';
import { PAGE_COMPONENTS } from '../../app/pageComponents.js';
import { useKeepAlive } from '../../hooks/useKeepAlive.js';

function PageLoading() {
  return <div className="page-loading" role="status">Loading…</div>;
}

// A page instance is its id plus its parameter: two lessons are two pages,
// each keeping its own scroll position and half-answered checks.
function keyOf(page, params) {
  return hashFor(page, params).slice(1);
}

// Each mounted key's page and params, remembered as they are seen (a few
// bytes per page visited) so a kept-alive page re-renders with its own.
const instances = new Map();

export default function PageHost() {
  const page = useUIStore((s) => s.page);
  const pageParams = useUIStore((s) => s.pageParams);
  const current = keyOf(page, pageParams);
  const mounted = useKeepAlive(current);

  instances.set(current, { page, params: pageParams });

  return (
    <div className="page-host">
      {mounted.map((key) => {
        const inst = instances.get(key);
        if (!inst) return null;
        const Page = PAGE_COMPONENTS[inst.page];
        const active = key === current;
        return (
          <div key={key} className="app-tab-keepalive page-pane" hidden={!active} data-page={inst.page}>
            {/* One boundary per page, OUTSIDE Suspense so it also catches a
                failed chunk download: a throw in one page never blanks the
                shell or another page. */}
            <ErrorBoundary label={pageById[inst.page]?.title ?? inst.page}>
              <Suspense fallback={<PageLoading />}>
                <Page {...inst.params} />
              </Suspense>
            </ErrorBoundary>
          </div>
        );
      })}
    </div>
  );
}

