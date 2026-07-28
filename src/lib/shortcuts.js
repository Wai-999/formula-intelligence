// Global keyboard shortcuts.
//
// Two rules shape the design. First, a shortcut must never fire while the
// user is typing — a bare "t" that flips the theme mid-sentence in the Lab
// editor or the Journal is worse than having no shortcut at all. Second,
// every shortcut has to be discoverable: an undocumented one is a secret,
// so "?" opens the list and the list is generated from this same table,
// which means it cannot drift out of date.

export const SHORTCUTS = [
  { keys: ['?'], label: 'Show this help', group: 'General' },
  { keys: ['Esc'], label: 'Close panel, overlay or selection', group: 'General' },
  { keys: ['t'], label: 'Toggle light / dark theme', group: 'General' },
  { keys: ['m'], label: 'Switch between Stats and ML mode', group: 'General' },
  { keys: ['/'], label: 'Focus the search box on this page', group: 'General' },
  { keys: ['['], label: 'Previous tab', group: 'Navigation' },
  { keys: [']'], label: 'Next tab', group: 'Navigation' },
  { keys: ['1', '–', '9'], label: 'Jump to the nth tab of the current mode', group: 'Navigation' },
  { keys: ['⌘/Ctrl', 'Enter'], label: 'Run the code (Python Lab)', group: 'Python' },
];

/** True when focus is somewhere that swallows plain-letter shortcuts. */
export function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
}

/**
 * Resolve a keydown to a shortcut id, or null.
 * Kept pure so the whole table is testable without a DOM or a React tree.
 */
export function matchShortcut(event) {
  // Never hijack the browser's or the OS's combinations.
  if (event.metaKey || event.ctrlKey || event.altKey) return null;
  if (isTypingTarget(event.target)) {
    // Escape is the one key that must still work while typing: it is how you
    // get OUT of the input you are trapped in.
    return event.key === 'Escape' ? 'escape' : null;
  }

  switch (event.key) {
    case '?': return 'help';
    case 'Escape': return 'escape';
    case 't': case 'T': return 'theme';
    case 'm': case 'M': return 'mode';
    case '/': return 'search';
    case '[': return 'prevTab';
    case ']': return 'nextTab';
    default:
      if (/^[1-9]$/.test(event.key)) return `tab:${Number(event.key) - 1}`;
      return null;
  }
}

/** The first visible search input on the page, if any. */
export function findSearchInput() {
  const candidates = document.querySelectorAll('input[type="search"], input[type="text"][placeholder*="earch"]');
  for (const el of candidates) {
    // Every tab stays mounted (keep-alive), so most of these are hidden;
    // offsetParent is null for anything inside a display:none ancestor.
    if (el.offsetParent !== null) return el;
  }
  return null;
}
