import {
  adCampaigns,
  aiSystems,
  customers,
  indexation,
  landingPages,
  metrics,
  opportunities,
  prompts,
  searchMovers,
  searchRows,
  settingDetails,
  websites
} from "./data.js";
import { badge, emptyChart, escapeHtml, metricCard, modalShell, panel } from "./ui.js";

export const viewMetadata = Object.freeze({
  overview: {
    title: "Übersicht",
    description: "Wie steht der aktive Kunde gerade da und wo ist das größte Potenzial?"
  },
  customers: {
    title: "Kunden",
    description: "Welche Kunden betreue ich, wie bearbeite ich ihre Stammdaten und welche Websites gehören dazu?"
  },
  websites: {
    title: "Websites",
    description: "Ist diese Website technisch, inhaltlich und marketingseitig sauber aufgestellt?"
  },
  search: {
    title: "Search & SEO",
    description: "Wie werde ich in Google gefunden, wo verliere ich Potenzial und was soll ich als Nächstes optimieren?"
  },
  ads: {
    title: "Ads",
    description: "Laufen meine bezahlten Kampagnen effizient und passen Anzeige, Landingpage und Conversion zusammen?"
  },
  visibility: {
    title: "AI Visibility",
    description: "Wie sichtbar ist die Marke in relevanten AI-Systemen und wer wird stattdessen genannt?"
  },
  prompts: {
    title: "Prompt Center",
    description: "Welchen konkreten Auftrag soll ich jetzt an ChatGPT geben?"
  },
  development: {
    title: "Entwicklung",
    description: "Was hat sich verbessert und welche Maßnahme hatte Wirkung?"
  },
  settings: {
    title: "Einstellungen",
    description: "Verbindungen, Benutzer, Sicherheit und technische Systembereiche verwalten."
  },
  styleguide: {
    title: "UI Styleguide",
    description: "Clickdummy-only Labor für UIkit, LESS, Tokens und Harika-spezifische Layoutentscheidungen."
  }
});

function metricGrid(items = metrics, columns = "uk-child-width-1-2@s uk-child-width-1-4@l") {
  return '<div class="uk-grid-small ' + columns + ' uk-margin-medium-bottom" data-uk-grid>' +
    items.map((metric) => '<div>' + metricCard(metric) + '</div>').join("") +
  '</div>';
}

function opportunityList(items) {
  return '<ul class="uk-list uk-list-divider uk-margin-remove">' +
    items.map((item, index) =>
      '<li>' +
        '<button class="uk-button uk-button-text opportunity-action" type="button" data-prompt-index="' + index + '">' +
          '<span class="eyebrow">' + escapeHtml(item.area) + '</span>' +
          '<span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.detail) + '</small></span>' +
          badge(item.impact, item.impact === "Hoch" ? "warning" : "neutral") +
        '</button>' +
      '</li>'
    ).join("") +
  '</ul>';
}

function overview() {
  return metricGrid() +
    '<div class="uk-grid-medium uk-child-width-1-1 uk-child-width-2-3@l" data-uk-grid>' +
      '<div>' + panel("Entwicklung", "Letzte 30 Tage", emptyChart("Organische Klicks und Conversion-Entwicklung")) + '</div>' +
      '<div class="uk-width-expand@l">' + panel(
        "Priorisierte Chancen",
        "Nächste Schritte",
        opportunityList(opportunities),
        '<a class="uk-button uk-button-text" href="?view=prompts" data-nav="prompts">Prompt Center</a>'
      ) + '</div>' +
    '</div>';
}

