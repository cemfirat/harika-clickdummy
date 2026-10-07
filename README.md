# Harika Clickdummy

Editable UI/UX laboratory for **Harika Intelligence Center**.

The repository is an **HTML-first multi-page prototype**. Product content remains directly editable in individual HTML files. Truly global shell elements are shared as small HTML partials and expanded by Vite at dev/build time.

No React, JSX, Handlebars, Nunjucks or JavaScript page renderer.

## Was ändere ich wo?

| Ich möchte ändern | Datei |
| --- | --- |
| Header-Struktur / Header-Klassen auf allen Seiten | `partials/workspace-header.html` |
| Header-Titel / Beschreibung nur einer Seite | Include-Zeile in der jeweiligen `*.html`-Datei |
| Footer auf allen Seiten | `partials/footer.html` |
| Sidebar auf allen Seiten | `partials/sidebar.html` |
| Hauptnavigation / Reihenfolge / Links | `partials/navigation.html` |
| Logo / Brand-Markup | `partials/brand.html` |
| Benutzerbereich in Sidebar/Mobilmenü | `partials/user.html` |
| Mobile Navigation | `partials/mobile-nav.html` |
| Profil-Modal | `partials/profile-modal.html` |
| Inhalt einer einzelnen Seite | jeweilige root-`*.html`-Datei |
| Farben / globale Theme-Werte | `src/styles/themes/interface/variables.less` |
| UIkit Buttons, Forms, Cards usw. | passende Datei in `src/styles/themes/interface/` |
| Sidebar / Workspace / Shell-Layout | `src/styles/shell.less` |
| Harika-spezifische Inhaltslayouts | `src/styles/product.less` |
| Charts / Visualisierung | `src/styles/visualizations.less` |
| Styleguide-only CSS | `src/styles/prototype.less` |
| Verhalten wie Filter / Clipboard | `src/app.js` |

Mehr Details: [docs/EDITING-GUIDE.md](docs/EDITING-GUIDE.md)

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
- Harika → clickdummy: [docs/HARIKA-SYNC.md](docs/HARIKA-SYNC.md)
- clickdummy → Harika: [docs/UI-TRANSFER.md](docs/UI-TRANSFER.md)

## UIkit

UIkit `3.25.25` is compiled from `uikit/src/less/uikit.theme.less`. Harika theme values live in `src/styles/themes/interface/`.

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
    └── styles/
        ├── main.less
        ├── themes/
        │   ├── standard.less
        │   ├── interface.less
        │   ├── interface/
        │   └── customers/
        ├── shell.less
        ├── product.less
        ├── visualizations.less
        └── prototype.less
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

- Standard: `src/styles/themes/standard.less`
- Harika UI: `src/styles/themes/interface.less`
- Customer themes: `src/styles/themes/customers/`

The Standard level imports UIkit's official `uikit.theme.less`. Harika then customizes UIkit through variables/hooks, following the UIkit documentation instead of maintaining a parallel component skin.

Preview commands:

```bash
npm run dev                 # Harika Benutzeroberfläche
npm run dev:standard        # UIkit Standard reference
npm run dev:customer:ambra  # customer child theme
```

See [docs/THEMES.md](docs/THEMES.md).

