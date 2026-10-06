import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import "uikit/dist/css/uikit.min.css";
import "./styles/main.less";
import { activeContext, navigation } from "./data.js";
import { harikaSource } from "./harika-source.js";
import { bindInteractiveUi } from "./interactions.js";
import { contextLabel, renderPromptModal, renderView } from "./views.js";

UIkit.use(Icons);

const app = document.querySelector("#app");

function currentView() {
  const value = new URL(window.location.href).searchParams.get("view") || "overview";
  return navigation.some((item) => item[0] === value) ? value : "overview";
}

function navigate(view, push = true) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", view);
  if (push) window.history.pushState({ view }, "", url);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navMarkup(activeView) {
  return navigation.map((item) => {
    const active = item[0] === activeView ? " is-active" : "";
    return '<li class="' + active + '"><a href="?view=' + item[0] + '" data-nav="' + item[0] + '"><span>' + item[2] + '</span><strong>' + item[1] + '</strong></a></li>';
  }).join("");
}

function shell(view) {
  return '<main class="app-shell">' +
    '<aside class="sidebar">' +
      '<a class="brand" href="?view=overview" data-nav="overview" aria-label="Harika Startseite"><span class="brand-mark">H</span><span><strong>HARIKA</strong><small>Intelligence Center</small></span></a>' +
      '<ul class="main-nav">' + navMarkup(view) + '</ul>' +
      '<div class="source-note"><span></span><div><strong>Clickdummy</strong><small>Harika ' + harikaSource.commit.slice(0, 7) + '</small></div></div>' +
    '</aside>' +
    '<section class="workspace">' +
      '<header class="topbar">' +
        '<button class="mobile-menu" type="button" data-toggle-nav aria-label="Navigation öffnen"><span></span><span></span><span></span></button>' +
        '<div class="context"><span class="context__dot"></span><div><strong>' + contextLabel() + '</strong><small>' + activeContext.environment + ' · ' + activeContext.period + ' · Daten ' + activeContext.freshness + '</small></div></div>' +
        '<div class="topbar__actions"><button class="uk-button uk-button-default uk-button-small" data-nav="customers">Kunde wechseln</button><button class="avatar" type="button" data-profile-open aria-label="Profil öffnen">CF</button></div>' +
      '</header>' +
      '<div class="demo-ribbon"><strong>UI-Labor</strong><span>Änderungen und Formulare bleiben lokal und werden beim Neuladen verworfen.</span></div>' +
      '<div class="content">' + renderView(view) + '</div>' +
      '<footer class="app-footer"><span>Harika Clickdummy · UI-Labor</span><span>Source: ccf-sites-ads@' + harikaSource.commit.slice(0, 7) + '</span></footer>' +
    '</section>' +
    '<div class="mobile-overlay" data-toggle-nav></div>' +
    '<div class="prompt-modal" hidden></div>' +
    '<div class="demo-toast" role="status" aria-live="polite" hidden></div>' +
  '</main>';
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("nav-open");
      navigate(element.dataset.nav);
    });
  });

  document.querySelectorAll("[data-toggle-nav]").forEach((element) => {
    element.addEventListener("click", () => document.body.classList.toggle("nav-open"));
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
  const modal = document.querySelector(".prompt-modal");
  modal.innerHTML = html;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  modal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });
}

function openPrompt(index) {
  showModal(renderPromptModal(index));

  const modal = document.querySelector(".prompt-modal");
  const copy = modal.querySelector("[data-copy-prompt]");
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
  const modal = document.querySelector(".prompt-modal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  modal.innerHTML = "";
  document.body.classList.remove("modal-open");
}

let toastTimer = null;
function notify(message, tone = "success") {
  const toast = document.querySelector(".demo-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.tone = tone;
  toast.hidden = false;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

function render() {
  app.innerHTML = shell(currentView());
  bindEvents();
}

window.addEventListener("popstate", render);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.body.classList.remove("nav-open");
    closeModal();
  }
});

render();