function customerView() {
  const rows = customers.map((customer) => {
    const relatedSites = websites
      .filter((website) => website.customer === customer.name)
      .flatMap((website) => [website.name, website.origin])
      .join(" ");
    const searchIndex = [
      customer.name,
      customer.company,
      customer.contact,
      customer.email,
      relatedSites
    ].join(" ").toLowerCase();

    return '<tr data-customer-row data-customer-search-index="' + escapeHtml(searchIndex) + '" data-customer-status="' + escapeHtml(customer.status) + '">' +
      '<td><strong>' + escapeHtml(customer.name) + '</strong><small class="table-secondary">' + escapeHtml(customer.company) + '</small></td>' +
      '<td>' + escapeHtml(customer.contact || "—") + '</td>' +
      '<td>' + customer.websites + '</td>' +
      '<td>' + badge(customer.status, customer.status === "Aktiv" ? "success" : "warning") + '</td>' +
      '<td class="table-actions">' +
        '<button class="uk-button uk-button-small uk-button-default" type="button" data-customer-open="' + escapeHtml(customer.id) + '">Öffnen</button> ' +
        '<button class="uk-button uk-button-small uk-button-text" type="button" data-customer-edit="' + escapeHtml(customer.id) + '">Bearbeiten</button>' +
      '</td>' +
    '</tr>';
  }).join("");

  const toolbar =
    '<div class="customer-toolbar uk-grid-small uk-flex-middle" data-uk-grid>' +
      '<div class="uk-width-expand@s"><label class="uk-form-label" for="customer-search">Kunden suchen</label><div class="uk-form-controls"><input id="customer-search" class="uk-input" type="search" placeholder="Name, Firma, Kontakt oder Website" data-customer-search></div></div>' +
      '<div class="uk-width-medium@s"><label class="uk-form-label" for="customer-status">Status</label><div class="uk-form-controls"><select id="customer-status" class="uk-select" data-customer-status-filter><option value="all">Alle Status</option><option value="Aktiv">Aktiv</option><option value="Geplant">Geplant</option></select></div></div>' +
      '<div class="uk-width-auto@s uk-flex uk-flex-bottom"><button class="uk-button uk-button-primary" type="button" data-new-customer>Neuer Kunde</button></div>' +
    '</div>' +
    '<p class="uk-text-meta uk-margin-small-top" data-customer-result aria-live="polite">' + customers.length + ' Kunden sichtbar</p>';

  return '<section class="uk-card uk-card-default uk-card-body customer-directory" aria-labelledby="customer-directory-title">' +
    '<div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap uk-margin-medium-bottom">' +
      '<div><p class="eyebrow uk-margin-remove-bottom">Kundenübersicht</p><h2 id="customer-directory-title" class="uk-card-title uk-margin-small-top uk-margin-remove-bottom">Kunden schnell finden und wechseln</h2></div>' +
      '<span class="uk-badge">' + customers.length + '</span>' +
    '</div>' +
    '<form class="uk-form-stacked" onsubmit="return false">' + toolbar + '</form>' +
    '<div class="uk-overflow-auto" tabindex="0" role="region" aria-label="Kundentabelle horizontal scrollen">' +
      '<table class="uk-table uk-table-divider uk-table-small uk-table-middle">' +
        '<thead><tr><th>Kunde</th><th>Hauptkontakt</th><th>Websites</th><th>Status</th><th><span class="uk-hidden-visually">Aktionen</span></th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>' +
  '</section>';
}

function websitesView() {
  const items = websites.map((site) =>
    '<li>' +
      '<article class="website-row">' +
        '<div class="website-icon" aria-hidden="true">' + escapeHtml(site.name.charAt(0)) + '</div>' +
        '<div class="website-summary">' +
          '<div class="uk-flex uk-flex-middle uk-flex-wrap harika-control-cluster">' +
            badge(site.status, site.status === "Aktiv" ? "success" : "warning") +
            '<span class="uk-text-meta">Umgebung · ' + escapeHtml(site.environment) + '</span>' +
          '</div>' +
          '<h3 class="uk-margin-small-top uk-margin-remove-bottom">' + escapeHtml(site.name) + '</h3>' +
          '<p><a class="uk-link-text" href="' + escapeHtml(site.origin) + '" target="_blank" rel="noreferrer">' + escapeHtml(site.origin) + ' <span class="uk-hidden-visually">(öffnet in neuem Tab)</span></a></p>' +
          '<p>' + escapeHtml(site.customer) + ' · ' + escapeHtml(site.connectors) + ' Verbindungen · Health ' + site.health + '</p>' +
        '</div>' +
        '<div class="website-actions">' +
          '<button class="uk-button uk-button-default uk-button-small" type="button" data-website-open="' + escapeHtml(site.id) + '">Öffnen</button>' +
          '<button class="uk-button uk-button-text uk-button-small" type="button" data-website-edit="' + escapeHtml(site.id) + '">Bearbeiten</button>' +
        '</div>' +
      '</article>' +
    '</li>'
  ).join("");

  return '<section class="uk-card uk-card-default uk-card-body">' +
    '<div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap uk-margin-medium-bottom">' +
      '<div><p class="eyebrow uk-margin-remove-bottom">Website-Verzeichnis</p><h2 class="uk-card-title uk-margin-small-top uk-margin-remove-bottom">' + websites.length + ' Websites</h2></div>' +
      '<button class="uk-button uk-button-primary" type="button" data-new-website>Website hinzufügen</button>' +
    '</div>' +
    '<ul class="uk-list uk-list-divider website-list uk-margin-remove">' + items + '</ul>' +
  '</section>';
}

