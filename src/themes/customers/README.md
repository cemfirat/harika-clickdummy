# Customer themes

Customer themes inherit `../harika.less` and follow UIkit's entry-file +
same-named-folder convention.

Example:

```text
customers/
├── ambra.less
└── ambra/
    ├── variables.less
    ├── customer.js
    ├── logo.svg
    └── avatar.png
```

Only `variables.less` is required.

- `variables.less` — approved customer branding variables.
- `customer.js` — optional declarative clickdummy metadata.
- `logo.svg` — optional real company logo.
- `avatar.png` — optional real avatar/profile image.

Do not copy UIkit/Harika component files into customer folders. Do not add
placeholder branding assets.
