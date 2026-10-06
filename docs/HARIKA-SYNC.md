# Harika source sync

The clickdummy is a UI/UX laboratory for **Harika Intelligence Center**. It is not a second product implementation or specification.

## Source of truth

Primary repository:

- `cemfirat/ccf-sites-ads`
- current inspected commit: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- inspected on: 2026-10-06

Before a substantial UI round, inspect at least:

- `docs/product-blueprint.md`
- `docs/information-architecture.md`
- relevant open UI/UX issues
- `apps/web/app/control-center.tsx`
- `apps/web/app/globals.css`
- `apps/web/components/control-center-ui.tsx`
- current UIkit dependency/lock state.

The detailed audited UI rule is in [UIKIT-BASELINE.md](UIKIT-BASELINE.md).

## Authority order

1. Product Blueprint
2. information architecture
3. current scoped issue / Definition of Done
4. productive implementation where it does not contradict 1–3
5. clickdummy experiment.

If a clickdummy experiment conflicts with Harika semantics, Harika wins until the product decision is intentionally changed.

## Navigation baseline

1. Übersicht
2. Kunden
3. Websites
4. Search & SEO
5. Ads
6. AI Visibility
7. Prompt Center
8. Entwicklung
9. Einstellungen

Approvals, request IDs and technical audit objects are not primary navigation.

## UIkit-first styling contract

The clickdummy follows Harika issue #300:

- UIkit source remains unmodified.
- `src/styles/main.less` imports `uikit/src/less/uikit.less`.
- `src/styles/theme/` contains UIkit variables/theme mappings.
- `src/styles/shell.less` is reserved for app shell/navigation/layout.
- `src/styles/product.less` contains only true Harika-specific composition.
- `src/styles/visualizations.less` contains charts/data visualization.
- `src/styles/prototype.less` is clickdummy-only.
- standard UIkit components are not restyled a second time in shell/product/prototype files.

## Direction of changes

**Harika → clickdummy**

Always sync:
- product truth
- navigation/terminology
- UIkit/design-system rules
- relevant accessibility rules
- productive shell/component changes.

**Clickdummy → Harika**

Only deliberately promote accepted:
- UIkit theme variable/hook decisions
- shell/layout changes
- product-specific composition
- visualization decisions
- interaction decisions that preserve production auth/data/API behavior.

Never auto-overwrite production.
