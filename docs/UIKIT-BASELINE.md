# Harika Clickdummy – UIkit-first / HTML-first baseline

Stand: 2026-10-06

This document locks the design-system and editing rules for the Harika UI lab. The productive source of truth remains `cemfirat/ccf-sites-ads`.

## Core editing rule

**HTML first. UIkit first.**

The clickdummy is intentionally a classic multi-page HTML prototype.

Each Harika area has its own editable root HTML file:

- `index.html` — Übersicht
- `kunden.html`
- `websites.html`
- `search-seo.html`
- `ads.html`
- `ai-visibility.html`
- `prompt-center.html`
- `entwicklung.html`
- `einstellungen.html`
- `styleguide.html` — prototype-only UI lab.

The visible page structure and UIkit classes must be readable directly in these files.

### Deliberate duplication

Sidebar, mobile navigation, workspace header and footer are deliberately duplicated across the HTML pages.

That is normally not ideal application architecture, but it is correct for this UI lab because Cem must be able to directly edit the actual HTML structure and classes of every page without a template engine, JSX, render function or hidden partial.

Do not introduce Nunjucks, Handlebars, JSX, React templates or JavaScript string rendering for page structure.

## JavaScript boundary

`src/app.js` is behavior-only.

Allowed:
- initialize UIkit and icons
- customer table filtering
- clipboard behavior
- demo form submission notifications
- small progressive-enhancement interactions.

Not allowed:
- `innerHTML` page rendering
- HTML template strings for pages
- creating structural DOM nodes in JavaScript
- a JS router replacing the individual HTML pages.

## Audited Harika sources

The baseline remains grounded in:

- `docs/product-blueprint.md`
- `docs/information-architecture.md`
- `docs/agency-platform-ux-audit-2026-09-18.md`
- `docs/release-audit-2026-09-03.md`
- `docs/uikit-runtime.md`
- `apps/web/app/control-center.tsx`
- `apps/web/app/globals.css`
- `apps/web/components/control-center-ui.tsx`
- relevant UI/UX issues, especially #66, #152, #300, #304, #306, #308, #309, #313, #318/#339, #324–#335, #342, #347 and #352.

Inspected Harika commit:

`51ef80c3e68a77e9a34a97363c9ad3644619302c`

## UIkit rule

Standard UI is built from UIkit primitives and semantics:

- cards: `uk-card*`
- grids/flex: `uk-grid*`, `uk-flex*`
- navigation: `ul.uk-nav > li > a`, active state on `li.uk-active`
- subnav/switcher: native UIkit markup and behavior
- forms: `uk-form-stacked`, `uk-input`, `uk-select`, `uk-textarea`
- tables: `uk-table*`
- lists: `uk-list*`
- modals: `uk-modal*`
- status: `uk-label*`, `uk-badge`, `uk-alert*`
- icons/close controls: UIkit icons and `data-uk-close`
- spacing/typography: UIkit utilities where they express the requirement.

A custom class must not recreate a standard UIkit component.

## LESS architecture

```text
src/styles/
├── main.less
├── theme/
│   ├── _import.less
│   ├── variables.less
│   ├── base.less
│   ├── button.less
│   ├── card.less
│   ├── form.less
│   ├── label.less
│   ├── badge.less
│   ├── alert.less
│   ├── table.less
│   └── modal.less
├── shell.less
├── product.less
├── visualizations.less
└── prototype.less
```

`main.less` imports the unmodified UIkit LESS source and then the Harika theme layer.

Custom LESS is limited to:
- Harika app shell
- true product-specific composition
- data visualization
- true Harika-special components
- prototype-only styleguide layout.

## Accessibility baseline

- native links for navigation
- one `main` landmark per page
- visible-on-focus skip link
- native HTML tables
- focusable/named horizontal table regions
- status text in addition to color
- native UIkit modals and close controls
- external links announce new-tab behavior
- labels tied to form controls.

## Product authority

The HTML files are an editable UI lab, not a second product specification. Harika Product Blueprint, IA and current scoped issues remain authoritative.
