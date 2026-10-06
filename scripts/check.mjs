import { readFile, readdir } from "node:fs/promises";
import { harikaSource } from "../src/harika-source.js";
import { transferState } from "../src/transfer-state.js";

const productPages = [
  "index.html",
  "kunden.html",
  "websites.html",
  "search-seo.html",
  "ads.html",
  "ai-visibility.html",
  "prompt-center.html",
  "entwicklung.html",
  "einstellungen.html"
];

const prototypePages = ["styleguide.html"];
const allPages = [...productPages, ...prototypePages];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fullSha = /^[0-9a-f]{40}$/;
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const appSource = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const lessEntry = await readFile(new URL("../src/styles/main.less", import.meta.url), "utf8");
const shellLess = await readFile(new URL("../src/styles/shell.less", import.meta.url), "utf8");
const productLess = await readFile(new URL("../src/styles/product.less", import.meta.url), "utf8");
const visualizationLess = await readFile(new URL("../src/styles/visualizations.less", import.meta.url), "utf8");
const prototypeLess = await readFile(new URL("../src/styles/prototype.less", import.meta.url), "utf8");
const transferStatusSource = await readFile(new URL("./transfer-status.mjs", import.meta.url), "utf8");
const transferGuide = await readFile(new URL("../docs/UI-TRANSFER.md", import.meta.url), "utf8");
const baselineGuide = await readFile(new URL("../docs/UIKIT-BASELINE.md", import.meta.url), "utf8");
const viteConfigSource = await readFile(new URL("../vite.config.js", import.meta.url), "utf8");
const pagesWorkflowSource = await readFile(new URL("../.github/workflows/pages-preview.yml", import.meta.url), "utf8");
const srcFiles = await readdir(new URL("../src/", import.meta.url));

assert(harikaSource.repository === "cemfirat/ccf-sites-ads", "Harika source repository must remain explicit.");
assert(fullSha.test(harikaSource.commit), "Harika source commit must be a full SHA.");
assert(transferState.schemaVersion === 1, "Unsupported transfer-state schema.");
assert(fullSha.test(transferState.uiBaselineClickdummyCommit), "Clickdummy UI baseline must be a full SHA.");
assert(packageJson.dependencies?.uikit === "3.25.25", "Clickdummy must pin the audited Harika UIkit version exactly.");

for (const legacy of ["main.js", "ui.js", "views.js", "data.js", "interactions.js"]) {
  assert(!srcFiles.includes(legacy), "Legacy JS-renderer file must stay removed: " + legacy);
}

const html = {};
for (const page of allPages) {
  html[page] = await readFile(new URL("../" + page, import.meta.url), "utf8");
  assert(html[page].includes('<script type="module" src="/src/app.js"></script>'), page + " must use the shared behavior-only app.js.");
  assert(html[page].includes('<main class="workspace" id="main-content"'), page + " must own the main landmark.");
  assert(html[page].includes('class="uk-nav uk-nav-default main-nav"'), page + " must use native UIkit navigation.");
  assert(html[page].includes('data-uk-offcanvas="overlay: true; flip: false"'), page + " must use UIkit Offcanvas.");
  assert(html[page].includes('src="./icon.svg"'), page + " must use the real Harika icon.");
  assert(!html[page].includes("?view="), page + " must not use the old JS view router.");
}

const combinedProductHtml = productPages.map((page) => html[page]).join("\n");
for (const [href, label] of [
  ["./index.html", "Übersicht"],
  ["./kunden.html", "Kunden"],
  ["./websites.html", "Websites"],
  ["./search-seo.html", "Search & SEO"],
  ["./ads.html", "Ads"],
  ["./ai-visibility.html", "AI Visibility"],
  ["./prompt-center.html", "Prompt Center"],
  ["./entwicklung.html", "Entwicklung"],
  ["./einstellungen.html", "Einstellungen"]
]) {
  for (const page of productPages) {
    assert(html[page].includes('href="' + href + '"'), page + " is missing navigation link " + label + ".");
  }
}

for (const marker of [
  "uk-card uk-card-default",
  "uk-form-stacked",
  "uk-table uk-table-divider",
  "uk-list uk-list-divider",
  "uk-subnav uk-subnav-pill",
  "uk-alert uk-alert-primary",
  "uk-modal-dialog"
]) {
  assert((combinedProductHtml + html["styleguide.html"]).includes(marker), "Expected UIkit-first HTML marker missing: " + marker);
}

assert(html["search-seo.html"].includes("data-uk-switcher"), "Search & SEO tabs must use native UIkit Switcher.");
assert(html["kunden.html"].includes("data-customer-search"), "Customer page must preserve direct HTML filter hooks.");
assert(html["prompt-center.html"].includes("data-copy-target"), "Prompt Center must preserve clipboard hooks in HTML.");

assert(!/\bfetch\s*\(/.test(appSource), "Clickdummy must not call remote APIs.");
assert(!/XMLHttpRequest/.test(appSource), "Clickdummy must not use XMLHttpRequest.");
assert(!/\.innerHTML\s*=/.test(appSource), "app.js must not render page markup with innerHTML.");
assert(!/insertAdjacentHTML/.test(appSource), "app.js must not inject page markup.");
assert(!/document\.createElement/.test(appSource), "app.js must remain behavior-only; page structure belongs in HTML.");
assert(!/<(?:main|section|article|table|nav|aside)\b/i.test(appSource), "app.js must not contain page markup.");

assert(!appSource.includes('uikit/dist/css/uikit.min.css'), "Do not load prebuilt UIkit CSS alongside the LESS theme.");
assert(lessEntry.includes('@import "uikit/src/less/uikit.less";'), "UIkit LESS source must be the styling foundation.");
assert(lessEntry.includes('@import "./theme/_import.less";'), "Harika UIkit theme layer must be imported.");

const nonThemeLess = [shellLess, productLess, visualizationLess, prototypeLess].join("\n");
for (const selector of [".uk-button", ".uk-input", ".uk-select", ".uk-textarea", ".uk-card", ".uk-label", ".uk-badge", ".uk-alert"]) {
  assert(!nonThemeLess.includes(selector), "Standard UIkit component must not be reskinned outside theme layer: " + selector);
}

for (const page of allPages) {
  assert(viteConfigSource.includes('"' + page + '"'), "Vite multi-page build is missing " + page + ".");
}

assert(viteConfigSource.includes('mode === "pages" ? "/harika-clickdummy/" : "/"'), "Vite Pages base path must remain explicit.");
assert(baselineGuide.includes("HTML first"), "UIkit baseline guide must preserve the HTML-first UI-lab rule.");
assert(transferStatusSource.includes('"styleguide.html"'), "Styleguide HTML must remain prototype-only in transfer status.");
assert(transferStatusSource.includes('"src/app.js"'), "Behavior-only app.js must be classified explicitly.");
assert(pagesWorkflowSource.includes("workflow_dispatch:"), "Pages preview must remain manually deployable.");
assert(/^\s*push:/m.test(pagesWorkflowSource), "Pages preview must auto-deploy relevant main changes.");
assert(pagesWorkflowSource.includes('"*.html"'), "Pages preview must deploy root HTML page changes.");
assert(pagesWorkflowSource.includes('"src/**"'), "Pages preview must deploy source changes.");
assert(transferGuide.includes("No PR before green branch CI"), "Transfer guide must preserve permanent CI-before-PR rule.");

console.log("Harika clickdummy HTML-first UIkit checks passed.");
