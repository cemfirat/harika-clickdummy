# Harika source sync

The clickdummy is a UI/UX laboratory for **Harika Intelligence Center**. It is not a second product implementation and must not drift into an independent product specification.

## Source of truth

Primary product repository:

- `cemfirat/ccf-sites-ads`
- current inspected commit: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- inspected on: 2026-10-06

Brand reference:

- `cemfirat/harika-site`

The same state is recorded in `src/harika-source.js`.

## Before every UI development round

1. Read the current `main` SHA of `cemfirat/ccf-sites-ads`.
2. Compare it with `src/harika-source.js`.
3. If it changed, inspect at least:
   - `docs/information-architecture.md`
   - `docs/product-blueprint.md`
   - `apps/web/app/control-center.tsx`
   - `apps/web/app/globals.css`
   - `apps/web/components/control-center-ui.tsx`
4. Classify changes:
   - product behavior / information architecture: Harika remains authoritative;
   - naming, navigation or semantics: update the clickdummy;
   - production-only API/auth/backend behavior: do not copy into the clickdummy;
   - visual changes: compare them with the clickdummy and deliberately merge or supersede them.
5. Update `src/harika-source.js` only after the relevant differences have been reviewed.

## Direction of changes

The sync is intentionally asymmetric:

- **Harika → clickdummy:** product truth, navigation, terminology, available features and relevant production UI changes are pulled into the clickdummy.
- **clickdummy → Harika:** layout, LESS, component and UX experiments are prototypes. They are promoted to Harika only after they are intentionally accepted.

Never automatically overwrite production Harika UI with clickdummy code.

## Current navigation baseline

1. Übersicht
2. Kunden
3. Websites
4. Search & SEO
5. Ads
6. AI Visibility
7. Prompt Center
8. Entwicklung
9. Einstellungen

Freigaben, technische Audit objects and request IDs are not primary navigation items.

## Styling contract

The clickdummy deliberately separates styling into:

- `src/styles/tokens.less` — Harika palette and design tokens
- `src/styles/layout.less` — app shell, sidebar, topbar, responsive layout
- `src/styles/components.less` — reusable UI building blocks
- `src/styles/views.less` — view-specific compositions
- `src/styles/main.less` — import entry point

This split is intended to make parallel UI work safe and easy to review.
