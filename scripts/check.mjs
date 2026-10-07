import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import less from "less";
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
const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const appSource = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const studioSource = await readFile(new URL("../src/studio.js", import.meta.url), "utf8");
const themeStudioPartial = await readFile(new URL("../partials/theme-studio.html", import.meta.url), "utf8");

const standardThemeSource = await readFile(new URL("../src/themes/standard.less", import.meta.url), "utf8");
const harikaThemeSource = await readFile(new URL("../src/themes/harika.less", import.meta.url), "utf8");
const harikaImportSource = await readFile(new URL("../src/themes/harika/_import.less", import.meta.url), "utf8");
const harikaOffcanvasSource = await readFile(new URL("../src/themes/harika/offcanvas.less", import.meta.url), "utf8");
const customerThemeSource = await readFile(new URL("../src/themes/customers/ambra.less", import.meta.url), "utf8");
const customerVariablesSource = await readFile(new URL("../src/themes/customers/ambra/variables.less", import.meta.url), "utf8");
const customerConfigSource = await readFile(new URL("../src/themes/customers/ambra/customer.js", import.meta.url), "utf8");
const themeReadme = await readFile(new URL("../src/themes/README.md", import.meta.url), "utf8");
const customerThemeReadme = await readFile(new URL("../src/themes/customers/README.md", import.meta.url), "utf8");

const shellLess = await readFile(new URL("../src/styles/shell.less", import.meta.url), "utf8");
const productLess = await readFile(new URL("../src/styles/product.less", import.meta.url), "utf8");
const visualizationLess = await readFile(new URL("../src/styles/visualizations.less", import.meta.url), "utf8");
const prototypeLess = await readFile(new URL("../src/styles/prototype.less", import.meta.url), "utf8");

const transferStatusSource = await readFile(new URL("./transfer-status.mjs", import.meta.url), "utf8");
const transferGuide = await readFile(new URL("../docs/UI-TRANSFER.md", import.meta.url), "utf8");
const baselineGuide = await readFile(new URL("../docs/UIKIT-BASELINE.md", import.meta.url), "utf8");
const editingGuide = await readFile(new URL("../docs/EDITING-GUIDE.md", import.meta.url), "utf8");
const themesGuide = await readFile(new URL("../docs/THEMES.md", import.meta.url), "utf8");
const styleguideGuide = await readFile(new URL("../docs/STYLEGUIDE.md", import.meta.url), "utf8");
const themeStudioGuide = await readFile(new URL("../docs/THEME-STUDIO.md", import.meta.url), "utf8");
const viteConfigSource = await readFile(new URL("../vite.config.js", import.meta.url), "utf8");
const pagesWorkflowSource = await readFile(new URL("../.github/workflows/pages-preview.yml", import.meta.url), "utf8");

const srcEntries = await readdir(new URL("../src/", import.meta.url));
const stylesEntries = await readdir(new URL("../src/styles/", import.meta.url));
const themesEntries = await readdir(new URL("../src/themes/", import.meta.url));
const styleguideExampleFiles = await readdir(new URL("../partials/styleguide/", import.meta.url));

assert(harikaSource.repository === "cemfirat/ccf-sites-ads", "Harika source repository must remain explicit.");
assert(fullSha.test(harikaSource.commit), "Harika source commit must be a full SHA.");
assert(transferState.schemaVersion === 1, "Unsupported transfer-state schema.");
assert(fullSha.test(transferState.uiBaselineClickdummyCommit), "Clickdummy UI baseline must be a full SHA.");
assert(packageJson.dependencies?.uikit === "3.25.25", "Clickdummy must pin the audited Harika UIkit version exactly.");

