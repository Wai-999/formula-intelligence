# Design system

Calm, dense-enough, readable: a study tool, not a dashboard of effects. One accent colour, one type scale, one set of primitives. Everything here is CSS custom properties and plain classes — no CSS-in-JS, no component library.

Sources: tokens in `src/index.css` (`:root` = dark, `[data-theme='light']` = light); primitives in `src/styles/studio.css`; shell in `src/components/layout/*.css`; labs in `src/features/labs/labs.css`.

## Themes

Three choices in Settings → Appearance: **Match my device** (default; follows `prefers-color-scheme` and switches live), **Light**, **Dark**. Stored in `fi_theme_v1`; a tiny inline script in `index.html` applies it before first paint, so there is no flash of the wrong theme. The light palette is designed, not inverted: every token is re-chosen for contrast on a light ground.

## Colour tokens

| Token | Dark | Light | Use |
|---|---|---|---|
| `--surface` | `#10111f` | `#f7f8fb` | page |
| `--surface-raised` | `#1a1a3a` | `#ffffff` | cards |
| `--surface-deep` | `#0b0c18` | `#eef1f6` | code, wells |
| `--border-solid` | `#2a2a4a` | `#dfe3ec` | card borders |
| `--text-primary` | `#f4f7fb` | `#10131c` | body text |
| `--text-muted` | `#9aa3b2` | `#46506a` | secondary text |
| `--text-faint` | `#7c8798` | `#5c6780` | eyebrows, captions (still ≥ 4.5:1) |
| `--primary` / `--primary-text` | `#8b5cf6` / `#a78bfa` | `#7c3aed` / `#6d28d9` | the single accent; links and selected states |
| `--accent` | `#22d3ee` | `#0e7490` | focus ring, highlights in labs |
| `--success` / `--warning` / `--danger` | `#34d399` / `#fbbf24` / `#fb7185` | `#047857` / `#854d0e` / `#be123c` | **state only** — never decoration |

Primary buttons use `#7c3aed` (dark) / `#6d28d9` (light) rather than `--primary`: white on `#8b5cf6` measures 4.2:1, below AA for 14 px text. Status is never colour alone: chips carry an icon and a word (`.studio-chip-ok` = check + "Authored").

Contrast is verified by axe on every page in both themes (`docs/ACCESSIBILITY_REPORT.md`).

## Type

- Family: `--font-sans` (Inter, falling back to the system UI font); `--font-mono` for code.
- Scale (px): **12 · 13 · 14 · 16 · 18 · 22 · 28**. Page title 22–28; section heading (`.studio-h2`) 18; card heading (`.studio-h3`) 14 bold; reading text 16 at line-height 1.6; secondary (`.studio-muted`) 13; eyebrow (`.studio-eyebrow`) 11 uppercase, 0.08 em tracking.
- Reading measure capped at **70ch** (`.studio-read`, `.studio-lede`). Headings use `text-wrap: balance`.
- Math: KaTeX with MathML output; display math scrolls horizontally inside its own box (focusable only when it actually overflows), never the page.

## Space, shape, layout

- Spacing steps 4 · 6 · 8 · 10 · 12 · 16 · 24 · 64 px; siblings are spaced by `gap` in flex/grid, not margins.
- Radii `--radius-sm` 6, `--radius-md` 10, `--radius-lg` 16.
- `.studio-page`: max 1080 px, 24 px padding (16 px under 768 px), sections 24 px apart.
- `.studio-grid`: `repeat(auto-fill, minmax(min(100%, 280px), 1fr))` — never overflows at 320 px.
- Wide content (tables, code, plots) scrolls inside `.studio-table-wrap` / its own container; the page never scrolls sideways (tested at 320 px on every page).

## Breakpoints and shell

| Width | Navigation | Header |
|---|---|---|
| ≥ 1024 px | labelled sidebar with the five destinations (collapsible, remembered) | full search field |
| 768–1023 px | icon rail with labels on hover/focus | compact |
| < 768 px | bottom bar: Home · Learn · Practice · Apply · Progress (no More menu) | icon search; settings under My Progress |

Focus mode (`f`, or the header button) hides all navigation for reading.

## Primitives — `src/styles/studio.css`

`.studio-scroll` (the page's scroll container) · `.studio-page` · `.studio-section` · `.studio-read` · `.studio-lede` · `.studio-h2` · `.studio-h3` · `.studio-eyebrow` · `.studio-muted` · `.studio-grid` · `.studio-card` / `.studio-card-link` · `.studio-row` · `.studio-btn` (40 px tall) / `.studio-btn-primary` / `.studio-btn-small` (32 px) · `.studio-chip` (+ `-ok`, `-warn`, `-bad`, `-accent`) · `.studio-callout` (+ variants) · `.studio-meter` · `.studio-list` · `.studio-fieldset` / `.studio-choice` · `.studio-input` / `.studio-textarea` · `.studio-table-wrap` / `.studio-table`.

Rules: one primary button per view; no streaks, points, badges or confetti (V4 §1, §4); links look like links (underlined); buttons say what happens ("Check", "Start a new mixed set"); `aria-pressed` for toggles; every control at least 24 × 24 px (WCAG 2.5.8), most 32–40 px.

## Focus

One indicator for every control: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`. Keyboard focus only — pointer clicks don't show rings. After navigation, focus moves to the page's `<h1>` so screen-reader and keyboard users start at the new content.

## Motion

Motion only explains a change (a panel opening, a value moving); nothing loops for decoration. Two off-switches, both honoured everywhere: the OS `prefers-reduced-motion`, and Settings → Motion → *Reduce motion* (`data-motion="reduce"` on `<html>`, stored in `fi_motion_v1`), which sets every animation and transition to ~0 ms. Lab tweens and D3 transitions read the same setting (`src/lib/motion.js`).

## Disclosures and views

Optional depth is a disclosure, never a separate place: lessons put the readiness check, derivation, assumptions, Python and reading behind `<details>` (`.lesson-disclosure`, a 44 px summary row). Several views of one thing are a `ViewSwitch` (`src/components/layout/ViewSwitch.jsx`): links styled as a segmented control, each a real address.

## Labs

`LabFrame` gives 19 of the 20 labs the same anatomy (the bias–variance lab is the older ML Playground): question → controls (labelled sliders and segmented buttons) → plot → **live numeric readout** → **numbers view** (a table/text alternative to the picture). Plots use `--accent` for the learner's object, `--primary-text` for the reference, muted greys for grids, and never encode meaning by colour alone (dashes and labels too).

## Icons

Tabler icon font from cdnjs (cached for offline use), always `aria-hidden` beside a text label; icon-only buttons carry `aria-label`.
