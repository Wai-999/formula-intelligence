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
  { keys: ['⌘/Ctrl', 'K'], label: 'Search lessons, formulas, models and pages', group: 'General' },
  { keys: ['/'], label: 'Focus the search box on this page', group: 'General' },
  { keys: ['f'], label: 'Focus mode: hide the navigation while you study', group: 'General' },
  { keys: ['1', '–', '7'], label: 'Home, Learn, Maps, Practice, Projects, Progress, Notebook', group: 'Navigation' },
  { keys: ['['], label: 'Previous page in this section', group: 'Navigation' },
  { keys: [']'], label: 'Next page in this section', group: 'Navigation' },
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
  // The one combination the app claims is the near-universal "quick search"
  // chord, and it works from inside a text field too. Every other browser or
  // OS combination is left alone.
  if ((event.metaKey || event.ctrlKey) && !event.altKey && (event.key === 'k' || event.key === 'K')) return 'globalSearch';
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
    case 'f': case 'F': return 'focus';
    case '/': return 'search';
    case '[': return 'prevPage';
    case ']': return 'nextPage';
    default:
      if (/^[1-7]$/.test(event.key)) return `section:${Number(event.key) - 1}`;
      return null;
  }
}

/** The first visible search input on the page, if any. */
export function findSearchInput() {
  const candidates = document.querySelectorAll('input[type="search"], input[type="text"][placeholder*="earch"]');
  for (const el of candidates) {
    // Visited pages stay mounted (keep-alive), so most of these are hidden;
    // offsetParent is null for anything inside a display:none ancestor.
    if (el.offsetParent !== null) return el;
  }
  return null;
}
