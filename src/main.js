import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import "./styles/main.less";
import { activeContext, navigation } from "./data.js";
import { harikaSource } from "./harika-source.js";
import { bindInteractiveUi } from "./interactions.js";
import { renderStyleguide } from "./prototype/styleguide.js";
import { viewIntroduction } from "./ui.js";
import { renderPromptModal, renderView, viewMetadata } from "./views.js";

UIkit.use(Icons);

const app = document.querySelector("#app");
const prototypeViews = new Set(["styleguide"]);
const iconUrl = import.meta.env.BASE_URL + "icon.svg";

function currentView() {
  const value = new URL(window.location.href).searchParams.get("view") || "overview";
  return navigation.some((item) => item[0] === value) || prototypeViews.has(value) ? value : "overview";
}

function navigationHref(view) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", view);
  return url.pathname + url.search;
}

function navigate(view, push = true) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", view);
  if (push) window.history.pushState({ view }, "", url);

  const offcanvas = document.querySelector("#ccf-mobile-nav");
  if (offcanvas) UIkit.offcanvas(offcanvas).hide();

  render();
  document.querySelector("#ccf-view-title")?.focus({ preventScroll: true });
  document.querySelector("#main-content")?.scrollIntoView({ block: "start" });
}

function navMarkup(activeView, className = "main-nav") {
  return '<ul class="uk-nav uk-nav-default ' + className + '">' +
    navigation.map(([id, label, number]) =>
      '<li' + (id === activeView ? ' class="uk-active"' : '') + '>' +
        '<a href="' + navigationHref(id) + '" data-nav="' + id + '"><span>' + number + '</span><strong>' + label + '</strong></a>' +
      '</li>'
    ).join("") +
  '</ul>';
}

function brandMarkup(extraClass = "") {
  return '<a class="uk-logo brand ' + extraClass + '" href="' + navigationHref("overview") + '" data-nav="overview" aria-label="Harika Startseite">' +
    '<img class="brand-mark" src="' + iconUrl + '" alt="" width="64" height="64">' +
    '<span class="brand-logo-copy"><strong>Harika</strong><small>Intelligence Center</small></span>' +
  '</a>';
}

function userMarkup() {
  return '<div class="aside-user">' +
    '<a href="#account" class="user" data-profile-open aria-label="Konto öffnen">' +
      '<span class="uk-icon-button user-icon" data-uk-icon="icon: user" aria-hidden="true"></span>' +
      '<div><strong>Cem Firat</strong><small>Administrator</small></div>' +
    '</a>' +
    '<div class="aside-user-actions"><a class="uk-link-text" href="?view=styleguide" data-nav="styleguide">Styleguide</a><span class="uk-text-meta">UI-Labor</span></div>' +
  '</div>';
}

function renderCurrentView(view) {
  return view === "styleguide" ? renderStyleguide() : renderView(view);
}

function shell(view) {
  const meta = viewMetadata[view] || viewMetadata.overview;
  return '<a class="skip-link" href="#main-content">Zum Hauptinhalt</a>' +
    '<div class="app-shell">' +
      '<aside class="sidebar desktop-sidebar" aria-label="Harika Navigation">' +
        brandMarkup() +
        userMarkup() +
        '<nav aria-label="Hauptnavigation">' + navMarkup(view) + '</nav>' +
        '<div class="safety-note"><span class="safety-dot"></span><div><strong>Clickdummy</strong><small>Mockdaten · Harika ' + harikaSource.commit.slice(0, 7) + '</small></div></div>' +
      '</aside>' +
      '<main class="workspace" id="main-content" tabindex="-1">' +
        '<button class="uk-icon-button mobile-nav-toggle" type="button" data-uk-icon="icon: menu" data-uk-toggle="target: #ccf-mobile-nav" aria-label="Navigation öffnen"></button>' +
        '<header class="workspace-header">' +
          viewIntroduction(meta.title, meta.description) +
          '<div class="workspace-header-meta"><span class="runtime-version">Clickdummy · ' + activeContext.customer + '</span></div>' +
        '</header>' +
        '<div class="view-content">' + renderCurrentView(view) + '</div>' +
        '<footer class="app-footer"><span>Harika Clickdummy · UIkit-first UI-Labor</span><span>Source: ccf-sites-ads@' + harikaSource.commit.slice(0, 7) + '</span></footer>' +
      '</main>' +
    '</div>' +
    '<div id="ccf-mobile-nav" data-uk-offcanvas="overlay: true; flip: false">' +
      '<div class="uk-offcanvas-bar">' +
        '<button class="uk-offcanvas-close" type="button" data-uk-close aria-label="Navigation schließen"></button>' +
        brandMarkup("uk-margin-medium-bottom") +
        userMarkup() +
        '<nav aria-label="Mobile Hauptnavigation">' + navMarkup(view, "main-nav mobile-nav") + '</nav>' +
      '</div>' +
    '</div>' +
    '<div id="app-modal" class="uk-modal" data-uk-modal="bg-close: true; esc-close: true; stack: true" aria-labelledby="app-modal-title"></div>';
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(element.dataset.nav);
    });
  });

  document.querySelectorAll("[data-prompt-index]").forEach((element) => {
    element.addEventListener("click", () => openPrompt(element.dataset.promptIndex));
  });

  bindInteractiveUi({
    navigate,
    rerender: render,
    showModal,
    closeModal,
    notify
  });
}

function showModal(html) {
  const modal = document.querySelector("#app-modal");
  if (!modal) return;
  modal.innerHTML = html;
  UIkit.modal(modal).show();

  modal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });
}

function openPrompt(index) {
  showModal(renderPromptModal(index));

  const modal = document.querySelector("#app-modal");
  const copy = modal?.querySelector("[data-copy-prompt]");
  if (copy) {
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.copyPrompt);
        copy.textContent = "Kopiert";
      } catch {
        copy.textContent = "Kopieren nicht verfügbar";
      }
    });
  }
}

function closeModal() {
  const modal = document.querySelector("#app-modal");
  if (modal) UIkit.modal(modal).hide();
}

function notify(message, tone = "success") {
  UIkit.notification({
    message,
    status: tone === "warning" ? "warning" : "success",
    pos: "bottom-right",
    timeout: 2800
  });
}

function render() {
  app.innerHTML = shell(currentView());
  bindEvents();
}

window.addEventListener("popstate", render);
render();
