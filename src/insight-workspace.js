// Document-local investigation demo. Example evidence and content stay in HTML.
export function initInsightWorkspace(UIkit, aiConnections) {
  const one = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const workbench = one("#insight-workbench");
  if (!workbench) return;
  const form = one("#insight-plan-form");
  const task = one("#insight-task");
  const assistant = one("#insight-assistant");
  const fields = ["title", "notes", "heading", "intro"];
  const control = (name) => form.elements.namedItem(name);
  const text = (selector, value) => { const node = one(selector); if (node) node.textContent = value; };
  const visible = (selector, show) => { const node = one(selector); if (node) node.hidden = !show; };
  const defaultHeading = control("heading").value;
  const defaultIntro = control("intro").value;
  const initialTasks = { signal: task.value, gap: one("#insight-gap-sample-task").textContent };
  const states = Object.fromEntries(["signal", "gap"].map((key) => [key, {
    prepared: false, author: "Du", savedPlan: null,
    plan: { title: "", notes: "", heading: defaultHeading, intro: defaultIntro, includeCheck: true, includeDraft: false },
    task: initialTasks[key], sentTask: "", stage: "Bereit zur Einordnung",
    response: key === "signal"
      ? "Ich kann einen Beispielplan zur Messabweichung vorbereiten. Die Ursache bleibt bis zu einer fachlichen Prüfung offen."
      : "Ohne aktuelle GA4-Daten lässt sich der Verlauf nicht beurteilen. Der nächste Schritt ist ein Plan zur Prüfung des Zugangs und der fehlenden Daten.",
    message: "", workStatus: "Beispieldaten zur Untersuchung. Noch keine Maßnahmen ausgeführt.",
    check: null, draft: null, failedDraft: null, reconnected: false
  }]));
  let selected = "signal";
  let connected = aiConnections.getState().connected;
  let operation = null;
  let sequence = 0;
  let timer = null;
  let opener = null;
  const state = () => states[selected];
  const same = (a, b) => Boolean(a && b) && JSON.stringify(a) === JSON.stringify(b);
  const content = (plan) => ({ heading: plan.heading, intro: plan.intro });

  function focus(node) {
    requestAnimationFrame(() => {
      if (node?.isConnected && !node.disabled && node.getClientRects().length) {
        if (globalThis.matchMedia?.("(max-width: 799px)").matches) node.scrollIntoView({ block: "nearest" });
        node.focus({ preventScroll: true });
      }
    });
  }

  function capture() {
    const current = state();
    if (current.prepared) {
      fields.forEach((name) => { current.plan[name] = control(name).value; });
      current.plan.includeCheck = one("#insight-include-check").checked;
      current.plan.includeDraft = selected === "signal" && one("#insight-include-draft").checked;
    }
    current.task = task.value;
  }

  function load() {
    const current = state();
    fields.forEach((name) => {
      control(name).value = current.plan[name];
      control(name).setCustomValidity("");
    });
    one("#insight-include-check").checked = current.plan.includeCheck;
    one("#insight-include-draft").checked = current.plan.includeDraft;
    task.value = current.task;
    task.setCustomValidity("");
    render();
  }

  function openAssistant(trigger) {
    if (trigger && !assistant.contains(trigger)) opener = trigger;
    assistant.hidden = false;
    workbench.dataset.workAssistantOpen = "true";
    all("[data-insight-open]").forEach((button) => button.setAttribute("aria-expanded", "true"));
    if (globalThis.matchMedia?.("(max-width: 799px)").matches) assistant.scrollIntoView({ block: "start" });
    focus(one("#insight-assistant-heading"));
  }

  function closeAssistant() {
    assistant.hidden = true;
    workbench.dataset.workAssistantOpen = "false";
    all("[data-insight-open]").forEach((button) => button.setAttribute("aria-expanded", "false"));
    const target = [opener, ...all("[data-insight-open]")]
      .find((node) => node?.isConnected && !node.disabled && node.getClientRects().length);
    focus(target);
  }

  function showTab(index, moveFocus = true) {
    UIkit.tab("#insight-tabs").show(index);
    if (globalThis.matchMedia?.("(max-width: 799px)").matches) closeAssistant();
    if (index === 1 && moveFocus && state().prepared) focus(control("title"));
  }

  function needsCheck(current) {
    return current.plan.includeCheck && (!current.check || current.check.notes !== current.plan.notes);
  }

  function needsDraft(current) {
    return selected === "signal" && current.plan.includeDraft &&
      (Boolean(current.failedDraft) || !same(content(current.plan), current.draft));
  }

  function render() {
    const current = state();
    const busy = Boolean(operation);
    const gap = selected === "gap";
    const hasResults = Boolean(current.check || current.draft || current.failedDraft);
    visible("#insight-signal-evidence", !gap);
    visible("#insight-gap-evidence", gap);
    text("#insight-ga-delta", gap ? "Daten fehlen" : "−46,7 %");
    text("#insight-ga-value", gap ? "—" : "245");
    text("#insight-ga-caption", gap ? "Aktueller Zeitraum nicht verfügbar" : "Sitzungen · vorher 460");
    text("#insight-finding-title", gap ? "GA4-Daten fehlen: Verlauf nicht beurteilbar"
      : "Weniger gemessene Sitzungen bei fast gleichen Anzeigenklicks");
    text("#insight-finding-summary", gap ? "Der aktuelle GA4-Zeitraum fehlt. Fehlende Werte sind keine Nullwerte und belegen keinen Einbruch."
      : "Eine Abweichung in den Beispieldaten. Ob Messung, Einwilligung oder Weiterleitung beteiligt ist, wurde noch nicht geprüft.");
    text("#insight-source-status", gap ? "29.10.2026 · Google Ads und Search Console vorhanden; aktueller GA4-Zeitraum fehlt"
      : "29.10.2026 · abgeschlossene, vorbereitete Beispieldaten");
    text("#insight-assistant-context", gap ? "GA4-Daten fehlen · Ursache noch offen" : "Abweichung zwischen Quellen");
    text("#insight-gap-status", current.reconnected
      ? "Zugriff erneuert (Demo). Vergleichsdaten und Ereigniseingang sind weiterhin offen."
      : "Zugriff offen · aktuelle Daten fehlen");
    one("#insight-reconnect").disabled = current.reconnected || busy;
    visible("#insight-ai-required", !connected);
    visible("#insight-plan-empty", !current.prepared);
    visible("#insight-plan-workspace", current.prepared);
    visible("#insight-content-fields", current.prepared && current.plan.includeDraft && !gap);
    visible("#insight-results-empty", !hasResults);
    visible("#insight-results-workspace", hasResults);
    visible("#insight-check-result", Boolean(current.check));
    visible("#insight-draft-result", Boolean(current.draft || current.failedDraft));
    visible("#insight-retry", Boolean(current.failedDraft));
    visible("#insight-edit-plan", current.prepared);
    visible("#insight-sent-task", Boolean(current.sentTask));
    visible("#insight-work-stop", busy);
    text("#insight-plan-author", current.author);
    text("#insight-plan-status", same(current.plan, current.savedPlan) ? "Plan gespeichert (Demo)"
      : current.savedPlan ? "Ungespeicherte Änderungen" : current.author === "Du" ? "Eigener Arbeitsplan" : "Vorschlag (Demo)");
    text("#insight-plan-message", current.message);
    text("#insight-work-status", current.workStatus);
    text("#insight-assistant-stage", current.stage);
    text("#insight-assistant-response-title", current.prepared ? current.plan.title.trim() || "Dein Arbeitsplan" : gap ? "Erst den Datenzugang klären" : "Erst verstehen, dann handeln");
    text("#insight-assistant-response", current.response);
    text("#insight-sent-task", current.sentTask);
    text("#insight-draft-help", gap ? "Für diesen Fall gibt es keine datenbasierte Inhaltsempfehlung. Kläre zunächst den fehlenden GA4-Zeitraum."
      : "Optionaler Inhaltsentwurf. Er behebt keinen nachgewiesenen Messfehler und wird nicht veröffentlicht.");
    [...form.elements].forEach((node) => { node.disabled = busy || !current.prepared; });
    control("heading").required = !gap && current.plan.includeDraft;
    control("intro").required = !gap && current.plan.includeDraft;
    one("#insight-include-draft").disabled = busy || gap || !current.prepared;
    one("#insight-save-plan").disabled = busy || !current.prepared || same(current.plan, current.savedPlan);
    one("#insight-run").disabled = busy || !current.prepared || (!needsCheck(current) && !needsDraft(current));
    one("#insight-retry").disabled = busy || !current.failedDraft;
    one("#insight-analyse").disabled = busy || !connected;
    one("#insight-analyse").textContent = current.prepared ? "Arbeitsstand besprechen" : "Prüfplan vorbereiten";
    one("#insight-stop").disabled = !busy;
    task.disabled = busy;
    all("#insight-manual-plan, [data-insight-manual]").forEach((button) => { button.disabled = busy; });
    all("[data-insight-edit]").forEach((button) => { button.disabled = busy; });
    workbench.setAttribute("aria-busy", String(busy));
    one("#insight-check-result").dataset.demoResource = `demo-insight-${selected}-check`;
    if (current.check) {
      text("#insight-check-report", current.check.report);
      text("#insight-check-status", current.check.notes === current.plan.notes
        ? "Prüfbericht (Demo)" : "Prüfbericht · neue Prüfschritte offen");
    }
    const shownDraft = current.draft ?? current.failedDraft;
    if (shownDraft) {
      text("#insight-result-title", shownDraft.heading);
      text("#insight-result-intro", shownDraft.intro);
      text("#insight-draft-status", current.failedDraft ? current.draft ? "Aktualisierung fehlgeschlagen" : "Nicht gespeichert"
        : same(content(current.plan), current.draft) ? "Entwurf (Demo)" : "Entwurf · Änderungen offen");
    }
    if (hasResults) text("#insight-result-summary", current.failedDraft
      ? "Der Entwurfsschritt ist fehlgeschlagen. Bereits vorhandene Prüfergebnisse und Entwürfe bleiben erhalten."
      : current.check && current.draft ? "Prüfbericht und Landingpage-Entwurf in dieser Demo vorhanden."
      : current.check ? "Prüfbericht in dieser Demo vorhanden. Offene Punkte sind weiter zu klären."
      : "Landingpage-Entwurf in dieser Demo gespeichert.");
  }

  function cancel(message) {
    if (!operation) return;
    clearTimeout(timer);
    timer = null;
    sequence += 1;
    operation = null;
    state().stage = "Angehalten";
    state().workStatus = message;
    state().message = message;
    render();
  }

  function begin(kind, run) {
    if (operation) return;
    const expected = ++sequence;
    const context = selected;
    operation = { kind, expected };
    state().stage = kind === "prepare" ? "Beispielplan wird vorbereitet" : "Demo-Schritte laufen";
    state().workStatus = kind === "prepare" ? "Vorbereiteter Beispielplan wird geladen …" : "Ausgewählte Schritte werden in dieser Vorschau simuliert …";
    render();
    timer = setTimeout(() => {
      if (operation?.expected !== expected || selected !== context) return;
      operation = null;
      timer = null;
      run();
      render();
    }, 650);
  }

  function validate() {
    capture();
    for (const name of fields) {
      const input = control(name);
      input.setCustomValidity(input.required && !input.value.trim() ? "Bitte gib einen Text ein." : "");
    }
    if (form.checkValidity()) return true;
    const planPanel = one("#insight-plan");
    if (planPanel.classList.contains("uk-active")) {
      showTab(1, false);
      requestAnimationFrame(() => form.reportValidity());
    } else {
      // UIkit changes tab panels asynchronously. Native validation must wait
      // until the invalid controls are visible, otherwise focus is lost.
      const reportWhenVisible = (event) => {
        if (event.target !== planPanel) return;
        planPanel.removeEventListener("shown", reportWhenVisible);
        form.reportValidity();
      };
      planPanel.addEventListener("shown", reportWhenVisible);
      showTab(1, false);
    }
    return false;
  }

  function runSteps(retry = false) {
    const current = state();
    if (operation || !current.prepared) return;
    if (retry) {
      if (selected !== "signal" || !current.failedDraft) return;
      // Retrying explicitly selects the draft again, including its validation.
      // An unchecked optional step must not make empty draft fields valid.
      current.plan.includeDraft = true;
      one("#insight-include-draft").checked = true;
      render();
    }
    if (!validate()) return;
    const check = !retry && needsCheck(current);
    const draft = retry ? Boolean(current.failedDraft) : needsDraft(current);
    if (!check && !draft) return;
    const snapshot = { ...current.plan };
    const fail = draft && !retry && one("#insight-outcome").value === "partial";
    begin("run", () => {
      current.savedPlan = snapshot;
      if (check) current.check = {
        notes: snapshot.notes,
        report: selected === "gap"
          ? "Im vorbereiteten Prüfbeispiel fehlen weiterhin die GA4-Vergleichsdaten. Zugang, Verarbeitung und tatsächlicher Ereigniseingang müssen separat geprüft werden. Ein Rückgang ist nicht beurteilbar."
          : "Im vorbereiteten Prüfbeispiel passen Ads-Zielseite und GA4-Property zur Hauptwebsite. Der tatsächliche Eingang eines Testereignisses ist noch offen. Tag, Einwilligung und Weiterleitung bleiben zu prüfen."
      };
      if (draft) {
        if (fail) {
          current.failedDraft = content(snapshot);
          one("#insight-outcome").value = "success";
        } else {
          current.draft = content(snapshot);
          current.failedDraft = null;
        }
      }
      current.stage = fail ? "Teilweise abgeschlossen" : "Demo-Ergebnis vorhanden";
      current.message = fail ? "Prüfergebnisse bleiben erhalten. Wiederhole gezielt den fehlgeschlagenen Entwurfsschritt."
        : "Die ausgewählten Demo-Schritte sind dokumentiert. Eine reale Website oder Messung wurde nicht verändert.";
      current.workStatus = current.message;
      showTab(2, false);
    });
  }

  function manualPlan() {
    if (operation) return;
    state().prepared = true;
    state().stage = "Gemeinsamer Arbeitsstand";
    state().message = "Halte deinen Prüfplan fest. Speichern führt noch keine Maßnahme aus.";
    render();
    showTab(1);
  }

  all("[data-insight-open]").forEach((button) => button.addEventListener("click", () => openAssistant(button)));
  all("[data-insight-close]").forEach((button) => button.addEventListener("click", closeAssistant));
  assistant.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !one(".uk-modal.uk-open")) { event.preventDefault(); closeAssistant(); }
  });
  one("#insight-manual-plan").addEventListener("click", manualPlan);
  all("[data-insight-manual]").forEach((button) => button.addEventListener("click", manualPlan));
  all("[data-insight-edit]").forEach((button) => button.addEventListener("click", () => showTab(1)));
  one("#insight-case").addEventListener("change", (event) => {
    if (!states[event.target.value]) return;
    capture();
    cancel("Der laufende Schritt wurde beim Fallwechsel angehalten. Der bisherige Arbeitsstand bleibt erhalten.");
    selected = event.target.value;
    load();
    UIkit.tab("#insight-tabs").show(0);
  });
  form.addEventListener("input", (event) => {
    event.target.setCustomValidity?.("");
    capture();
    state().author = "Du";
    render();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (operation || !state().prepared || !validate()) return;
    state().savedPlan = { ...state().plan };
    state().message = "Arbeitsplan gespeichert (Demo). Es wurden noch keine zusätzlichen Schritte ausgeführt.";
    render();
  });
  one("#insight-run").addEventListener("click", () => runSteps());
  one("#insight-retry").addEventListener("click", () => runSteps(true));
  all("#insight-stop, #insight-work-stop").forEach((button) => button.addEventListener("click", () => {
    cancel("Demo-Schritt angehalten. Deine Eingaben und bereits vorhandenen Ergebnisse bleiben erhalten.");
  }));
  one("#insight-reconnect").addEventListener("click", () => {
    if (selected !== "gap" || operation) return;
    state().reconnected = true;
    state().workStatus = "Demo-Zugriff erneuert. Messdaten wurden dadurch nicht erzeugt; der Verlauf bleibt nicht beurteilbar.";
    render();
  });
  task.addEventListener("input", () => { task.setCustomValidity(""); state().task = task.value; });
  one("#insight-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (operation || !connected) return;
    task.setCustomValidity(task.value.trim() ? "" : "Bitte gib einen Auftrag ein.");
    if (!event.currentTarget.reportValidity()) return;
    capture();
    const current = state();
    current.sentTask = task.value.trim();
    if (current.prepared) {
      current.stage = "Dein Arbeitsstand bleibt erhalten";
      current.response = `Zu „${current.plan.title.trim() || "deinem Arbeitsplan"}“: Prüfergebnisse und Entwurf bleiben getrennt. Deine bearbeiteten Texte werden nicht durch das Beispiel ersetzt. Offene Ursachen lassen sich erst durch eine tatsächliche Prüfung klären.`;
      render();
      return;
    }
    begin("prepare", () => {
      current.prepared = true;
      current.author = "KI-Vorschlag (Demo)";
      current.plan.title = one(`#insight-${selected}-sample-title`).textContent;
      current.plan.notes = one(`#insight-${selected}-sample-notes`).textContent;
      current.stage = "Prüfplan vorbereitet";
      current.message = "Vorbereiteter Beispielplan. Bearbeite ihn direkt und wähle konkrete nächste Schritte.";
      current.workStatus = "Prüfplan vorbereitet. Noch keine Schritte ausgeführt.";
      current.response = selected === "signal"
        ? "Die Abweichung ist ein Anlass, Messung und Zuordnung zu prüfen. Der Beispielplan trennt mögliche Ursachen von den nötigen Prüfungen. Ein Inhaltsentwurf ist ein eigener, optionaler Schritt."
        : "Der fehlende Zeitraum lässt keine Aussage über einen Rückgang zu. Der Beispielplan beginnt beim Datenzugang; eine Inhaltsempfehlung folgt daraus nicht.";
      load();
      if (!globalThis.matchMedia?.("(max-width: 799px)").matches) showTab(1, false);
    });
  });
  aiConnections.subscribe((next) => {
    if (operation?.kind === "prepare") cancel("Die Vorbereitung wurde beim Wechsel des KI-Zugangs angehalten. Deine Eingaben bleiben erhalten.");
    connected = next.connected;
    render();
  });
  globalThis.addEventListener("pagehide", () => {
    cancel("Beim Verlassen angehalten. Der bisherige Demo-Arbeitsstand bleibt in diesem Dokument erhalten.");
  });
  load();
}
