// HTML-first Ads prototype. All resources and responses are local demo objects.
// Analysis prepares an editable proposal; only explicit application changes it.
export function initAdsWorkspace(UIkit, aiConnections) {
  const one = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const workbench = one("#ads-workbench");
  if (!workbench) return;
  const panel = one("#ads-assistant");
  const form = one("#keyword-form");
  const picker = one("#keyword-picker");
  const task = one("#ads-task");
  const campaignPicker = one("#ads-campaign");
  const matchLabels = { EXACT: "Genau passend", PHRASE: "Passende Wortgruppe", BROAD: "Weitgehend passend" };
  const fields = {
    text: one("#keyword-text"), match: one("#keyword-match"),
    status: one("#keyword-status"), oldAction: one("#keyword-old-action")
  };
  const entries = all("[data-keyword-source]").map((row) => {
    const index = Number(row.dataset.keywordSource);
    const original = {
      id: `demo-keyword-${index + 1}`, text: row.dataset.keywordText,
      match: row.dataset.keywordMatch, status: row.dataset.keywordStatus
    };
    return {
      index, row, original,
      draft: { text: original.text, match: original.match, status: original.status, oldAction: "keep" },
      existingStatus: original.status,
      suggestion: { text: row.dataset.suggestedText, match: row.dataset.suggestedMatch, status: row.dataset.suggestedStatus },
      author: "Noch nicht bearbeitet", committed: false, replacement: null, result: null
    };
  });
  let selected = 0;
  let campaign = "raffstores";
  let ai = aiConnections?.getState() ?? { connected: false, provider: null, label: "Noch nicht verbunden" };
  let stage = "idle";
  let review = null;
  let operation = null;
  let timer = null;
  let sequence = 0;
  let opener = null;

  const setText = (selector, value) => all(selector).forEach((node) => { node.textContent = value; });
  const show = (selector, value) => all(selector).forEach((node) => { node.hidden = !value; });
  const statusLabel = (status) => status === "PAUSED" ? "Pausiert" : "Aktiv";
  const isReplacement = (entry) => entry.draft.text.trim() !== entry.original.text || entry.draft.match !== entry.original.match;
  const changed = (entry) => !entry.committed && (isReplacement(entry) || entry.draft.status !== entry.original.status);
  const started = () => Boolean(review?.some((item) => item.phase !== "pending"));
  const unfinished = () => Boolean(review?.some((item) => item.phase !== "done"));
  const partial = () => started() && unfinished();

  function focus(node) {
    requestAnimationFrame(() => {
      if (node?.isConnected && node.getClientRects().length && !node.disabled) {
        if (globalThis.matchMedia?.("(max-width: 799px)").matches) node.scrollIntoView({ block: "nearest" });
        node.focus({ preventScroll: true });
      }
    });
  }

  function openAssistant(trigger) {
    if (trigger && !panel.contains(trigger)) opener = trigger;
    panel.hidden = false;
    workbench.dataset.workAssistantOpen = "true";
    all("button[data-ads-open]").forEach((button) => button.setAttribute("aria-expanded", "true"));
    render();
    if (globalThis.matchMedia?.("(max-width: 799px)").matches) panel.scrollIntoView({ block: "start" });
    focus(one("#ads-assistant-heading"));
  }

  function closeAssistant() {
    panel.hidden = true;
    workbench.dataset.workAssistantOpen = "false";
    all("button[data-ads-open]").forEach((button) => button.setAttribute("aria-expanded", "false"));
    focus([opener, ...all("button[data-ads-open]")].find((node) => node?.getClientRects().length && !node.disabled));
  }

  function showMain(target) {
    if (globalThis.matchMedia?.("(max-width: 799px)").matches) closeAssistant();
    const node = one(target);
    node?.scrollIntoView({ block: "start" });
    focus(node);
  }

  function fillEditor() {
    const entry = entries[selected];
    if (!entry) return;
    for (const [name, field] of Object.entries(fields)) {
      field.value = entry.draft[name];
      field.setCustomValidity("");
    }
    picker.value = String(selected);
  }

  function resultSummary() {
    const results = entries.map((entry) => entry.result).filter(Boolean);
    const done = results.filter((item) => item.phase === "done").length;
    const open = results.length - done;
    const replacements = entries.filter((entry) => entry.replacement).length;
    if (!results.length) return "Noch keine Demo-Änderung ausgeführt.";
    const completed = `${done} von ${results.length} ${results.length === 1 ? "Änderung" : "Änderungen"} in der Demo geprüft.`;
    const resources = replacements ? ` ${replacements} ${replacements === 1 ? "pausierter Ersatz besteht" : "pausierte Ersatzkeywords bestehen"}.` : "";
    return completed + resources + (open ? ` ${open} ${open === 1 ? "Schrittfolge ist" : "Schrittfolgen sind"} noch offen.` : " Die historischen Leistungswerte bleiben beim Original.");
  }

  function render() {
    const busy = Boolean(operation);
    const wrongCampaign = campaign !== "raffstores";
    const entry = entries[selected];
    const replacement = isReplacement(entry);
    const blocked = busy || wrongCampaign || partial();
    show("#ads-context-mismatch", wrongCampaign);
    show("#ads-ai-required", !ai.connected);
    setText("#ads-ai-label", ai.connected ? ai.label : "Noch nicht verbunden");
    one("#ads-model").disabled = !ai.connected || busy;
    one("#ads-analyse").disabled = !ai.connected || blocked;
    one("#ads-analyse").textContent = entries.every((candidate) => candidate.committed)
      ? "Ergebnis öffnen" : entries.some((candidate) => candidate.author !== "Noch nicht bearbeitet")
      ? "Arbeitsstand ergänzen" : "Vorschlag vorbereiten";
    one("#keyword-fields").disabled = blocked || entry.committed;
    picker.disabled = busy || wrongCampaign;
    fields.status.disabled = blocked || entry.committed || replacement;
    fields.oldAction.disabled = blocked || entry.committed;
    one("#ads-preview-button").disabled = blocked || !entries.some(changed);
    show("#keyword-replacement-note", replacement);
    show("#keyword-locked-note", entry.committed || partial());
    setText("#keyword-locked-note", partial()
      ? "Ein Teil der Demo-Änderung ist bereits erfolgt. Setze die offenen Schritte fort; die Vorschläge bleiben dafür erhalten."
      : "Diese Demo-Änderung ist abgeschlossen. Die Ergebnisse bleiben sichtbar; weitere unveränderte Keywords kannst du noch bearbeiten.");
    setText("#keyword-author", entry.author);
    setText("#keyword-work-status", entry.committed ? "Übernommen (Demo)" : changed(entry) ? "Vorschlag · noch nicht übernommen" : "Unverändert");
    workbench.setAttribute("aria-busy", String(busy));
    for (const name of ["idle", "running", "prepared", "result", "paused"]) {
      show(`#ads-assistant-${name}`, stage === name);
    }
    all("[data-ads-cancel]").forEach((button) => { button.disabled = !busy; });
    one("#ads-cancel").hidden = operation?.kind !== "apply";
    all("[data-ads-review]").forEach((button) => { button.disabled = wrongCampaign || busy; });

    for (const item of entries) {
      item.row.classList.toggle("uk-active", item.index === selected);
      all(`[data-keyword-select="${item.index}"]`).forEach((button) => {
        button.disabled = wrongCampaign || busy;
        button.setAttribute("aria-pressed", String(item.index === selected));
      });
      const status = one(`[data-keyword-original-status="${item.index}"]`);
      status.textContent = statusLabel(item.original.status);
      status.classList.toggle("uk-label-success", item.original.status === "ENABLED");
      const resourceRow = one(`[data-keyword-replacement="${item.index}"]`);
      resourceRow.hidden = !item.replacement;
      if (item.replacement) {
        resourceRow.dataset.demoResource = item.replacement.id;
        setText(`[data-keyword-replacement-text="${item.index}"]`, item.replacement.text);
        setText(`[data-keyword-replacement-match="${item.index}"]`, matchLabels[item.replacement.match]);
      }
      const proposed = isReplacement(item)
        ? `${item.original.text} → ${item.draft.text.trim() || "Noch kein Text"} · ${matchLabels[item.draft.match]} · neuer Ersatz pausiert`
        : `${item.original.text} · ${matchLabels[item.draft.match]} · ${statusLabel(item.draft.status)}`;
      setText(`[data-ads-suggestion="${item.index}"]`, proposed + (item.author === "Du" ? " · von dir bearbeitet" : ""));

      const previewRow = one(`[data-keyword-preview="${item.index}"]`);
      const change = review?.find((candidate) => candidate.index === item.index);
      previewRow.hidden = !change;
      if (change) {
        setText(`[data-preview-old="${item.index}"]`, `${change.before.text} · ${matchLabels[change.before.match]} · ${statusLabel(change.before.status)}`);
        setText(`[data-preview-new="${item.index}"]`, `${change.after.text} · ${matchLabels[change.after.match]} · ${statusLabel(change.after.status)}`);
        setText(`[data-preview-impact="${item.index}"]`, change.type === "replace"
          ? `Neues Keyword ohne Leistungsdaten. Original ${change.after.oldAction === "pause" ? "ausdrücklich pausieren" : "unverändert lassen"}; bisherige Statistik bleibt dort.`
          : "Status des bestehenden Keywords ändern. Dieselbe Ressource behält ihre Historie.");
      }

      const resultRow = one(`[data-keyword-result="${item.index}"]`);
      resultRow.hidden = !item.result;
      if (!item.result) continue;
      const result = item.result;
      resultRow.dataset.demoResource = item.replacement?.id ?? item.original.id;
      resultRow.dataset.phase = result.phase;
      const resultStatus = one(`[data-result-status="${item.index}"]`);
      const pendingLabel = result.phase === "pending" ? "Noch nicht ausgeführt" : "Ausgeführt · Prüfung offen";
      resultStatus.textContent = result.phase === "done" ? "Verifiziert (Demo)" : result.failed ? "Rücklesen fehlgeschlagen" : pendingLabel;
      resultStatus.classList.toggle("uk-label-success", result.phase === "done");
      resultStatus.classList.toggle("uk-label-warning", Boolean(result.failed));
      let description;
      if (result.type === "replace") {
        description = item.replacement
          ? `Neuer Ersatz „${item.replacement.text}“ · ${matchLabels[item.replacement.match]} · pausiert. Noch keine Leistungsdaten.`
          : `Geplant: „${result.after.text}“ als pausierter Ersatz. Noch nicht angelegt.`;
      } else {
        description = result.phase === "pending"
          ? `Geplant: bestehendes Keyword ${statusLabel(result.after.status).toLocaleLowerCase("de")}. Noch nicht geändert.`
          : `Bestehendes Keyword ist ${statusLabel(item.original.status).toLocaleLowerCase("de")}. Es wurde kein Ersatz angelegt.`;
      }
      setText(`[data-result-description="${item.index}"]`, description);
      setText(`[data-result-original="${item.index}"]`, `Original „${item.original.text}“: ${statusLabel(item.original.status)}. Bisherige Leistungsdaten bleiben erhalten.`);
    }

    show("#ads-preview", Boolean(review?.length));
    const finished = review?.length && review.every((item) => item.phase === "done");
    setText("#ads-preview-heading", finished ? "Übernommene Änderungen" : started() ? "Änderungen und offene Schritte" : "Diese Änderungen sind vorgesehen");
    const apply = one("#ads-apply");
    apply.disabled = busy || wrongCampaign || !review?.length || started();
    apply.textContent = operation?.kind === "apply" ? "Übernahme läuft …" : finished ? "Bereits übernommen" : started() ? "Übernahme begonnen" : "In Demo übernehmen";
    show("#ads-result", entries.some((item) => item.result));
    const summary = resultSummary();
    setText("#ads-result-summary", summary);
    setText("#ads-assistant-result-text", summary);
    const retry = one("#ads-retry");
    retry.hidden = !partial();
    retry.disabled = busy || wrongCampaign;
  }

  function chooseKeyword(index, moveFocus = true) {
    if (operation || campaign !== "raffstores" || !entries[index]) return;
    selected = index;
    fillEditor();
    render();
    if (moveFocus) showMain("#keyword-editor-heading");
  }

  function cancel(message) {
    if (!operation) return;
    clearTimeout(timer);
    timer = null;
    operation = null;
    sequence += 1;
    stage = "paused";
    setText("#ads-paused-reason", message);
    setText("#ads-progress", message);
    render();
  }

  function changeCampaign(value) {
    if (!["raffstores", "markisen", "pergolen"].includes(value)) return;
    campaign = value;
    campaignPicker.value = value;
    if (campaign !== "raffstores" && operation) {
      cancel("Beim Kampagnenwechsel angehalten. Der Arbeitsstand gehört weiterhin zu Search | Raffstores. Bereits erfolgte Demo-Schritte bleiben erhalten.");
    }
    render();
  }

  function discardReview() {
    // A cancelled operation can have queued result rows without executing them.
    // Discard only those exact pending references; real demo effects stay visible.
    for (const change of review ?? []) {
      const entry = entries[change.index];
      if (change.phase === "pending" && entry.result === change) entry.result = null;
    }
    review = null;
  }

  function updateDraft(event) {
    if (operation || partial() || campaign !== "raffstores" || entries[selected].committed) return;
    const entry = entries[selected];
    if (event.target === fields.status && !isReplacement(entry)) {
      entry.existingStatus = fields.status.value;
    }
    for (const [name, field] of Object.entries(fields)) {
      field.setCustomValidity("");
      entry.draft[name] = field.value;
    }
    // PAUSED is mandatory for a replacement, not an implicit pause request for
    // the original when the user restores its text and match type.
    entry.draft.status = isReplacement(entry) ? "PAUSED" : entry.existingStatus;
    fields.status.value = entry.draft.status;
    entry.author = "Du";
    discardReview();
    setText("#ads-edit-status", "Deine Änderung gehört zum Arbeitsvorschlag. Öffne die Vorschau, bevor du sie in der Demo übernimmst.");
    render();
  }

  function previewChanges() {
    if (operation || partial() || campaign !== "raffstores") return;
    const changedEntries = entries.filter(changed);
    for (const entry of changedEntries) {
      const validText = entry.draft.text.trim().length > 0 && entry.draft.text.trim().length <= 120;
      if (!validText || !Object.hasOwn(matchLabels, entry.draft.match) || !["ENABLED", "PAUSED"].includes(entry.draft.status)) {
        chooseKeyword(entry.index, false);
        fields.text.setCustomValidity(validText ? "Bitte prüfe die Auswahl." : "Bitte gib einen Keyword-Text mit höchstens 120 Zeichen ein.");
        showMain("#keyword-editor-heading");
        form.reportValidity();
        return;
      }
    }
    discardReview();
    review = changedEntries.map((entry) => ({
      index: entry.index, type: isReplacement(entry) ? "replace" : "update",
      before: { ...entry.original },
      after: { ...entry.draft, text: entry.draft.text.trim(), status: isReplacement(entry) ? "PAUSED" : entry.draft.status },
      phase: "pending", failed: false
    }));
    render();
    if (review.length) showMain("#ads-preview-heading");
    else setText("#ads-edit-status", "Es gibt keine offenen Änderungen in deinem Arbeitsstand.");
  }

  function finishChange(change) {
    change.phase = "done";
    change.failed = false;
    entries[change.index].committed = true;
  }

  function applyStep(change) {
    const entry = entries[change.index];
    if (change.phase === "pending") {
      if (change.type === "replace") {
        // Existing IDs survive failed verification, cancellation and retries.
        if (!entry.replacement) entry.replacement = {
          id: `${entry.original.id}-replacement`, text: change.after.text,
          match: change.after.match, status: "PAUSED"
        };
        change.phase = "created";
      } else {
        entry.original.status = change.after.status;
        change.phase = "updated";
      }
      return;
    }
    if (change.phase === "created" || change.phase === "updated") {
      if (operation.failVerification) {
        operation.failVerification = false;
        one("#ads-outcome").value = "success";
        change.failed = true;
        operation = null;
        stage = "result";
        setText("#ads-progress", "Der Speicherschritt ist erfolgt, das simulierte Rücklesen ist fehlgeschlagen. Fortsetzen prüft dieselbe Ressource erneut.");
        return;
      }
      change.failed = false;
      if (change.type === "replace" && change.after.oldAction === "pause" && entry.original.status !== "PAUSED") change.phase = "verified";
      else finishChange(change);
      return;
    }
    if (change.phase === "verified") {
      entry.original.status = "PAUSED";
      change.phase = "paused";
      return;
    }
    if (change.phase === "paused") finishChange(change);
  }

  function queueStep(expected) {
    if (!operation || operation.sequence !== expected || campaign !== "raffstores") return;
    const next = review.find((item) => item.phase !== "done");
    if (!next) {
      operation = null;
      timer = null;
      stage = "result";
      setText("#ads-progress", "Die beauftragten Demo-Schritte sind abgeschlossen. Budgets und Kampagnenaktivierung bleiben unverändert.");
      render();
      return;
    }
    const label = next.phase === "pending" ? "Änderung ausführen" : "Ergebnis prüfen";
    setText("#ads-progress", `${label}: ${next.before.text} · simuliert`);
    timer = setTimeout(() => {
      if (!operation || operation.sequence !== expected || campaign !== "raffstores") return;
      timer = null;
      applyStep(next);
      render();
      if (operation) queueStep(expected);
    }, 420);
  }

  function applyReview(resume = false) {
    if (operation || campaign !== "raffstores" || !review?.length || !unfinished()) return;
    if (started() && !resume) return;
    operation = {
      kind: "apply", sequence: ++sequence,
      failVerification: !resume && one("#ads-outcome").value === "partial"
    };
    if (resume) one("#ads-outcome").value = "success";
    review.forEach((change) => {
      change.failed = false;
      entries[change.index].result = change;
    });
    stage = "running";
    render();
    queueStep(operation.sequence);
  }

  all("button[data-ads-open]").forEach((button) => button.addEventListener("click", () => openAssistant(button)));
  all("[data-ads-close]").forEach((button) => button.addEventListener("click", closeAssistant));
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !one(".uk-modal.uk-open")) {
      event.preventDefault();
      closeAssistant();
    }
  });
  campaignPicker.addEventListener("change", () => changeCampaign(campaignPicker.value));
  all("[data-ads-select-campaign]").forEach((link) => link.addEventListener("click", () => changeCampaign(link.dataset.adsSelectCampaign)));
  all("[data-ads-return]").forEach((button) => button.addEventListener("click", () => {
    changeCampaign("raffstores");
    focus(campaignPicker);
  }));
  picker.addEventListener("change", () => chooseKeyword(Number(picker.value), false));
  all("[data-keyword-select]").forEach((button) => button.addEventListener("click", () => chooseKeyword(Number(button.dataset.keywordSelect))));
  Object.values(fields).forEach((field) => field.addEventListener(field.tagName === "SELECT" ? "change" : "input", updateDraft));
  form.addEventListener("submit", (event) => { event.preventDefault(); previewChanges(); });
  one("#ads-apply").addEventListener("click", () => applyReview());
  one("#ads-retry").addEventListener("click", () => applyReview(true));
  all("[data-ads-cancel]").forEach((button) => button.addEventListener("click", () => {
    cancel("Angehalten. Deine Bearbeitungen bleiben erhalten. Bereits ausgeführte Demo-Schritte werden beim Fortsetzen nicht doppelt angelegt.");
  }));
  all("[data-ads-review]").forEach((button) => button.addEventListener("click", () => {
    if (campaign === "raffstores" && !operation) showMain("#keyword-editor-heading");
  }));
  all("[data-ads-show-result]").forEach((button) => button.addEventListener("click", () => showMain("#ads-result-heading")));

  one("#ads-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (operation || partial() || campaign !== "raffstores" || !ai.connected) return;
    task.setCustomValidity(task.value.trim() ? "" : "Bitte beschreibe deinen Auftrag.");
    if (!event.currentTarget.reportValidity()) return;
    setText("#ads-sent-task", task.value.trim());
    if (entries.every((entry) => entry.committed)) {
      stage = "result";
      setText("#ads-progress", "Dieser Demo-Auftrag ist bereits abgeschlossen. Die vorhandenen Ergebnisse bleiben erhalten.");
      render();
      showMain("#ads-result-heading");
      return;
    }
    operation = { kind: "analyse", sequence: ++sequence };
    const expected = operation.sequence;
    stage = "running";
    setText("#ads-progress", "Der vorbereitete Beispielablauf wird geladen. Bestehende Bearbeitungen bleiben erhalten.");
    render();
    timer = setTimeout(() => {
      if (!operation || operation.sequence !== expected || campaign !== "raffstores") return;
      timer = null;
      operation = null;
      let proposals = 0;
      for (const entry of entries) {
        if (entry.author === "Du" || entry.committed || entry.replacement) continue;
        entry.draft = { ...entry.suggestion, oldAction: "keep" };
        entry.existingStatus = entry.suggestion.status;
        if (isReplacement(entry)) entry.draft.status = "PAUSED";
        entry.author = "KI-Vorschlag (Demo)";
        proposals += 1;
      }
      discardReview();
      stage = "prepared";
      fillEditor();
      setText("#ads-progress", proposals
        ? "Beispielvorschläge vorbereitet. Deine Bearbeitungen bleiben erhalten; die Analyse hat keine Ads-Ressource geändert."
        : "Deine Bearbeitungen bleiben unverändert im gemeinsamen Arbeitsstand. Die Analyse hat keine Ads-Ressource geändert.");
      setText("#ads-edit-status", "Der gemeinsame Arbeitsstand enthält vorbereitete Vorschläge. Du kannst jeden Wert ändern und anschließend die Unterschiede ansehen.");
      render();
    }, 650);
  });
  task.addEventListener("input", () => task.setCustomValidity(""));
  globalThis.addEventListener("pagehide", () => cancel("Beim Verlassen der Seite angehalten. Bereits erfolgte Demo-Schritte bleiben in dieser geöffneten Vorschau nachvollziehbar."));

  fillEditor();
  render();
  aiConnections?.subscribe((next) => {
    if (operation?.kind === "analyse" && (!next.connected || next.provider !== ai.provider)) {
      cancel("Der KI-Zugang hat sich geändert. Der Demo-Auftrag wurde angehalten; dein Arbeitsstand bleibt erhalten.");
    }
    ai = next;
    render();
  });
  return { onCampaignChange: changeCampaign };
}
