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
  {
    id: "ambra",
    name: "AMBRA Sonnenschutzsysteme",
    company: "AMBRA Sonnenschutzsysteme",
    contact: "Cem Firat",
    email: "office@ambra.example",
    phone: "+43 1 555 0101",
    websites: 1,
    status: "Aktiv"
  },
  {
    id: "people-matter",
    name: "People Matter",
    company: "Katharina Weiner GmbH",
    contact: "Katharina Weiner",
    email: "kontakt@peoplematter.example",
    phone: "+43 1 555 0102",
    websites: 2,
    status: "Aktiv"
  },
  {
    id: "eurocasher",
    name: "Eurocasher",
    company: "Eurocasher",
    contact: "Projektteam",
    email: "office@eurocasher.example",
    phone: "",
    websites: 1,
    status: "Aktiv"
  },
  {
    id: "mediarama",
    name: "Mediarama",
    company: "Mediarama",
    contact: "Intern",
    email: "",
    phone: "",
    websites: 0,
    status: "Geplant"
  }
];

export const websites = [
  {
    id: "ambra-at",
    name: "AMBRA",
    origin: "https://ambra.at",
    customer: "AMBRA Sonnenschutzsysteme",
    environment: "Produktion",
    health: 86,
    status: "Aktiv",
    connectors: "4/4",
    wordpress: "6.9.1",
    theme: "YOOtheme Pro",
    lastCheck: "vor 18 Min."
  },
  {
    id: "people-matter-live",
    name: "People Matter",
    origin: "https://peoplematter.example",
    customer: "People Matter",
    environment: "Produktion",
    health: 78,
    status: "Aktiv",
    connectors: "3/4",
    wordpress: "6.9.1",
    theme: "YOOtheme Pro",
    lastCheck: "vor 43 Min."
  },
  {
    id: "people-matter-staging",
    name: "People Matter Staging",
    origin: "https://staging.peoplematter.example",
    customer: "People Matter",
    environment: "Staging",
    health: 71,
    status: "Geplant",
    connectors: "2/4",
    wordpress: "6.9.1",
    theme: "YOOtheme Pro",
    lastCheck: "gestern"
  },
  {
    id: "eurocasher-shop",
    name: "Eurocasher",
    origin: "https://eurocasher.example",
    customer: "Eurocasher",
    environment: "Produktion",
    health: 81,
    status: "Aktiv",
    connectors: "3/4",
    wordpress: "6.9.1",
    theme: "YOOtheme Pro",
    lastCheck: "vor 2 Std."
  }
];

export const searchRows = [
  { query: "raffstore wien", clicks: 214, impressions: 2830, ctr: "7,6 %", position: "5,3" },
  { query: "jalousien wien", clicks: 167, impressions: 3420, ctr: "4,9 %", position: "6,8" },
  { query: "pergola wien", clicks: 91, impressions: 1890, ctr: "4,8 %", position: "8,1" },
  { query: "fliegengitter plisse", clicks: 76, impressions: 940, ctr: "8,1 %", position: "4,7" }
];

export const landingPages = [
  { path: "/raffstores/", clicks: 488, impressions: 7130, ctr: "6,8 %", position: "5,9", trend: "+14 %" },
  { path: "/markisen/", clicks: 361, impressions: 4980, ctr: "7,2 %", position: "6,2", trend: "+7 %" },
  { path: "/pergolen/", clicks: 244, impressions: 4210, ctr: "5,8 %", position: "8,4", trend: "-3 %" }
];

export const searchMovers = [
  { query: "raffstore wien", movement: "+2,1", status: "Gewinner" },
  { query: "fliegengitter plisse", movement: "+1,4", status: "Gewinner" },
  { query: "pergola beschattung", movement: "-2,8", status: "Verlierer" },
  { query: "markise terrasse", movement: "-1,2", status: "Verlierer" }
];

export const indexation = [
  { label: "Indexierte URLs", value: "38", detail: "Search Console" },
  { label: "Nicht indexiert", value: "5", detail: "davon 3 bewusst ausgeschlossen" },
  { label: "Sitemap", value: "Aktiv", detail: "zuletzt gelesen vor 2 Tagen" }
];

export const adCampaigns = [
  { id: "raffstores", name: "Search | Raffstores", spend: "€ 684", conversions: "18", cpa: "€ 38,00", status: "Aktiv", ctr: "7,8 %", landingpage: "/raffstores/" },
  { id: "markisen", name: "Search | Markisen", spend: "€ 512", conversions: "13", cpa: "€ 39,38", status: "Aktiv", ctr: "6,9 %", landingpage: "/markisen/" },
  { id: "pergolen", name: "Search | Pergolen", spend: "€ 421", conversions: "9", cpa: "€ 46,78", status: "Aktiv", ctr: "5,8 %", landingpage: "/pergolen/" }
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

export const settingDetails = {
  connections: {
    title: "Verbindungen",
    description: "WordPress, Search Console, GA4, Google Ads und AI Visibility werden hier pro Workspace verwaltet.",
    status: "4 aktive Verbindungen"
  },
  users: {
    title: "Benutzer & Rollen",
    description: "Zugriffe und Rollen bleiben getrennt von Kundenkontakten und werden je Workspace verwaltet.",
    status: "2 Benutzer"
  },
  security: {
    title: "Login & Sicherheit",
    description: "Passkeys, Sitzungen und weitere Sicherheitsoptionen werden hier gebündelt.",
    status: "Passkey aktiv"
  },
  diagnostics: {
    title: "Systemdiagnose",
    description: "Technische Audit-, Request- und Diagnoseinformationen bleiben aus der Hauptnavigation heraus und sind hier erreichbar.",
    status: "Keine kritischen Hinweise"
  },
  wordpress: {
    title: "WordPress Connector",
    description: "Version, erkannte Capabilities und Messbereitschaft des WordPress Connectors.",
    status: "Verbunden"
  },
  retention: {
    title: "Datenaufbewahrung",
    description: "Konfiguration für historische Messdaten und spätere Snapshot-Aufbewahrung.",
    status: "Standard"
  }
};
