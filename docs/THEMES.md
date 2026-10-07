# Themes

Harika follows UIkit's Less theme model as closely as practical.

Official references:
- UIkit Installation: https://getuikit.com/docs/installation
- UIkit Less: https://getuikit.com/docs/less

UIkit supports compiling either the core styles (`uikit.less`) or the default theme
(`uikit.theme.less`). Harika uses the default theme as its system baseline and
customizes it through Less variables and hooks.

## Theme hierarchy

```text
UIkit Standard
      ↓
Harika
      ↓
Customer
```

In Harika terminology, Harika and Customer are child themes. UIkit itself calls
these custom themes.

## Directory structure

The structure deliberately mirrors UIkit's recommendation of one compiler entry
file plus a same-named directory containing component customizations.

```text
src/
├── themes/
│   ├── standard.less
│   ├── _system-tokens.less
│   │
│   ├── harika.less
│   ├── harika/
│   │   ├── _import.less
│   │   ├── variables.less
│   │   ├── base.less
│   │   ├── table.less
│   │   ├── form.less
│   │   ├── button.less
│   │   ├── card.less
│   │   ├── alert.less
│   │   ├── badge.less
│   │   ├── label.less
│   │   ├── modal.less
│   │   └── offcanvas.less
│   │
│   └── customers/
│       ├── README.md
│       ├── ambra.less
│       └── ambra/
│           ├── variables.less
│           ├── customer.js
│           ├── logo.svg      # optional, only when a real asset exists
│           └── avatar.png    # optional, only when a real asset exists
│
└── styles/
    ├── shell.less
    ├── product.less
    ├── visualizations.less
    └── prototype.less
```

Theme files live in `src/themes/`. Harika-specific structural CSS that is not
a UIkit component customization stays in `src/styles/`.

## 1. Standard

Entry:

`src/themes/standard.less`

This is the system reference level.

It imports UIkit's official default theme:

```less
@import "uikit/src/less/uikit.theme.less";
```

Do not add Harika brand colors or customer branding to this level.

Harika shell/product selectors are appended so the application remains usable as
a complete reference view, but their neutral aliases map to UIkit globals via
`_system-tokens.less`.

## 2. Harika

Entry:

`src/themes/harika.less`

```less
@import "standard.less";
@import "harika/_import.less";
```

The `harika/` directory contains one file per customized UIkit component,
following the same pattern recommended by UIkit for larger custom themes.

### Import order

`harika/_import.less` must preserve UIkit's component import order for all
components we customize.

### Variables first

Prefer an existing UIkit Less variable whenever possible.

Example:

```less
@button-primary-background: @ccf-indigo;
```

A single global variable can influence multiple UIkit components, which is one
of the main advantages of using the framework's Less system.

### Hooks second

Use a UIkit hook when a variable cannot express the required declaration.

Example:

```less
.hook-offcanvas-bar() {
  color: @ccf-creme;
}
```

Do not add direct `.uk-*` selector overrides to shell/product files when a
documented UIkit variable or hook can solve the same problem.

## 3. Customer themes

Each customer follows the same UIkit entry-file + folder pattern.

AMBRA:

```text
src/themes/customers/
├── ambra.less
└── ambra/
    ├── variables.less
    └── customer.js
```

Entry:

`src/themes/customers/ambra.less`

```less
@import "../harika.less";
@import "ambra/variables.less";
```

A customer theme inherits Harika. It must not copy UIkit or Harika component
files.

### Customer variables

`variables.less` is intended for approved customer branding such as:

- primary/secondary brand colors
- typography
- selected semantic design tokens.

Do not put layout changes or product behavior into a customer theme.

### Customer assets

Real customer assets may live in the same customer directory:

```text
ambra/
├── logo.svg
├── avatar.png
└── favicon.svg
```

Use semantic filenames. A company logo is `logo.svg`, not `avatar.png`.
Do not add placeholder or invented brand assets.

### customer.js

`customer.js` is optional metadata/configuration for the clickdummy.

It may describe:
- customer id/name
- paths to existing customer assets
- other declarative presentation metadata.

It must not contain arbitrary DOM manipulation, API calls, authentication logic,
or a separate customer application.

## Build and preview

Harika is the default:

```bash
npm run dev
npm run build
```

UIkit Standard reference:

```bash
npm run dev:standard
npm run build:standard
```

AMBRA:

```bash
npm run dev:customer:ambra
npm run build:customer:ambra
```

Full verification compiles Standard, Harika, AMBRA and the Pages build:

```bash
npm run verify
```

GitHub Pages uses the Harika theme.

## Create a new customer theme

For a customer named `example`:

1. Create `src/themes/customers/example.less`.
2. Create `src/themes/customers/example/variables.less`.
3. Optionally add `customer.js` and real assets.
4. Import Harika from the entry file.
5. Add Vite/npm preview and build modes.
6. Add only approved branding variables.
7. Run all static checks and builds before CI.

Entry:

```less
@import "../harika.less";
@import "example/variables.less";
```

## Ownership rules

| Change | Owner |
| --- | --- |
| UIkit default system | `standard.less` / upstream UIkit |
| Harika component appearance | `harika/` variables/hooks |
| Harika shell/layout | `src/styles/shell.less` |
| Harika product composition | `src/styles/product.less` |
| Customer branding | `customers/<slug>/variables.less` |
| Customer logo/avatar | `customers/<slug>/` assets |
| Customer metadata | `customers/<slug>/customer.js` |

## Non-negotiable rules

- Never edit files inside `node_modules/uikit`.
- Never copy UIkit component source into Harika or customer themes.
- Prefer UIkit variables before hooks.
- Prefer hooks before miscellaneous direct selectors.
- Preserve UIkit component import order.
- Customer themes inherit Harika.
- Customer themes do not fork Harika layout or product behavior.
- No invented customer branding values or assets.