function keywordsTable() {
  const rows = searchRows.map((row) =>
    '<tr><td><strong>' + escapeHtml(row.query) + '</strong></td><td>' + row.clicks + '</td><td>' + row.impressions + '</td><td>' + escapeHtml(row.ctr) + '</td><td>' + escapeHtml(row.position) + '</td><td><button class="uk-button uk-button-text uk-button-small" type="button" data-prompt-index="0">Prompt anzeigen</button></td></tr>'
  ).join("");
  return '<div class="uk-overflow-auto" tabindex="0" role="region" aria-label="Keyword-Tabelle horizontal scrollen"><table class="uk-table uk-table-divider uk-table-small uk-table-middle"><thead><tr><th>Suchanfrage</th><th>Klicks</th><th>Impressionen</th><th>CTR</th><th>Ø Position</th><th>Aktion</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function landingpageTable() {
  const rows = landingPages.map((row) =>
    '<tr><td><strong>' + escapeHtml(row.path) + '</strong></td><td>' + row.clicks + '</td><td>' + row.impressions + '</td><td>' + escapeHtml(row.ctr) + '</td><td>' + escapeHtml(row.position) + '</td><td>' + badge(row.trend, row.trend.startsWith("+") ? "success" : "warning") + '</td></tr>'
  ).join("");
  return '<div class="uk-overflow-auto" tabindex="0" role="region" aria-label="Landingpage-Tabelle horizontal scrollen"><table class="uk-table uk-table-divider uk-table-small uk-table-middle"><thead><tr><th>Landingpage</th><th>Klicks</th><th>Impressionen</th><th>CTR</th><th>Ø Position</th><th>Trend</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function searchView() {
  const moverRows = searchMovers.map((item) =>
    '<li><div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap"><strong>' + escapeHtml(item.query) + '</strong><span>' + badge(item.status, item.status === "Gewinner" ? "success" : "warning") + ' <b>' + escapeHtml(item.movement) + '</b></span></div></li>'
  ).join("");
  const indexRows = indexation.map((item) =>
    '<div><article class="uk-card uk-card-default uk-card-body compact-stat"><strong>' + escapeHtml(item.value) + '</strong><span>' + escapeHtml(item.label) + '</span><small>' + escapeHtml(item.detail) + '</small></article></div>'
  ).join("");

  const tabs = [
    ["overview", "Übersicht"],
    ["keywords", "Keywords"],
    ["landingpages", "Landingpages"],
    ["movers", "Gewinner & Verlierer"],
    ["opportunities", "Chancen"],
    ["indexation", "Indexierung"]
  ];

  return '<ul class="uk-subnav uk-subnav-pill" aria-label="Search Bereiche">' +
      tabs.map(([id, label], index) =>
        '<li' + (index === 0 ? ' class="uk-active"' : '') + '><a href="#search-' + id + '" data-search-tab="' + id + '" aria-controls="search-' + id + '">' + label + '</a></li>'
      ).join("") +
    '</ul>' +
    '<section id="search-overview" data-search-panel="overview">' +
      '<div class="uk-grid-medium uk-child-width-1-1 uk-child-width-2-3@l" data-uk-grid>' +
        '<div>' + panel("Organische Entwicklung", "Search Console", emptyChart("Search Console Entwicklung")) + '</div>' +
        '<div class="uk-width-expand@l">' + panel("SEO-Chancen", "Priorisiert",
          '<ul class="uk-list uk-list-divider uk-margin-remove">' +
            '<li class="compact-stat"><strong>14</strong><span>Keywords Position 4–15</span></li>' +
            '<li class="compact-stat"><strong>8</strong><span>hohe Impressionen + niedrige CTR</span></li>' +
            '<li class="compact-stat"><strong>3</strong><span>neue Gewinner</span></li>' +
          '</ul>') + '</div>' +
      '</div>' +
    '</section>' +
    '<section id="search-keywords" data-search-panel="keywords" hidden>' + panel("Keywords", "Search Console", keywordsTable()) + '</section>' +
    '<section id="search-landingpages" data-search-panel="landingpages" hidden>' + panel("Landingpages", "Organische Einstiege", landingpageTable()) + '</section>' +
    '<section id="search-movers" data-search-panel="movers" hidden>' + panel("Gewinner & Verlierer", "Vergleich zum Vorzeitraum", '<ul class="uk-list uk-list-divider uk-margin-remove">' + moverRows + '</ul>') + '</section>' +
    '<section id="search-opportunities" data-search-panel="opportunities" hidden>' + panel("Chancen", "Priorisiert", opportunityList(opportunities.filter((item) => item.area === "Search & SEO"))) + '</section>' +
    '<section id="search-indexation" data-search-panel="indexation" hidden><div class="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@m" data-uk-grid>' + indexRows + '</div></section>';
}

