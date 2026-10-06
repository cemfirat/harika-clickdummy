import {
  activeContext,
  adCampaigns,
  aiSystems,
  customers,
  metrics,
  opportunities,
  prompts,
  searchRows,
  websites
} from "./data.js";
import { badge, emptyChart, escapeHtml, metricCard, panel, viewIntroduction } from "./ui.js";

function overview() {
  const metricGrid = '<div class="metric-grid">' + metrics.map(metricCard).join("") + '</div>';
  const chanceRows = opportunities.map((item, index) =>
    '<button class="opportunity-row" type="button" data-prompt-index="' + index + '">' +
      '<span class="opportunity-row__area">' + escapeHtml(item.area) + '</span>' +
      '<span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.detail) + '</small></span>' +
      badge(item.impact, item.impact === "Hoch" ? "warning" : "neutral") +
    '</button>'
  ).join("");

  return viewIntroduction("Übersicht", "Wie steht der aktive Kunde gerade da und wo ist das größte Potenzial?") +
    metricGrid +
    '<div class="dashboard-grid">' +
      panel("Entwicklung", "Letzte 30 Tage", emptyChart("Organische Klicks und Conversion-Entwicklung")) +
      panel("Priorisierte Chancen", "Nächste Schritte", '<div class="opportunity-list">' + chanceRows + '</div>', '<button class="uk-button uk-button-text" data-nav="prompts">Prompt Center</button>') +
    '</div>';
}

function customerView() {
  const rows = customers.map((customer) =>
    '<tr><td><strong>' + escapeHtml(customer.name) + '</strong></td>' +
    '<td>' + escapeHtml(customer.contact) + '</td>' +
    '<td>' + customer.websites + '</td>' +
    '<td>' + badge(customer.status, customer.status === "Aktiv" ? "success" : "warning") + '</td>' +
    '<td class="table-actions"><button class="uk-button uk-button-small uk-button-default">Öffnen</button><button class="uk-button uk-button-small uk-button-text">Bearbeiten</button></td></tr>'
  ).join("");

  const toolbar = '<div class="list-toolbar"><input class="uk-input" type="search" placeholder="Kunden suchen…" aria-label="Kunden suchen"><select class="uk-select" aria-label="Status"><option>Alle Status</option><option>Aktiv</option><option>Geplant</option></select><button class="uk-button uk-button-primary">Neuer Kunde</button></div>';
  return viewIntroduction("Kunden", "Welche Kunden betreue ich, wie bearbeite ich ihre Daten und welche Websites gehören dazu?") +
    panel("Kundenliste", customers.length + " Kunden", toolbar + '<div class="uk-overflow-auto"><table class="uk-table uk-table-divider uk-table-middle"><thead><tr><th>Kunde</th><th>Kontakt</th><th>Websites</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>');
}

function websitesView() {
  const cards = websites.map((site) =>
    '<article class="website-card">' +
      '<div class="website-card__icon">' + escapeHtml(site.name.charAt(0)) + '</div>' +
      '<div class="website-card__main"><div class="website-card__meta">' + badge(site.status, site.status === "Aktiv" ? "success" : "warning") + '<span>' + escapeHtml(site.environment) + '</span></div>' +
      '<h3>' + escapeHtml(site.name) + '</h3><a href="' + escapeHtml(site.origin) + '" target="_blank" rel="noreferrer">' + escapeHtml(site.origin) + '</a>' +
      '<small>' + escapeHtml(site.customer) + ' · ' + escapeHtml(site.connectors) + ' Verbindungen</small></div>' +
      '<div class="website-card__score"><strong>' + site.health + '</strong><span>Health</span></div>' +
      '<div class="website-card__actions"><button class="uk-button uk-button-default uk-button-small">Öffnen</button><button class="uk-button uk-button-text uk-button-small">Bearbeiten</button></div>' +
    '</article>'
  ).join("");

  return viewIntroduction("Websites", "Ist diese Website technisch, inhaltlich und marketingseitig sauber aufgestellt?") +
    '<div class="section-toolbar"><div><strong>' + websites.length + ' Websites</strong><span>über alle Kunden</span></div><button class="uk-button uk-button-primary">Website hinzufügen</button></div>' +
    '<div class="website-list">' + cards + '</div>';
}

