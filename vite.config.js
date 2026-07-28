import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/formula-intelligence/',
  plugins: [react()],
  // Required by Vitest, which still transforms test files with esbuild and
  // defaults .jsx to the classic runtime — without this every JSX test fails
  // with "React is not defined". Vite 8's own builds use oxc and log that
  // this option is ignored; that warning is expected, and removing the
  // option to silence it breaks the test suite (verified, not assumed).
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    // Content-data suites import multi-thousand-line modules; the default
    // 5s timeout is tight for the first cold transform of those.
    testTimeout: 15000,
    include: ['src/**/*.test.{js,jsx}'],
  },
})
