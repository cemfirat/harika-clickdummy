import { readFile } from "node:fs/promises";
import { navigation } from "../src/data.js";
import { harikaSource } from "../src/harika-source.js";
import { transferState } from "../src/transfer-state.js";
import { renderStyleguide } from "../src/prototype/styleguide.js";
import { renderView } from "../src/views.js";

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

assert(harikaSource.repository === "cemfirat/ccf-sites-ads", "Harika source repository must remain explicit.");
assert(fullSha.test(harikaSource.commit), "Harika source commit must be a full SHA.");
assert(transferState.schemaVersion === 1, "Unsupported transfer-state schema.");
assert(fullSha.test(transferState.uiBaselineClickdummyCommit), "Clickdummy UI baseline must be a full SHA.");

if (transferState.lastPromotion !== null) {
  assert(fullSha.test(transferState.lastPromotion.clickdummyCommit), "Promoted clickdummy commit must be a full SHA.");
  assert(fullSha.test(transferState.lastPromotion.harikaCommit), "Promoted Harika commit must be a full SHA.");
  assert(typeof transferState.lastPromotion.promotedAt === "string" && transferState.lastPromotion.promotedAt.length >= 10, "Promotion date is required.");
}

const ids = navigation.map(([id]) => id);
assert(JSON.stringify(ids) === JSON.stringify(expectedNavigation), "Primary navigation drift detected.");
assert(new Set(ids).size === ids.length, "Navigation ids must be unique.");

for (const id of ids) {
  const html = renderView(id);
  assert(typeof html === "string" && html.length > 100, "View " + id + " did not render meaningful markup.");
  assert(html.includes("Harika Intelligence Center"), "View " + id + " is missing the Harika view introduction.");
}

const styleguideHtml = renderStyleguide();
assert(styleguideHtml.includes("UI Styleguide"), "Prototype styleguide must render.");
assert(styleguideHtml.includes("Prototype only"), "Styleguide must be clearly marked as prototype-only.");

const mainSource = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
const viewsSource = await readFile(new URL("../src/views.js", import.meta.url), "utf8");
const interactionsSource = await readFile(new URL("../src/interactions.js", import.meta.url), "utf8");
const lessEntry = await readFile(new URL("../src/styles/main.less", import.meta.url), "utf8");
const transferStatusSource = await readFile(new URL("./transfer-status.mjs", import.meta.url), "utf8");
const transferGuide = await readFile(new URL("../docs/UI-TRANSFER.md", import.meta.url), "utf8");
const viteConfigSource = await readFile(new URL("../vite.config.js", import.meta.url), "utf8");
const pagesWorkflowSource = await readFile(new URL("../.github/workflows/pages-preview.yml", import.meta.url), "utf8");

for (const source of [mainSource, viewsSource, interactionsSource]) {
  assert(!/\bfetch\s*\(/.test(source), "Clickdummy must not call remote APIs.");
  assert(!/XMLHttpRequest/.test(source), "Clickdummy must not use XMLHttpRequest.");
}

for (const file of ["tokens.less", "layout.less", "components.less", "views.less", "prototype.less"]) {
  assert(lessEntry.includes(file), "LESS entry is missing " + file + ".");
}

assert(mainSource.includes('prototypeViews = new Set(["styleguide"])'), "Styleguide must remain outside primary navigation.");
assert(transferStatusSource.includes('"src/styles/prototype.less"'), "Prototype LESS must be excluded from automatic Harika transfer.");
assert(transferStatusSource.includes('"src/prototype/"'), "Prototype source must be excluded from automatic Harika transfer.");

for (const marker of [
  "data-customer-search",
  "data-new-customer",
  "data-new-website",
  "data-search-tab",
  "data-campaign-open",
  "data-setting-open"
]) {
  assert(viewsSource.includes(marker), "Expected interactive UI marker missing: " + marker);
}

assert(mainSource.includes("bindInteractiveUi"), "Main shell must bind clickdummy interactions.");
assert(viteConfigSource.includes('mode === "pages" ? "/harika-clickdummy/" : "/"'), "Vite Pages base path must remain explicit.");
assert(pagesWorkflowSource.includes("workflow_dispatch:"), "Pages preview must remain manually deployable.");
assert(!/^\s*push:/m.test(pagesWorkflowSource), "Pages preview must not auto-run while Pages activation is manual.");
assert(pagesWorkflowSource.includes("actions/deploy-pages@v4"), "Pages preview must use the official deploy-pages action.");
assert(transferGuide.includes("No PR before green branch CI"), "Transfer guide must preserve the permanent CI-before-PR rule.");
assert(transferGuide.includes("src/data.js"), "Transfer guide must explicitly exclude mock data from automatic promotion.");

console.log("Harika clickdummy static checks passed.");
