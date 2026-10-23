# Review: samsung-orsay-lab

Oct 23, 2026 · @Niklas Wecker

## Gesamteindruck

Der Code ist solide, aber auf Browser-Korrektheit optimiert statt auf maximalen Informationsgewinn pro TV-Durchlauf. Genau diese Durchläufe sind teuer: neu bauen, synchronisieren, am Gerät ablesen.

Geprüft am Stand von [Auda29/samsung-orsay-lab](https://github.com/Auda29/samsung-orsay-lab) (Commit 86bf3cb): 4 von 4 Python-Unittests und 13 von 13 Player-Tests bestehen. Der Playwright-Browsertest wurde nicht ausgeführt.

Stark sind die ES5-Disziplin, der deterministische Build, die Player-Sessions mit eindeutigen Callback-Namen und die ehrliche Dokumentation der Grenzen.

## Vor dem ersten TV-Test ändern

Fünf Änderungen, sortiert nach Nutzen für den ersten Gerätetest. Punkt 1 und 2 sparen am meisten Durchläufe.

1. **Mehrere Player-APIs in einem Durchlauf prüfen.** `player.js` nutzt nur das ältere `SAMSUNG-INFOLINK-PLAYER`-Plugin. Die eigene Recherche (`research/evidence/samsung-legacy-api.md`) nennt dagegen `webapis.avplay` als Media-API der Legacy-Plattform.
   - `$MANAGER_WIDGET/Common/webapi/1.0/webapis.js` zusätzlich laden.
   - In der Diagnose drei Pfade abfragen: INFOLINK-PLAYER, SEF-Plugin (`clsid:SAMSUNG-INFOLINK-SEF`) und `webapis.avplay`.
2. **Log-Rückkanal zum Installationsserver.** Log (6 Zeilen) und Tastencodes (12 Einträge) sind nur am TV-Bildschirm ablesbar.
   - `serve.py` um einen `POST /log`-Endpoint erweitern.
   - `LabLog.add`, `diagnostics()` und `window.onerror` senden per XHR dorthin. Das bleibt im eigenen LAN und ist keine Telemetrie.
3. **Port-Defaults vereinheitlichen.** `build.py` nutzt standardmäßig Port 80, `serve.py` Port 8080, das Makefile 8080. Ohne explizite Ports passen URLs und Server nicht zusammen.
   - `serve.py` liest den Port aus `dist/widgetlist.xml` und warnt bei Abweichung von `--bind`/`--port`.
4. **`tests/browser.py` darf `dist/` nicht überschreiben.** Der Test ruft `build("127.0.0.1", port)` ohne `output` auf und zerstört so einen LAN-Build.
   - `build()` unterstützt `output=` bereits: ein `tempfile.TemporaryDirectory()` übergeben.
5. **Eine Versionsquelle, pro TV-Build hochzählen.** Die Version steht dreifach: `VERSION` in `build.py` (ungenutzt), hartkodierter `ZIP_NAME`, `<ver>` in `config.xml`. Laut Community-Berichten ersetzt Smart Hub ein Widget mit gleicher ID und Version beim Resync nicht immer.
   - Version aus einer Quelle ableiten, z. B. mit `--build-number`.

## Kleinere Punkte

Vier Punkte mit wenig Aufwand, die im Zweifel ebenfalls Durchläufe sparen.

| Stelle | Befund | Vorschlag |
| --- | --- | --- |
| `tv-orsay.js` `block()` | `widget.blockNavigation()` wird ohne Argument aufgerufen; Samsung-Beispiele übergeben das Event. Wirft es, verdrängt "blockNavigation FEHLER" bei jedem Tastendruck echte Fehler aus dem 6-Zeilen-Log. | Event durchreichen. |
| `index.html` / `ui.js` | Key-Handler hängt an `document`; Samsung-Samples nutzen `onkeydown` direkt am fokussierten Anchor (`href="javascript:void(0);"`). | Zusätzlich am Anchor registrieren. |
| `player.js` | `InitPlayer`/`StartPlayback` prüfen nur `false` und `0`; manche Plugin-Methoden liefern `-1` bei Fehlern. | Rohwert immer mitloggen. |
| README, TV-UI | README liest sich wie ein Sitzungsprotokoll ("Cloud-Instanz", "deinem TV"). Viele Disclaimer auf dem TV-Bildschirm überdecken die Messwerte. | Protokoll nach `VALIDATION.md`, UI-Texte kürzen. |

## Zur Zielsetzung

Für den ersten Gerätetest (Installation, Tasten, lokales MP4) ist das Repo fast bereit. Für Plex und YouTube im Alltag ist ein Streaming-Stick am HDMI realistisch die Lösung.

`FEASIBILITY.md` gewichtet das Risiko richtig: Plex und YouTube scheitern eher an TLS, Anmeldung und Dienst-API als an UI oder Decoder. Das Projekt lohnt sich daher vor allem, wenn die Plattform selbst das Ziel ist.

Nächster Schritt: Punkte 1 bis 4 umsetzen, dann den ersten TV-Durchlauf fahren.
