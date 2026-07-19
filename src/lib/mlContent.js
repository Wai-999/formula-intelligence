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
