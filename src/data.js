export const navigation = [
  ["overview", "Übersicht", "01"],
  ["customers", "Kunden", "02"],
  ["websites", "Websites", "03"],
  ["search", "Search & SEO", "04"],
  ["ads", "Ads", "05"],
  ["visibility", "AI Visibility", "06"],
  ["prompts", "Prompt Center", "07"],
  ["development", "Entwicklung", "08"],
  ["settings", "Einstellungen", "09"]
];

export const activeContext = {
  customer: "AMBRA Sonnenschutzsysteme",
  website: "ambra.at",
  environment: "Produktion",
  period: "Letzte 30 Tage",
  freshness: "vor 18 Min."
};

export const metrics = [
  { label: "Organische Klicks", value: "1.842", delta: "+12,4 %", tone: "success", source: "Search Console" },
  { label: "AI Visibility", value: "64 %", delta: "+7 PP", tone: "success", source: "AI Visibility" },
  { label: "Conversions", value: "47", delta: "+9,3 %", tone: "success", source: "GA4 + Ads" },
  { label: "Website Health", value: "86 / 100", delta: "3 Hinweise", tone: "warning", source: "Website Intelligence" }
];

export const opportunities = [
  {
    area: "Search & SEO",
    title: "Raffstore-Landingpage hat hohe Impressionen, aber niedrige CTR",
    detail: "Position 6,8 bei 3.420 Impressionen. Title und Description zuerst prüfen.",
    impact: "Hoch"
  },
  {
    area: "Website",
    title: "Core Web Vitals auf Mobil verbessern",
    detail: "LCP ist bei zwei zentralen Landingpages erhöht. Keine pauschale Performance-Aussage.",
    impact: "Mittel"
  },
  {
    area: "AI Visibility",
    title: "Pergolen werden bei relevanten Fragen zu selten genannt",
    detail: "Mitbewerber werden in 8 von 12 beobachteten Antworten häufiger genannt.",
    impact: "Hoch"
  }
];

export const customers = [
  { name: "AMBRA Sonnenschutzsysteme", contact: "Cem Firat", websites: 1, status: "Aktiv" },
  { name: "People Matter", contact: "Katharina Weiner", websites: 2, status: "Aktiv" },
  { name: "Eurocasher", contact: "Projektteam", websites: 1, status: "Aktiv" },
  { name: "Mediarama", contact: "Intern", websites: 0, status: "Geplant" }
];

export const websites = [
  { name: "AMBRA", origin: "https://ambra.at", customer: "AMBRA Sonnenschutzsysteme", environment: "Produktion", health: 86, status: "Aktiv", connectors: "4/4" },
  { name: "People Matter", origin: "https://peoplematter.example", customer: "People Matter", environment: "Produktion", health: 78, status: "Aktiv", connectors: "3/4" },
  { name: "People Matter Staging", origin: "https://staging.peoplematter.example", customer: "People Matter", environment: "Staging", health: 71, status: "Geplant", connectors: "2/4" }
];

export const searchRows = [
  { query: "raffstore wien", clicks: 214, impressions: 2830, ctr: "7,6 %", position: "5,3" },
  { query: "jalousien wien", clicks: 167, impressions: 3420, ctr: "4,9 %", position: "6,8" },
  { query: "pergola wien", clicks: 91, impressions: 1890, ctr: "4,8 %", position: "8,1" },
  { query: "fliegengitter plisse", clicks: 76, impressions: 940, ctr: "8,1 %", position: "4,7" }
];

export const adCampaigns = [
  { name: "Search | Raffstores", spend: "€ 684", conversions: "18", cpa: "€ 38,00", status: "Aktiv" },
  { name: "Search | Markisen", spend: "€ 512", conversions: "13", cpa: "€ 39,38", status: "Aktiv" },
  { name: "Search | Pergolen", spend: "€ 421", conversions: "9", cpa: "€ 46,78", status: "Aktiv" }
];

export const aiSystems = [
  { name: "ChatGPT", state: "Aktiv", score: 72 },
  { name: "Perplexity", state: "Aktiv", score: 61 },
  { name: "Google AI", state: "Nicht verbunden", score: null },
  { name: "Weitere Provider", state: "Nicht messbar", score: null }
];

export const prompts = [
  {
    title: "SEO-Chance analysieren",
    context: "AMBRA · ambra.at · Search Console",
    text: "Analysiere die Suchanfrage „jalousien wien“ anhand der sichtbaren Harika-Messdaten. Trenne gemessene Fakten von Annahmen und priorisiere konkrete Optimierungen für Snippet, Landingpage und interne Verlinkung. Ändere noch nichts."
  },
  {
    title: "AI-Visibility-Lücke untersuchen",
    context: "AMBRA · Pergolen · AI Visibility",
    text: "Analysiere, weshalb Mitbewerber bei Fragen zu Pergolen häufiger genannt werden. Nutze nur belegte Quellen und die vorhandenen Harika-Beobachtungen. Erstelle danach drei priorisierte Content-Maßnahmen."
  },
  {
    title: "Website Health prüfen",
    context: "AMBRA · ambra.at · Website Intelligence",
    text: "Bewerte die gemessenen Website-Health-Hinweise. Unterscheide Fehler, Chancen und nicht verifizierbare Zustände. Schlage zuerst nur sichere Prüf- und Verbesserungsmaßnahmen vor."
  }
];
