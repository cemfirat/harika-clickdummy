import { readFile } from "node:fs/promises";
import { navigation } from "../src/data.js";
import { harikaSource } from "../src/harika-source.js";
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

assert(harikaSource.repository === "cemfirat/ccf-sites-ads", "Harika source repository must remain explicit.");
assert(/^[0-9a-f]{40}$/.test(harikaSource.commit), "Harika source commit must be a full SHA.");

const ids = navigation.map(([id]) => id);
assert(JSON.stringify(ids) === JSON.stringify(expectedNavigation), "Primary navigation drift detected.");
assert(new Set(ids).size === ids.length, "Navigation ids must be unique.");

for (const id of ids) {
  const html = renderView(id);
  assert(typeof html === "string" && html.length > 100, "View " + id + " did not render meaningful markup.");
  assert(html.includes("Harika Intelligence Center"), "View " + id + " is missing the Harika view introduction.");
}

const mainSource = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
const viewsSource = await readFile(new URL("../src/views.js", import.meta.url), "utf8");
const lessEntry = await readFile(new URL("../src/styles/main.less", import.meta.url), "utf8");

for (const source of [mainSource, viewsSource]) {
  assert(!/\bfetch\s*\(/.test(source), "Clickdummy must not call remote APIs.");
  assert(!/XMLHttpRequest/.test(source), "Clickdummy must not use XMLHttpRequest.");
}

for (const file of ["tokens.less", "layout.less", "components.less", "views.less"]) {
  assert(lessEntry.includes(file), "LESS entry is missing " + file + ".");
}

console.log("Harika clickdummy static checks passed.");
