# Clickdummy → Harika UI transfer

This document defines controlled promotion from `cemfirat/harika-clickdummy` into `cemfirat/ccf-sites-ads`.

## Principle

The clickdummy is a Vite-served **multi-page HTML UI lab** with mock content. Harika is the productive React application with real auth, data, permissions and connectors.

Accepted decisions are **ported**, never copied blindly.

## Mapping

| Clickdummy | Harika interpretation |
| --- | --- |
| root product `*.html` pages | visible HTML/UIkit structure and view composition translated into production React/UIkit |
| `src/styles/theme/**` | UIkit theme variables/hooks |
| `src/styles/shell.less` | app shell/sidebar/responsive layout |
| `src/styles/product.less` | true product-specific layout only |
| `src/styles/visualizations.less` | charts/data visualization |
| `src/app.js` | behavior decisions only; never production data/auth logic |

The deliberate HTML duplication in the clickdummy is an editing aid and must not be copied into production architecture.

## Never promote automatically

- mock customer/website/metric content
- demo form behavior
- `styleguide.html`
- `src/styles/prototype.less`
- `src/harika-source.js`
- `src/transfer-state.js`
- documentation/scripts.

## Required sequence

1. Freeze exact clickdummy source SHA.
2. Refresh current `ccf-sites-ads/main` and relevant Product Blueprint / IA / issue scope.
3. Calculate the delta from the transfer checkpoint.
4. Classify each decision: HTML/UIkit structure, theme, shell, product layout, visualization, behavior or demo-only.
5. Create a focused Harika branch.
6. Port the accepted decision into production React/UIkit while preserving auth, permissions, APIs and real data.
7. Perform maximum static/build/browser checks before GitHub Actions.
8. Run one strong final branch-CI candidate.
9. **No PR before green branch CI.**
10. Log exact clickdummy and Harika SHAs after successful integration.

## Parallel work

If Harika changes while the clickdummy is edited:
- refresh Harika before promotion;
- Harika semantics remain authoritative;
- resolve conflicts explicitly;
- never silently overwrite either side.
