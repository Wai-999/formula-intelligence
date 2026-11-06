# How to say each symbol

## What the owner asked for (2026-11-06)

> “Add the name — how to call each notation — to understand the individual notations when it is broken down.”

A formula is hard to learn when you cannot say it. $\bar x$ is “x bar”, $\sigma$ is “sigma”, $f'(x)$ is “f prime of x”, and $\sum$ means “the sum of”. Until now the app showed the symbols, but never how to read them.

## What changed

Every place the app breaks notation down now gives each symbol a reading. Each reading has a speaker button that plays it in the browser's own voice.

| Where | What it shows | Source of the readings |
|---|---|---|
| Every lesson, **Understand → Notation** | *Say “f of x”* under each term written in math or code: 137 terms in 40 lessons | `say` on each glossary entry (`src/data/curriculum/lessons/*.js`) |
| Every lesson's formula box (**The result**) and the concept map | The whole formula read aloud, then a table: symbol, how to say it, meaning, units. The registry's symbol meanings and units were stored before, but never shown. | `say` on each of the 57 curriculum formulas and its 104 symbols (`src/data/curriculum/formulas.js`) |
| Formula map, **Researcher depth → Notation**, and Apply → Python library, **Formula → Variables** | The reading under each symbol: 197 readings, covering every symbol that is not a plain word (“Range” and “threshold” read as themselves) | `src/data/notation/spoken.js`, keyed by the symbol as written |

The speaker button (`src/components/math/SayIt.jsx`):
- uses the browser's Web Speech API (`speechSynthesis`): the app sends nothing, records nothing and pays for nothing. Some browsers also offer online voices (Chrome's “Google …” voices send the text to their maker), so the button chooses an English voice installed on the device whenever the browser lists one;
- is left out where the browser has no voice, and the reading is still shown;
- speaks in US English at 0.85 speed. Greek names that English voices misread are respelled **for the voice only**. The page shows “mu”; the voice is given “mew” (likewise chi → “kye”, phi → “fye”, rho → “roe”, `src/lib/notation.js`).

## How the readings are written

- **Spoken words, not symbols.** “x sub i” for $x_i$, “x bar” for $\bar x$, “p hat” for $\hat p$, “q star” for $q^*$, “f prime” for $f'$, “capital X” where case matters, and “the sum from i equals one to n of …” for $\sum_{i=1}^{n}$.
- **Abbreviations are spelled out once**: “I Q R, the interquartile range”; “d f, the degrees of freedom”.
- **Code is read as a programmer would say it**: `//` is “double slash”, `T& x` is “T reference x”, `&&` is “and”.

## Checks

- `src/data/notation/__tests__/spoken.test.js` checks that:
  - every glossary term written in math or code has a reading;
  - every curriculum formula and every symbol in it has one;
  - every Formula map symbol that is not plain words has one, with no stale entries;
  - every reading is plain text, with no LaTeX, `$` or backticks;
  - the Greek respelling touches whole words only.
- `src/components/math/__tests__/SayIt.test.jsx` checks that the reading always shows, that the button appears only when the browser has a voice, and that it speaks the respelled text in English. It also checks that the formula breakdown has one row per symbol.
- `e2e/notation-readings.spec.js` runs in a real browser with a recording voice: the break-even lesson's notation list and formula table, and the speaker button saying “capital F”. A statistics lesson's button is given “mew, sigma”.

## Status

The readings are **AI-drafted** and awaiting the same human review as the lessons. They are the usual US classroom readings. Some symbols have accepted alternatives (“mu naught” or “mu sub zero”; “grad f” or “del f”), and where a common alternative exists, the reading gives both.
