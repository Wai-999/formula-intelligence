import { useEffect, useState } from 'react';
import { useUIStore, TABS } from '../store/useUIStore.js';
import { useMLUIStore, ML_TABS } from '../store/useMLUIStore.js';
import { useThemeStore } from '../store/useThemeStore.js';
import { matchShortcut, findSearchInput } from '../lib/shortcuts.js';

/**
 * Wires the shortcut table to the app. Lives at the shell so it works on
 * every page, and returns the help-overlay state rather than rendering it,
 * keeping this hook free of markup.
 */
export function useGlobalShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      const action = matchShortcut(event);
      if (!action) return;

      const ui = useUIStore.getState();
      const isStats = ui.mode === 'stats';
      const tabs = isStats ? TABS : ML_TABS;
      const current = isStats ? ui.activeTab : ui.mlActiveTab;
      const goTo = (id) => (isStats ? ui.setActiveTab(id) : ui.setMLActiveTab(id));

      if (action === 'help') {
        event.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      if (action === 'escape') {
        // Closing the overlay takes priority; only then does Escape mean
        // "clear my selection", so one press never does two things.
        if (helpOpen) { setHelpOpen(false); return; }
        if (event.target?.blur && event.target !== document.body) event.target.blur();
        if (isStats && ui.selectedNodeId) ui.selectNode(null);
        else if (!isStats && useMLUIStore.getState().selectedModelId) useMLUIStore.getState().selectModel(null);
        return;
      }

      if (action === 'theme') { event.preventDefault(); useThemeStore.getState().toggle(); return; }
      if (action === 'mode') { event.preventDefault(); ui.setMode(isStats ? 'ml' : 'stats'); return; }

      if (action === 'search') {
        const input = findSearchInput();
        if (input) { event.preventDefault(); input.focus(); input.select?.(); }
        return;
      }

      const index = tabs.findIndex((t) => t.id === current);
      if (action === 'prevTab') {
        event.preventDefault();
        goTo(tabs[(index - 1 + tabs.length) % tabs.length].id);
        return;
      }
      if (action === 'nextTab') {
        event.preventDefault();
        goTo(tabs[(index + 1) % tabs.length].id);
        return;
      }
      if (action.startsWith('tab:')) {
        const n = Number(action.slice(4));
        if (tabs[n]) { event.preventDefault(); goTo(tabs[n].id); }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [helpOpen]);

  return { helpOpen, closeHelp: () => setHelpOpen(false) };
}
