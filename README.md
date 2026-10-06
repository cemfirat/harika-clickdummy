# Harika Clickdummy

Interactive UI/UX prototype for **Harika Intelligence Center**.

This repository exists so layout, LESS, navigation and interaction patterns can be developed quickly without coupling design experiments to the productive Harika backend.

## Relationship to Harika

- Product source of truth: `cemfirat/ccf-sites-ads`
- Brand reference: `cemfirat/harika-site`
- Current Harika baseline: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- Harika → clickdummy sync: [docs/HARIKA-SYNC.md](docs/HARIKA-SYNC.md)
- clickdummy → Harika transfer: [docs/UI-TRANSFER.md](docs/UI-TRANSFER.md)
- promotion history: [docs/UI-TRANSFER-LOG.md](docs/UI-TRANSFER-LOG.md)

The clickdummy contains **mock data only**. It does not call production APIs and does not perform real writes.

## Local development

```bash
npm install
npm run dev
```

Production-style verification:

```bash
npm run verify
npm run preview
```

Show UI changes that are pending for an intentional Harika transfer:

```bash
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
    ├── tokens.less
    ├── layout.less
    ├── components.less
    ├── views.less
    ├── prototype.less
    └── main.less
```

The LESS split is deliberate: tokens and layout can be changed without mixing view-specific experiments into the whole interface.

## Current prototype scope

- full nine-item Harika primary navigation
- responsive app shell
- active customer / website context
- overview with KPI cards, opportunities and mock trend
- searchable/filterable customer list
- local demo create/edit customer forms
- website list with local demo add/edit flow
- customer and website context switching
- Search & SEO tabs with real click interactions
- Ads campaign detail dialog
- AI Visibility
- Prompt Center with modal and clipboard interaction
- development timeline
- settings detail dialogs
- demo profile dialog
- clickdummy-only UI Styleguide for LESS/tokens/components (footer → Styleguide)

All form changes exist only in the current browser session and are discarded on reload.

## Guardrails

- no production credentials
- no backend calls
- no DNS/auth/runtime changes
- no automatic promotion from clickdummy to Harika
- source sync before each substantial UI round
- exact commit-to-commit transfer tracking
- no PR before green branch CI
