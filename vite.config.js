import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

// Emits sw.js listing this build's files as actually written to disk (Vite
// prunes empty CSS-only chunks after generateBundle, and a single missing
// file would make the worker's install fail). Template:
// src/sw/serviceWorker.template.js. WOFF/TTF fallbacks are left out: every
// supported browser uses WOFF2.
function serviceWorker() {
  let outDir = 'dist'
  return {
    name: 'fi-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const walk = (dir, prefix = '') => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name), `${prefix}${d.name}/`) : [`${prefix}${d.name}`]))
      const files = walk(outDir).filter((f) => !/\.(map|woff|ttf)$/.test(f) && f !== 'sw.js' && f !== 'index.html').sort()
      const precache = ['./', ...files]
      const version = createHash('sha256').update(files.map((f) => f + statSync(join(outDir, f)).size).join('|')).digest('hex').slice(0, 12)
      const source = readFileSync(new URL('./src/sw/serviceWorker.template.js', import.meta.url), 'utf8')
        .replace("'__VERSION__'", JSON.stringify(version))
        .replace('__PRECACHE__', JSON.stringify(precache))
      writeFileSync(join(outDir, 'sw.js'), source)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/formula-intelligence/',
  plugins: [react(), serviceWorker()],
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
