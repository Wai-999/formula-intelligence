// Errors thrown outside React's render path (event handlers, promises,
// timers) never reach a boundary. Without a listener they vanish into the
// console, which on a static site with no telemetry means they vanish
// entirely. This surfaces them the same way, so a click handler that throws
// is at least visible rather than silently doing nothing.
export function installGlobalErrorHandlers(onError) {
  const handleError = (event) => {
    console.error('[window.onerror]', event.error || event.message);
    onError?.(event.error || new Error(event.message), { source: 'window.onerror' });
  };
  const handleRejection = (event) => {
    console.error('[unhandledrejection]', event.reason);
    onError?.(event.reason, { source: 'unhandledrejection' });
  };
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
}
