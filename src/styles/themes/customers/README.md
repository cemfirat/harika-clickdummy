# Customer child themes

Customer themes inherit the Harika `interface.less` child theme.

A customer entry file should stay small:

```less
@import "../interface.less";
@import "customer-slug/variables.less";
```

Customer themes should normally change only approved semantic variables such as
brand colors or typography. They must not copy UIkit source files or fork Harika
shell/product layout.

`ambra.less` is the first inheritance example. It intentionally has no invented
brand overrides yet.
