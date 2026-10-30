import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { initAiConnections } from "./ai-connections.js";
import { initWebsiteAssistant } from "./website-assistant.js";
import { initInsightWorkspace } from "./insight-workspace.js";
import { initAdsWorkspace } from "./ads-workspace.js";

UIkit.use(Icons);

document.documentElement.dataset.theme = __HARIKA_THEME__;

document.querySelectorAll("[data-active-theme]").forEach((node) => {
  node.textContent = __HARIKA_THEME__;
});

const themePreferenceStorageKey = "ccf-theme-preference";
const themePreferences = new Set(["light", "dark", "system"]);
let currentThemePreference;

function isThemePreference(value) {
  return typeof value === "string" && themePreferences.has(value);
}

function readStoredThemePreference() {
  try {
    const value = globalThis.localStorage?.getItem(themePreferenceStorageKey);
    return isThemePreference(value) ? value : "system";
  } catch {
    return "system";
  }
}

function resolveThemePreference(preference, prefersDark) {
  if (preference === "light" || preference === "dark") return preference;
  return prefersDark ? "dark" : "light";
}

function applyThemePreference(preference) {
  const prefersDark = globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches === true;
  const resolved = resolveThemePreference(preference, prefersDark);
  const root = document.documentElement;
  root.dataset.ccfTheme = preference;
  root.dataset.ccfResolvedTheme = resolved;
  root.style.colorScheme = resolved;
  document.querySelectorAll("[data-harika-appearance]").forEach((link) => {
    link.media = preference === "system"
      ? `(prefers-color-scheme: ${link.dataset.harikaAppearance})`
      : link.dataset.harikaAppearance === resolved ? "all" : "not all";
  });
  return resolved;
}

function persistThemePreference(preference) {
  try {
    globalThis.localStorage?.setItem(themePreferenceStorageKey, preference);
  } catch {
    // Private mode or quota: keep the in-document preference for this page.
  }
}

function syncThemeSwitcherControls(preference) {
  document.querySelectorAll("[data-theme-preference]").forEach((button) => {
    const pressed = button.dataset.themePreference === preference;
    button.classList.toggle("uk-active", pressed);
    button.setAttribute("aria-pressed", pressed ? "true" : "false");
  });
}

function initThemePreference() {
  const initial = readStoredThemePreference();
  currentThemePreference = initial;
  applyThemePreference(initial);
  syncThemeSwitcherControls(initial);

  document.querySelectorAll("[data-theme-preference]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.themePreference;
      if (!isThemePreference(next)) return;
      currentThemePreference = next;
      persistThemePreference(next);
      applyThemePreference(next);
      syncThemeSwitcherControls(next);
    });
  });

  const media = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener?.("change", () => {
    if (currentThemePreference === "system") applyThemePreference("system");
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== themePreferenceStorageKey && event.key !== null) return;
    currentThemePreference = readStoredThemePreference();
    applyThemePreference(currentThemePreference);
    syncThemeSwitcherControls(currentThemePreference);
  });
}

initThemePreference();

