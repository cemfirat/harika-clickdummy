# Theme system

Harika follows UIkit's own Less theme model.

References:
- https://getuikit.com/docs/installation
- https://getuikit.com/docs/less

UIkit recommends compiling its Less sources, using `uikit.theme.less` when the default theme is wanted, and applying customizations through variables and hooks.

## Hierarchy

```text
UIkit standard theme
        ↓
Harika interface child theme
        ↓
Customer child theme
```

"Child theme" is Harika terminology for this inheritance convention. UIkit itself calls these custom themes.

## Level 1 — Standard

Entry:

`src/styles/themes/standard.less`

It imports:

`uikit/src/less/uikit.theme.less`

The UIkit component skin is not customized at this level.

Harika-specific shell/product selectors are still appended so the application can be viewed as a usable reference. Their neutral color aliases map to UIkit global variables in `_system-tokens.less`.

Do not put Harika brand values into `standard.less`.

## Level 2 — Benutzeroberfläche

Entry:

`src/styles/themes/interface.less`

It imports `standard.less` and then:

`src/styles/themes/interface/_import.less`

Component customizations follow UIkit's recommended structure: one Less file per customized component, using variables and hooks.

This is the default Harika Clickdummy theme and the theme deployed to GitHub Pages.

## Level 3 — Kunde

Customer entries live under:

`src/styles/themes/customers/`

Example:

`src/styles/themes/customers/ambra.less`

A customer theme imports the Harika interface theme and then only its customer-specific variables.

Customer themes should normally be restricted to:
- approved brand colors
- typography decisions
- other semantic design tokens.

Customer themes must not:
- copy UIkit component source
- duplicate Harika interface component files
- fork shell/layout behavior
- add arbitrary `.uk-*` overrides
- introduce hooks unless there is an explicit reviewed reason.

AMBRA currently inherits the interface unchanged. No brand colors were invented.

## Commands

Default Harika interface:

```bash
npm run dev
npm run build
```

UIkit standard reference:

```bash
npm run dev:standard
npm run build:standard
```

AMBRA customer child theme:

```bash
npm run dev:customer:ambra
npm run build:customer:ambra
```

Full verification compiles all three levels plus the Pages build:

```bash
npm run verify
```

## Adding a customer

Create:

```text
src/styles/themes/customers/
├── customer-slug.less
└── customer-slug/
    └── variables.less
```

Entry:

```less
@import "../interface.less";
@import "customer-slug/variables.less";
```

Only add approved overrides to `variables.less`.

Then add a matching Vite mode and npm dev/build scripts.

## Rule of thumb

If it should exist in every UIkit project unchanged → **Standard**.

If it belongs to Harika's own application UI → **Benutzeroberfläche**.

If it is only branding for one customer → **Kunde**.
