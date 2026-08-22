# Four Mobile Wedding Designs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build four local mobile design variants while preserving the original wedding invitation.

**Architecture:** Keep one semantic HTML document and one behavior module. A tiny query-parameter bootstrap adds a theme class, while a dedicated CSS file provides four isolated visual systems; a separate local gallery links to every variant.

**Tech Stack:** Static HTML, CSS, JavaScript, Node test runner.

## Global Constraints

- Do not deploy any variant.
- Preserve all existing copy and functional links.
- Keep `?design=original` free of variant overrides.
- Optimize for 360–430px mobile viewports.

---

### Task 1: Theme routing and regression coverage

**Files:**
- Modify: `index.html`
- Modify: `invitation.mjs`
- Modify: `tests/structure.test.mjs`

- [ ] Add a failing structural test requiring theme links, query routing, and original fallback.
- [ ] Run `node --test tests/*.test.mjs` and confirm the new assertion fails.
- [ ] Add the theme stylesheet and query bootstrap.
- [ ] Re-run tests and confirm they pass.

### Task 2: Four mobile visual systems

**Files:**
- Create: `design-variants.css`
- Test: `tests/structure.test.mjs`

- [ ] Add a failing test requiring four isolated theme roots and mobile rules.
- [ ] Implement Editorial Ivory, Cinematic, Romantic Album, and Modern Minimal.
- [ ] Verify reduced-motion rules, contrast, compact schedule spacing, media composition, and button states.
- [ ] Re-run the complete test suite.

### Task 3: Local comparison gallery

**Files:**
- Create: `preview.html`
- Create: `preview.css`
- Test: `tests/structure.test.mjs`

- [ ] Add a failing test requiring original plus A/B/C/D preview links.
- [ ] Build a responsive local gallery with embedded phone previews and direct open buttons.
- [ ] Start the local server on the LAN-capable host and visually inspect every direction at 390×844.
- [ ] Run `node --test tests/*.test.mjs` and `git diff --check`.

