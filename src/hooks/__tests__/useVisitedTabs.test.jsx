import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVisitedTabs } from '../useVisitedTabs.js';

// This hook decides what gets mounted. Wrong in one direction it mounts
// everything (the performance problem it exists to fix); in the other it
// unmounts a tab on switch, silently discarding a half-finished quiz or a
// graph's pan position — exactly what keep-alive was protecting.
describe('useVisitedTabs', () => {
  it('starts with the initially open tab', () => {
    const { result } = renderHook(() => useVisitedTabs('map'));
    expect([...result.current]).toEqual(['map']);
  });

  it('accumulates tabs as they are opened', () => {
    const { result, rerender } = renderHook(({ tab }) => useVisitedTabs(tab), {
      initialProps: { tab: 'map' },
    });
    act(() => rerender({ tab: 'quiz' }));
    act(() => rerender({ tab: 'journal' }));
    expect([...result.current].sort()).toEqual(['journal', 'map', 'quiz']);
  });

  it('NEVER forgets a tab once visited — that is the keep-alive guarantee', () => {
    const { result, rerender } = renderHook(({ tab }) => useVisitedTabs(tab), {
      initialProps: { tab: 'map' },
    });
    act(() => rerender({ tab: 'quiz' }));
    act(() => rerender({ tab: 'map' }));
    expect(result.current.has('quiz')).toBe(true);
    expect(result.current.has('map')).toBe(true);
  });

  it('does not grow when the same tab is re-selected', () => {
    const { result, rerender } = renderHook(({ tab }) => useVisitedTabs(tab), {
      initialProps: { tab: 'map' },
    });
    const first = result.current;
    act(() => rerender({ tab: 'map' }));
    expect(result.current).toBe(first);
  });

  it('mounts only what was opened, not all nine tabs', () => {
    const { result, rerender } = renderHook(({ tab }) => useVisitedTabs(tab), {
      initialProps: { tab: 'map' },
    });
    act(() => rerender({ tab: 'quiz' }));
    expect(result.current.size).toBe(2);
  });
});
