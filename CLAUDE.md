# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static study site reviewing PostgreSQL — one HTML page per topic, hand-authored, no framework, no build step. The site exists to be read; the design aesthetic is "editorial / technical-journal" (serif display, generous whitespace, warm paper background, oxblood accent).

12 pages: `index.html` (landing) + 11 chapter pages (`transactions.html`, `isolation-levels.html`, `mvcc.html`, `locking-deadlocks.html`, `joins.html`, `aggregates-group-by.html`, `window-functions.html`, `ctes.html`, `indexes.html`, `explain-planner.html`, `jsonb.html`).

## Serving locally

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

`.claude/launch.json` is set up so Claude Code's preview tools can `preview_start` the server by the name `sql-review`.

There is no build, no lint, no test command — every file in the repo is what ships.

## Architecture: how the pages are built

**All twelve pages share one stylesheet** (`assets/styles.css`) and one Prism syntax-highlighting bundle (`assets/prism.js` + `assets/prism-sql.js`, self-hosted from cdnjs). No per-page CSS, no inline `<style>`. When something looks wrong, the fix almost always lives in `styles.css`.

Every chapter page follows the same skeleton — change the skeleton once, change it everywhere:

```
<header class="site-header">  brand + sticky top nav
<main class="page">
  <header class="masthead">   chapter number + title + standfirst
  <section>                   lede + body sections (h2.num + h2)
  <div class="cheat-sheet">   one-card recap
  <section class="further">   links into the official Postgres docs
  <nav class="chapter-nav">   prev/next chapter buttons
<footer class="site-footer">
```

`transactions.html` is the canonical template — when adding a new chapter, copy from there.

## The component vocabulary

These class names are load-bearing. Use the existing ones rather than inventing new ones; the responsive rules are tied to them.

| Class | What it is |
|---|---|
| `.example` / `.example.split` | A query block + result table. `.split` puts query and result side-by-side on wide screens (collapses ≤1000px). |
| `.example .result-wrap` + `<table class="result">` | The pre-rendered output of the query above. |
| `.callout` + modifier (`.note` / `.warning` / `.pitfall`) | Coloured aside with a small-caps label. |
| `aside.marginalia` | Editorial marginal note. Lives in the left gutter on wide screens, collapses inline with an accent border on narrow. |
| `.kv` | Two-column `<dl>` for key-value definitions. Stacks ≤600px. |
| `.cheat-sheet` + inner `<dl>` | The dark recap card at the end of each chapter. Stacks ≤700px. |
| `.sessions` | Three-column grid (T / Session A / Session B) for parallel SQL-session timelines (isolation, deadlocks). |
| `.matrix` | The lock-mode conflict matrix on `locking-deadlocks.html`. |
| `.venn-grid` + `.venn-card` + `.venn` | CSS-only Venn diagrams on `joins.html`. |
| `.toc-grid` + `.toc-card` | The chapter cards on `index.html`. |
| `.data-table` (wraps a `<table class="data">`) | Standalone reference table on the paper background. |

## Design tokens

All colour, font, and spacing tokens live as CSS variables in `:root` at the top of `styles.css`:

- Palette: `--paper`, `--ink`, `--ink-muted`, `--rule`, `--accent` (oxblood), `--code-bg`, plus Prism-specific code colours.
- Fonts: `--font-display` (Fraunces), `--font-body` (Source Serif 4), `--font-mono` (JetBrains Mono) — all loaded from Google Fonts via `@import` at the top of the stylesheet.
- Layout: `--max-w`, `--main-w`, `--gutter` define the three-column page grid.

Change a variable → every chapter updates.

## The minmax(0, …) rule — non-negotiable

CSS Grid's bare `1fr` is `minmax(auto, 1fr)`, which lets a wide child (a long `<pre>`, the lock matrix) push the track — and therefore the whole page — past the viewport. Every grid track in this codebase uses `minmax(0, 1fr)` for this reason. When adding new layouts:

- Use `minmax(0, 1fr)` everywhere — never bare `1fr`.
- Wide internal scrollers (`<pre>`, `.data-table`, `.matrix`) must have `overflow-x: auto` and `max-width: 100%`.
- `html { overflow-x: clip }` is the global safety net; don't rely on it as a primary fix.

If a page starts overflowing horizontally on mobile, this is almost always the cause.

## Responsive breakpoints

The stylesheet uses these breakpoints, in this order of significance:

- **≤1000px** — three-column page grid collapses to one; marginalia moves inline; `.example.split` stacks.
- **≤700px** — masthead stacks (chapter number above title); sessions grid tightens; cheat-sheet `<dl>` stacks.
- **≤600px** — `.kv` lists stack.
- **≤520px** — chapter-nav stacks vertically.
- **≤480px** — small final polish (drop site-header `em`, smaller padding, smaller code font).

When adding a new component, test at 375px (iPhone SE) before considering it done.

## Cross-references between chapters

There are three places that name every chapter; keep them in sync when adding/renaming/reordering:

1. The `<nav>` inside each chapter's `.site-header` (one current-page marker per file).
2. Each chapter's `.chapter-nav` prev/next links at the bottom.
3. The `.toc-grid` on `index.html` (also has the "Suggested reading paths" callouts below).

No automated check enforces this — eyeball it after every change.

## Content conventions

- SQL examples must be Postgres-specific (system catalogs, GUCs, lock-mode names, real error codes like `40001` / `40P01`). Generic SQL is not the point of the site.
- Result tables under `.example` should be the **actual** output a real Postgres would produce against the stated schema, not made up.
- Cite the official docs (`https://www.postgresql.org/docs/current/...`) in the "Further reading" section of every chapter.
- Every non-trivial Postgres claim is worth cross-checking against the docs before it ships.