for (const legacy of ["main.js", "ui.js", "views.js", "data.js", "interactions.js"]) {
  assert(!srcEntries.includes(legacy), "Legacy JS-renderer file must stay removed: " + legacy);
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

assert(themesEntries.includes("standard.less"), "UIkit standard theme entry is missing.");
assert(themesEntries.includes("harika.less"), "Harika theme entry is missing.");
assert(themesEntries.includes("harika"), "Harika theme folder is missing.");
assert(themesEntries.includes("customers"), "Customer theme folder is missing.");
assert(!themesEntries.includes("interface.less"), "Legacy interface theme entry must stay removed.");
assert(!themesEntries.includes("interface"), "Legacy interface theme folder must stay removed.");
assert(!stylesEntries.includes("main.less"), "Redundant src/styles/main.less compatibility entry must stay removed.");
assert(!stylesEntries.includes("themes"), "Theme source must live in src/themes, not src/styles/themes.");

assert(standardThemeSource.includes('@import "uikit/src/less/uikit.theme.less";'), "Standard theme must import UIkit's official default theme.");
assert(!standardThemeSource.includes('@import "uikit/src/less/uikit.less";'), "Standard theme must use uikit.theme.less, not core-only uikit.less.");
assert(standardThemeSource.includes('@import "../styles/shell.less";'), "Standard theme must include Harika shell structure from src/styles.");
assert(standardThemeSource.includes('@import "../styles/product.less";'), "Standard theme must include Harika product structure from src/styles.");

assert(harikaThemeSource.includes('@import "standard.less";'), "Harika theme must inherit the standard theme.");
assert(harikaThemeSource.includes('@import "harika/_import.less";'), "Harika theme must load component customizations.");
assert(harikaImportSource.includes('@import "variables.less";'), "Harika theme must preserve component-structured imports.");
assert(harikaImportSource.includes('@import "offcanvas.less";'), "Harika theme must keep Offcanvas customization in the UIkit theme layer.");
assert(harikaOffcanvasSource.includes("@offcanvas-bar-background"), "Offcanvas theme must use the official UIkit variable.");
assert(harikaOffcanvasSource.includes(".hook-offcanvas-bar()"), "Offcanvas theme must use the official UIkit hook.");
assert(!shellLess.includes(".uk-offcanvas-bar"), "Shell LESS must not directly reskin UIkit Offcanvas.");

assert(customerThemeSource.includes('@import "../harika.less";'), "Customer theme must inherit Harika.");
assert(customerThemeSource.includes('@import "ambra/variables.less";'), "AMBRA customer theme must keep its overrides isolated.");
assert(!customerVariablesSource.includes(".hook-"), "Customer variables must not add UIkit hooks without an explicit architecture review.");
assert(!/\.uk-[a-z0-9_-]+\s*\{/i.test(customerVariablesSource), "Customer variables must not add direct .uk-* selector overrides.");
assert(!/\b(fetch|XMLHttpRequest|document|window|UIkit)\b/.test(customerConfigSource), "customer.js must remain declarative metadata and must not contain application behavior.");
assert(customerConfigSource.includes('id: "ambra"'), "AMBRA customer metadata must expose the customer id.");
assert(customerConfigSource.includes('logo: null'), "Missing customer logo must remain explicit rather than using a placeholder.");
assert(customerConfigSource.includes('avatar: null'), "Missing customer avatar must remain explicit rather than using a placeholder.");

assert(packageJson.scripts?.dev === "vite --mode harika", "Harika must be the default dev theme.");
assert(packageJson.scripts?.build === "vite build --mode harika", "Harika must be the default build theme.");
assert(packageJson.scripts?.["dev:standard"] === "vite --mode standard", "Standard theme dev mode must remain explicit.");
assert(packageJson.scripts?.["dev:customer:ambra"] === "vite --mode customer-ambra", "AMBRA customer theme dev mode must remain explicit.");
assert(packageJson.scripts?.["build:standard"] === "vite build --mode standard", "Standard theme build mode must remain explicit.");
assert(packageJson.scripts?.["build:customer:ambra"] === "vite build --mode customer-ambra", "AMBRA customer theme build mode must remain explicit.");
assert(packageJson.scripts?.studio === "vite --mode harika --host 127.0.0.1", "Theme Studio must bind explicitly to loopback.");
assert(packageJson.scripts?.["studio:customer:ambra"] === "vite --mode customer-ambra --host 127.0.0.1", "AMBRA Theme Studio must bind explicitly to loopback.");

const nonThemeLess = [shellLess, productLess, visualizationLess, prototypeLess].join("\n");
for (const selector of [".uk-button", ".uk-input", ".uk-select", ".uk-textarea", ".uk-card", ".uk-label", ".uk-badge", ".uk-alert"]) {
  assert(!nonThemeLess.includes(selector), "Standard UIkit component must not be reskinned outside theme layer: " + selector);
}

for (const [page] of allPages) {
  assert(viteConfigSource.includes('"' + page + '"'), "Vite multi-page build is missing " + page + ".");
}

assert(viteConfigSource.includes('name: "harika-html-partials"'), "Vite must keep the small HTML partial plugin.");
assert(viteConfigSource.includes('name: "harika-theme-studio"'), "Vite must keep the local Theme Studio plugin.");
assert(viteConfigSource.includes('apply: "serve"'), "Theme Studio plugin must be development-server only.");
assert(viteConfigSource.includes("isLoopbackRequest"), "Theme Studio must enforce loopback requests.");
assert(viteConfigSource.includes('address === "127.0.0.1" || address === "::1"'), "Theme Studio loopback allowlist must remain explicit.");
assert(viteConfigSource.includes("assertThemeStudioFile"), "Theme Studio must validate every editable path against an allowlist.");
assert(viteConfigSource.includes('const files = ["src/themes/harika.less"]'), "Theme Studio allowlist must start at Harika, not UIkit Standard.");
assert(!viteConfigSource.includes('const files = ["src/themes/standard.less"]'), "UIkit Standard must stay read-only in Theme Studio.");
assert(viteConfigSource.includes('requestUrl.pathname === "/__studio/status"'), "Theme Studio status endpoint is missing.");
assert(viteConfigSource.includes('requestUrl.pathname === "/__studio/file"'), "Theme Studio file endpoint is missing.");
assert(viteConfigSource.includes("raw.length > 512 * 1024"), "Theme Studio request-size guard is missing.");
assert(viteConfigSource.includes("await less.render"), "Theme Studio saves must validate LESS directly.");
assert(viteConfigSource.includes("writeFileSync(absolutePath, previousContent"), "Theme Studio must roll back invalid LESS writes.");
assert(viteConfigSource.includes("rolledBack: true"), "Theme Studio must report compile rollback.");
assert(viteConfigSource.includes("expandHtmlPartials"), "Vite must expand shared HTML partials.");
assert(viteConfigSource.includes("includeCodePattern"), "Vite must support styleguide code includes.");
assert(viteConfigSource.includes("expandCodePartials"), "Vite must render styleguide markup from the same example source.");
assert(viteConfigSource.includes("server.watcher.add(partialsDirectory)"), "Vite dev server must watch shared partials.");
assert(viteConfigSource.includes('mode === "pages" ? "/harika-clickdummy/" : "/"'), "Vite Pages base path must remain explicit.");
assert(/\bstandard:\s*"src\/themes\/standard\.less"/.test(viteConfigSource), "Vite must expose the standard theme mode.");
assert(/\bharika:\s*"src\/themes\/harika\.less"/.test(viteConfigSource), "Vite must expose the Harika theme mode.");
assert(viteConfigSource.includes('"customer-ambra": "src/themes/customers/ambra.less"'), "Vite must expose the AMBRA customer theme mode.");
assert(/\bpages:\s*"src\/themes\/harika\.less"/.test(viteConfigSource), "Pages must use the Harika theme.");
assert(viteConfigSource.includes("themeEntries[mode] ?? themeEntries.harika"), "Unknown theme modes must fall back to Harika.");
assert(viteConfigSource.includes('"@harika-theme": resolveThemeEntry(mode)'), "Vite must resolve the active theme through one alias.");
assert(!viteConfigSource.includes("interface"), "Vite theme configuration must not use the legacy interface name.");

assert(baselineGuide.includes("Shared only where it is truly global"), "UI baseline must preserve the shared-partial rule.");
assert(editingGuide.includes("Global or page-specific?"), "Editing guide must explain the global/page-specific split.");
assert(editingGuide.includes("Theme level"), "Editing guide must explain theme ownership.");
assert(themesGuide.includes("## Theme hierarchy"), "Theme guide must document the hierarchy.");
assert(themesGuide.includes("src/themes/harika.less"), "Theme guide must document the Harika entry file.");
assert(themesGuide.includes("src/themes/customers/ambra.less"), "Theme guide must document the AMBRA customer entry file.");
assert(themesGuide.includes("Variables first"), "Theme guide must document the variables-first rule.");
assert(themesGuide.includes("Hooks second"), "Theme guide must document the hooks-second rule.");
assert(themeReadme.includes("UIkit's documented custom-theme structure"), "Theme source README must explain its UIkit alignment.");
assert(styleguideGuide.includes("Single source for Preview + Markup"), "Styleguide guide must document synchronized Preview/Markup.");
assert(styleguideGuide.includes("@include-code"), "Styleguide guide must document the code include directive.");
assert(themeStudioGuide.includes("Theme Studio is the local editing mode"), "Theme Studio guide must document local-only editing.");
assert(themeStudioGuide.includes("No PR before green branch CI"), "Theme Studio guide must preserve CI-before-PR.");
assert(themeStudioGuide.includes("127.0.0.1"), "Theme Studio guide must document the loopback boundary.");
assert(themeStudioGuide.includes("does **not** currently"), "Theme Studio guide must state its current non-goals.");

for (const example of [
  "typography.html",
  "buttons.html",
  "cards.html",
  "forms.html",
  "status.html",
  "tables-lists.html",
  "navigation.html",
  "layout.html",
  "feedback.html",
  "harika.html"
]) {
  assert(styleguideExampleFiles.includes(example), "Missing styleguide example: " + example);
}

for (const section of [
  'id="theme"',
  'id="tokens"',
  'id="typography"',
  'id="layout"',
  'id="buttons"',
  'id="cards"',
  'id="forms"',
  'id="status"',
  'id="tables-lists"',
  'id="navigation"',
  'id="feedback"',
  'id="harika-components"'
]) {
  assert(html["styleguide.html"].includes(section), "Missing styleguide section: " + section);
}

assert(html["styleguide.html"].includes("@include-code partials/styleguide/"), "Styleguide must expose Markup from shared example files.");
assert(html["styleguide.html"].includes("data-active-theme"), "Styleguide must expose the active compiled theme.");
assert(html["styleguide.html"].includes("@include partials/theme-studio.html"), "Styleguide must include the Theme Studio offcanvas.");
assert(html["styleguide.html"].includes('src="/src/studio.js"'), "Styleguide must load the local Theme Studio client.");
assert(html["styleguide.html"].includes("data-studio-open"), "Styleguide must expose Theme Studio entry buttons.");

assert(themeStudioPartial.includes('id="theme-studio"'), "Theme Studio partial must use its own UIkit Offcanvas.");
assert(themeStudioPartial.includes("data-studio-editor"), "Theme Studio editor is missing.");
assert(themeStudioPartial.includes("data-studio-save"), "Theme Studio save action is missing.");
assert(themeStudioPartial.includes("data-studio-diff"), "Theme Studio Git diff area is missing.");

assert(studioSource.includes('const endpoint = "/__studio"'), "Theme Studio client must use only the local Studio endpoint.");
assert(!studioSource.includes("api.github.com"), "Theme Studio client must not talk directly to GitHub.");
assert(!studioSource.includes("github.com/"), "Theme Studio client must not embed GitHub write endpoints.");
assert(studioSource.includes("Speichern & kompilieren") || themeStudioPartial.includes("Speichern &amp; kompilieren"), "Theme Studio must expose explicit save/compile semantics.");
assert(studioSource.includes('event.key === "Tab"'), "Theme Studio editor must preserve Tab indentation.");
assert(studioSource.includes('event.metaKey || event.ctrlKey'), "Theme Studio editor must support Cmd/Ctrl+S.");
assert(customerThemeReadme.includes("entry-file +"), "Customer theme README must explain the entry-file + folder convention.");

assert(transferStatusSource.includes('"partials/"'), "Shared partials must be classified for UI transfer.");
assert(transferStatusSource.includes('"src/styles/"'), "Structural styles must be classified for UI transfer.");
assert(transferStatusSource.includes('"src/themes/"'), "Theme changes must be classified for UI transfer.");
assert(transferStatusSource.includes('"styleguide.html"'), "Styleguide HTML must remain prototype-only in transfer status.");
assert(transferStatusSource.includes('"partials/theme-studio.html"'), "Theme Studio partial must remain prototype/local-only in transfer status.");
assert(transferStatusSource.includes('"src/studio.js"'), "Theme Studio client must remain prototype/local-only in transfer status.");
assert(transferStatusSource.includes('"partials/styleguide/"'), "Styleguide example partials must remain prototype-only in transfer status.");
assert(transferStatusSource.includes('"src/app.js"'), "Behavior-only app.js must be classified explicitly.");

assert(pagesWorkflowSource.includes("workflow_dispatch:"), "Pages preview must remain manually deployable.");
assert(/^\s*push:/m.test(pagesWorkflowSource), "Pages preview must auto-deploy relevant main changes.");
assert(pagesWorkflowSource.includes('"*.html"'), "Pages preview must deploy root HTML page changes.");
assert(pagesWorkflowSource.includes('"partials/**"'), "Pages preview must deploy shared partial changes.");
assert(pagesWorkflowSource.includes('"src/**"'), "Pages preview must deploy source/theme changes.");
assert(transferGuide.includes("No PR before green branch CI"), "Transfer guide must preserve permanent CI-before-PR rule.");

for (const relativePath of [
  "src/themes/harika.less",
  "src/themes/customers/ambra.less"
]) {
  const filename = resolve(rootDirectory, relativePath);
  const source = await readFile(filename, "utf8");
  await less.render(source, {
    filename,
    javascriptEnabled: false,
    paths: [
      rootDirectory,
      resolve(rootDirectory, "node_modules")
    ]
  });
}

console.log("Harika clickdummy HTML-first + UIkit theme structure + local Theme Studio checks passed.");
