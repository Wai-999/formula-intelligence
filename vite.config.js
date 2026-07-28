import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/formula-intelligence/',
  plugins: [react()],
  // Vitest transforms test files through esbuild rather than the React
  // plugin's pipeline, and esbuild defaults .jsx to the classic runtime —
  // which needs React in scope and fails with "React is not defined".
  // The app itself never hits this (the plugin handles src), only tests.
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
