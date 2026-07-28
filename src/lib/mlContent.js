import { useMLUIStore } from '../store/useMLUIStore.js';

/**
 * Builds a bilingual, two-depth content object. Shape:
 *   { en: { beginner, researcher }, my: { beginner, researcher } }
 * Used throughout ML mode's data files so every explanatory string is
 * authored once, in all four required combinations, next to the concept it
 * describes — no separate translation-file indirection to keep in sync.
 */
export function bl(enBeginner, enResearcher, myBeginner, myResearcher) {
  return {
    en: { beginner: enBeginner, researcher: enResearcher },
    my: { beginner: myBeginner, researcher: myResearcher },
  };
}

/**
 * Same text at both depths (beginner === researcher). Used for content that
 * doesn't meaningfully change with audience depth — e.g. Module 3's model
 * cards keep advantages/weaknesses/usage-area bullets doc-sourced and
 * identical at both levels, while each model's `howItWorks` field (the
 * actual mechanism explanation) uses full bl() to genuinely fork into a
 * beginner analogy vs. a researcher notation/derivation, matching Module
 * 11's definition of what the level toggle is for. See BUILD_LOG.md Module 3.
 */
export function blSame(en, my) {
  return bl(en, en, my, my);
}

/** Reads the current level+language from useMLUIStore and resolves a bl() object to its string. */
export function useT(content) {
  const level = useMLUIStore((s) => s.level);
  const lang = useMLUIStore((s) => s.lang);
  return resolveT(content, level, lang);
}

/**
 * Non-hook resolver for use inside callbacks/loops where a hook can't be called.
 *
 * Guarantees a STRING for every input, including malformed ones. That
 * guarantee is the point: these objects are shaped {en:{...}, my:{...}},
 * and returning one to a JSX child throws "Objects are not valid as a
 * React child" — which, before error boundaries existed, blanked the whole
 * app (FIX_LOG Fifth Pass). The `byLang` guard below covers content that
 * has neither the requested language nor an `en` fallback (an empty or
 * half-authored object); without it this threw a TypeError instead of
 * degrading to empty text, turning one bad content entry into a dead page.
 */
export function resolveT(content, level, lang) {
  if (!content) return '';
  const byLang = content[lang] || content.en;
  if (!byLang) return '';
  const value = byLang[level] ?? byLang.beginner ?? content.en?.beginner ?? '';
  return typeof value === 'string' ? value : String(value ?? '');
}
