# Harika UI transfer log

Append-only record of Harika-derived UI-lab baselines and intentionally promoted
UI decisions from `cemfirat/harika-clickdummy` to `cemfirat/ccf-sites-ads`.

| Date | Clickdummy commit | Harika commit/source | Scope | Result |
| --- | --- | --- | --- | --- |
| 2026-10-06 | `7ca420830f0512d9a701f1136e9cdcc0c2209754` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | Initial UI-lab baseline | Superseded; baseline was not sufficiently faithful to Harika/UIkit |
| 2026-10-06 | `16ed0edc22fe94c8bb5d0928cd86b7372048dd18` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | UIkit-first baseline rebuilt from productive shell, Product Blueprint, IA and UI/UX issues | Superseded by HTML-first editing baseline |
| 2026-10-06 | `117621532bac10e9937b4c70a6e2e79517ef535e` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | HTML-first multi-page UI lab: nine product HTML pages + styleguide, JS behavior only | Superseded by shared-partial editing baseline |

| 2026-10-07 | `84360449ab6dc741212a63800651c75c0564e716` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | Shared HTML partial baseline: global header/footer/sidebar/nav centralized, page content remains direct HTML | Superseded by UIkit theme hierarchy baseline |

| 2026-10-07 | `44bdf68af81eecaf3121c4f9005ec9951a895107` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | UIkit theme hierarchy: Standard → Harika interface → customer child theme | Superseded by semantically named UIkit-aligned theme baseline |

| 2026-10-07 | `bb84e431eee6085847b46a26abef29e4ec928b2b` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | UIkit-aligned naming and structure: Standard → Harika → Customer under `src/themes/` | Superseded by expanded UIkit-style styleguide baseline |

| 2026-10-07 | `bf0f54f8b68c66423c7477cdcaaa73f1639c89d0` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | Expanded UIkit-style component reference with synchronized Preview/Markup examples | Superseded by local Theme Studio baseline |

| 2026-10-07 | `ee6b1b4573aa3ee2084eb77beceee4ca1c953e1e` | `51ef80c3e68a77e9a34a97363c9ad3644619302c` | Local Theme Studio: Styleguide-integrated LESS editing, compile validation, rollback and Git diff | Active baseline; no production promotion |

## Logging rule

- Baseline rows may be added when the UI lab is deliberately re-anchored to an audited Harika source state.
- Promotion rows are added only after the corresponding Harika change is successfully integrated.
- Every row must use exact source/target SHAs and distinguish a baseline reset from a production promotion.
