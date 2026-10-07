# Theme Studio

Theme Studio is the local editing mode for the Harika clickdummy.

It is intentionally smaller than a full IDE. Its purpose is to make UIkit/LESS
theme work fast while preserving the repository's existing Git/CI discipline.

## Scope

Theme Studio currently supports:

- opening editable Harika/customer LESS files
- editing them directly in the Styleguide
- saving to the local working tree
- validating the affected theme entry with Less before a save is accepted
- automatic Vite CSS/HMR refresh
- comparing the saved file with Git `HEAD`
- restoring the editor contents to the `HEAD` version
- showing current branch, short HEAD and file Git status.

It does **not** currently:

- commit
- push
- open pull requests
- execute arbitrary shell commands
- edit files outside the allowed theme paths.

Git commit/push is a later, separate layer.

## Start

From the repository:

```bash
npm install
npm run studio
```

Then open the local Vite URL and go to:

```text
/styleguide.html
```

Harika is the default Studio theme.

AMBRA:

```bash
npm run studio:customer:ambra
```

## GitHub Pages

Theme Studio is intentionally unavailable on GitHub Pages.

The public Styleguide still renders the buttons, but they remain disabled because
the development-only `/__studio/*` endpoints do not exist in production builds.

No GitHub credentials or write API are shipped to the browser.

## MAMP Pro

For a friendly local domain, MAMP Pro may sit in front of the Vite development
server as a local reverse proxy.

The important architecture rule is:

```text
local domain
    ↓
MAMP Pro / local proxy
    ↓
127.0.0.1:Vite
    ↓
Theme Studio + HMR
```

Do not point the local Studio domain at the static `dist/` build. The writable
Studio endpoints only exist in the Vite development server.

Exact MAMP Pro UI configuration should be verified against the installed MAMP
version before it is documented as a click-by-click procedure.

## Editable files

The service builds an allowlist from:

```text
src/themes/harika.less
src/themes/harika/*.less
src/themes/customers/*.less
src/themes/customers/*/*.less
```

`src/themes/standard.less` is intentionally not editable through Theme Studio.
It remains the UIkit system reference.

Only `.less` files in the allowlist can be written.

## Save / compile flow

When **Speichern & kompilieren** is used:

1. the requested path is checked against the allowlist
2. the file is written to the local working tree
3. the affected theme entry/entries are compiled with Less
4. if compilation succeeds, the save is accepted
5. Vite updates the browser through its normal file watcher/HMR
6. if compilation fails, the previous file content is restored and the compiler
   error is returned to the Studio.

Editing a Harika theme file validates:

- `src/themes/harika.less`
- every customer theme entry because customer themes inherit Harika.

Editing a customer theme validates only that customer's entry.

## Git comparison

Theme Studio compares the saved local file with:

```text
git show HEAD:<path>
```

and exposes:

- current Git status
- unified `git diff -- <path>`
- the `HEAD` version for the Reset/HEAD action.

Reset only puts the `HEAD` content into the editor. It is not written until
**Speichern & kompilieren** is used.

## Local-only security boundary

The Vite middleware accepts Studio requests only from loopback:

- `127.0.0.1`
- `::1`

Requests are rejected when:

- they are not local
- the file is outside the allowlist
- the payload is too large
- the LESS validation fails.

The Studio has no generic filesystem endpoint and no generic command endpoint.

## Editor shortcuts

Inside the textarea:

- `Tab` inserts two spaces
- `Cmd+S` / `Ctrl+S` saves and compiles.

## Next layer

The planned Git layer should remain separate from file editing:

```text
Edit
  ↓
LESS validation
  ↓
local diff
  ↓
npm run verify
  ↓
branch / commit / push
  ↓
branch CI
  ↓
PR only after green CI
```

Permanent rule:

**No PR before green branch CI.**
