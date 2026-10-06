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
    '<h1>' + escapeHtml(title) + '</h1>' +
    '<p>' + escapeHtml(description) + '</p>' +
  '</div>';
}

export function metricCard(metric) {
  return '<article class="uk-card uk-card-default metric-card">' +
    '<div class="metric-card__top"><span>' + escapeHtml(metric.source) + '</span>' + badge(metric.delta, metric.tone) + '</div>' +
    '<strong class="metric-card__value">' + escapeHtml(metric.value) + '</strong>' +
    '<span class="metric-card__label">' + escapeHtml(metric.label) + '</span>' +
  '</article>';
}

export function panel(title, eyebrow, body, trailing = "") {
  return '<section class="uk-card uk-card-default panel">' +
    '<header class="panel__heading"><div><p class="eyebrow">' + escapeHtml(eyebrow) + '</p><h2>' + escapeHtml(title) + '</h2></div>' + trailing + '</header>' +
    '<div class="panel__body">' + body + '</div>' +
  '</section>';
}

export function emptyChart(label) {
  return '<div class="mock-chart" aria-label="' + escapeHtml(label) + '">' +
    '<div class="mock-chart__grid"></div>' +
    '<svg viewBox="0 0 640 220" role="img" aria-hidden="true">' +
      '<polyline points="18,176 96,160 164,170 238,124 318,136 404,92 490,108 620,54" fill="none"></polyline>' +
      '<circle cx="620" cy="54" r="5"></circle>' +
    '</svg>' +
  '</div>';
}

export function modalShell({ eyebrow, title, body, footer = "" }) {
  return '<div class="prompt-modal__backdrop" data-close-modal></div>' +
    '<div class="prompt-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">' +
      '<button class="prompt-modal__close" type="button" data-close-modal aria-label="Schließen">×</button>' +
      '<p class="eyebrow">' + escapeHtml(eyebrow) + '</p>' +
      '<h2 id="app-modal-title">' + escapeHtml(title) + '</h2>' +
      '<div class="demo-modal__body">' + body + '</div>' +
      (footer ? '<div class="prompt-modal__footer">' + footer + '</div>' : '') +
    '</div>';
}
