import { Component } from 'react';
import './ErrorBoundary.css';

// The app's only error boundary mechanism. Until this existed, ANY thrown
// render error anywhere in the tree unmounted the entire app and left a
// blank white page with no explanation — a failure mode this project hit
// for real (see FIX_LOG.md's Fifth Pass: one un-resolved bl() object in a
// detail panel blanked the whole UI on every Model Map node click, and the
// only symptom the user could report was "nothing shows up").
//
// Placement matters more than the component itself. Both mode bodies use a
// keep-alive pattern — every tab stays mounted and inactive ones are hidden
// with display:none — so a crash in a tab the user isn't even looking at
// still throws during render and, without a boundary, takes down the tabs
// they ARE looking at. Wrapping each keep-alive pane individually (rather
// than only the root) means a broken tab degrades to a recoverable message
// inside its own pane while every other tab keeps working.
//
// React only catches errors thrown during render, in lifecycle methods, and
// in constructors of the subtree below. It does NOT catch errors inside
// event handlers, async callbacks, or timers — those still surface as
// unhandled rejections, which is why installGlobalErrorHandlers() below
// exists as the complementary net.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the full component stack in the console: the boundary swallows
    // the throw, so without this the developer loses the one artifact that
    // makes the bug findable.
    console.error(
      `[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`,
      error,
      info?.componentStack
    );
    this.setState({ info });
    this.props.onError?.(error, info);
  }

  handleRetry = () => {
    // Clearing the error re-renders the children from scratch. This is a
    // real fix for transient causes (a bad transient prop, a one-off state
    // combination) and a no-op loop for deterministic ones — hence the
    // reload escape hatch alongside it.
    this.setState({ error: null, info: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const label = this.props.label || 'this view';
    const compact = this.props.variant === 'compact';

    return (
      <div className={`errb ${compact ? 'errb-compact' : ''}`} role="alert">
        <div className="errb-card">
          <i className="ti ti-alert-triangle errb-icon" aria-hidden="true" />
          <p className="errb-title">Something broke in {label}</p>
          <p className="errb-body">
            The rest of the app is still running — you can switch to another
            tab, or try rendering this one again.
          </p>
          <pre className="errb-detail">{String(error?.message || error)}</pre>
          <div className="errb-actions">
            <button type="button" className="errb-btn errb-btn-primary" onClick={this.handleRetry}>
              <i className="ti ti-refresh" aria-hidden="true" /> Try again
            </button>
            <button type="button" className="errb-btn" onClick={this.handleReload}>
              <i className="ti ti-reload" aria-hidden="true" /> Reload app
            </button>
          </div>
        </div>
      </div>
    );
  }
}
