# Harika Clickdummy

Interactive UI/UX prototype for **Harika Intelligence Center**.

This repository exists so layout, LESS, navigation and interaction patterns can be developed quickly without coupling design experiments to the productive Harika backend.

## Relationship to Harika

- Product source of truth: `cemfirat/ccf-sites-ads`
- Brand reference: `cemfirat/harika-site`
- Current Harika baseline: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- Sync rules: [docs/HARIKA-SYNC.md](docs/HARIKA-SYNC.md)

The clickdummy contains **mock data only**. It does not call production APIs and does not perform real writes.

## Local development

```bash
npm install
npm run dev
```

Production-style build:

```bash
npm run build
npm run preview
```

## UI structure

```text
src/
├── main.js
├── data.js
├── harika-source.js
├── ui.js
├── views.js
└── styles/
    ├── tokens.less
    ├── layout.less
    ├── components.less
    ├── views.less
    └── main.less
```

The LESS split is deliberate: tokens and layout can be changed without mixing view-specific experiments into the whole interface.

## Current prototype scope

- full nine-item Harika primary navigation
- responsive app shell
- active customer / website context
- overview with KPI cards, opportunities and mock trend
- customer list
- website list
- Search & SEO
- Ads
- AI Visibility
- Prompt Center with modal and clipboard interaction
- development timeline
- settings overview

## Guardrails

- no production credentials
- no backend calls
- no DNS/auth/runtime changes
- no automatic promotion from clickdummy to Harika
- source sync before each substantial UI round
