# Ads-Keywords und gemeinsame Untersuchungen

Stand: 30.10.2026 · nächster bestätigter UX-Teilumfang von [Harika #541](https://github.com/cemfirat/harika/issues/541)

## Auftrag und Produktgrenze

Cem hat nach der veröffentlichten Website-Arbeitsfläche den nächsten Schritt
bestätigt: „perfekt, mach so weiter“. Der angenommene Plan nennt die
Ads-Keyword-Bearbeitung und einen Ablauf für verbindungsübergreifende
Auffälligkeiten. Beide ergänzen die gemeinsame Arbeitszentrale für Menschen
und unterstützte KI; Grundlage bleibt der [Funktionskatalog](https://github.com/cemfirat/harika/blob/813ac040ddc3b3c30a888a233160f1890125ee53/docs/ai-assistant-capabilities.md).

Dieser Schritt erweitert ausschließlich den bestehenden HTML-/UIkit-Clickdummy.
Er implementiert keine produktiven Google-, WordPress- oder Modelladapter.
Konto, Property, Website, Keywords, Kennzahlen und Antworten sind fiktive
Beispiele. Alle Arbeitsstände existieren nur im geöffneten Dokument. Neuladen
oder Wechsel zu einer anderen HTML-Seite setzt die jeweilige Vorschau zurück.

## Ads: direkt oder gemeinsam Keywords überarbeiten

Einstieg: `ads.html#keywords`.

Die bestehende Kampagnenübersicht bleibt erreichbar. Der neue Arbeitsbereich
ist an das Beispielkonto, **Search | Raffstores** und die zugehörige
Anzeigengruppe gebunden. Andere Kampagnen sind kein stillschweigender neuer
Ausführungsbereich.

1. Ein bestehendes Keyword auswählen und Text, Match Type oder die konkret
   angebotene Statusaktion direkt bearbeiten. Ein KI-Zugang ist dafür unnötig.
2. Optional den persönlichen Demo-KI-Zugang verbinden und einen vorbereiteten
   Vorschlag nutzen. Menschliche Eingaben bleiben bei erneutem Aufruf erhalten.
3. Die konkrete Vorschau zeigt Original, gewünschten Arbeitsstand und die
   betroffenen Aktionen. Eine Analyse oder Vorschau ändert keine Ressource.
4. Erst **In Demo übernehmen** führt die ausgewählten Beispielaktionen aus.
5. Ergebnis und Verlauf zeigen Original und gegebenenfalls Ersatz getrennt.

### Fachliche Entscheidungen

- Text-/Match-Type-Änderungen werden als neue Keyword-Ressource dargestellt.
  Google dokumentiert das Keyword-Feld des AdGroupCriterion als unveränderlich.
  Auch die Google-Ads-Oberfläche behandelt entsprechende Änderungen als
  Ersatz mit eigener Historie. [API](https://developers.google.com/google-ads/api/reference/rpc/v26/AdGroupCriterion),
  [Google-Ads-Hilfe](https://support.google.com/google-ads/answer/7477082?hl=en).
- Harikas hier gewähltes Vorbereitungsmodell legt den Ersatz **pausiert** an.
  Das Original behält standardmäßig seinen aktuellen Status. Das ist eine
  bewusste Produktentscheidung und keine Behauptung über Googles Standard-UI.
- Eine optional ausdrücklich gewählte Pause des Originals muss in der
  Vorschau stehen. Sie wird nicht durch eine Analyse oder reine Ersatzanlage
  implizit autorisiert. Neue Keywords werden in diesem Ablauf nie aktiviert.
- Alte Leistungsdaten bleiben beim Original. Der neue Ersatz zeigt keine
  geerbten Klicks oder behauptete Leistungsverbesserung.
- Ein bereits angelegter Ersatz mit noch offener Ergebnisprüfung bleibt
  sichtbar. Wiederholen prüft dieselbe lokale Demo-Ressource und legt keinen
  weiteren Ersatz an. Dies ist kein Nachweis produktiver API-Idempotenz.
- Kampagnenwechsel und Abbruch beenden laufende Simulationen. Eingaben,
  vorhandene Ressourcen und bereits abgeschlossene Schritte bleiben erhalten.

## Übersicht: einen Befund über mehrere Quellen untersuchen

Einstieg: `index.html#auffaelligkeiten`.

Die Untersuchung ist auf die fiktive kanonische Landingpage
`https://www.beispiel.example/raffstores/` begrenzt. Google Ads, GA4 und Search
Console zeigen jeweils ihre eigene Kennzahl und Zuordnung. Frühere generische
Dashboard-Werte und die gemischte Conversion-Summe werden durch diesen konkret
lesbaren Untersuchungsfall ersetzt.

### Zwei nachvollziehbare Fälle

| Fall | Sichtbarer Befund | Nächster sinnvoller Schritt |
| --- | --- | --- |
| Abweichung zwischen Quellen | Ads-Klicks fast stabil, deutlich weniger erfasste GA4-Sitzungen mit passender Landingpage/Quelle, organische Klicks fast stabil | Messung, Weiterleitung und Zuordnung prüfen; Ursache bleibt offen |
| GA4-Daten fehlen | Aktueller GA4-Zeitraum fehlt; kein Prozentwert und kein angenommener Nullwert | Datenzugang und Verarbeitung klären; Verlauf noch nicht beurteilbar |

Die Beispielzeiträume sind 12.–25.10.2026 und 28.09.–11.10.2026: jeweils
14 vollständige Tage mit identischer Wochentagsverteilung. Der Demo-Datenstand
ist ausdrücklich auf 29.10.2026 festgelegt. Das ist ein Szenario, kein Abruf
realer Messdaten und keine Behauptung statistischer Signifikanz.

Ads-Klicks und GA4-Sitzungen messen unterschiedliche Vorgänge. Stabile
Klicks bei weniger Sitzungen beweisen keinen Trackingfehler. Tagging,
Einwilligung, Weiterleitungen und Zuordnung sind prüfbare Hypothesen, keine
festgestellten Ursachen. [Google: Unterschiede zwischen Klicks und Sitzungen](https://support.google.com/google-ads/answer/14452452?hl=en).

Das Quellenpanel nennt Website, Konto/Property, Dimensionen, Zeiträume und
Zeitzonen. Search-Console-Datum und lokale Ads-/GA4-Tage werden nicht als
exakt gleiche Tagesgrenzen ausgegeben ([Search-Analytics-API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)). Die Beispielwerte werden weder
summiert noch als ein gemeinsamer Conversion- oder Erfolgsscore dargestellt.
In produktiver Nutzung muss die tatsächliche Datenreife geprüft werden;
Kalendertage allein reichen nicht, denn Daten können nachverarbeitet werden.
[Google: Datenaktualität](https://support.google.com/analytics/answer/11198161?hl=en).

### Gemeinsamer Arbeitsplan und getrennte Ergebnisse

Menschen können den Prüfplan direkt selbst erstellen, ohne KI-Zugang. Der
Assistent kann einen Beispielplan vorbereiten; danach bearbeiten beide Wege
denselben Titel und dieselben Prüfschritte. Ein erneuter Assistentenaufruf
überschreibt menschliche Texte nicht.

**Plan speichern** dokumentiert den Arbeitsstand, führt aber keine Prüfung
oder Änderung aus. Erst **Ausgewählte Schritte simulieren** verarbeitet die
konkret gewählten Schritte:

- **Messprüfung:** vorbereiteter Demo-Prüfbericht mit weiterhin offenen
  Live-Checks. Ein fehlendes Testereignis wird nicht als erfolgreich geprüft
  ausgegeben.
- **Landingpage-Entwurf:** eigener, optionaler Inhaltsentwurf. Kein
  nachgewiesener Messfehler wird dadurch als repariert erklärt. Der Entwurf
  wird nicht veröffentlicht und erzeugt keine gemessene Verbesserung.

Im Datenlückenfall gibt es keine daraus abgeleitete Inhaltsempfehlung. Die
simulierte Erneuerung des GA4-Zugangs erzeugt keine Messwerte. Jeder Fall hält
seinen eigenen Plan und seine Ergebnisse; der Wechsel hält laufende Schritte
an und zeigt ausschließlich die Ergebnisse des ausgewählten Falls.

Ein simulierter Entwurfsfehler lässt einen vorhandenen Prüfbericht und einen
eventuell älteren Entwurf bestehen. Wiederholen betrifft nur den fehlgeschlagenen
Entwurfsschritt. Ergebnisansichten bleiben von ungespeicherten Änderungen im
Editor unterscheidbar. Eine spätere Wirkungsmessung wird ausdrücklich als noch
offen geführt.

## Gemeinsame Bedienung und technische Zuordnung

| Datei | Aufgabe |
| --- | --- |
| `ads.html` | Kampagnen, Keyword-Bearbeitung, Vorschau, Ergebnis und Assistent als direktes HTML |
| `index.html` | Quellen, Fälle, Arbeitsplan, Prüfergebnisse und Assistent als direktes HTML |
| `src/ads-workspace.js` | Ausschließlich lokale Keyword-Demo-Zustände |
| `src/insight-workspace.js` | Ausschließlich lokale Untersuchungs-/Entwurfszustände |
| `src/ai-connections.js` | Gemeinsame dokumentlokale Verbindungsvorschau und modale Fokusführung |
| `src/website-assistant.js` | Bestehender Beitragsablauf verwendet den gemeinsamen Verbindungsdialog |
| `src/styles/product.less` | Zusammensetzung von Facharbeit und Assistent sowie mobile Ansicht |

Die neue gemeinsame Verbindungsvorschau erfasst keine Zugangsdaten, speichert
keine Identitäten und erweitert keine Berechtigungen. Sie ist keine Änderung
an der produktiven Harika-Authentifizierung. Alle drei neuen Verhaltensmodule
sind für die Übernahme in Harika ausdrücklich als prototype-only klassifiziert.

Die UI bleibt im bestehenden Light-/Dark-UIkit-Design. Auf breiten Ansichten
stehen Facharbeit und Assistent nebeneinander; auf schmalen Ansichten wechselt
die Arbeitsfläche. Struktur und Beispielinhalte bleiben im HTML. JavaScript
erzeugt kein Seiten-Markup und sendet keine Provider-Anfragen.

## Abnahme

Vor einem PR: unabhängiger Fach-/Code-Review, reale Browserbedienung,
`npm run verify`, `npm run transfer:status` und grüne Branch-CI auf dem exakten
Candidate-SHA. Nach Merge wird die Pages-Veröffentlichung und die öffentliche
Vorschau separat geprüft. Die tatsächlichen Nachweise stehen im zugehörigen PR.

Browserfälle umfassen direkte Bedienung ohne KI, gemeinsames Bearbeiten,
konkrete Vorschau, getrennte Alt-/Neu-Daten, Abbruch, Kontextwechsel,
Teilfehler/Wiederholung, Datenlücken, unveränderte menschliche Texte,
Hell/Dunkel, mobile Darstellung, Fokusführung und die Regression des bereits
veröffentlichten Website-Beitragsablaufs.

Der Gesamtauftrag #541 bleibt offen. Produktive Adapter, echte Modellzugänge,
Ressourcenrechte, belastbare Untersuchungen und reale Ergebnis-/Wirkungsprüfung
benötigen jeweils eigene Implementierung und Abnahme.

### Lokaler Prüfnachweis vom 30.10.2026

- Architektur-/Theme-Prüfung und alle vier Builds erfolgreich: Standard,
  Harika, AMBRA und Pages.
- Unabhängiger fachlicher Code-Review abgeschlossen; die dabei gefundenen
  Status-/Abbruch-/Validierungsfälle sind korrigiert und im Browser nachgeprüft.
- Zwölf gezielte Chromium-Browserfälle einschließlich der Nachprüfungen
  erfolgreich: direkte Ads-Arbeit, persönliche Demo-Verbindung, gemeinsame
  Textbearbeitung, pausierter Ersatz, getrennte Historie, Teilfehler/Retry,
  Abbruch, Kontextwechsel, Untersuchungsplan, Datenlücke und Entwurfsvalidierung.
- Hell/Dunkel, 390-px-Ansicht ohne Seitenüberlauf, sichtbarer Fokus beim Öffnen
  aus tiefen Editoren sowie beim Zurückkehren und im gemeinsamen KI-Dialog
  geprüft. UI-Labor und vorhandener Website-Beitragsablauf ebenfalls geprüft.
- Keine JavaScript-/Console-Fehler oder Provider-Aufrufe im abschließend
  geprüften Zustand. Die tatsächlichen Maßnahmen sind weiterhin Simulationen.
- Chromium-Nachweis; kein zusätzlicher Safari-/WebKit-Nachweis.

GitHub-Candidate, erfolgreiche CI-Läufe, Merge und Pages-Veröffentlichung
werden mit exakten SHAs im zugehörigen Pull Request nachgewiesen.
