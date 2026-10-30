# Harika Spectrum design — UIkit implementation

## Decision and scope

On 2026-10-30, Cem accepted the compact Harika Light/Dark design study and asked
for the same appearance on real UIkit with Less, following Kalkurama's theme
architecture. This change implements that decision in the HTML-first clickdummy.

The website workspace is the reference screen: compact navigation, an explicit
organization/customer context, a searchable website table and the selected
website's findings/connections. A finding opens a native UIkit prompt modal.
Other pages inherit the same shared shell and native component theme.

The study's custom controls and Lucide icons are replaced by UIkit components and
UIkit icons. Page structure stays in HTML, global chrome in small partials,
styling in Less and JavaScript in behavior-only modules.

## Sources

- [Harika brand assets](https://github.com/cemfirat/harika/tree/e722ddac3d0abd4c75965e6f5d1a3b47285caaa3/brand)
- [Harika information architecture](https://github.com/cemfirat/harika/blob/e722ddac3d0abd4c75965e6f5d1a3b47285caaa3/docs/information-architecture.md)
- [Kalkurama's complete UIkit themes](https://github.com/cemfirat/kalkurama/blob/51a14596d0dc1f81d807535552e08555159dba49/docs/development/uikit-themes.md)
- [Kalkurama's compact shell](https://github.com/cemfirat/kalkurama/blob/51a14596d0dc1f81d807535552e08555159dba49/assets/styles/app.css)

The existing Harika baseline in `src/harika-source.js` and transfer checkpoint in
`src/transfer-state.js` remain historical records. This design implementation is
not a claim that newer production behavior has been copied or that any change
has been promoted to the live Harika application. The production promotion
sequence remains in [UI-TRANSFER.md](UI-TRANSFER.md).

## Brand palette and UI roles

The supplied brand palette contains yellow `#FFFF00`, magenta `#FF00FF`, cyan
`#00FFFF`, blue `#0000FF`, red `#FF0000`, green `#00FF00` and black. Its inverse
palette uses violet `#5600FF` instead of blue and white instead of black.

The accepted UI uses that violet family for interaction and neutral surfaces for
working content. These are intentionally derived UI roles, not a claim that all
values already existed as a complete brand specification.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#F7F7FA` | `#101014` |
| Surface | `#FFFFFF` | `#19191F` |
| Raised surface | `#FFFFFF` | `#23232B` |
| Main text | `#211C2C` | `#F4F1F8` |
| Secondary text | `#665F70` | `#B5AEC0` |
| Subtle divider | `#DED9E5` | `#393440` |
| Control boundary | `#857B91` | `#81768E` |
| Primary action/link/focus | `#5600FF` | `#BFA9FF` |
| On primary | `#FFFFFF` | `#17121F` |
| Selected background | `#F0E9FF` | `#2A2040` |

The primary text pairs have calculated contrast ratios of 7.40:1 in Light and
9.04:1 in Dark. Secondary text on the normal surface has 6.11:1 and 8.15:1.
These calculations are evidence for those pairs, not a whole-application
accessibility certification. See the W3C explanations for
[text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Navigation icons use circular surfaces, following the requested Kalkurama
pattern. Harika surfaces and controls are flat: no cast shadows or inset
selection bars. Keyboard focus remains visible through native outlines.

Active navigation has a filled icon surface and `aria-current`; selected rows
retain their check mark. Statuses use explicit text. A missing optional
source, an intentionally unused source, an expired authorization and a measured
failure are different states.

## UIkit component mapping

| Interface element | Framework primitive |
| --- | --- |
| Website table | `uk-table` and native table semantics |
| Search/input | `uk-search`, `uk-input` |
| Findings and connections | `uk-tab` / UIkit Switcher |
| Panels | `uk-card` |
| Actions | `uk-button` |
| Status | `uk-label` / `uk-alert` |
| Prompt dialog | `uk-modal` |
| Navigation | `uk-nav`, UIkit dropdown/offcanvas |
| Icons | UIkit icons |

The 64 px rail, context header and list/detail composition are product layout.
Their custom styles do not replace standard UIkit components. Main content uses
a sans-serif font, compact headings and consistent spacing. On narrow screens,
the list and detail stack and navigation remains available through the native
offcanvas with full labels.

## Review requirements

Before merging:

1. Run `npm run verify` and `npm run transfer:status`.
2. Inspect the website screen and styleguide in both appearances.
3. Verify System appearance changes, stored preference and blocked storage.
4. Exercise selection, filtering, tabs, prompt copy, modal close/focus return and
   mobile navigation with native UIkit behavior.
5. Check narrow layouts for horizontal overflow and readable focus/state marks.
6. Push the coherent candidate to a `verify/**` branch and wait for green branch
   CI before opening the pull request.

Website records in the new reference screen use `.example` domains and remain
explicitly fictional. There are no production API calls or data writes.
