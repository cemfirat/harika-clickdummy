# Clickdummy → Harika UI transfer

This document defines controlled promotion from `cemfirat/harika-clickdummy` into `cemfirat/ccf-sites-ads`.

## Principle

The clickdummy is a Vite-served HTML UI lab with directly editable page HTML and small shared build-time partials. Harika is the productive React application with real auth, data, permissions and connectors.

Accepted decisions are **ported**, never copied blindly.

## Mapping

| Clickdummy | Harika interpretation |
| --- | --- |
| root product `*.html` pages | page-specific HTML/UIkit structure and view composition translated into production React/UIkit |
| `partials/**` | shared shell/header/footer/navigation decisions translated into production shared components |
| `src/styles/theme/**` | UIkit theme variables/hooks |
| `src/styles/shell.less` | app shell/sidebar/responsive layout |
| `src/styles/product.less` | true product-specific layout only |
| `src/styles/visualizations.less` | charts/data visualization |
| `src/app.js` | behavior decisions only; never production data/auth logic |

The build-time include mechanism itself is a clickdummy editing aid and is not a production architecture requirement.

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
4. Classify each decision: page HTML, shared partial, theme, shell, product layout, visualization, behavior or demo-only.
5. Create a focused Harika branch.
6. Port accepted decisions into production React/UIkit while preserving auth, permissions, APIs and real data.
7. Perform maximum static/build/browser checks before GitHub Actions.
8. Run one strong final branch-CI candidate.
9. **No PR before green branch CI.**
10. Log exact clickdummy and Harika SHAs after successful integration.
