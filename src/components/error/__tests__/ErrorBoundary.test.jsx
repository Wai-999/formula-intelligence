import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import ErrorBoundary from '../ErrorBoundary.jsx';

function Boom({ shouldThrow = true }) {
  if (shouldThrow) throw new Error('kaboom');
  return <p>recovered content</p>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs caught errors to console.error by design; silence it so a
    // passing suite doesn't look like a failing one.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('renders children untouched when nothing throws', () => {
    render(<ErrorBoundary label="Map"><p>all good</p></ErrorBoundary>);
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('catches a render error and shows the labeled fallback', () => {
    render(<ErrorBoundary label="Quiz"><Boom /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something broke in Quiz/)).toBeInTheDocument();
  });

  it('surfaces the error message so the failure is diagnosable', () => {
    render(<ErrorBoundary label="Quiz"><Boom /></ErrorBoundary>);
    expect(screen.getByText(/kaboom/)).toBeInTheDocument();
  });

  it('isolates the failure — sibling subtrees keep rendering', () => {
    render(
      <div>
        <ErrorBoundary label="Quiz"><Boom /></ErrorBoundary>
        <ErrorBoundary label="Map"><p>map still here</p></ErrorBoundary>
      </div>
    );
    expect(screen.getByText(/Something broke in Quiz/)).toBeInTheDocument();
    expect(screen.getByText('map still here')).toBeInTheDocument();
  });

  it('calls the onError hook with the error and component stack', () => {
    const onError = vi.fn();
    render(<ErrorBoundary label="Quiz" onError={onError}><Boom /></ErrorBoundary>);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][1]).toHaveProperty('componentStack');
  });

  it('recovers via "Try again" once the underlying cause is gone', () => {
    function Harness() {
      const [broken, setBroken] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setBroken(false)}>fix it</button>
          <ErrorBoundary label="Quiz"><Boom shouldThrow={broken} /></ErrorBoundary>
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByText(/Something broke in Quiz/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('fix it'));      // remove the cause
    fireEvent.click(screen.getByText(/Try again/));    // reset the boundary
    expect(screen.getByText('recovered content')).toBeInTheDocument();
  });

  it('falls back to a generic label when none is supplied', () => {
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText(/Something broke in this view/)).toBeInTheDocument();
  });

  it('offers a reload escape hatch for deterministic failures', () => {
    render(<ErrorBoundary label="Quiz"><Boom /></ErrorBoundary>);
    expect(screen.getByText(/Reload app/)).toBeInTheDocument();
  });
});
