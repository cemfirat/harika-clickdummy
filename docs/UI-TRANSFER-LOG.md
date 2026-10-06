# Harika UI transfer log

Append-only record of intentionally promoted UI decisions from
`cemfirat/harika-clickdummy` to `cemfirat/ccf-sites-ads`.

| Date | Clickdummy commit | Harika commit | Scope | Result |
| --- | --- | --- | --- | --- |
| 2026-10-06 | `7ca420830f0512d9a701f1136e9cdcc0c2209754` | — | Initial UI-lab baseline derived from Harika `51ef80c3e68a77e9a34a97363c9ad3644619302c` | Baseline only; no production promotion |

## Logging rule

A new row is added only after the corresponding Harika change is successfully integrated.
The row must name the exact clickdummy source commit, the resulting Harika commit and the
scope that was actually transferred.
