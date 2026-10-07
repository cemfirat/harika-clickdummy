# Harika Clickdummy

Editable UI/UX laboratory for **Harika Intelligence Center**.

The repository is an **HTML-first multi-page prototype**. Product content remains directly editable in individual HTML files. Truly global shell elements are shared as small HTML partials and expanded by Vite at dev/build time.

No React, JSX, Handlebars, Nunjucks or JavaScript page renderer.

## Seiten direkt bearbeiten

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

Example:

```html
<!-- @include partials/workspace-header.html {"title":"Kunden","description":"Welche Kunden betreue ich?"} -->

<div class="view-content">
  <!-- Dieser Bereich bleibt direkt editierbares Seiten-HTML. -->
</div>
```

Changing the classes or structure in `partials/workspace-header.html` updates the header on every page. Changing the values in the include line affects only that page.

## Rule

**Page HTML = page structure/content**  
**Partials = global repeated HTML**  
**LESS = styling/theme**  
**JavaScript = behavior only**

`src/app.js` may initialize UIkit, activate the current navigation item, filter a demo table, copy text or show a demo notification. It must not render page structure.

## Source of truth

- Product: `cemfirat/ccf-sites-ads`
- inspected Harika baseline: `51ef80c3e68a77e9a34a97363c9ad3644619302c`
- rules: [docs/UIKIT-BASELINE.md](docs/UIKIT-BASELINE.md)
- styleguide: [docs/STYLEGUIDE.md](docs/STYLEGUIDE.md)
- Harika → clickdummy: [docs/HARIKA-SYNC.md](docs/HARIKA-SYNC.md)
- clickdummy → Harika: [docs/UI-TRANSFER.md](docs/UI-TRANSFER.md)

## UIkit

UIkit `3.25.25` is compiled from `uikit/src/less/uikit.theme.less`. Harika theme values live in `src/themes/harika/`.

Custom LESS is limited to shell, true product-specific composition, visualizations and the prototype-only styleguide.

## Browser preview

- https://cemfirat.github.io/harika-clickdummy/

Relevant HTML, partial, UI and LESS changes merged to `main` deploy automatically to GitHub Pages.

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
├── partials/
│   ├── brand.html
│   ├── user.html
│   ├── navigation.html
│   ├── sidebar.html
│   ├── workspace-header.html
│   ├── footer.html
│   ├── mobile-nav.html
│   └── profile-modal.html
└── src/
    ├── app.js
    ├── harika-source.js
    ├── transfer-state.js
    ├── styles/
    │   ├── shell.less
    │   ├── product.less
    │   ├── visualizations.less
    │   └── prototype.less
    └── themes/
        ├── standard.less
        ├── harika.less
        ├── harika/
        └── customers/
```

## Guardrails

- mock content only
- no production credentials/APIs/writes
- no JavaScript-rendered page markup
- shared HTML only through the tiny build-time partial include
- no full template framework
- no silent product/IA drift
- no custom recreation of UIkit standard components
- exact transfer checkpoints
- **no PR before green branch CI**

## Theme system

The styling hierarchy follows UIkit's Less theme model:

```text
UIkit Standard Theme
        ↓
Harika Benutzeroberfläche
        ↓
Kunden-Childtheme
```

- Standard: `src/themes/standard.less`
- Harika: `src/themes/harika.less`
- Customer themes: `src/themes/customers/`

The Standard level imports UIkit's official `uikit.theme.less`. Harika customizes UIkit through variables/hooks, following the UIkit documentation instead of maintaining a parallel component skin.

Preview commands:

```bash
npm run dev                 # Harika Benutzeroberfläche
npm run dev:standard        # UIkit Standard reference
npm run dev:customer:ambra  # customer child theme
```

See [docs/THEMES.md](docs/THEMES.md).

