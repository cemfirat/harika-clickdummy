import {
  activeContext,
  adCampaigns,
  customers,
  settingDetails,
  websites
} from "./data.js";
import { escapeHtml, modalShell } from "./ui.js";

function byId(items, id) {
  return items.find((item) => item.id === id) || null;
}

function formRow(label, name, value = "", type = "text", required = false) {
  return '<label class="demo-form__row"><span>' + escapeHtml(label) + '</span><input class="uk-input" type="' + type + '" name="' + name + '" value="' + escapeHtml(value) + '"' + (required ? ' required' : '') + '></label>';
}

function selectRow(label, name, options, current) {
  const items = options.map((option) =>
    '<option value="' + escapeHtml(option) + '"' + (option === current ? ' selected' : '') + '>' + escapeHtml(option) + '</option>'
  ).join("");
  return '<label class="demo-form__row"><span>' + escapeHtml(label) + '</span><select class="uk-select" name="' + name + '">' + items + '</select></label>';
}

function nextId(value) {
  const normalized = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return normalized || "demo-" + (customers.length + websites.length + 1);
}

function customerWebsite(customerName) {
  return websites.find((website) => website.customer === customerName) || null;
}

export function bindInteractiveUi({ navigate, rerender, showModal, closeModal, notify }) {
  const search = document.querySelector("[data-customer-search]");
  const status = document.querySelector("[data-customer-status-filter]");
  const customerRows = [...document.querySelectorAll("[data-customer-row]")];

  if (search && status && customerRows.length) {
    const applyCustomerFilter = () => {
      const needle = search.value.trim().toLowerCase();
      const selectedStatus = status.value;
      let visible = 0;

      for (const row of customerRows) {
        const matchesText = !needle || row.dataset.customerSearchIndex.includes(needle);
        const matchesStatus = selectedStatus === "all" || row.dataset.customerStatus === selectedStatus;
        row.hidden = !(matchesText && matchesStatus);
        if (!row.hidden) visible += 1;
      }

      const result = document.querySelector("[data-customer-result]");
      if (result) result.textContent = visible + (visible === 1 ? " Kunde sichtbar" : " Kunden sichtbar");
    };

    search.addEventListener("input", applyCustomerFilter);
    status.addEventListener("change", applyCustomerFilter);
  }

  document.querySelectorAll("[data-customer-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const customer = byId(customers, button.dataset.customerOpen);
      if (!customer) return;
      const site = customerWebsite(customer.name);
      activeContext.customer = customer.name;
      activeContext.website = site ? new URL(site.origin).hostname : "Keine Website gewählt";
      activeContext.environment = site?.environment || "Kein Website-Kontext";
      notify("Aktiver Kontext: " + customer.name);
      navigate("overview");
    });
  });

  document.querySelectorAll("[data-customer-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const customer = byId(customers, button.dataset.customerEdit);
      if (!customer) return;
      openCustomerForm(customer);
    });
  });

  document.querySelector("[data-new-customer]")?.addEventListener("click", () => openCustomerForm(null));

  document.querySelectorAll("[data-website-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const website = byId(websites, button.dataset.websiteOpen);
      if (!website) return;
      activeContext.customer = website.customer;
      activeContext.website = new URL(website.origin).hostname;
      activeContext.environment = website.environment;
      notify("Aktive Website: " + website.name);
      navigate("overview");
    });
  });

  document.querySelectorAll("[data-website-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const website = byId(websites, button.dataset.websiteEdit);
      if (!website) return;
      openWebsiteForm(website);
    });
  });

  document.querySelector("[data-new-website]")?.addEventListener("click", () => openWebsiteForm(null));

  document.querySelectorAll("[data-search-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.searchTab;
      document.querySelectorAll("[data-search-tab]").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll("[data-search-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.searchPanel !== target;
      });
    });
  });

  document.querySelectorAll("[data-campaign-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const campaign = byId(adCampaigns, button.dataset.campaignOpen);
      if (!campaign) return;
      showModal(modalShell({
        eyebrow: "Google Ads",
        title: campaign.name,
        body: '<dl class="demo-detail-list">' +
          '<div><dt>Kosten</dt><dd>' + escapeHtml(campaign.spend) + '</dd></div>' +
          '<div><dt>Conversions</dt><dd>' + escapeHtml(campaign.conversions) + '</dd></div>' +
          '<div><dt>CPA</dt><dd>' + escapeHtml(campaign.cpa) + '</dd></div>' +
          '<div><dt>CTR</dt><dd>' + escapeHtml(campaign.ctr) + '</dd></div>' +
          '<div><dt>Landingpage</dt><dd>' + escapeHtml(campaign.landingpage) + '</dd></div>' +
        '</dl>',
        footer: '<small>Demoansicht mit Mockdaten.</small><button class="uk-button uk-button-primary" type="button" data-close-modal>Schließen</button>'
      }));
    });
  });

  document.querySelectorAll("[data-setting-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const setting = settingDetails[button.dataset.settingOpen];
      if (!setting) return;
      showModal(modalShell({
        eyebrow: "Einstellungen",
        title: setting.title,
        body: '<p>' + escapeHtml(setting.description) + '</p><div class="demo-status-card"><span>Status</span><strong>' + escapeHtml(setting.status) + '</strong></div>',
        footer: '<small>Nur Clickdummy – keine Systemeinstellung wird geändert.</small><button class="uk-button uk-button-primary" type="button" data-close-modal>Schließen</button>'
      }));
    });
  });

  document.querySelector("[data-profile-open]")?.addEventListener("click", () => {
    showModal(modalShell({
      eyebrow: "Konto",
      title: "Cem Firat",
      body: '<dl class="demo-detail-list"><div><dt>Rolle</dt><dd>Administrator</dd></div><div><dt>Workspace</dt><dd>' + escapeHtml(activeContext.customer) + '</dd></div><div><dt>Demo-Modus</dt><dd>Aktiv</dd></div></dl>',
      footer: '<small>Der Clickdummy enthält keine echte Anmeldung.</small><button class="uk-button uk-button-primary" type="button" data-close-modal>Schließen</button>'
    }));
  });

  function openCustomerForm(customer) {
    const editing = Boolean(customer);
    const values = customer || {
      name: "",
      company: "",
      contact: "",
      email: "",
      phone: "",
      status: "Aktiv"
    };

    showModal(modalShell({
      eyebrow: editing ? "Kundendaten" : "Setup",
      title: editing ? "Kunde bearbeiten" : "Neuer Kunde",
      body: '<form class="demo-form" data-customer-form>' +
        formRow("Geschäftsbezeichnung", "name", values.name, "text", true) +
        formRow("Rechtliche Firma", "company", values.company) +
        formRow("Hauptkontakt", "contact", values.contact) +
        formRow("E-Mail", "email", values.email, "email") +
        formRow("Telefon", "phone", values.phone, "tel") +
        selectRow("Status", "status", ["Aktiv", "Geplant"], values.status) +
        '<div class="demo-form__actions"><button class="uk-button uk-button-default" type="button" data-close-modal>Abbrechen</button><button class="uk-button uk-button-primary" type="submit">' + (editing ? "Änderung simulieren" : "Kunde anlegen") + '</button></div>' +
      '</form>',
      footer: '<small>Nur lokale Clickdummy-Sitzung. Keine API und keine Speicherung.</small>'
    }));

    const form = document.querySelector("[data-customer-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      if (!name) return;

      if (editing) {
        const previousName = customer.name;
        customer.name = name;
        customer.company = String(data.get("company") || "").trim() || name;
        customer.contact = String(data.get("contact") || "").trim();
        customer.email = String(data.get("email") || "").trim();
        customer.phone = String(data.get("phone") || "").trim();
        customer.status = String(data.get("status") || "Aktiv");

        if (previousName !== customer.name) {
          for (const website of websites) {
            if (website.customer === previousName) website.customer = customer.name;
          }
          if (activeContext.customer === previousName) activeContext.customer = customer.name;
        }
        recountCustomerWebsites();
      } else {
        customers.push({
          id: nextId(name),
          name,
          company: String(data.get("company") || "").trim() || name,
          contact: String(data.get("contact") || "").trim(),
          email: String(data.get("email") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          websites: 0,
          status: String(data.get("status") || "Aktiv")
        });
      }

      closeModal();
      rerender();
      notify(editing ? "Kundendaten lokal aktualisiert." : "Demo-Kunde lokal angelegt.");
    });
  }

  function openWebsiteForm(website) {
    const editing = Boolean(website);
    const values = website || {
      name: "",
      origin: "https://",
      customer: activeContext.customer,
      environment: "Produktion",
      status: "Aktiv"
    };

    showModal(modalShell({
      eyebrow: editing ? "Website" : "Setup",
      title: editing ? "Website bearbeiten" : "Website hinzufügen",
      body: '<form class="demo-form" data-website-form>' +
        formRow("Name", "name", values.name, "text", true) +
        formRow("HTTPS-Origin", "origin", values.origin, "url", true) +
        selectRow("Kunde", "customer", customers.map((item) => item.name), values.customer) +
        selectRow("Umgebung", "environment", ["Produktion", "Staging", "Entwicklung"], values.environment) +
        selectRow("Status", "status", ["Aktiv", "Geplant"], values.status) +
        '<div class="demo-form__actions"><button class="uk-button uk-button-default" type="button" data-close-modal>Abbrechen</button><button class="uk-button uk-button-primary" type="submit">' + (editing ? "Änderung simulieren" : "Website hinzufügen") + '</button></div>' +
      '</form>',
      footer: '<small>Nur lokale Clickdummy-Sitzung. Keine Verbindung wird eingerichtet.</small>'
    }));

    const form = document.querySelector("[data-website-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const origin = String(data.get("origin") || "").trim();
      const customerName = String(data.get("customer") || "").trim();

      try {
        const parsed = new URL(origin);
        if (parsed.protocol !== "https:") throw new Error("HTTPS required");
      } catch {
        notify("Bitte eine gültige HTTPS-Adresse eingeben.", "warning");
        return;
      }

      if (editing) {
        const oldCustomer = website.customer;
        website.name = name;
        website.origin = origin;
        website.customer = customerName;
        website.environment = String(data.get("environment") || "Produktion");
        website.status = String(data.get("status") || "Aktiv");
        if (oldCustomer !== customerName) recountCustomerWebsites();
      } else {
        websites.push({
          id: nextId(name + "-" + websites.length),
          name,
          origin,
          customer: customerName,
          environment: String(data.get("environment") || "Produktion"),
          health: 0,
          status: String(data.get("status") || "Aktiv"),
          connectors: "0/4",
          wordpress: "Nicht geprüft",
          theme: "Nicht geprüft",
          lastCheck: "Noch nicht geprüft"
        });
        recountCustomerWebsites();
      }

      closeModal();
      rerender();
      notify(editing ? "Website lokal aktualisiert." : "Demo-Website lokal hinzugefügt.");
    });
  }

  function recountCustomerWebsites() {
    for (const customer of customers) {
      customer.websites = websites.filter((website) => website.customer === customer.name).length;
    }
  }
}