function searchView() {
  const rows = searchRows.map((row) =>
    '<tr><td><strong>' + escapeHtml(row.query) + '</strong></td><td>' + row.clicks + '</td><td>' + row.impressions + '</td><td>' + escapeHtml(row.ctr) + '</td><td>' + escapeHtml(row.position) + '</td><td><button class="uk-button uk-button-text uk-button-small" data-prompt-index="0">Prompt anzeigen</button></td></tr>'
  ).join("");
  return viewIntroduction("Search & SEO", "Wie werde ich in Google gefunden, wo verliere ich Potenzial und was soll ich als Nächstes optimieren?") +
    '<nav class="subnav" aria-label="Search Bereiche"><button class="is-active">Übersicht</button><button>Keywords</button><button>Landingpages</button><button>Gewinner & Verlierer</button><button>Chancen</button><button>Indexierung</button></nav>' +
    '<div class="dashboard-grid">' +
      panel("Organische Entwicklung", "Search Console", emptyChart("Search Console Entwicklung")) +
      panel("SEO-Chancen", "Priorisiert", '<div class="compact-stat"><strong>14</strong><span>Keywords Position 4–15</span></div><div class="compact-stat"><strong>8</strong><span>hohe Impressionen + niedrige CTR</span></div><div class="compact-stat"><strong>3</strong><span>neue Gewinner</span></div>') +
    '</div>' +
    panel("Suchanfragen", "Aktuelle Daten", '<div class="uk-overflow-auto"><table class="uk-table uk-table-divider uk-table-middle"><thead><tr><th>Suchanfrage</th><th>Klicks</th><th>Impressionen</th><th>CTR</th><th>Ø Position</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>');
}

function adsView() {
  const rows = adCampaigns.map((campaign) =>
    '<tr><td><strong>' + escapeHtml(campaign.name) + '</strong></td><td>' + escapeHtml(campaign.spend) + '</td><td>' + escapeHtml(campaign.conversions) + '</td><td>' + escapeHtml(campaign.cpa) + '</td><td>' + badge(campaign.status, "success") + '</td><td><button class="uk-button uk-button-text uk-button-small">Öffnen</button></td></tr>'
  ).join("");
  return viewIntroduction("Ads", "Laufen meine bezahlten Kampagnen effizient und passen Anzeige, Landingpage und Conversion zusammen?") +
    '<div class="metric-grid metric-grid--three">' +
      metricCard({label:"Kosten", value:"€ 1.617", delta:"+4,1 %", tone:"warning", source:"Google Ads"}) +
      metricCard({label:"Conversions", value:"40", delta:"+11,1 %", tone:"success", source:"Google Ads"}) +
      metricCard({label:"Ø CPA", value:"€ 40,43", delta:"−6,3 %", tone:"success", source:"Google Ads"}) +
    '</div>' +
    panel("Kampagnen", "Google Ads", '<div class="uk-overflow-auto"><table class="uk-table uk-table-divider uk-table-middle"><thead><tr><th>Kampagne</th><th>Kosten</th><th>Conversions</th><th>CPA</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>');
}

function visibilityView() {
  const cards = aiSystems.map((provider) =>
    '<article class="provider-card"><div>' + badge(provider.state, provider.state === "Aktiv" ? "success" : "neutral") + '<strong>' + escapeHtml(provider.name) + '</strong></div>' +
    '<span class="provider-card__score">' + (provider.score === null ? "–" : provider.score + " %") + '</span></article>'
  ).join("");
  return viewIntroduction("AI Visibility", "Wie sichtbar ist die Marke in relevanten AI-Systemen und wer wird stattdessen genannt?") +
    panel("Messabdeckung", "Provider", '<div class="provider-grid">' + cards + '</div>') +
    '<div class="dashboard-grid">' +
      panel("Sichtbarkeit im Zeitverlauf", "AI Visibility", emptyChart("AI Visibility Trend")) +
      panel("Wettbewerber", "12 beobachtete Fragen", '<ol class="rank-list"><li><strong>AMBRA</strong><span>64 %</span></li><li><strong>Sonnenwerk</strong><span>58 %</span></li><li><strong>ShadePro</strong><span>42 %</span></li></ol>') +
    '</div>';
}

