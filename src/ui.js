export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function badge(label, tone = "neutral") {
  const className = tone === "success"
    ? "uk-label uk-label-success"
    : tone === "warning"
      ? "uk-label uk-label-warning"
      : tone === "danger"
        ? "uk-label uk-label-danger"
        : "uk-label";
  return '<span class="' + className + '">' + escapeHtml(label) + '</span>';
}

export function viewIntroduction(title, description) {
  return '<div class="view-introduction">' +
    '<p class="eyebrow">Harika Intelligence Center</p>' +
    '<h1 id="ccf-view-title" tabindex="-1">' + escapeHtml(title) + '</h1>' +
    '<p>' + escapeHtml(description) + '</p>' +
  '</div>';
}

export function metricCard(metric) {
  return '<article class="uk-card uk-card-default uk-card-body metric-card">' +
    '<div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap harika-control-cluster">' +
      '<span class="metric-source">' + escapeHtml(metric.source) + '</span>' +
      badge(metric.delta, metric.tone) +
    '</div>' +
    '<strong class="metric-value">' + escapeHtml(metric.value) + '</strong>' +
    '<span class="metric-label">' + escapeHtml(metric.label) + '</span>' +
  '</article>';
}

export function panel(title, eyebrow, body, trailing = "", extraClass = "") {
  return '<section class="uk-card uk-card-default ' + escapeHtml(extraClass) + '">' +
    '<div class="uk-card-header">' +
      '<div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap harika-control-cluster">' +
        '<div><p class="eyebrow uk-margin-remove-bottom">' + escapeHtml(eyebrow) + '</p><h2 class="uk-card-title uk-margin-small-top uk-margin-remove-bottom">' + escapeHtml(title) + '</h2></div>' +
        trailing +
      '</div>' +
    '</div>' +
    '<div class="uk-card-body">' + body + '</div>' +
  '</section>';
}

export function emptyChart(label) {
  return '<div class="mock-chart">' +
    '<div class="mock-chart__grid"></div>' +
    '<svg viewBox="0 0 640 220" role="img" aria-label="' + escapeHtml(label) + '">' +
      '<polyline points="18,176 96,160 164,170 238,124 318,136 404,92 490,108 620,54" fill="none"></polyline>' +
      '<circle cx="620" cy="54" r="5"></circle>' +
    '</svg>' +
  '</div>';
}

export function modalShell({ eyebrow, title, body, footer = "" }) {
  return '<div class="uk-modal-dialog">' +
    '<button class="uk-modal-close-default" type="button" data-uk-close data-close-modal aria-label="Schließen"></button>' +
    '<div class="uk-modal-header">' +
      '<p class="eyebrow uk-margin-remove-bottom">' + escapeHtml(eyebrow) + '</p>' +
      '<h2 id="app-modal-title" class="uk-modal-title uk-margin-small-top uk-margin-remove-bottom">' + escapeHtml(title) + '</h2>' +
    '</div>' +
    '<div class="uk-modal-body uk-overflow-auto" data-uk-overflow-auto>' + body + '</div>' +
    '<div class="uk-modal-footer uk-flex uk-flex-between uk-flex-middle uk-flex-wrap harika-control-cluster">' +
      (footer || '<span></span><button class="uk-button uk-button-default uk-modal-close" type="button" data-close-modal>Schließen</button>') +
    '</div>' +
  '</div>';
}
