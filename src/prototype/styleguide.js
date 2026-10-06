import { badge, emptyChart, escapeHtml, metricCard, panel, viewIntroduction } from "../ui.js";

const palette = [
  ["Ink", "@ink", "#20123a"],
  ["Accent", "@accent", "#622064"],
  ["Accent dark", "@accent-dark", "#330033"],
  ["Accent soft", "@accent-soft", "#e0c2d1"],
  ["Highlight", "@highlight", "#ffe343"],
  ["Ready", "@ready", "#176044"],
  ["Ready accent", "@ready-accent", "#32d296"],
  ["Paper", "@paper", "#f6f6f6"],
  ["Panel", "@panel", "#fff9ee"],
  ["Line", "@line", "#c4c5cc"],
  ["Danger", "@danger", "#c1272d"],
  ["Chart highlight", "@chart-highlight", "#ff0066"]
];

const spacing = [
  ["4", 4],
  ["8", 8],
  ["12", 12],
  ["16", 16],
  ["24", 24],
  ["32", 32],
  ["48", 48],
  ["64", 64]
];

function paletteMarkup() {
  return '<div class="styleguide-swatches">' + palette.map(([label, variable, value]) =>
    '<article class="styleguide-swatch">' +
      '<span class="styleguide-swatch__color" style="--sample-color:' + escapeHtml(value) + '"></span>' +
      '<div><strong>' + escapeHtml(label) + '</strong><code>' + escapeHtml(variable) + '</code><small>' + escapeHtml(value) + '</small></div>' +
    '</article>'
  ).join("") + '</div>';
}

function spacingMarkup() {
  return '<div class="styleguide-spacing">' + spacing.map(([label, value]) =>
    '<div><code>' + label + ' px</code><span style="--space-width:' + value + 'px"></span></div>'
  ).join("") + '</div>';
}

function typographyMarkup() {
  return '<div class="styleguide-type">' +
    '<div><code>Display</code><h1>Harika Intelligence Center</h1></div>' +
    '<div><code>H2</code><h2>Messbare Chancen erkennen</h2></div>' +
    '<div><code>H3</code><h3>Website Health</h3></div>' +
    '<div><code>Body</code><p>Harika verbindet technische Website-Qualität, Search, Analytics, Ads und AI Visibility zu verständlichen Arbeitsaufträgen.</p></div>' +
    '<div><code>Meta</code><small>Search Console · vor 18 Min. aktualisiert</small></div>' +
  '</div>';
}

function componentMarkup() {
  const buttons = '<div class="styleguide-inline">' +
    '<span class="uk-button uk-button-primary">Primary</span>' +
    '<span class="uk-button uk-button-default">Default</span>' +
    '<span class="uk-button uk-button-text">Text</span>' +
  '</div>';
  const labels = '<div class="styleguide-inline">' +
    badge("Standard") + badge("Aktiv", "success") + badge("Hinweis", "warning") + badge("Fehler", "danger") +
  '</div>';
  const forms = '<div class="styleguide-form-grid">' +
    '<label><span>Textfeld</span><input class="uk-input" type="text" value="ambra.at" readonly></label>' +
    '<label><span>Auswahl</span><select class="uk-select" disabled><option>Produktion</option></select></label>' +
    '<label><span>Textarea</span><textarea class="uk-textarea" rows="3" readonly>Layout- und Komponentenentscheidungen hier testen.</textarea></label>' +
  '</div>';

  return '<div class="styleguide-component-stack">' +
    '<section><h3>Buttons</h3>' + buttons + '</section>' +
    '<section><h3>Labels</h3>' + labels + '</section>' +
    '<section><h3>Form Controls</h3>' + forms + '</section>' +
  '</div>';
}

function architectureMarkup() {
  const files = [
    ["tokens.less", "Farben, semantische Rollen, Radien, Größen"],
    ["layout.less", "App-Shell, Sidebar, Topbar, Responsive"],
    ["components.less", "wiederverwendbare UI-Bausteine"],
    ["views.less", "produktive View-Kompositionen"],
    ["prototype.less", "nur Clickdummy/Styleguide, niemals automatisch nach Harika"]
  ];

  return '<div class="styleguide-file-map">' + files.map(([name, description]) =>
    '<div><code>' + escapeHtml(name) + '</code><span>' + escapeHtml(description) + '</span></div>'
  ).join("") + '</div>';
}

export function renderStyleguide() {
  return viewIntroduction(
    "UI Styleguide",
    "Clickdummy-only Labor für Layout, LESS, Tokens und Komponenten. Diese Ansicht gehört nicht zur Harika-Produktnavigation."
  ) +
    '<div class="styleguide-banner"><strong>Prototype only</strong><span>Änderungen hier helfen bei der Beurteilung des Designs, sind aber keine Harika-Produktfunktion.</span></div>' +
    panel("Farb- und Semantik-Tokens", "tokens.less", paletteMarkup()) +
    '<div class="styleguide-two-column">' +
      panel("Typografie", "UI-Hierarchie", typographyMarkup()) +
      panel("Abstände", "Spacing scale", spacingMarkup()) +
    '</div>' +
    panel("Komponenten", "components.less", componentMarkup()) +
    '<div class="styleguide-two-column">' +
      panel("Metric Card", "Wiederverwendbar", metricCard({ label: "Organische Klicks", value: "1.842", delta: "+12,4 %", tone: "success", source: "Search Console" })) +
      panel("Chart", "Datenvisualisierung", emptyChart("Styleguide Trend")) +
    '</div>' +
    panel("LESS-Struktur", "Arbeitsmodell", architectureMarkup());
}