function adsView() {
  const rows = adCampaigns.map((campaign) =>
    '<tr><td><strong>' + escapeHtml(campaign.name) + '</strong></td><td>' + escapeHtml(campaign.spend) + '</td><td>' + escapeHtml(campaign.conversions) + '</td><td>' + escapeHtml(campaign.cpa) + '</td><td>' + badge(campaign.status, "success") + '</td><td><button class="uk-button uk-button-text uk-button-small" type="button" data-campaign-open="' + escapeHtml(campaign.id) + '">Öffnen</button></td></tr>'
  ).join("");

  const adsMetrics = [
    {label:"Kosten", value:"€ 1.617", delta:"+4,1 %", tone:"warning", source:"Google Ads"},
    {label:"Conversions", value:"40", delta:"+11,1 %", tone:"success", source:"Google Ads"},
    {label:"Ø CPA", value:"€ 40,43", delta:"−6,3 %", tone:"success", source:"Google Ads"}
  ];

  return metricGrid(adsMetrics, "uk-child-width-1-1 uk-child-width-1-3@m") +
    panel("Kampagnen", "Google Ads",
      '<div class="uk-overflow-auto" tabindex="0" role="region" aria-label="Ads-Kampagnen horizontal scrollen"><table class="uk-table uk-table-divider uk-table-small uk-table-middle"><thead><tr><th>Kampagne</th><th>Kosten</th><th>Conversions</th><th>CPA</th><th>Status</th><th>Aktion</th></tr></thead><tbody>' + rows + '</tbody></table></div>');
}

function visibilityView() {
  const cards = aiSystems.map((provider) =>
    '<div><article class="uk-card uk-card-default uk-card-body">' +
      '<div class="uk-flex uk-flex-between uk-flex-middle">' +
        '<div>' + badge(provider.state, provider.state === "Aktiv" ? "success" : "neutral") + '<h3 class="uk-card-title uk-margin-small-top uk-margin-remove-bottom">' + escapeHtml(provider.name) + '</h3></div>' +
        '<strong class="provider-score">' + (provider.score === null ? "–" : provider.score + " %") + '</strong>' +
      '</div>' +
    '</article></div>'
  ).join("");

  return panel("Messabdeckung", "Provider", '<div class="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-4@l" data-uk-grid>' + cards + '</div>') +
    '<div class="uk-grid-medium uk-child-width-1-1 uk-child-width-2-3@l uk-margin-medium-top" data-uk-grid>' +
      '<div>' + panel("Sichtbarkeit im Zeitverlauf", "AI Visibility", emptyChart("AI Visibility Trend")) + '</div>' +
      '<div class="uk-width-expand@l">' + panel("Wettbewerber", "12 beobachtete Fragen", '<ol class="uk-list uk-list-divider rank-list"><li><strong>AMBRA</strong><span>64 %</span></li><li><strong>Sonnenwerk</strong><span>58 %</span></li><li><strong>ShadePro</strong><span>42 %</span></li></ol>') + '</div>' +
    '</div>';
}

