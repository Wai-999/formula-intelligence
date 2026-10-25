import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeepAlive } from '../useKeepAlive.js';

// This hook decides what stays mounted. Wrong one way, it mounts every page
// ever opened (unbounded, §13); wrong the other, it unmounts the page you
// just left and silently throws away a half-finished quiz or a graph's pan.
describe('useKeepAlive', () => {
  const run = (keys, limit = 3) => {
    const { result, rerender } = renderHook(({ k }) => useKeepAlive(k, limit), { initialProps: { k: keys[0] } });
    for (const k of keys.slice(1)) act(() => rerender({ k }));
    return result.current;
  };

  it('starts with the page that is open', () => {
    expect(run(['home'])).toEqual(['home']);
  });

  it('keeps the pages you are moving between', () => {
    expect(run(['home', 'learn/formulas', 'home', 'learn/formulas'])).toEqual(['home', 'learn/formulas']);
  });

  it('drops the least recently seen page past the limit', () => {
    expect(run(['a', 'b', 'c', 'd'])).toEqual(['b', 'c', 'd']);
  });

  it('revisiting a page refreshes it, so it is not the one dropped', () => {
    expect(run(['a', 'b', 'c', 'a', 'd'])).toEqual(['a', 'c', 'd']);
  });

  it('never reorders mounted pages (reordering would remount them)', () => {
    expect(run(['a', 'b', 'c', 'a'])).toEqual(['a', 'b', 'c']);
  });

  it('always includes the current page', () => {
    expect(run(['a', 'b', 'c', 'd', 'e', 'f'], 2)).toContain('f');
  });
});
