# Harika Clickdummy

Editable UI/UX laboratory for **Harika Intelligence Center**.

The repository is intentionally a classic **multi-page HTML prototype**. The visible structure and UIkit classes live directly in individual HTML files so they can be edited precisely without digging through JavaScript render functions.

## Edit these pages directly

| Area | File |
| --- | --- |
| Übersicht | `index.html` |
| Kunden | `kunden.html` |
| Websites | `websites.html` |
| Search & SEO | `search-seo.html` |
| Ads | `ads.html` |
| AI Visibility | `ai-visibility.html` |
| Prompt Center | `prompt-center.html` |
| Entwicklung | `entwicklung.html` |
| Einstellungen | `einstellungen.html` |
| UI-Labor | `styleguide.html` |

Sidebar, Header, mobile Navigation and Footer are intentionally duplicated in these HTML files. For this repository that is a feature: the exact page markup must remain directly editable.

## Rule

**HTML = structure and UIkit classes**  
**LESS = styling/theme**  
**JavaScript = behavior only**

`src/app.js` may initialize UIkit, filter a demo table, copy text or show a demo notification. It must not render page structure.

No JSX, Nunjucks, Handlebars or JS page renderer.

## Source of truth

- Product: `cemfirat/ccf-sites-ads`
- inspected Harika baseline: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- rules: [docs/UIKIT-BASELINE.md](docs/UIKIT-BASELINE.md)
- Harika → clickdummy: [docs/HARIKA-SYNC.md](docs/HARIKA-SYNC.md)
- clickdummy → Harika: [docs/UI-TRANSFER.md](docs/UI-TRANSFER.md)

## UIkit

UIkit `3.25.25` is compiled from `uikit/src/less/uikit.less`. Harika theme values live in `src/styles/theme/`.

Custom LESS is limited to shell, true product-specific composition, visualizations and the prototype-only styleguide.

## Browser preview

- https://cemfirat.github.io/harika-clickdummy/

Relevant HTML/UI/LESS changes merged to `main` deploy automatically to GitHub Pages.

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

## Source layout

```text
/
├── index.html
├── kunden.html
├── websites.html
├── search-seo.html
├── ads.html
├── ai-visibility.html
├── prompt-center.html
├── entwicklung.html
├── einstellungen.html
├── styleguide.html
└── src/
    ├── app.js
    ├── harika-source.js
    ├── transfer-state.js
    └── styles/
        ├── main.less
        ├── theme/
        ├── shell.less
        ├── product.less
        ├── visualizations.less
        └── prototype.less
```

## Guardrails

- mock content only
- no production credentials/APIs/writes
- no JavaScript-rendered page markup
- no silent product/IA drift
- no custom recreation of UIkit standard components
- exact transfer checkpoints
- **no PR before green branch CI**
