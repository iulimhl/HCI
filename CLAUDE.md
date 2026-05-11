# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running locally

No build system — static HTML with React 18 + Babel compiled in the browser.

```bash
npx serve -l 3456 .
# or
python -m http.server 8080
```

Open `intelliden.html` (not index.html) in the browser.

## Architecture

**Intelliden** is a smart-home OS design prototype rendered as a Figma-like canvas with four device artboards (phone, tablet, AR, watch).

### Entry point

`intelliden.html` loads React/ReactDOM/Babel from CDN, then each `.jsx` file as `<script type="text/babel">`. The inline `<script>` at the bottom defines `App` and mounts it.

### Script load order matters

Scripts are loaded sequentially and depend on prior globals. Current order:
`design-canvas.jsx` → `ios-frame.jsx` → `tweaks-panel.jsx` → `theme.jsx` → `phone.jsx` → `tablet.jsx` → `ar.jsx` → `watch.jsx` → `personas.jsx` → `research.jsx` → `styleguide.jsx`

Every file exports to `window` via `Object.assign(window, { ... })`. Cross-file references rely on this — there are no ES module imports.

### Key layers

- **`design-canvas.jsx`** — Pan/zoom canvas (`DesignCanvas`, `DCSection`, `DCArtboard`). Persists layout to `.design-canvas.state.json`.
- **`theme.jsx`** — Shared data and design tokens. `getPalette(theme, time)` returns OKLCH-based color palette. `HOUSEHOLDS`, `PERMS`, `ROOMS`, `SCENES`, `ENERGY` provide household data. Also exports `Glyph` (SVG icons), `useToast`/`Toast`, and `PersonaSwitcherModal`.
- **`phone.jsx` / `tablet.jsx` / `ar.jsx` / `watch.jsx`** — Device-specific dashboards. Each receives `pal`, `household`, `perm`, `persona`, `onPersonaChange` props.
- **`tweaks-panel.jsx`** — Live settings sidebar (`TweakRadio`, `TweakToggle`, `TweakSlider`, etc.) for switching persona/theme/time.
- **`ios-frame.jsx`** — iOS 26 Liquid Glass device chrome (status bar, nav bar, keyboard).

### State management

Global state flows through `useTweaks(defaults)` in App. Three tweaks: `theme` (light/dark), `time` (dawn/day/dusk/night), `persona` (owner/family/guest). The `PERMS` object gates which UI elements appear per persona.

### Persona system

Three roles — Owner, Family, Guest — each with different permission levels. `PersonaSwitcherModal` (in `theme.jsx`) is shared across phone, tablet, and AR. It accepts a `glass` prop for the AR frosted-glass variant.

## Fonts

- **Instrument Serif** — display headings
- **Geist** — UI text
- **JetBrains Mono** — metadata labels, small caps

## Other files

- `personas.jsx` — Persona profile cards for the personas section
- `research.jsx` — Research dossier cards (interviews, competitor analysis, observational)
- `styleguide.jsx` — Visual design system reference (colors, typography, components)
