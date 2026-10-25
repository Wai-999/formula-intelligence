import { useEffect, useState } from 'react';
import { useUIStore } from '../store/useUIStore.js';
import { useMLUIStore } from '../store/useMLUIStore.js';
import { useThemeStore } from '../store/useThemeStore.js';
import { matchShortcut, findSearchInput } from '../lib/shortcuts.js';
import { SECTIONS, pageById, pagesInSection, sectionHome, tabOf } from '../app/pages.js';

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

      if (action === 'globalSearch') {
        event.preventDefault();
        ui.setSearchOpen(!ui.searchOpen);
        return;
      }
      // While the search dialog is open it owns the keyboard.
      if (ui.searchOpen) return;

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
        if (ui.page === 'learn/formulas' && ui.selectedNodeId) ui.selectNode(null);
        else if (ui.page === 'learn/models' && useMLUIStore.getState().selectedModelId) useMLUIStore.getState().selectModel(null);
        return;
      }

      if (action === 'theme') { event.preventDefault(); useThemeStore.getState().toggle(); return; }
      if (action === 'focus') { event.preventDefault(); ui.toggleFocusMode(); return; }

      if (action === 'search') {
        const input = findSearchInput();
        event.preventDefault();
        if (input) { input.focus(); input.select?.(); } else ui.setSearchOpen(true);
        return;
      }

      if (action.startsWith('section:')) {
        const section = SECTIONS[Number(action.slice(8))];
        if (section) { event.preventDefault(); ui.goTo(sectionHome(section.id)); }
        return;
      }

      if (action === 'prevPage' || action === 'nextPage') {
        const sectionId = pageById[ui.page]?.section;
        const pages = sectionId ? pagesInSection(sectionId) : [];
        if (pages.length < 2) return;
        event.preventDefault();
        // A page behind a tab (a map behind Maps) counts as that tab.
        const index = Math.max(0, pages.findIndex((p) => p.id === tabOf(ui.page)));
        const step = action === 'prevPage' ? -1 : 1;
        ui.goTo(pages[(index + step + pages.length) % pages.length].id);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [helpOpen]);

  return { helpOpen, openHelp: () => setHelpOpen(true), closeHelp: () => setHelpOpen(false) };
}
