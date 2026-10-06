# Clickdummy → Harika UI transfer

This document defines how an accepted UI experiment moves from `cemfirat/harika-clickdummy`
into the productive Harika application in `cemfirat/ccf-sites-ads`.

The process is deliberately controlled. There is no bidirectional file sync and no automatic
overwrite of production code.

## Why the transfer is not a copy operation

The clickdummy is optimized for fast UI work:

- Vite
- UIkit
- vanilla JavaScript
- LESS
- mock data
- no productive API/auth/write behavior

Harika is the productive application and owns:

- React/Next application structure
- real workspace and website data
- authentication and authorization
- production connectors and APIs
- audit/change-control behavior
- tests and deployment constraints

Therefore a clickdummy decision is **ported**, not copied blindly.

## Transfer checkpoint

The technical checkpoint is stored in:

- `src/transfer-state.js`

It contains:

- the initial clickdummy UI baseline;
- after the first successful promotion, the last clickdummy commit that was promoted;
- the corresponding Harika commit.

The current pending UI delta is therefore:

```text
last promoted clickdummy commit (or initial UI baseline)
                         ↓
                  current clickdummy HEAD
```

Run locally:

```bash
npm run transfer:status
```

The command reports the UI files changed since that checkpoint.

## Transferable UI paths

These files are candidates for intentional promotion:

| Clickdummy | Harika target / interpretation |
| --- | --- |
| `src/styles/tokens.less` | Harika design tokens / theme variables |
| `src/styles/layout.less` | app shell, sidebar, topbar, responsive layout |
| `src/styles/components.less` | reusable production UI components |
| `src/styles/views.less` | view-specific Harika styling |
| `src/ui.js` | component design to be translated into React/UIkit components |
| `src/views.js` | view composition to be translated into production views |
| `src/main.js` | shell/navigation interaction decisions only |
| `index.html` | only structural/document-shell decisions that are relevant to Harika |

## Never promote automatically

The following are reference or prototype material and are not production payload:

- `src/data.js` mock data;
- demo customer names and demo metrics;
- clipboard/demo-only behavior that has no production equivalent;
- `src/harika-source.js`;
- `src/transfer-state.js`;
- `src/prototype/` clickdummy-only UI-lab views;
- `src/styles/prototype.less` clickdummy-only Styleguide styling;
- documentation and repository scripts.

## Required transfer sequence

1. **Freeze the clickdummy source commit**
   - identify the exact clickdummy commit to promote;
   - do not transfer from an uncommitted local state.

2. **Refresh Harika first**
   - read the current `ccf-sites-ads/main` SHA;
   - compare it with `src/harika-source.js`;
   - inspect product/navigation/style changes that happened in parallel.

3. **Calculate the clickdummy delta**
   - compare the transfer checkpoint with the selected clickdummy commit;
   - review only the changed UI decisions.

4. **Classify every change**
   - visual token;
   - layout;
   - reusable component;
   - view composition;
   - interaction;
   - product/information-architecture change;
   - mock/demo-only change.

5. **Create a Harika branch**
   - use a focused branch such as `ui/port-clickdummy-sidebar`;
   - never work directly on production `main`.

6. **Port the design into Harika**
   - preserve real data flows, auth, permissions and APIs;
   - adapt the accepted UI decision to the production React/UIkit structure;
   - do not replace production behavior with mock behavior.

7. **Verify before PR**
   - static checks first;
   - build/tests next;
   - GitHub Actions only when the branch is a final candidate;
   - no trial-and-error Action runs.

8. **No PR before green branch CI**
   - this is a permanent repository rule;
   - a PR is opened only after the relevant branch checks are green.

9. **Record the successful promotion**
   - append an entry to `docs/UI-TRANSFER-LOG.md`;
   - update `src/transfer-state.js` with the promoted clickdummy commit and resulting Harika commit;
   - refresh `src/harika-source.js` after the new Harika main state is known.

## Handling parallel development

If Harika changed while the clickdummy was being edited:

- Harika product semantics remain authoritative;
- clickdummy visual decisions are rebased conceptually onto the new production state;
- conflicting information architecture is reviewed explicitly;
- neither side is silently overwritten.

This allows UI experimentation and production development to continue in parallel without
turning the clickdummy into a competing source of product truth.
