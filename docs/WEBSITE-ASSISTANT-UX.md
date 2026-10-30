# Website-Arbeitsfläche: gemeinsam mit KI

Stand: 30.10.2026 · Teilumfang von [Harika #541](https://github.com/cemfirat/harika/issues/541)

## Produktentscheidung und Umfang

Cem hat den nächsten UX-/UI-Schritt bestätigt: die bestehende Website-Arbeitsfläche um kontextbezogene KI-Arbeit, einen persönlichen KI-Zugang und das gemeinsame Erstellen/Bearbeiten von Beiträgen erweitern. Grundlage ist der angenommene [Funktions- und Abnahmekatalog](https://github.com/cemfirat/harika/blob/813ac040ddc3b3c30a888a233160f1890125ee53/docs/ai-assistant-capabilities.md). Diese Produktdokumentation liegt auf einem Core-Arbeitsbranch; sie ist kein Implementierungs- oder Produktivnachweis.

Diese erste klickbare Umsetzung umfasst die **Hauptwebsite des fiktiven Beispielkunden**. Sie zeigt menschliche Direktbearbeitung und den Wechsel zum Assistenten am selben Arbeitsstand.

## Ablauf ausprobieren

Einstieg: `websites.html#beitraege` bzw. `websites.html#assistent`.

1. **Beiträge** öffnen und **Mit KI vorbereiten** wählen.
2. Unter **KI-Verbindung einrichten** einen persönlichen Demo-Zugang verbinden. Der Auftragstext bleibt erhalten.
3. **Auftrag starten** lädt drei vorbereitete Beispielbeiträge.
4. Einen Beitrag auswählen und Titel, Kurzbeschreibung oder Inhalt direkt bearbeiten.
5. **KI um Rückmeldung bitten** bezieht sich auf den aktuellen bearbeiteten Titel; die Rückmeldung ist ausdrücklich ein vorbereiteter Demotext.
6. Einzelne oder alle Beiträge als Demo-Entwürfe speichern.
7. Ergebnis öffnen, weiterbearbeiten und den Status ungespeicherter Änderungen prüfen.

Alternativ lässt sich mit **Beitrag selbst schreiben** ein einzelner Beitrag ohne KI-Zugang bearbeiten und simuliert speichern.

Im Befund **Search-Daten fehlen noch** führt die primäre Aktion direkt zur Property-Zuordnung. Ein simulierter Verbindungsstatus erzeugt keine Messwerte. Die bisherige Prompt-/Kopierfunktion bleibt ergänzend erreichbar.

## Arbeitskontext und Layout

Der Assistent bleibt an die Hauptwebsite gebunden. Bei einem Wechsel auf Magazin/Staging zeigt er den abweichenden Kontext, unterbricht noch nicht ausgeführte Simulationen und bietet die Rückkehr zur Hauptwebsite an. Bereits bearbeitete Inhalte bleiben erhalten. Auf den anderen Websites werden keine Beiträge im Hintergrund angelegt.

Auf breiten Ansichten stehen Facharbeit und Assistent nebeneinander. Die Website-Auswahl bleibt über einen kompakten Selector verfügbar. Auf schmalen Ansichten erhält der Assistent eine eigene Arbeitsansicht; **Beiträge bearbeiten** führt zum Editor zurück.

Die Hauptnavigation, vollständigen Hell-/Dunkel-Themes und UIkit-Primitiven bleiben die Grundlage. Die persönliche Verbindung ist über **Mein Konto** sowie aus dem Assistenten erreichbar. Organisationsweite Verbindungen sind weiter Bestandteil von #541; diese Vorschau zeigt den persönlichen Weg.

## Ergebnis- und Fehlerzustände

- Fehlender KI-Zugang, vorbereitete Vorschläge, laufender Schritt und angehaltener Auftrag.
- Einzeln gespeicherte Entwürfe und noch ungespeicherte menschliche Änderungen.
- Teilfehler mit gezielter Wiederholung und stabilen lokalen Demo-Objekten.
- Kontextwechsel während eines laufenden Schritts ohne verspätetes Speichern.
- Search-Console-Zuordnung ohne erfundene Search-Daten.

Unter **Demo-Ablauf testen** lässt sich ein Speicherfehler im letzten betroffenen Beitrag auslösen. Erfolgreiche Ergebnisse bleiben bestehen; **Fehlgeschlagenen Entwurf erneut speichern** wiederholt nur den fehlgeschlagenen Schritt.

## Prototypgrenze

Die Antworttexte und Vorschläge sind vorbereitete Beispiele. Freie Eingaben werden angezeigt, aber von keinem echten Modell verarbeitet. Verbindungen und Entwürfe existieren nur im Arbeitsspeicher des geöffneten Dokuments; Neuladen setzt die Vorschau zurück.

Es gibt keine Zugangsdatenfelder, Provideranmeldungen, Modellanfragen oder WordPress-Schreibzugriffe. „Entwurf (Demo)“ ist kein echtes WordPress-Objekt. SEO-/Builder-/Wirkungsprüfungen werden nicht als ausgeführt dargestellt. Dies ist keine vollständige Ads-/Analytics-/Rank-Math-/YOOtheme-Implementierung.

## Technische Zuordnung

| Datei | Rolle |
| --- | --- |
| `websites.html` | Direkt editierbares Seiten-HTML einschließlich Beiträge, Assistent und Search-Setup |
| `partials/ai-connections-modal.html` | Gemeinsam verwendete persönliche Verbindungsvorschau |
| `partials/profile-modal.html` | Einstieg unter Mein Konto |
| `src/app.js` | Gemeinsame Navigation und Website-Auswahl; Integration des Verhaltensmoduls |
| `src/website-assistant.js` | Ausschließlich lokale Demo-Zustände und vorhandene HTML-Elemente |
| `src/styles/product.less` | Zusammensetzung, responsive Arbeitsflächen und Abstände |

Das Verhaltensmodul erzeugt kein Seiten-Markup. Felder, Vorschläge und Ergebniszeilen stehen im HTML. Es ist in der Transferklassifikation ausdrücklich **prototype-only**: Bedienentscheidungen können übernommen werden; die simulierte Ausführung darf nicht in produktive Fachlogik kopiert werden.

## Abnahme und nächste Schritte

Vor PR gelten `npm run verify`, `npm run transfer:status`, echte Browserbedienung in beiden Erscheinungen und auf schmalen Ansichten sowie grüne Branch-CI auf dem exakten Candidate-SHA.

Im Browser sind insbesondere Zugangswechsel, bearbeiteter Text, Speichern/Teilfehler/Wiederholung, Abbruch, Website-Wechsel, Fokusführung und Überlauf zu prüfen. Testumgebung und etwaige nicht verfügbare Browser werden beim konkreten Prüfnachweis angegeben.

Der Gesamtauftrag #541 bleibt offen. Nächste fachliche Abläufe sind Ads-Keywords und verbindungsübergreifende Auffälligkeiten. Produktionsanbindung, echte Modell-/Nutzerdelegation, serverseitige Ausführung, Verlauf und fachliche Ergebnisprüfung benötigen eigene Implementierung und Abnahme.

### Lokaler Prüfnachweis vom 30.10.2026

- `npm run verify` erfolgreich: bestehende Architektur-/Theme-Prüfungen sowie Standard-, Harika-, AMBRA- und Pages-Builds.
- Unabhängiger Code-Review und `git diff --check` erfolgreich.
- Acht echte Browserfälle mit Chromium 141.0.7390.37 / Playwright 1.56.1 erfolgreich: gemeinsamer Beitragsablauf, Teilfehler/Wiederholung, Abbruch, Kontextwechsel, manuelle Bearbeitung, Search-Setup, mobile Darstellung und Tastatur-/Modalverhalten.
- Hell/Dunkel anhand tatsächlich geladener Stylesheets und gerenderter Oberflächen geprüft. Mobile Ansicht mit 390 px Breite ohne horizontalen Seitenüberlauf.
- Sichtbarer Fokus nach Assistent-/Modal-Schließen und Tab-/Shift-Tab-Begrenzung im KI-Dialog geprüft; persönliche Verbindung auch außerhalb der Website-Seite erreichbar.
- WebKit konnte wegen fehlender Hostbibliotheken in dieser Umgebung nicht gestartet werden; daraus wird kein bestandener Safari-/WebKit-Nachweis abgeleitet.

Die GitHub-Prüfung und eine Veröffentlichung der Vorschau werden über den zugehörigen PR mit exaktem Commit nachgewiesen. Diese lokalen Tests verwenden ausschließlich fiktive Daten und keine produktiven API-Aufrufe.
