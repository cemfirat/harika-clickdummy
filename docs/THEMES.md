# Themes

Harika follows UIkit's Less theme model. UIkit `3.25.25` remains the framework;
Harika customizes its variables and hooks rather than recreating its components.

Official references:

- [UIkit installation](https://getuikit.com/docs/installation)
- [UIkit Less themes](https://getuikit.com/docs/less)

The approved Spectrum design is documented in
[SPECTRUM-DESIGN.md](SPECTRUM-DESIGN.md).

## Theme hierarchy

```text
UIkit Standard
      ↓
Harika
      ↓
Customer
```

Each level has complete Light and Dark builds. Appearance is independent of the
selected brand. The UIkit source in `node_modules` remains unchanged.

## Compiler entry files

| Brand | Light | Dark |
| --- | --- | --- |
| Standard reference | `src/themes/standard.less` | `src/themes/standard-dark.less` |
| Harika | `src/themes/harika-light.less` | `src/themes/harika-dark.less` |
| AMBRA child theme | `src/themes/customers/ambra.less` | `src/themes/customers/ambra-dark.less` |

`src/themes/harika.less` remains the compatible Light base. It inherits
`standard.less` and loads `harika/_import.less`. The explicit Light entry imports
this base. The Dark entry adds `harika/dark.less` before Less resolves the complete
UIkit theme.

`standard.less` imports UIkit's official `uikit/src/less/uikit.theme.less`.
The Standard reference stays neutral. Customer entries inherit the matching
Harika appearance and then apply narrow customer variables. AMBRA still has no
invented branding values or assets.

Common structural styles are included in each complete build. Only the selected
appearance stylesheet is active, so the two UIkit skins do not compete in the
cascade.

## Source ownership

| Change | Owner |
| --- | --- |
| Upstream UIkit reference | `standard.less` and `standard-dark.less` |
| Neutral structural aliases | `_system-tokens.less` |
| Harika Light palette and shared variables | `harika/variables.less` |
| Harika Dark palette and component color modes | `harika/dark.less` |
| Harika component appearance | `harika/` component variables and hooks |
| Shell and responsive navigation layout | `src/styles/shell.less` |
| Website list/detail and other product composition | `src/styles/product.less` |
| Charts | `src/styles/visualizations.less` |
| Prototype documentation layout | `src/styles/prototype.less` |
| Customer branding | `customers/<slug>/variables.less` |
| Optional real customer assets | `customers/<slug>/` |

`_system-tokens.less` exposes semantic CSS variables for product composition from
the selected Less build. The shell does not maintain a second palette under a
runtime Dark selector. Native components obtain their colors from UIkit variables
and hooks, including forms, labels, tabs, notifications, dropdowns, modals and
offcanvas panels.

## Variables first

Prefer existing UIkit variables for a component requirement. For example:

```less
@button-primary-background: @harika-primary;
@button-primary-color: @harika-on-primary;
```

Palette roles include background, surface, raised surface, main and secondary
text, control boundary, primary action, selected state and semantic feedback.
UIkit's hover and active states must remain readable in each appearance.

## Hooks second

When a variable does not express a necessary declaration, use the matching UIkit
hook. Preserve relative UIkit component order in `harika/_import.less`.

Do not put direct `.uk-*` reskins in shell, product or prototype styles. Do not
copy UIkit component source. Custom styles describe Harika's spatial composition,
not replacement buttons, forms or modals.

## Full Dark theme

Dark is a separately compiled UIkit theme. It supplies dark global values and
explicit component color modes. `uk-light` and `uk-dark` keep their UIkit role for
contrasting sub-surfaces; they are not root application-theme switches.

The Dark build uses light foregrounds on dark normal surfaces. Primary buttons
have their own foreground/background pairing. Native browser controls follow the
resolved `color-scheme`.

## Appearance at runtime

The preference is `system`, `light` or `dark`, stored locally under
`ccf-theme-preference`. This is clickdummy-local behavior, not production account
or authentication logic.

Vite emits two complete CSS assets, one for each appearance, and inserts their
head links with `data-harika-appearance="light"` and
`data-harika-appearance="dark"`. An early head bootstrap resolves the preference
before content is painted. The bootstrap and shared behavior activate the
matching stylesheet and set:

- `data-ccf-theme`: the chosen preference;
- `data-ccf-resolved-theme`: the resolved Light or Dark appearance;
- `color-scheme`: the appearance for native browser controls.

System follows changes to `prefers-color-scheme`. Visible and offcanvas controls
stay synchronized. Blocked local storage must not prevent switching within the
current page or resolving the system appearance.

Theme CSS is loaded through the head rather than imported by `src/app.js`. Vite's
appearance plugin compiles the two Less entries separately so they cannot be
merged into one conflicting CSS asset. Development CSS routes recompile the
sources; production assets use the configured base, including GitHub Pages.
There is no remote theme service or browser-side Less compiler.

## Build and preview

```bash
npm ci
npm run dev                 # Harika, Light/Dark/System
npm run dev:standard        # neutral UIkit reference, Light/Dark/System
npm run dev:customer:ambra  # child-theme inheritance, Light/Dark/System
```

Verification builds each brand and the GitHub Pages variant:

```bash
npm run verify
npm run transfer:status
```

Every build includes both appearance assets. The static check compiles all six
entries and verifies complete native UIkit rules and the Harika foreground/surface
pairs. A theme must work on the styleguide as well as the website workspace.

## Theme Studio

Theme Studio edits Harika and customer Less sources locally. Standard stays
read-only. A Harika edit is accepted only after both Harika appearances and all
customer entries compile. A customer edit validates both customer appearances.
Theme Studio validates the draft in memory before writing the local file.
Failed compilation leaves the file untouched, so the draft and compiler error
remain visible without a page reload.

Theme Studio remains development-only and loopback-only. It does not commit,
push, publish or transfer a design into production.

## Customer themes

Customer themes contain approved color/type overrides and optional real assets.
They do not fork navigation, layout or behavior.

To add a customer:

1. Add matching Light and Dark entries under `src/themes/customers/`.
2. Import the matching Harika appearance and shared customer variables.
3. Add only approved brand values under `customers/<slug>/variables.less`.
4. Add the pair to Vite modes and preview commands.
5. Compile and inspect both appearances before branch CI.

Customer metadata stays declarative. Missing logos or avatars remain explicitly
absent rather than replaced with invented brand assets.
