# Styleguide

The clickdummy styleguide is a UIkit-oriented component reference.

## Goal

It documents:

- the active theme hierarchy
- Harika color/semantic tokens
- representative UIkit components used by Harika
- Harika-specific product patterns
- the exact HTML markup used by every example.

The styleguide is prototype-only. It is not a Harika product view and is never
promoted blindly into production.

## UIkit documentation pattern

Each component section follows the same documentation pattern used throughout
UIkit:

1. short description
2. live Preview
3. Markup
4. variants/modifiers in the example where useful
5. link to the corresponding upstream UIkit documentation.

## Single source for Preview + Markup

Example markup lives in:

`partials/styleguide/`

A component example is included twice in `styleguide.html`:

```html
<!-- @include partials/styleguide/buttons.html -->
<!-- @include-code partials/styleguide/buttons.html -->
```

- `@include` renders the live example.
- `@include-code` renders the same file escaped inside the code block.

This keeps Preview and Markup synchronized without runtime JavaScript rendering.

## Add a component

1. Create a semantic example file in `partials/styleguide/`.
2. Use native UIkit markup/classes.
3. Add a styleguide section with Preview and Markup tabs.
4. Link to the relevant UIkit docs page.
5. Add prototype-only CSS only when needed for documentation layout.
6. Never restyle standard UIkit components in `prototype.less`.
7. Run `npm run verify`.

## Scope

The styleguide should prioritize components Harika actually uses. It is not
intended to duplicate all of UIkit documentation.

Harika-specific examples belong in the final Harika section and should exist
only when UIkit alone does not express the product pattern.
