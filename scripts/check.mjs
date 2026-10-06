import { readFile } from "node:fs/promises";
import { navigation } from "../src/data.js";
import { harikaSource } from "../src/harika-source.js";
import { transferState } from "../src/transfer-state.js";
import { renderStyleguide } from "../src/prototype/styleguide.js";
import { renderView, viewMetadata } from "../src/views.js";

const expectedNavigation = [
  "overview",
  "customers",
  "websites",
  "search",
  "ads",
  "visibility",
  "prompts",
  "development",
  "settings"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fullSha = /^[0-9a-f]{40}$/;
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const mainSource = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
const uiSource = await readFile(new URL("../src/ui.js", import.meta.url), "utf8");
const viewsSource = await readFile(new URL("../src/views.js", import.meta.url), "utf8");
const interactionsSource = await readFile(new URL("../src/interactions.js", import.meta.url), "utf8");
const styleguideSource = await readFile(new URL("../src/prototype/styleguide.js", import.meta.url), "utf8");
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

assert(harikaSource.repository === "cemfirat/ccf-sites-ads", "Harika source repository must remain explicit.");
assert(fullSha.test(harikaSource.commit), "Harika source commit must be a full SHA.");
assert(transferState.schemaVersion === 1, "Unsupported transfer-state schema.");
assert(fullSha.test(transferState.uiBaselineClickdummyCommit), "Clickdummy UI baseline must be a full SHA.");
assert(packageJson.dependencies?.uikit === "3.25.25", "Clickdummy must pin the audited Harika UIkit version exactly.");

const ids = navigation.map(([id]) => id);
assert(JSON.stringify(ids) === JSON.stringify(expectedNavigation), "Primary navigation drift detected.");
assert(new Set(ids).size === ids.length, "Navigation ids must be unique.");

for (const id of ids) {
  const html = renderView(id);
  assert(typeof html === "string" && html.length > 100, "View " + id + " did not render meaningful markup.");
  assert(viewMetadata[id]?.title, "View metadata missing for " + id + ".");
}

const styleguideHtml = renderStyleguide();
assert(styleguideHtml.includes("Prototype only"), "Styleguide must remain clearly prototype-only.");

for (const source of [mainSource, viewsSource, interactionsSource]) {
  assert(!/\bfetch\s*\(/.test(source), "Clickdummy must not call remote APIs.");
  assert(!/XMLHttpRequest/.test(source), "Clickdummy must not use XMLHttpRequest.");
}

assert(!mainSource.includes('uikit/dist/css/uikit.min.css'), "Do not load prebuilt UIkit CSS alongside the LESS theme.");
assert(lessEntry.includes('@import "uikit/src/less/uikit.less";'), "UIkit LESS source must be the styling foundation.");
assert(lessEntry.includes('@import "./theme/_import.less";'), "Harika UIkit theme layer must be imported.");
assert(mainSource.includes('class="uk-logo brand'), "Shell must use UIkit logo semantics.");
assert(mainSource.includes('class="uk-nav uk-nav-default'), "Primary navigation must be a native UIkit nav.");
assert(mainSource.includes('class="uk-active"'), "Primary navigation must use native uk-active state.");
assert(mainSource.includes('data-uk-offcanvas="overlay: true; flip: false"'), "Mobile navigation must use UIkit Offcanvas.");
assert(mainSource.includes('class="uk-offcanvas-close"'), "Mobile navigation must use UIkit close control.");
assert(mainSource.includes('data-uk-icon="icon: user"'), "User chrome must use a native UIkit icon.");
assert(mainSource.includes('class="skip-link"'), "App shell must expose a skip link.");
assert(mainSource.includes('<main class="workspace" id="main-content"'), "View content must own the main landmark.");
assert(!mainSource.includes("topbar"), "Legacy custom topbar must not return.");
assert(!mainSource.includes("demo-ribbon"), "Legacy demo ribbon must not return.");

assert(uiSource.includes("uk-modal-header"), "Modal must use UIkit modal header.");
assert(uiSource.includes("uk-modal-body"), "Modal must use UIkit modal body.");
assert(uiSource.includes("uk-modal-footer"), "Modal must use UIkit modal footer.");
assert(uiSource.includes("data-uk-close"), "Modal close must use the native UIkit close component.");
assert(!uiSource.includes(">×<"), "Manual close glyphs are forbidden.");

for (const marker of [
  "uk-card uk-card-default",
  "uk-form-stacked",
  "uk-table uk-table-divider",
  "uk-list uk-list-divider",
  "uk-subnav uk-subnav-pill",
  "uk-alert uk-alert-primary"
]) {
  assert((viewsSource + interactionsSource + styleguideSource).includes(marker), "Expected UIkit-first marker missing: " + marker);
}

assert(!/uk-subnav[^\n]*>[\s\S]{0,120}<button/.test(viewsSource), "UIkit subnav items must not be custom button items.");
assert(!/[>\s][?×…][<\s]/.test(mainSource + uiSource + viewsSource + interactionsSource), "Manual icon glyphs are forbidden; use UIkit icons.");

const nonThemeLess = [shellLess, productLess, visualizationLess, prototypeLess].join("\n");
for (const selector of [".uk-button", ".uk-input", ".uk-select", ".uk-textarea", ".uk-card", ".uk-label", ".uk-badge", ".uk-alert"]) {
  assert(!nonThemeLess.includes(selector), "Standard UIkit component must not be reskinned outside theme layer: " + selector);
}

assert(baselineGuide.includes("UIkit first"), "UIkit baseline guide must preserve the primary design-system rule.");
assert(transferStatusSource.includes('"src/styles/prototype.less"'), "Prototype LESS must stay excluded from automatic transfer.");
assert(transferStatusSource.includes('"src/prototype/"'), "Prototype source must stay excluded from automatic transfer.");
assert(viteConfigSource.includes('mode === "pages" ? "/harika-clickdummy/" : "/"'), "Vite Pages base path must remain explicit.");
assert(pagesWorkflowSource.includes("workflow_dispatch:"), "Pages preview must remain manually deployable.");
assert(!/^\s*push:/m.test(pagesWorkflowSource), "Pages preview must not auto-run while Pages activation is manual.");
assert(transferGuide.includes("No PR before green branch CI"), "Transfer guide must preserve permanent CI-before-PR rule.");

console.log("Harika clickdummy UIkit-first static checks passed.");
