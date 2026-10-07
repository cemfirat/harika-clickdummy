import { readFile, readdir } from "node:fs/promises";
import { harikaSource } from "../src/harika-source.js";
import { transferState } from "../src/transfer-state.js";

const productPages = [
  ["index.html", "overview"],
  ["kunden.html", "kunden"],
  ["websites.html", "websites"],
  ["search-seo.html", "search-seo"],
  ["ads.html", "ads"],
  ["ai-visibility.html", "ai-visibility"],
  ["prompt-center.html", "prompt-center"],
  ["entwicklung.html", "entwicklung"],
  ["einstellungen.html", "einstellungen"]
];

const prototypePages = [["styleguide.html", "styleguide"]];
const allPages = [...productPages, ...prototypePages];

const partialFiles = [
  "brand.html",
  "user.html",
  "navigation.html",
  "sidebar.html",
  "workspace-header.html",
  "footer.html",
  "mobile-nav.html",
  "profile-modal.html"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fullSha = /^[0-9a-f]{40}$/;
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const appSource = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const lessEntry = await readFile(new URL("../src/styles/main.less", import.meta.url), "utf8");
const standardThemeSource = await readFile(new URL("../src/styles/themes/standard.less", import.meta.url), "utf8");
const interfaceThemeSource = await readFile(new URL("../src/styles/themes/interface.less", import.meta.url), "utf8");
const interfaceImportSource = await readFile(new URL("../src/styles/themes/interface/_import.less", import.meta.url), "utf8");
const interfaceOffcanvasSource = await readFile(new URL("../src/styles/themes/interface/offcanvas.less", import.meta.url), "utf8");
const customerThemeSource = await readFile(new URL("../src/styles/themes/customers/ambra.less", import.meta.url), "utf8");
const customerVariablesSource = await readFile(new URL("../src/styles/themes/customers/ambra/variables.less", import.meta.url), "utf8");
const shellLess = await readFile(new URL("../src/styles/shell.less", import.meta.url), "utf8");
const productLess = await readFile(new URL("../src/styles/product.less", import.meta.url), "utf8");
const visualizationLess = await readFile(new URL("../src/styles/visualizations.less", import.meta.url), "utf8");
const prototypeLess = await readFile(new URL("../src/styles/prototype.less", import.meta.url), "utf8");
const transferStatusSource = await readFile(new URL("./transfer-status.mjs", import.meta.url), "utf8");
const transferGuide = await readFile(new URL("../docs/UI-TRANSFER.md", import.meta.url), "utf8");
const baselineGuide = await readFile(new URL("../docs/UIKIT-BASELINE.md", import.meta.url), "utf8");
const editingGuide = await readFile(new URL("../docs/EDITING-GUIDE.md", import.meta.url), "utf8");
const themesGuide = await readFile(new URL("../docs/THEMES.md", import.meta.url), "utf8");
const viteConfigSource = await readFile(new URL("../vite.config.js", import.meta.url), "utf8");
const pagesWorkflowSource = await readFile(new URL("../.github/workflows/pages-preview.yml", import.meta.url), "utf8");
const srcFiles = await readdir(new URL("../src/", import.meta.url));
const stylesDirectories = await readdir(new URL("../src/styles/", import.meta.url));

assert(harikaSource.repository === "cemfirat/ccf-sites-ads", "Harika source repository must remain explicit.");
assert(fullSha.test(harikaSource.commit), "Harika source commit must be a full SHA.");
assert(transferState.schemaVersion === 1, "Unsupported transfer-state schema.");
assert(fullSha.test(transferState.uiBaselineClickdummyCommit), "Clickdummy UI baseline must be a full SHA.");
assert(packageJson.dependencies?.uikit === "3.25.25", "Clickdummy must pin the audited Harika UIkit version exactly.");

for (const legacy of ["main.js", "ui.js", "views.js", "data.js", "interactions.js"]) {
  assert(!srcFiles.includes(legacy), "Legacy JS-renderer file must stay removed: " + legacy);
}

const partials = {};
for (const file of partialFiles) {
  partials[file] = await readFile(new URL("../partials/" + file, import.meta.url), "utf8");
}

assert(partials["navigation.html"].includes('class="uk-nav uk-nav-default main-nav"'), "Navigation partial must use native UIkit navigation.");
assert(partials["navigation.html"].includes('data-nav-page="overview"'), "Navigation partial must expose page identifiers.");
assert(partials["sidebar.html"].includes("@include partials/navigation.html"), "Sidebar must reuse the shared navigation partial.");
assert(partials["mobile-nav.html"].includes("@include partials/navigation.html"), "Mobile navigation must reuse the shared navigation partial.");
assert(partials["sidebar.html"].includes("@include partials/brand.html"), "Sidebar must reuse the shared brand partial.");
assert(partials["mobile-nav.html"].includes("@include partials/brand.html"), "Mobile navigation must reuse the shared brand partial.");
assert(partials["workspace-header.html"].includes("{{title}}"), "Workspace header must expose the title variable.");
assert(partials["workspace-header.html"].includes("{{description}}"), "Workspace header must expose the description variable.");
assert(partials["mobile-nav.html"].includes('data-uk-offcanvas="overlay: true; flip: false"'), "Mobile navigation must use UIkit Offcanvas.");
assert(partials["brand.html"].includes('src="./icon.svg"'), "Brand partial must use the real Harika icon.");

const html = {};
for (const [page, pageId] of allPages) {
  html[page] = await readFile(new URL("../" + page, import.meta.url), "utf8");

  assert(html[page].includes('<body data-page="' + pageId + '">'), page + " must expose its page id.");
  assert(html[page].includes("<!-- @include partials/sidebar.html -->"), page + " must use the shared sidebar.");
  assert(html[page].includes("<!-- @include partials/workspace-header.html "), page + " must use the shared workspace header.");
  assert(html[page].includes("<!-- @include partials/footer.html -->"), page + " must use the shared footer.");
  assert(html[page].includes("<!-- @include partials/mobile-nav.html -->"), page + " must use the shared mobile navigation.");
  assert(html[page].includes("<!-- @include partials/profile-modal.html -->"), page + " must use the shared profile modal.");
  assert(html[page].includes('<script type="module" src="/src/app.js"></script>'), page + " must use the shared behavior-only app.js.");
  assert(html[page].includes('<main class="workspace" id="main-content"'), page + " must keep directly editable page content inside the main landmark.");
  assert(!html[page].includes('<aside class="sidebar desktop-sidebar"'), page + " must not duplicate global sidebar markup.");
  assert(!html[page].includes('<footer class="app-footer"'), page + " must not duplicate global footer markup.");
  assert(!html[page].includes('<div id="ccf-mobile-nav"'), page + " must not duplicate global mobile navigation.");
  assert(!html[page].includes("?view="), page + " must not use the old JS view router.");
}

const combinedProductHtml = productPages.map(([page]) => html[page]).join("\n");
for (const marker of [
  "uk-card uk-card-default",
  "uk-form-stacked",
  "uk-table uk-table-divider",
  "uk-list uk-list-divider",
  "uk-subnav uk-subnav-pill",
  "uk-alert uk-alert-primary",
  "uk-modal-dialog"
]) {
  assert((combinedProductHtml + html["styleguide.html"] + Object.values(partials).join("\n")).includes(marker), "Expected UIkit-first HTML marker missing: " + marker);
}

assert(html["search-seo.html"].includes("data-uk-switcher"), "Search & SEO tabs must use native UIkit Switcher.");
assert(html["kunden.html"].includes("data-customer-search"), "Customer page must preserve direct HTML filter hooks.");
assert(html["prompt-center.html"].includes("data-copy-target"), "Prompt Center must preserve clipboard hooks in HTML.");

assert(!/\bfetch\s*\(/.test(appSource), "Clickdummy must not call remote APIs.");
assert(!/XMLHttpRequest/.test(appSource), "Clickdummy must not use XMLHttpRequest.");
assert(!/\.innerHTML\s*=/.test(appSource), "app.js must not render page markup with innerHTML.");
assert(!/insertAdjacentHTML/.test(appSource), "app.js must not inject page markup.");
assert(!/document\.createElement/.test(appSource), "app.js must remain behavior-only; page structure belongs in HTML/partials.");
assert(!/<(?:main|section|article|table|nav|aside)\b/i.test(appSource), "app.js must not contain page markup.");
assert(appSource.includes('document.body.dataset.page'), "app.js must activate shared navigation from the page id.");
assert(appSource.includes('[data-nav-page]'), "app.js must target shared navigation metadata.");
assert(appSource.includes("document.documentElement.dataset.theme = __HARIKA_THEME__"), "app.js must expose the selected theme for inspection.");

assert(!appSource.includes('uikit/dist/css/uikit.min.css'), "Do not load prebuilt UIkit CSS alongside the Less theme.");
assert(appSource.includes('import "@harika-theme";'), "app.js must load the selected Vite theme alias.");
assert(lessEntry.includes('@import "./themes/interface.less";'), "Compatibility main.less must point to the Harika interface theme.");

assert(standardThemeSource.includes('@import "uikit/src/less/uikit.theme.less";'), "Standard theme must import UIkit's official default theme.");
assert(!standardThemeSource.includes('@import "uikit/src/less/uikit.less";'), "Standard theme must use uikit.theme.less, not core-only uikit.less.");
assert(interfaceThemeSource.includes('@import "standard.less";'), "Harika interface theme must inherit the standard theme.");
assert(interfaceThemeSource.includes('@import "interface/_import.less";'), "Harika interface theme must load component customizations.");
assert(interfaceImportSource.includes('@import "variables.less";'), "Interface theme must preserve component-structured imports.");
assert(interfaceImportSource.includes('@import "offcanvas.less";'), "Interface theme must keep Offcanvas customization in the UIkit theme layer.");
assert(interfaceOffcanvasSource.includes("@offcanvas-bar-background"), "Offcanvas theme must use the official UIkit variable.");
assert(interfaceOffcanvasSource.includes(".hook-offcanvas-bar()"), "Offcanvas theme must use the official UIkit hook.");
assert(!shellLess.includes(".uk-offcanvas-bar"), "Shell LESS must not directly reskin UIkit Offcanvas.");

assert(customerThemeSource.includes('@import "../interface.less";'), "Customer theme must inherit the Harika interface theme.");
assert(customerThemeSource.includes('@import "ambra/variables.less";'), "AMBRA customer theme must keep its overrides isolated.");
assert(!customerVariablesSource.includes(".hook-"), "Customer theme must not add UIkit hooks without an explicit architecture review.");
assert(!/\.uk-[a-z0-9_-]+\s*\{/i.test(customerVariablesSource), "Customer theme must not add direct .uk-* selector overrides.");

assert(stylesDirectories.includes("themes"), "Theme hierarchy directory is missing.");
assert(!stylesDirectories.includes("theme"), "Legacy flat src/styles/theme directory must stay removed.");

assert(packageJson.scripts?.["dev:standard"] === "vite --mode standard", "Standard theme dev mode must remain explicit.");
assert(packageJson.scripts?.["dev:customer:ambra"] === "vite --mode customer-ambra", "AMBRA customer theme dev mode must remain explicit.");
assert(packageJson.scripts?.["build:standard"] === "vite build --mode standard", "Standard theme build mode must remain explicit.");
assert(packageJson.scripts?.["build:customer:ambra"] === "vite build --mode customer-ambra", "AMBRA customer theme build mode must remain explicit.");

const nonThemeLess = [shellLess, productLess, visualizationLess, prototypeLess].join("\n");
for (const selector of [".uk-button", ".uk-input", ".uk-select", ".uk-textarea", ".uk-card", ".uk-label", ".uk-badge", ".uk-alert"]) {
  assert(!nonThemeLess.includes(selector), "Standard UIkit component must not be reskinned outside theme layer: " + selector);
}

for (const [page] of allPages) {
  assert(viteConfigSource.includes('"' + page + '"'), "Vite multi-page build is missing " + page + ".");
}

assert(viteConfigSource.includes('name: "harika-html-partials"'), "Vite must keep the small HTML partial plugin.");
assert(viteConfigSource.includes("expandHtmlPartials"), "Vite must expand shared HTML partials.");
assert(viteConfigSource.includes("server.watcher.add(partialsDirectory)"), "Vite dev server must watch shared partials.");
assert(viteConfigSource.includes('mode === "pages" ? "/harika-clickdummy/" : "/"'), "Vite Pages base path must remain explicit.");
assert(/\bstandard:\s*"src\/styles\/themes\/standard\.less"/.test(viteConfigSource), "Vite must expose the standard theme mode.");
assert(/\binterface:\s*"src\/styles\/themes\/interface\.less"/.test(viteConfigSource), "Vite must expose the interface theme mode.");
assert(viteConfigSource.includes('"customer-ambra": "src/styles/themes/customers/ambra.less"'), "Vite must expose the AMBRA customer theme mode.");
assert(viteConfigSource.includes('"@harika-theme": resolveThemeEntry(mode)'), "Vite must resolve the active theme through one alias.");

assert(baselineGuide.includes("Shared only where it is truly global"), "UI baseline must preserve the shared-partial rule.");
assert(editingGuide.includes("Global or page-specific?"), "Editing guide must explain the global/page-specific split.");
assert(editingGuide.includes("Theme level"), "Editing guide must explain theme ownership.");
assert(themesGuide.includes("UIkit standard theme"), "Theme guide must document the UIkit standard layer.");
assert(themesGuide.includes("Harika interface child theme"), "Theme guide must document the interface child theme.");
assert(themesGuide.includes("Customer child theme"), "Theme guide must document customer child themes.");
assert(transferStatusSource.includes('"partials/"'), "Shared partials must be classified for UI transfer.");
assert(transferStatusSource.includes('"styleguide.html"'), "Styleguide HTML must remain prototype-only in transfer status.");
assert(transferStatusSource.includes('"src/app.js"'), "Behavior-only app.js must be classified explicitly.");

assert(pagesWorkflowSource.includes("workflow_dispatch:"), "Pages preview must remain manually deployable.");
assert(/^\s*push:/m.test(pagesWorkflowSource), "Pages preview must auto-deploy relevant main changes.");
assert(pagesWorkflowSource.includes('"*.html"'), "Pages preview must deploy root HTML page changes.");
assert(pagesWorkflowSource.includes('"partials/**"'), "Pages preview must deploy shared partial changes.");
assert(pagesWorkflowSource.includes('"src/**"'), "Pages preview must deploy source changes.");
assert(transferGuide.includes("No PR before green branch CI"), "Transfer guide must preserve permanent CI-before-PR rule.");

console.log("Harika clickdummy HTML-first + UIkit theme hierarchy checks passed.");
