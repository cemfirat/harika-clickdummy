// Shared, document-local demo access. No credentials, persistence or provider calls.
export function initAiConnections(UIkit) {
  const one = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const modal = one("#ai-connections-modal");
  const subscribers = new Set();
  let state = { connected: false, provider: null, label: "Kein persönlicher Demo-Zugang verbunden" };
  let opener = null;
  let submitted = false;

  function visible(node) {
    return node?.isConnected && node.getClientRects().length && !node.disabled;
  }

  function open(trigger) {
    if (!modal) return;
    opener = trigger ?? document.activeElement;
    submitted = false;
    UIkit.modal(modal).show();
  }

  all("[data-ai-settings]").forEach((button) => button.addEventListener("click", (event) => {
    event.preventDefault();
    open(button);
  }));

  modal?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...modal.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")]
      .filter((node) => node.tabIndex >= 0 && visible(node));
    const first = controls[0];
    const last = controls[controls.length - 1];
    const active = document.activeElement;
    if (!first) return;
    if (event.shiftKey && (active === first || !controls.includes(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !controls.includes(active))) {
      event.preventDefault();
      first.focus();
    }
  });

  modal?.addEventListener("hidden", (event) => {
    if (event.target !== modal || one(".uk-modal.uk-open")) return;
    const task = opener?.dataset.aiFocusTarget
      ? one(opener.dataset.aiFocusTarget)
      : one("#assistant-task");
    const preferred = submitted ? [task, opener] : [opener, task];
    const target = [...preferred, ...all('button[data-ai-settings], button[data-assistant-open], a[href="#profile-modal"]')]
      .find(visible);
    requestAnimationFrame(() => { if (visible(target)) target.focus({ preventScroll: true }); });
  });

  one("#ai-connection-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const provider = one("#ai-provider")?.value === "direct-api" ? "Anbieter-API" : "OpenRouter";
    state = { connected: true, provider, label: `${provider} · persönlich (Demo)` };
    all("[data-ai-connection-label]").forEach((node) => { node.textContent = state.label; });
    const status = one("#ai-connection-status");
    if (status) status.textContent = "Demo-Zugang verbunden. Es wurden keine Anmeldedaten übertragen. Die Auswahl gilt für diese geöffnete Vorschau.";
    subscribers.forEach((subscriber) => subscriber({ ...state }));
    submitted = true;
    if (modal?.classList.contains("uk-open")) UIkit.modal(modal).hide();
  });

  return {
    getState: () => ({ ...state }),
    subscribe(callback) {
      subscribers.add(callback);
      callback({ ...state });
      return () => subscribers.delete(callback);
    },
    open
  };
}
