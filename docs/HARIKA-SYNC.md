# Harika source sync

The clickdummy is the editable UI/UX laboratory for **Harika Intelligence Center**. It is not a second product implementation.

## Source of truth

- `cemfirat/ccf-sites-ads`
- inspected commit: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- inspected: 2026-10-06

Before substantial UI work inspect:
- Product Blueprint
- information architecture
- relevant open UI/UX issues
- productive shell/components
- current UIkit dependency/theme state.

## HTML-first sync rule

Harika → clickdummy sync updates either:

- the relevant root HTML page for page-specific structure, or
- a file in `partials/` when the productive change is genuinely global.

Do not hide synchronized structure in browser JavaScript.

## Shared shell rule

Global shell elements are centralized so they can be edited once:

- Header → `partials/workspace-header.html`
- Footer → `partials/footer.html`
- Sidebar → `partials/sidebar.html`
- Navigation → `partials/navigation.html`
- Mobile Navigation → `partials/mobile-nav.html`

Page content remains directly in each root HTML page.

## Navigation baseline

1. `index.html` — Übersicht
2. `kunden.html`
3. `websites.html`
4. `search-seo.html`
5. `ads.html`
6. `ai-visibility.html`
7. `prompt-center.html`
8. `entwicklung.html`
9. `einstellungen.html`

`styleguide.html` is prototype-only.

## Styling contract

- UIkit source remains unmodified.
- `src/styles/main.less` imports `uikit/src/less/uikit.less`.
- `src/styles/theme/` owns UIkit theme values.
- `shell.less` owns app shell/layout.
- `product.less` owns real Harika-specific composition only.
- `visualizations.less` owns charts.
- `prototype.less` is styleguide-only.
- `src/app.js` is behavior-only.

## Authority order

1. Product Blueprint
2. information architecture
3. scoped issue / Definition of Done
4. productive implementation where consistent with 1–3
5. clickdummy experiment.
