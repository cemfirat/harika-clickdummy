import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import "@harika-theme";

UIkit.use(Icons);

document.documentElement.dataset.theme = __HARIKA_THEME__;

document.querySelectorAll("[data-active-theme]").forEach((node) => {
  node.textContent = __HARIKA_THEME__;
});

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
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent || "");
      const original = button.textContent;
      button.textContent = "Kopiert";
      window.setTimeout(() => { button.textContent = original; }, 1600);
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
