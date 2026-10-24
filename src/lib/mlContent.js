import { useMLUIStore } from '../store/useMLUIStore.js';

/**
 * Builds a two-depth content object: { beginner, researcher }.
 *
 * English only (Master Prompt V3.1 §2/§4). This used to be a bilingual,
 * two-depth object ({ en: {...}, my: {...} }); the Burmese half was removed
 * by scripts/codemods/strip-burmese.mjs, guarded by a snapshot of every
 * resolved English string at both depths (scripts/codemods/
 * english-snapshot.mjs). Depth — the beginner/researcher fork — is the part
 * that carries pedagogy, so it survives unchanged.
 */
export function bl(beginner, researcher) {
  return { beginner, researcher };
}

/**
 * Same text at both depths. For content that doesn't meaningfully change
 * with audience depth — titles, labels, doc-sourced bullets — while
 * mechanism explanations use bl() to genuinely fork into a beginner analogy
 * vs. researcher notation. See BUILD_LOG.md Module 3.
 */
export function blSame(text) {
  return bl(text, text);
}

/** Reads the current depth from useMLUIStore and resolves a bl() object to its string. */
export function useT(content) {
  const level = useMLUIStore((s) => s.level);
  return resolveT(content, level);
}

/**
 * Non-hook resolver for use inside callbacks/loops where a hook can't be called.
 *
 * Guarantees a STRING for every input, including malformed ones. That
 * guarantee is the point: returning an object to a JSX child throws
 * "Objects are not valid as a React child" — which, before error boundaries
 * existed, blanked the whole app (FIX_LOG Fifth Pass). Plain strings pass
 * through, so a field can be authored without bl() when it never forks.
 */
export function resolveT(content, level) {
  if (content === null || content === undefined) return '';
  if (typeof content === 'string') return content;
  if (typeof content !== 'object') return String(content);
  const value = content[level] ?? content.beginner ?? '';
  return typeof value === 'string' ? value : String(value ?? '');
}
