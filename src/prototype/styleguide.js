import { badge, emptyChart, escapeHtml, metricCard, panel } from "../ui.js";

const palette = [
  ["Ink", "@ccf-indigo", "#20123a"],
  ["Violet", "@ccf-violet", "#622064"],
  ["Dark violet", "@ccf-darker-violet", "#330033"],
  ["Creme", "@ccf-creme", "#fff9ee"],
  ["Light gray", "@ccf-light-gray", "#f6f6f6"],
  ["Mint", "@ccf-mint", "#32d296"],
  ["Ready", "@ccf-ready", "#176044"],
  ["Warning", "@ccf-warning", "#684900"],
  ["Danger", "@ccf-darker-red", "#820033"],
  ["Chart magenta", "@ccf-magenta", "#ff0066"],
  ["Chart ice", "@ccf-ice", "#00ffff"]
];

function paletteMarkup() {
  return '<div class="styleguide-swatches">' + palette.map(([label, variable, value]) =>
    '<article class="styleguide-swatch">' +
      '<span class="styleguide-swatch__color" style="--sample-color:' + escapeHtml(value) + '"></span>' +
      '<div><strong>' + escapeHtml(label) + '</strong><code>' + escapeHtml(variable) + '</code><small>' + escapeHtml(value) + '</small></div>' +
    '</article>'
  ).join("") + '</div>';
}

function componentMarkup() {
  return '<div class="uk-grid-medium uk-child-width-1-1 uk-child-width-1-2@m" data-uk-grid>' +
    '<div><section class="uk-card uk-card-default uk-card-body"><h3 class="uk-card-title">Buttons</h3><p class="uk-flex uk-flex-wrap harika-control-cluster"><button class="uk-button uk-button-primary">Primary</button><button class="uk-button uk-button-default">Default</button><button class="uk-button uk-button-danger">Danger</button><button class="uk-button uk-button-text">Text</button><button class="uk-icon-button" data-uk-icon="icon: info" aria-label="Info"></button></p></section></div>' +
    '<div><section class="uk-card uk-card-default uk-card-body"><h3 class="uk-card-title">Labels & Badge</h3><p class="uk-flex uk-flex-wrap harika-control-cluster">' + badge("Standard") + badge("Aktiv","success") + badge("Hinweis","warning") + badge("Fehler","danger") + '<span class="uk-badge">12</span></p></section></div>' +
    '<div><section class="uk-card uk-card-default uk-card-body"><h3 class="uk-card-title">Form</h3><form class="uk-form-stacked"><div class="uk-margin"><label class="uk-form-label">Textfeld</label><div class="uk-form-controls"><input class="uk-input" value="ambra.at" readonly></div></div><div class="uk-margin"><label class="uk-form-label">Auswahl</label><div class="uk-form-controls"><select class="uk-select"><option>Produktion</option></select></div></div></form></section></div>' +
    '<div><section class="uk-card uk-card-default uk-card-body"><h3 class="uk-card-title">Alerts</h3><div class="uk-alert uk-alert-primary">Primary</div><div class="uk-alert uk-alert-success">Success</div><div class="uk-alert uk-alert-warning">Warning</div><div class="uk-alert uk-alert-danger">Danger</div></section></div>' +
  '</div>';
}

function architectureMarkup() {
  const rows = [
    ["uikit/src/less/uikit.less", "unveränderte UIkit-Quellen als Fundament"],
    ["styles/theme/", "UIkit-Variablen und komponentenspezifische Theme-Hooks"],
    ["shell.less", "Harika App-Shell, Sidebar, Workspace, Responsive"],
    ["product.less", "echte Harika-spezifische Layouts"],
    ["visualizations.less", "Charts und Datenvisualisierung"],
    ["prototype.less", "nur Clickdummy-/Styleguide-Layout"]
  ];
  return '<dl class="uk-description-list uk-description-list-divider">' +
    rows.map(([name, description]) => '<dt><code>' + escapeHtml(name) + '</code></dt><dd>' + escapeHtml(description) + '</dd>').join("") +
  '</dl>';
}

export function renderStyleguide() {
  const sampleMetric = metricCard({ label: "Organische Klicks", value: "1.842", delta: "+12,4 %", tone: "success", source: "Search Console" });
  return '<div class="uk-alert uk-alert-primary"><strong>Prototype only:</strong> Diese Ansicht testet das echte UIkit-Theme. Sie ist keine Harika-Produktfunktion.</div>' +
    panel("Farb- und Semantik-Tokens", "UIkit Theme", paletteMarkup()) +
    '<div class="uk-margin-medium-top">' + panel("Native UIkit-Komponenten", "Kein Parallel-Designsystem", componentMarkup()) + '</div>' +
    '<div class="uk-grid-medium uk-child-width-1-1 uk-child-width-1-2@l uk-margin-medium-top" data-uk-grid>' +
      '<div>' + panel("Metric Card", "Harika-Spezialkomponente", sampleMetric) + '</div>' +
      '<div>' + panel("Chart", "Datenvisualisierung", emptyChart("Styleguide Trend")) + '</div>' +
    '</div>' +
    '<div class="uk-margin-medium-top">' + panel("LESS-Struktur", "Arbeitsmodell", architectureMarkup()) + '</div>';
}
