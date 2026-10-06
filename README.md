# Harika Clickdummy

UI/UX laboratory for **Harika Intelligence Center**.

The clickdummy mirrors the productive Harika information architecture and shell while using mock data only. It exists to test deliberate UI/LESS decisions without coupling experiments to production APIs, authentication or writes.

## Source of truth

- Product: `cemfirat/ccf-sites-ads`
- Inspected Harika baseline: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- UIkit baseline rules: [docs/UIKIT-BASELINE.md](docs/UIKIT-BASELINE.md)
- Harika → clickdummy sync: [docs/HARIKA-SYNC.md](docs/HARIKA-SYNC.md)
- clickdummy → Harika transfer: [docs/UI-TRANSFER.md](docs/UI-TRANSFER.md)
- transfer history: [docs/UI-TRANSFER-LOG.md](docs/UI-TRANSFER-LOG.md)

## Design-system rule

**UIkit first.**

The clickdummy compiles the unmodified UIkit LESS source and applies the Harika theme through UIkit variables/component theme files. It does not import the prebuilt UIkit CSS and then rebuild Cards, Forms, Navs, Modals or Status components with a second custom design system.

Custom LESS is limited to Harika shell/layout, data visualization, true product-specific composition and clickdummy-only prototype layout.

## Browser preview

Immediate browser workspace:

- https://stackblitz.com/github/cemfirat/harika-clickdummy?startScript=dev

Planned GitHub Pages preview:

- https://cemfirat.github.io/harika-clickdummy/

Pages remains manually deployed while repository Pages activation is pending.

## Local development

```bash
npm install
npm run dev
```

Verification:

```bash
npm run verify
npm run transfer:status
```

## UI structure

```text
src/
├── main.js
├── data.js
├── harika-source.js
├── interactions.js
├── prototype/
│   └── styleguide.js
├── transfer-state.js
├── ui.js
├── views.js
└── styles/
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

## Current scope

- nine Harika primary areas
- production-aligned desktop shell and mobile UIkit Offcanvas
- real Harika icon
- compact customer table/search/filter
- website list
- local demo customer/website forms
- context switching
- Search & SEO subnav
- Ads details
- AI Visibility
- Prompt Center with native UIkit modal
- development view
- settings details
- UIkit-first styleguide.

All data changes are local to the browser session and disappear on reload.

## Guardrails

- mock data only
- no production credentials
- no backend/API calls
- no productive writes
- no silent product/IA drift
- no custom recreation of UIkit standard components
- exact commit-to-commit transfer tracking
- **no PR before green branch CI**
