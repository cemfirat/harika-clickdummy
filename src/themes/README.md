# Theme source

This directory follows UIkit's documented custom-theme structure.

```text
standard.less
harika.less
harika/
customers/
```

- `standard.less` = UIkit default theme / system baseline.
- `harika.less` + `harika/` = Harika custom theme.
- `customers/<slug>.less` + `customers/<slug>/` = customer theme.

The entry file is the Less compiler entry point. The matching folder contains
component customizations or customer-specific files.

See `docs/THEMES.md` for the full guide.
