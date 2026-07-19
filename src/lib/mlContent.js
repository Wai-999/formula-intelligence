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
  if (!content) return '';
  const byLang = content[lang] || content.en;
  return byLang[level] ?? byLang.beginner ?? content.en?.beginner ?? '';
}

/** Non-hook resolver for use inside callbacks/loops where a hook can't be called. */
export function resolveT(content, level, lang) {
  if (!content) return '';
  const byLang = content[lang] || content.en;
  return byLang[level] ?? byLang.beginner ?? content.en?.beginner ?? '';
}
