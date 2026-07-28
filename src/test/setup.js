import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Every store in this app reads localStorage at module-import time and
// writes to it on nearly every action, so tests must start from a clean
// slate or they leak state into each other in import order — which is
// non-obvious and would produce exactly the kind of intermittent failure
// that makes people distrust and then ignore a test suite.
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
