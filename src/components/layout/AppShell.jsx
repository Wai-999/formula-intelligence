import { Suspense, lazy, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { initHashSync } from '../../lib/hashRoute.js';
import { isMLPage, hashFor } from '../../app/pages.js';
import PrimaryNav from './PrimaryNav.jsx';
import BottomNav from './BottomNav.jsx';
import PageHeader from './PageHeader.jsx';
import PageHost from './PageHost.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import ShortcutsOverlay from './ShortcutsOverlay.jsx';
import SearchDialog from '../search/SearchDialog.jsx';
import { useGlobalShortcuts } from '../../hooks/useGlobalShortcuts.js';
import ToastStack from '../toast/ToastStack.jsx';
import './AppShell.css';

// The first visit to an ML page explains one misconception above the page;
// loaded with that page, not with the shell.
const EntryMisconceptionBanner = lazy(() => import('../ml/learning/EntryMisconceptionBanner.jsx'));

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * The shell: a header with search, focus mode, theme and settings; five
 * destinations (V4 §3) as a sidebar, rail or bottom bar depending on width;
 * one page header with the page's only <h1>; and the page itself.
 *
 * The beginner/researcher depth switch left the header in V4: it is a
 * setting (Settings → Learning), and lessons put derivations behind
 * "Go deeper" instead.
 */
export default function AppShell() {
  const page = useUIStore((s) => s.page);
  const focusMode = useUIStore((s) => s.focusMode);
  const toggleFocusMode = useUIStore((s) => s.toggleFocusMode);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const { helpOpen, closeHelp } = useGlobalShortcuts();
  const isML = isMLPage(page);

  useEffect(() => initHashSync(), []);

  return (
    <div className={`app-shell${focusMode ? ' focus-mode' : ''}`}>
      <a className="skip-link" href="#main-content" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>
        Skip to content
      </a>
      <header className="app-header">
        <a className="app-brand" href={hashFor('home')} aria-label="Formula Intelligence — Home">
          <span className="app-brand-mark" aria-hidden="true">∑</span>
          <span className="app-brand-name">Formula Intelligence</span>
        </a>
        <button type="button" className="app-search-btn" onClick={() => setSearchOpen(true)} aria-label="Search" aria-keyshortcuts={IS_MAC ? 'Meta+K' : 'Control+K'}>
          <i className="ti ti-search" aria-hidden="true" />
          <span className="app-search-label">Search</span>
          <kbd aria-hidden="true">{IS_MAC ? '⌘K' : 'Ctrl K'}</kbd>
        </button>
        <div className="app-header-spacer" />
        <button
          type="button"
          className="header-icon-btn"
          onClick={toggleFocusMode}
          aria-pressed={focusMode}
          aria-keyshortcuts="F"
          title={focusMode ? 'Leave focus mode (F)' : 'Focus mode: hide navigation (F)'}
          aria-label={focusMode ? 'Leave focus mode' : 'Focus mode'}
        >
          <i className={`ti ${focusMode ? 'ti-arrows-minimize' : 'ti-arrows-maximize'}`} aria-hidden="true" />
        </button>
        <ThemeToggle />
        <a className="header-icon-btn app-header-settings" href={hashFor('progress/settings')} title="Settings" aria-label="Settings" aria-current={page === 'progress/settings' ? 'page' : undefined}>
          <i className="ti ti-settings" aria-hidden="true" />
        </a>
      </header>
      <div className="app-body">
        <PrimaryNav />
        <main id="main-content" className="app-main" tabIndex={-1}>
          <PageHeader />
          {isML && <Suspense fallback={null}><EntryMisconceptionBanner /></Suspense>}
          <PageHost />
        </main>
      </div>
      <BottomNav />
      <ToastStack />
      <SearchDialog />
      <ShortcutsOverlay open={helpOpen} onClose={closeHelp} />
    </div>
  );
}