function promptsView() {
  const cards = prompts.map((prompt, index) =>
    '<div><article class="uk-card uk-card-default uk-card-body prompt-card">' +
      '<p class="eyebrow">' + escapeHtml(prompt.context) + '</p>' +
      '<h3 class="uk-card-title">' + escapeHtml(prompt.title) + '</h3>' +
      '<p>' + escapeHtml(prompt.text) + '</p>' +
      '<button class="uk-button uk-button-primary uk-button-small uk-margin-auto-top" type="button" data-prompt-index="' + index + '">Prompt anzeigen</button>' +
    '</article></div>'
  ).join("");
  return '<div class="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-3@xl" data-uk-grid>' + cards + '</div>';
}

function developmentView() {
  const devMetrics = [
    {label:"Organische Klicks", value:"+18 %", delta:"seit Baseline", tone:"success", source:"90 Tage"},
    {label:"AI Visibility", value:"+11 PP", delta:"seit Baseline", tone:"success", source:"90 Tage"},
    {label:"Website Health", value:"+9 Punkte", delta:"seit Baseline", tone:"success", source:"90 Tage"}
  ];
  return metricGrid(devMetrics, "uk-child-width-1-1 uk-child-width-1-3@m") +
    panel("Wirkung über Zeit", "Historische Messpunkte", emptyChart("Harika Entwicklung")) +
    '<div class="uk-margin-medium-top">' + panel("Annotationen", "Maßnahmen",
      '<ul class="uk-list uk-list-divider uk-margin-remove">' +
        '<li><time class="uk-text-meta">28. Sep</time><strong class="uk-display-block">SEO-Optimierung Raffstore</strong><p class="uk-text-meta uk-margin-small-top">Title, Description und interne Verlinkung angepasst.</p></li>' +
        '<li><time class="uk-text-meta">19. Sep</time><strong class="uk-display-block">Performance-Fix</strong><p class="uk-text-meta uk-margin-small-top">Hero-Bild und Font-Loading optimiert.</p></li>' +
        '<li><time class="uk-text-meta">08. Sep</time><strong class="uk-display-block">Ads Landingpage angepasst</strong><p class="uk-text-meta uk-margin-small-top">Message Match und CTA verbessert.</p></li>' +
      '</ul>') + '</div>';
}

function settingsView() {
  const order = ["connections", "users", "security", "diagnostics", "wordpress", "retention"];
  const items = order.map((key) => {
    const item = settingDetails[key];
    return '<li><button class="uk-button uk-button-text uk-width-1-1 uk-text-left" type="button" data-setting-open="' + key + '">' +
      '<span class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1"><span><strong class="uk-display-block">' + escapeHtml(item.title) + '</strong><small class="uk-text-meta">' + escapeHtml(item.description) + '</small></span><span data-uk-icon="icon: chevron-right" aria-hidden="true"></span></span>' +
    '</button></li>';
  }).join("");
  return panel("Harika konfigurieren", "System", '<ul class="uk-list uk-list-divider uk-margin-remove">' + items + '</ul>');
}

const views = {
  overview,
  customers: customerView,
  websites: websitesView,
  search: searchView,
  ads: adsView,
  visibility: visibilityView,
  prompts: promptsView,
  development: developmentView,
  settings: settingsView
};

export function renderView(view) {
  return (views[view] || views.overview)();
}

export function renderPromptModal(index) {
  const prompt = prompts[Number(index)] || prompts[0];
  return modalShell({
    eyebrow: "Prompt Center",
    title: prompt.title,
    body: '<p class="uk-text-meta">' + escapeHtml(prompt.context) + '</p><pre class="uk-background-muted uk-padding-small uk-text-small prompt-preview"><code>' + escapeHtml(prompt.text) + '</code></pre>',
    footer: '<small class="uk-text-meta">Clickdummy: keine echte Aktion wird ausgeführt.</small><button class="uk-button uk-button-primary" type="button" data-copy-prompt="' + escapeHtml(prompt.text) + '">In Zwischenablage kopieren</button>'
  });
}
