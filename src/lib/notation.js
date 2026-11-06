// Saying notation aloud (src/components/math/SayIt.jsx). The readings
// themselves are authored next to the notation they read: `say` on a lesson's
// glossary entries and on curriculum formulas and their variables, and
// src/data/notation/spoken.js for the Formula map's symbol tables.

// Greek letter names that English voices tend to misread, respelled for the
// voice only: the page still shows the real name ("mu", not "mew").
const SOUNDS = { mu: 'mew', nu: 'new', xi: 'ksye', chi: 'kye', phi: 'fye', psi: 'sye', rho: 'roe', tau: 'taw', eta: 'ayta' };

/** The text handed to the speech engine for a reading. */
export const forSpeech = (text) => text.replace(/[A-Za-z]+/g, (w) => SOUNDS[w.toLowerCase()] ?? w);

/** True where the browser has its own speech synthesis (the Web Speech API). */
export const canSpeak = () => typeof window !== 'undefined'
  && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

/**
 * Speak a reading with the browser's built-in voice. Some browsers also
 * offer online voices (Chrome's “Google …” voices), so a voice installed on
 * the device is chosen whenever the browser lists one.
 */
export function speak(text) {
  if (!canSpeak()) return false;
  const u = new window.SpeechSynthesisUtterance(forSpeech(text));
  u.lang = 'en-US';
  u.rate = 0.85;
  const voices = window.speechSynthesis.getVoices?.() ?? [];
  const local = voices.filter((v) => v.localService && /^en\b|^en-/i.test(v.lang));
  const voice = local.find((v) => v.lang === 'en-US') ?? local[0];
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}
