# Clickdummy → Harika UI transfer

This document defines controlled promotion from `cemfirat/harika-clickdummy` into `cemfirat/ccf-sites-ads`.

## Principle

The clickdummy is Vite + vanilla JavaScript + mock data. Harika is the productive React application with real auth, data, permissions and connectors.

Therefore accepted decisions are **ported**, never blindly copied.

## UIkit-first mapping

| Clickdummy | Harika interpretation |
| --- | --- |
| `src/styles/theme/**` | UIkit theme variables/hooks, aligned with issue #300 / future `packages/theme` |
| `src/styles/shell.less` | app shell/sidebar/responsive layout |
| `src/styles/product.less` | true product-specific layout only |
| `src/styles/visualizations.less` | charts/data visualization |
| `src/ui.js` | reusable component decisions translated into production React/UIkit |
| `src/views.js` | view composition translated into production views |
| `src/main.js` | shell/navigation semantics and interaction decisions only |

Standard UIkit geometry/skin must not be promoted as custom CSS. If a change belongs to a UIkit component, prefer its LESS variable/hook in the Harika theme layer.

## Never promote automatically

- `src/data.js` mock data
- demo names/metrics
- browser-local mutation behavior
- `src/interactions.js` demo implementation as code
- `src/harika-source.js`
- `src/transfer-state.js`
- `src/prototype/**`
- `src/styles/prototype.less`
- documentation/scripts.

## Required sequence

1. Freeze exact clickdummy source SHA.
2. Refresh current `ccf-sites-ads/main` and re-read relevant Product Blueprint / IA / issue scope.
3. Calculate the delta from the transfer checkpoint.
4. Classify each decision: UIkit theme, shell, product layout, visualization, interaction, product semantics or demo-only.
5. Create a focused Harika branch.
6. Port into production React/UIkit while preserving auth, permissions, APIs and real data.
7. Perform maximum static/build/browser checks before GitHub Actions.
8. Run one strong final branch-CI candidate.
9. **No PR before green branch CI.**
10. After successful integration, append the exact clickdummy and Harika SHAs to `UI-TRANSFER-LOG.md` and update the checkpoint.

## Parallel work

If Harika changes while the clickdummy is edited:
- refresh Harika before promotion;
- Harika semantics remain authoritative;
- resolve conflicting UI decisions explicitly;
- never silently overwrite either side.
