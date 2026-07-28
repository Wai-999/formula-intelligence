import { useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import ErrorBoundary from './components/error/ErrorBoundary.jsx';
import { installGlobalErrorHandlers } from './lib/globalErrorHandlers.js';

// Two layers of protection, deliberately:
//   1. Per-tab boundaries inside StatsBody/MLBody isolate the common case —
//      one page's content or graph code throwing — so the other tabs keep
//      working and the user can navigate away from the broken one.
//   2. This root boundary is the last resort for failures ABOVE the tabs
//      (the shell, header, mode switcher, toast stack). It cannot be
//      recovered from by switching tabs, so its fallback is the full-page
//      variant offering a reload.
function App() {
  useEffect(() => installGlobalErrorHandlers(), []);

  return (
    <ErrorBoundary label="the app shell">
      <AppShell />
    </ErrorBoundary>
  );
}

export default App;