const currentPage = document.body.dataset.page;
document.querySelectorAll("[data-nav-page]").forEach((item) => {
  const active = item.dataset.navPage === currentPage;
  item.classList.toggle("uk-active", active);

  const link = item.querySelector("a");
  if (link) {
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
});


const customerSearch = document.querySelector("[data-customer-search]");
const customerStatus = document.querySelector("[data-customer-status-filter]");
const customerRows = [...document.querySelectorAll("[data-customer-row]")];

function applyCustomerFilter() {
  if (!customerSearch || !customerStatus || customerRows.length === 0) return;

  const needle = customerSearch.value.trim().toLowerCase();
  const status = customerStatus.value;
  let visible = 0;

  for (const row of customerRows) {
    const matchesText = !needle || row.dataset.customerSearchIndex.includes(needle);
    const matchesStatus = status === "all" || row.dataset.customerStatus === status;
    row.hidden = !(matchesText && matchesStatus);
    if (!row.hidden) visible += 1;
  }

  const result = document.querySelector("[data-customer-result]");
  if (result) result.textContent = visible + (visible === 1 ? " Kunde sichtbar" : " Kunden sichtbar");
}

customerSearch?.addEventListener("input", applyCustomerFilter);
customerStatus?.addEventListener("change", applyCustomerFilter);

// The website workspace is HTML-first: selection reveals existing detail
// panels; native UIkit Tabs, Switcher and Modal own their interactions.
const aiConnections = initAiConnections(UIkit);
const websiteAssistant = initWebsiteAssistant(UIkit, aiConnections);
initInsightWorkspace(UIkit, aiConnections);
initAdsWorkspace(UIkit, aiConnections);
const websiteRows = [...document.querySelectorAll("[data-website-row]")];
const websiteSearch = document.querySelector("[data-website-search]");

function selectWebsite(id) {
  const selected = websiteRows.find((row) => row.dataset.websiteRow === id);
  if (!selected) return;
  for (const row of websiteRows) {
    const active = row === selected;
    row.classList.toggle("uk-active", active);
    row.querySelector("[data-website-select]")?.setAttribute("aria-pressed", String(active));
  }
  document.querySelectorAll("[data-website-detail]").forEach((detail) => {
    detail.hidden = detail.dataset.websiteDetail !== id;
  });
  const fields = {
    "website-edit-modal-name": selected.dataset.websiteName,
    "website-edit-modal-origin": selected.dataset.websiteOrigin,
    "website-edit-modal-environment": selected.dataset.websiteEnvironment
  };
  for (const [fieldId, value] of Object.entries(fields)) {
    const field = document.getElementById(fieldId);
    if (field && value !== undefined) field.value = value;
  }
  document.querySelectorAll("[data-website-picker]").forEach((picker) => { picker.value = id; });
  websiteAssistant.onWebsiteChange(id);
}

function applyWebsiteFilter() {
  if (!websiteSearch) return;
  const needle = websiteSearch.value.trim().toLocaleLowerCase("de");
  let visible = 0;
  for (const row of websiteRows) {
    row.hidden = !(row.dataset.websiteSearchIndex ?? row.textContent).toLocaleLowerCase("de").includes(needle);
    if (!row.hidden) visible += 1;
  }
  const result = document.querySelector("[data-website-result]");
  if (result) result.textContent = `${visible} ${visible === 1 ? "Website" : "Websites"} · ${document.body.dataset.demoCustomer ?? "Beispielkunde"}`;
  const empty = document.querySelector("[data-website-empty]");
  if (empty) empty.hidden = visible !== 0;
}

document.querySelectorAll("[data-website-select]").forEach((button) => {
  button.addEventListener("click", () => selectWebsite(button.dataset.websiteSelect));
});
document.querySelectorAll("[data-website-edit]").forEach((link) => {
  link.addEventListener("click", () => selectWebsite(link.dataset.websiteEdit));
});
websiteRows.forEach((row) => {
  row.addEventListener("click", (event) => {
    if (!event.target.closest("a, button, input, select, label")) selectWebsite(row.dataset.websiteRow);
  });
});
websiteSearch?.addEventListener("input", applyWebsiteFilter);
document.querySelectorAll("[data-website-picker]").forEach((picker) => {
  picker.addEventListener("change", () => selectWebsite(picker.value));
});
document.querySelectorAll("[data-assistant-return]").forEach((button) => {
  button.addEventListener("click", () => selectWebsite("main"));
});
if (websiteRows.length) {
  const selected = websiteRows.find((row) => row.querySelector('[aria-pressed="true"]')) ?? websiteRows[0];
  selectWebsite(selected.dataset.websiteRow);
  applyWebsiteFilter();
  if (window.location.hash === "#beitraege") UIkit.tab("#website-tabs-main").show(1);
  if (window.location.hash === "#assistent") document.querySelector("button[data-assistant-open]")?.click();
}

for (const [attribute, value] of [
  ["data-workspace-organization", document.body.dataset.demoOrganization],
  ["data-workspace-customer", document.body.dataset.demoCustomer]
]) {
  if (value) document.querySelectorAll(`[${attribute}]`).forEach((node) => { node.textContent = value; });
}

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    UIkit.modal(form.closest(".uk-modal"))?.hide();
    UIkit.notification({
      message: form.dataset.demoMessage || "Demo-Aktion simuliert.",
      status: "success",
      pos: "bottom-right",
      timeout: 2600
    });
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  const label = button.querySelector("[data-copy-label]") ?? button;
  const originalLabel = label.textContent;
  let resetLabelTimer;
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent || "");
      window.clearTimeout(resetLabelTimer);
      label.textContent = "Kopiert";
      resetLabelTimer = window.setTimeout(() => { label.textContent = originalLabel; }, 1600);
    } catch {
      UIkit.notification({
        message: "Kopieren ist in diesem Browser nicht verfügbar.",
        status: "warning",
        pos: "bottom-right",
        timeout: 2600
      });
    }
  });
});