function promptsView() {
  const cards = prompts.map((prompt, index) =>
    '<article class="prompt-card"><p class="eyebrow">' + escapeHtml(prompt.context) + '</p><h3>' + escapeHtml(prompt.title) + '</h3><p>' + escapeHtml(prompt.text) + '</p><button class="uk-button uk-button-primary uk-button-small" data-prompt-index="' + index + '">Prompt anzeigen</button></article>'
  ).join("");
  return viewIntroduction("Prompt Center", "Welchen konkreten Auftrag soll ich jetzt an ChatGPT geben?") +
    '<div class="prompt-grid">' + cards + '</div>';
}

function developmentView() {
  return viewIntroduction("Entwicklung", "Was hat sich verbessert und welche Maßnahme hatte Wirkung?") +
    '<div class="metric-grid metric-grid--three">' +
      metricCard({label:"Organische Klicks", value:"+18 %", delta:"seit Baseline", tone:"success", source:"90 Tage"}) +
      metricCard({label:"AI Visibility", value:"+11 PP", delta:"seit Baseline", tone:"success", source:"90 Tage"}) +
      metricCard({label:"Website Health", value:"+9 Punkte", delta:"seit Baseline", tone:"success", source:"90 Tage"}) +
    '</div>' +
    panel("Wirkung über Zeit", "Historische Messpunkte", emptyChart("Harika Entwicklung")) +
    panel("Annotationen", "Maßnahmen", '<div class="timeline"><article><time>28. Sep</time><strong>SEO-Optimierung Raffstore</strong><p>Title, Description und interne Verlinkung angepasst.</p></article><article><time>19. Sep</time><strong>Performance-Fix</strong><p>Hero-Bild und Font-Loading optimiert.</p></article><article><time>08. Sep</time><strong>Ads Landingpage angepasst</strong><p>Message Match und CTA verbessert.</p></article></div>');
}

function settingsView() {
  const items = [
    ["Verbindungen", "WordPress, Search Console, GA4, Google Ads und AI Visibility verwalten."],
    ["Benutzer & Rollen", "Zugriffe und Berechtigungen je Workspace verwalten."],
    ["Login & Sicherheit", "Passkeys und Kontosicherheit konfigurieren."],
    ["Systemdiagnose", "Technische Audit- und Request-Informationen einsehen."],
    ["WordPress Connector", "Connector-Version und Capabilities prüfen."],
    ["Datenaufbewahrung", "Historische Messdaten und Aufbewahrung steuern."]
  ].map((item) =>
    '<button class="settings-row" type="button"><span><strong>' + escapeHtml(item[0]) + '</strong><small>' + escapeHtml(item[1]) + '</small></span><span aria-hidden="true">→</span></button>'
  ).join("");
  return viewIntroduction("Einstellungen", "Verbindungen, Benutzer, Sicherheit und technische Systembereiche verwalten.") +
    panel("Harika konfigurieren", "System", '<div class="settings-list">' + items + '</div>');
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
  return '<div class="prompt-modal__backdrop" data-close-modal></div>' +
    '<div class="prompt-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="prompt-title">' +
      '<button class="prompt-modal__close" type="button" data-close-modal aria-label="Schließen">×</button>' +
      '<p class="eyebrow">Prompt Center</p><h2 id="prompt-title">' + escapeHtml(prompt.title) + '</h2>' +
      '<p class="uk-text-meta">' + escapeHtml(prompt.context) + '</p>' +
      '<pre><code>' + escapeHtml(prompt.text) + '</code></pre>' +
      '<div class="prompt-modal__footer"><small>Clickdummy: keine echte Aktion wird ausgeführt.</small><button class="uk-button uk-button-primary" type="button" data-copy-prompt="' + escapeHtml(prompt.text) + '">In Zwischenablage kopieren</button></div>' +
    '</div>';
}

export function contextLabel() {
  return activeContext.customer + " · " + activeContext.website;
}
