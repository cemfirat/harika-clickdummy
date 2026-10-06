# Harika Clickdummy – UIkit-first baseline

Stand: 2026-10-06

This document locks the design-system rules for the Harika UI lab. The productive source of truth remains `cemfirat/ccf-sites-ads`.

## Audited Harika sources

The baseline was rebuilt after reviewing:

- `docs/product-blueprint.md`
- `docs/information-architecture.md`
- `docs/agency-platform-ux-audit-2026-09-18.md`
- `docs/release-audit-2026-09-03.md`
- `docs/uikit-runtime.md`
- `apps/web/app/control-center.tsx`
- `apps/web/app/globals.css`
- `apps/web/components/control-center-ui.tsx`
- current UI/UX issues, especially #66, #152, #300, #304, #306, #308, #309, #313, #318/#339, #324–#335, #342, #347 and #352.

Inspected Harika commit:

`51ef80c3e68a77e9a34a97363c9ad3644619302c`

## Non-negotiable UI rule

**UIkit first.**

Standard UI is built from UIkit primitives and semantics:

- cards: `uk-card*`
- grids/flex: `uk-grid*`, `uk-flex*`
- navigation: `ul.uk-nav > li > a`, active state on `li.uk-active`
- subnav: `uk-subnav` with native link items
- forms: `uk-form-stacked`, `uk-input`, `uk-select`, `uk-textarea`
- tables: `uk-table*`
- lists: `uk-list*`
- modals: `uk-modal-dialog`, `uk-modal-header`, `uk-modal-body`, `uk-modal-footer`
- status: `uk-label*`, `uk-badge`, `uk-alert*`
- icons/close controls: native UIkit icons and `data-uk-close`
- spacing and typography: UIkit utilities wherever they express the requirement.

A custom class must not recreate a standard UIkit component.

## LESS architecture

The clickdummy follows the architecture decided in Harika issue #300:

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

`main.less` imports the unmodified UIkit LESS source first and the Harika theme layer afterwards:

```less
@import "uikit/src/less/uikit.less";
@import "./theme/_import.less";
```

LESS is the styling source. The clickdummy must not load `uikit/dist/css/uikit.min.css` in parallel.

### Theme layer

`theme/` owns UIkit variables and component theme values such as:

- global palette and typography
- buttons
- forms/focus/placeholder
- cards
- labels
- badges
- alerts
- tables
- modals

This prevents `shell.less` or `product.less` from becoming a second UIkit theme.

### Custom CSS/LESS allowed only for

- Harika app shell and sidebar
- product-specific layout/composition
- data visualization
- true Harika-special components
- clickdummy-only styleguide layout.

## Shell baseline

The clickdummy mirrors the productive Harika shell:

- real Harika `icon.svg`
- 16.5rem dark sidebar on desktop
- native `ul.uk-nav.uk-nav-default`
- native UIkit user icon
- responsive UIkit Offcanvas on mobile
- large workspace header instead of a custom sticky topbar
- Harika radial workspace background
- one content `main` landmark plus a visible-on-focus skip link, following open accessibility issue #334.

## Accessibility baseline

- native links for navigation; no buttons disguised as UIkit nav items
- native HTML tables remain tables
- horizontally scrollable table regions are keyboard focusable and named
- status is text plus color, never color alone
- full `uk-alert` base class with modifiers
- modals use native UIkit header/body/footer and close controls
- no manual `?`, `×` or `…` icon geometry
- external links announce that they open a new tab
- form labels are explicit and tied to controls.

## Clickdummy-only behavior

Mock data, local mutations, demo notifications and the styleguide remain prototype behavior. They never imply production APIs or writes.

The visual baseline is not a second product specification. Harika product semantics and the current repository issues remain authoritative.
