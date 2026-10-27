/* eslint-disable no-restricted-globals */
// Service worker (docs/PERFORMANCE_REPORT.md §Offline; acceptance test 7).
// Generated at build time by the plugin in vite.config.js, which replaces
// the two placeholders with this build's version and exact asset list.
//
// What works offline after one online visit: the whole app — lessons, labs,
// maps, practice, the diagnostic, notes and progress — because every built
// file is cached here. What does NOT: the Python runtime (Pyodide, ~10 MB
// from a CDN, deliberately not cached here; the browser may or may not keep
// its own copy) and external links. The app says so where it matters.

const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const APP_CACHE = `fi-app-${VERSION}`;
// Held the cdnjs icon font until the app shipped its own subset; deleted on
// activation so it does not linger on learners' devices.
const RETIRED_CACHES = ['fi-runtime-v1'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  // Remove previous builds’ caches. Waiting (no skipWaiting) means an open
  // tab keeps the build it started with until every tab is closed, so a
  // lazily loaded page can never be fetched from a different build.
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => (k.startsWith('fi-app-') && k !== APP_CACHE) || RETIRED_CACHES.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // App navigations: network first (fresh deploys win), cached shell offline.
  if (req.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(
      fetch(req).catch(() => caches.match('./', { ignoreSearch: true, ignoreVary: true })),
    );
    return;
  }

  // Built assets: content-hashed file names never change, so cache first.
  // ignoreVary: module scripts are requested with an Origin header that the
  // precache requests did not send, and a "Vary: Origin" response header
  // would otherwise make every lookup miss.
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(req)));
  }
  // Everything else (Pyodide, external links) goes straight to the network.
});
