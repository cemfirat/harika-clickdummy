// Interactive, in-memory prototype. No model request or WordPress write occurs.
// Page structure and all example content belong to the HTML, never this module.
export function initWebsiteAssistant(UIkit, aiConnections) {
  const one = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const text = (selector, value) => all(selector).forEach((node) => { node.textContent = value; });
  const visible = (selector, value) => all(selector).forEach((node) => { node.hidden = !value; });
  const panel = one("#website-assistant");
  const access = one("#assistant-access");
  const model = one("#assistant-model");
  const task = one("#assistant-task");
  const picker = one("#draft-picker");
  const forms = all("[data-draft-editor]");
  const drafts = forms.map((form) => ({
    index: Number(form.dataset.draftEditor),
    id: `demo-post-${Number(form.dataset.draftEditor) + 1}`,
    form,
    created: false,
    failed: false,
    saved: null,
    author: "KI-Vorschlag (Demo)"
  }));
  const sampleTask = "Bereite drei Beitragsvorschläge zum Thema Sonnenschutz für diese Website vor. Ich möchte die Texte anschließend bearbeiten und als Entwürfe speichern.";
  const stages = ["idle", "running", "prepared", "result", "cancelled"];
  let connected = aiConnections.getState().connected;
  let website = "main";
  let stage = "idle";
  let draftCount = 0;
  let selectedDraft = 0;
  let operation = null;
  let timer = null;
  let sequence = 0;
  let opener = null;

  function fields(draft) {
    return Object.fromEntries(["title", "excerpt", "content"].map((name) => [
      name, draft.form.elements.namedItem(name)?.value ?? ""
    ]));
  }

  function sameFields(left, right) {
    return Boolean(left && right) && ["title", "excerpt", "content"].every((name) => left[name] === right[name]);
  }

  function preparedDrafts() {
    return drafts.filter((draft) => draft.index < draftCount);
  }

  function dirty(draft) {
    return draft.created && !sameFields(fields(draft), draft.saved);
  }

  function hasAccess() {
    return connected && access?.value === "personal";
  }

  function focus(node) {
    if (!node) return;
    requestAnimationFrame(() => {
      if (node.isConnected && node.getClientRects().length) node.focus({ preventScroll: true });
    });
  }

  function openAssistant(trigger) {
    if (!panel) return;
    if (trigger && !panel.contains(trigger)) opener = trigger;
    panel.hidden = false;
    document.body.dataset.assistantOpen = "true";
    all("button[data-assistant-open]").forEach((button) => button.setAttribute("aria-expanded", "true"));
    render();
    focus(one("#assistant-heading"));
  }

  function closeAssistant() {
    if (!panel) return;
    panel.hidden = true;
    document.body.dataset.assistantOpen = "false";
    all("button[data-assistant-open]").forEach((button) => button.setAttribute("aria-expanded", "false"));
    const returnTarget = [opener, ...all("button[data-assistant-open]")]
      .find((node) => node?.isConnected && node.getClientRects().length && !node.disabled);
    focus(returnTarget);
  }

  function showPosts() {
    if (website !== "main") return;
    const tabs = one("#website-tabs-main");
    if (tabs) UIkit.tab(tabs).show(1);
    else one("#website-posts-tab")?.click();
    if (globalThis.matchMedia?.("(max-width: 799px)").matches) closeAssistant();
  }

  function showDraft(index, moveFocus = true) {
    if (website !== "main" || index < 0 || index >= draftCount) return;
    selectedDraft = index;
    if (picker) picker.value = String(index);
    showPosts();
    render();
    if (moveFocus) focus(drafts.find((draft) => draft.index === index)?.form.elements.namedItem("title"));
  }

  function render() {
    const busy = Boolean(operation);
    const wrongWebsite = website !== "main";
    visible("#assistant-context-mismatch", wrongWebsite);
    visible("#assistant-connection-required", !connected);
    visible("#posts-empty", draftCount === 0);
    visible("#posts-workspace", draftCount > 0);
    stages.forEach((name) => visible(`#assistant-${name}`, stage === name));
    panel?.setAttribute("aria-busy", String(busy));
    one("#posts-workspace")?.setAttribute("aria-busy", String(busy));
    if (access) access.disabled = busy;
    if (model) model.disabled = !hasAccess() || busy;
    if (picker) picker.disabled = busy;
    const start = one("#assistant-start");
    if (start) {
      start.disabled = wrongWebsite || !hasAccess() || busy;
      start.textContent = draftCount > 0 ? "Arbeitsstand öffnen" : "Auftrag starten";
    }
    all("[data-assistant-sample]").forEach((button) => { button.disabled = busy || wrongWebsite; });
    const manual = one("#manual-post");
    if (manual) manual.disabled = busy || wrongWebsite;
    const stop = one("#assistant-stop");
    if (stop) stop.disabled = !busy;

    for (const draft of drafts) {
      const prepared = draft.index < draftCount;
      draft.form.hidden = !prepared || selectedDraft !== draft.index;
      [...draft.form.elements].forEach((control) => {
        control.disabled = !prepared || busy || wrongWebsite;
      });
      visible(`[data-draft-result="${draft.index}"]`, prepared);
      const option = picker?.querySelector(`option[value="${draft.index}"]`);
      if (option) {
        option.hidden = !prepared;
        option.disabled = !prepared;
      }
      if (!prepared) continue;
      const title = fields(draft).title.trim() || "Unbenannter Beitrag";
      text(`[data-draft-title="${draft.index}"]`, title);
      const label = draft.failed ? "Speichern fehlgeschlagen" : dirty(draft)
        ? "Ungespeicherte Änderung" : draft.created ? "Entwurf (Demo)" : "Vorschlag";
      all(`[data-draft-status="${draft.index}"]`).forEach((node) => {
        node.textContent = label;
        node.classList.toggle("uk-label-success", draft.created && !dirty(draft) && !draft.failed);
        node.classList.toggle("uk-label-warning", draft.failed || dirty(draft));
      });
      all(`[data-open-draft="${draft.index}"]`).forEach((button) => {
        button.disabled = busy || wrongWebsite;
      });
      // Stable prototype IDs describe the same local object on every retry.
      all(`[data-draft-result="${draft.index}"]`).forEach((node) => { node.dataset.demoResource = draft.id; });
    }
    const active = preparedDrafts();
    text("#assistant-prepared h3", draftCount === 1 ? "Dein vorhandener Beitrag" : "Drei Themen als Ausgangspunkt");
    all("li[data-draft-title]").forEach((node) => { node.hidden = Number(node.dataset.draftTitle) >= draftCount; });
    const created = active.filter((draft) => draft.created).length;
    const failed = active.filter((draft) => draft.failed).length;
    const unsaved = active.filter((draft) => !draft.created || dirty(draft)).length;
    text("#posts-created-count", `${created} ${created === 1 ? "Demo-Entwurf" : "Demo-Entwürfe"}`);
    text("#posts-updated-by", drafts.find((draft) => draft.index === selectedDraft)?.author ?? "Du");
    visible("#draft-error", failed > 0);
    const retry = one("#retry-failed");
    if (retry) {
      retry.hidden = failed === 0;
      retry.disabled = busy || wrongWebsite;
    }
    all("[data-save-all]").forEach((button) => {
      button.disabled = busy || wrongWebsite || draftCount === 0 || unsaved === 0;
    });
    all("[data-save-draft]").forEach((button) => {
      const draft = drafts.find((candidate) => String(candidate.index) === button.dataset.saveDraft);
      button.disabled = busy || wrongWebsite || !draft || draft.index >= draftCount ||
        (draft.created && !dirty(draft) && !draft.failed);
    });
    all("[data-assistant-feedback]").forEach((button) => {
      button.disabled = wrongWebsite || !hasAccess() || busy || draftCount === 0;
    });
    all("#assistant-cancelled [data-open-posts]").forEach((button) => { button.hidden = draftCount === 0; });
    if (stage === "result") {
      const modified = active.filter(dirty).length;
      const summary = failed > 0
        ? `${created} von ${draftCount} Demo-Entwürfen angelegt. ${failed} ${failed === 1 ? "Beitrag konnte" : "Beiträge konnten"} nicht gespeichert werden.`
        : modified > 0
        ? `${created} Demo-Entwürfe vorhanden. ${modified} ${modified === 1 ? "Beitrag enthält" : "Beiträge enthalten"} noch ungespeicherte Änderungen.`
        : `${created} von ${draftCount} Demo-Entwürfen angelegt. Alle Ergebnisse bleiben in dieser Vorschau.`;
      text("#assistant-result-summary", summary);
    }
  }

  function cancel(reason) {
    if (!operation) return;
    clearTimeout(timer);
    timer = null;
    operation = null;
    sequence += 1;
    stage = "cancelled";
    text("#assistant-progress-label", reason);
    text("#assistant-cancel-reason", reason);
    text("#posts-result-summary", reason);
    render();
  }

  function begin(kind, run) {
    if (operation || website !== "main") return;
    operation = { kind, sequence: ++sequence };
    const expected = operation.sequence;
    stage = "running";
    text("#assistant-progress-label", kind === "prepare"
      ? "Drei vorbereitete Beispielbeiträge werden geladen …"
      : "Demo-Entwürfe werden in dieser Vorschau gespeichert …");
    if (kind === "save") text("#posts-result-summary", "Demo-Entwürfe werden in dieser Vorschau gespeichert …");
    render();
    timer = setTimeout(() => {
      if (!operation || operation.sequence !== expected || website !== "main") return;
      timer = null;
      operation = null;
      run();
      render();
    }, 650);
  }

  function save(indices, retry = false) {
    if (operation || website !== "main") return;
    const selected = preparedDrafts().filter((draft) => indices.includes(draft.index) &&
      (!draft.created || dirty(draft) || draft.failed));
    if (!selected.length) {
      text("#posts-result-summary", "Diese Demo-Entwürfe sind bereits gespeichert.");
      return;
    }
    for (const draft of selected) {
      for (const name of ["title", "content"]) {
        const field = draft.form.elements.namedItem(name);
        field?.setCustomValidity(field.value.trim() ? "" : "Bitte gib einen Text ein.");
      }
      if (!draft.form.checkValidity()) {
        showDraft(draft.index, false);
        draft.form.reportValidity();
        return;
      }
    }
    const snapshots = new Map(selected.map((draft) => [draft.index, fields(draft)]));
    const failIndex = !retry && one("#demo-outcome")?.value === "partial"
      ? selected[selected.length - 1].index : -1;
    begin("save", () => {
      if (failIndex >= 0) one("#demo-outcome").value = "success";
      for (const draft of selected) {
        draft.failed = draft.index === failIndex;
        if (!draft.failed) {
          draft.created = true;
          draft.saved = snapshots.get(draft.index);
        }
      }
      stage = "result";
      const failed = selected.filter((draft) => draft.failed).length;
      text("#posts-result-summary", failed
        ? "Ein Demo-Speicherschritt ist fehlgeschlagen. Erfolgreiche Entwürfe bleiben erhalten. Du kannst den fehlgeschlagenen Schritt erneut versuchen."
        : "Demo-Entwürfe gespeichert. Es wurden keine Inhalte auf einer echten Website angelegt.");
      text("#assistant-progress-label", failed ? "Demo-Auftrag teilweise abgeschlossen." : "Demo-Auftrag abgeschlossen.");
    });
  }

  all("button[data-assistant-open]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => openAssistant(button));
  });
  all("[data-assistant-close]").forEach((button) => button.addEventListener("click", closeAssistant));
  panel?.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !one(".uk-modal.uk-open")) {
      event.preventDefault();
      closeAssistant();
    }
  });

  aiConnections.subscribe((state) => {
    if (operation?.kind === "prepare") cancel("Die Demo-Analyse wurde beim Wechsel des KI-Zugangs angehalten. Dein Auftrag bleibt erhalten.");
    connected = state.connected;
    const personal = access?.querySelector('option[value="personal"]');
    if (personal) {
      personal.disabled = !connected;
      if (connected) {
        personal.textContent = `${state.provider} · mein Zugang (Demo)`;
        access.value = "personal";
      }
    }
    render();
  });
  access?.addEventListener("change", () => {
    if (operation?.kind === "prepare") cancel("Die Demo-Analyse wurde angehalten. Wähle einen KI-Zugang und starte den Auftrag erneut.");
    render();
  });

  all("[data-assistant-sample]").forEach((button) => button.addEventListener("click", () => {
    if (operation || website !== "main") return;
    if (task) task.value = sampleTask;
    focus(task);
  }));
  one("#assistant-task-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (operation || website !== "main" || !hasAccess() || !event.currentTarget.reportValidity()) return;
    const instruction = task?.value.trim();
    if (!instruction) {
      focus(task);
      return;
    }
    text("#assistant-sent-task", instruction);
    if (draftCount > 0) {
      stage = "prepared";
      text("#assistant-progress-label", "Deine vorhandenen Vorschläge und Änderungen bleiben erhalten. Du kannst sie weiterbearbeiten und speichern.");
      render();
      showDraft(selectedDraft);
      return;
    }
    begin("prepare", () => {
      draftCount = drafts.length;
      stage = "prepared";
      selectedDraft = 0;
      if (picker) picker.value = "0";
      text("#assistant-progress-label", "Drei Beispielvorschläge sind bereit. Bearbeite die Texte und speichere sie als Demo-Entwürfe.");
      text("#posts-result-summary", "Vorbereitete Beispielinhalte. Du kannst jeden Text vor dem Speichern bearbeiten.");
      if (!globalThis.matchMedia?.("(max-width: 799px)").matches) showPosts();
    });
  });
  one("#assistant-stop")?.addEventListener("click", () => cancel("Demo-Aktion angehalten. Deine Eingaben bleiben erhalten; es wurden keine weiteren Entwürfe angelegt."));

  all("[data-open-posts], [data-draft-review]").forEach((button) => button.addEventListener("click", () => {
    showDraft(selectedDraft);
  }));
  picker?.addEventListener("change", () => showDraft(Number(picker.value), false));
  all("[data-open-draft]").forEach((button) => button.addEventListener("click", () => {
    showDraft(Number(button.dataset.openDraft));
  }));
  one("#manual-post")?.addEventListener("click", () => {
    if (operation || website !== "main") return;
    if (draftCount === 0) {
      draftCount = 1;
      const first = drafts.find((draft) => draft.index === 0);
      if (first) {
        for (const name of ["title", "excerpt", "content"]) {
          const field = first.form.elements.namedItem(name);
          if (field) field.value = "";
        }
        first.author = "Du";
      }
      text("#posts-result-summary", "Schreibe deinen Beitrag. Gespeichert wird ausschließlich in dieser Demo.");
      stage = "prepared";
    }
    showDraft(selectedDraft);
  });
  forms.forEach((form) => {
    form.addEventListener("input", (event) => {
      const draft = drafts.find((candidate) => candidate.form === form);
      if (!draft || draft.index >= draftCount) return;
      event.target.setCustomValidity?.("");
      draft.author = "Du";
      render();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      save([Number(form.dataset.draftEditor)]);
    });
  });
  all("[data-save-all]").forEach((button) => button.addEventListener("click", () => {
    save(preparedDrafts().map((draft) => draft.index));
  }));
  one("#retry-failed")?.addEventListener("click", () => {
    save(preparedDrafts().filter((draft) => draft.failed).map((draft) => draft.index), true);
  });
  all("[data-assistant-feedback]").forEach((button) => button.addEventListener("click", () => {
    if (operation || website !== "main" || !hasAccess()) return;
    const draft = drafts.find((candidate) => candidate.index === selectedDraft);
    if (!draft || draft.index >= draftCount) return;
    const current = fields(draft);
    text("#assistant-feedback-title", current.title.trim() || "Dein noch unbenannter Beitrag");
    text("#assistant-feedback-content", current.content.trim());
    visible("#assistant-feedback", true);
    openAssistant(button);
    focus(one("#assistant-feedback-heading"));
  }));

  one("#search-setup-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (website !== "main" || !event.currentTarget.reportValidity()) return;
    const property = one("#search-property")?.value;
    if (property !== "domain" && property !== "prefix") return;
    all("[data-search-status]").forEach((node) => {
      node.textContent = "Verbunden (Demo)";
      node.classList.remove("website-status-neutral");
      node.classList.add("uk-label-success");
    });
    text("#search-finding-title", "Verbindung vorbereitet – Daten noch offen");
    text("#search-finding-description", "Die Property wurde in dieser Demo zugeordnet. Es liegen keine echten Messdaten vor; Aussagen zur Sichtbarkeit sind deshalb weiterhin nicht möglich.");
    visible("#search-setup-result", true);
    const modal = one("#search-setup-modal");
    if (modal) UIkit.modal(modal).hide();
  });

  render();
  return {
    onWebsiteChange(id) {
      if (!["main", "magazine", "staging"].includes(id)) return;
      website = id;
      if (website !== "main" && operation) {
        cancel("Der Auftrag für die Hauptwebsite wurde beim Website-Wechsel angehalten. Kehre zurück, um weiterzuarbeiten. Deine Eingaben bleiben erhalten.");
      }
      render();
    }
  };
}
