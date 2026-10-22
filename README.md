# Samsung UE32J4570 · Orsay Lab

Eine isolierte Entwicklungsumgebung und ein erster Diagnose-Prototyp für den
Samsung UE32J4570SSXZG. **Orsay / Samsung Legacy Platform, kein Tizen.**

Die Oberfläche ist lokal geprüft. Die ZIP-Paketierung folgt dem dokumentierten
Orsay-Widgetformat; **die Installation auf diesem Fernseher ist noch nicht
bestätigt**. Plex und YouTube sind Prüfpunkte, noch keine integrierten Clients.
Es wurde keine Verbindung zu deinem TV oder Plex-Server hergestellt.

## Einstieg

Im vorhandenen Workspace liegt das Projekt unter `/workspace/samsung-orsay-lab`.
Eine lokale `.venv` mit Python 3.12.14 wurde eingerichtet. Die vorhandene
Cloud-Instanz wurde weiterverwendet; es wurde keine zweite Cloud-Instanz angelegt.
Die `.venv` nutzt hier vorhandene Systempakete für Browserprüfungen.

Build und Installationsserver benötigen nur Python 3.10+ und dessen
Standardbibliothek. Auf einem eigenen Rechner:

```bash
cd samsung-orsay-lab
python3 -m venv .venv
# Linux/macOS; Windows: .venv\Scripts\activate
. .venv/bin/activate
python3 tools/build.py --host 127.0.0.1 --port 8080
python3 tools/serve.py --bind 127.0.0.1 --port 8080
```

Im Browser `http://127.0.0.1:8080/preview/index.html` öffnen. Pfeile, Enter,
Escape/Backspace und F9 (= simulierter Exit) bedienen die Vorschau.
Das Verzeichnis wird absichtlich nicht als Dateiliste angezeigt.

Für das eigene 30-Sekunden-Testvideo einmal `python3 tools/make_sample.py`
ausführen. Dafür wird FFmpeg mit libx264 benötigt; es wird nichts heruntergeladen.
Das Video liegt außerhalb des Widgets unter `media/test.mp4` und wird separat
vom Installationsserver ausgeliefert. Eine Datei wurde hier bereits erzeugt.

**Vor einem TV-Test mit der LAN-IP des Installationsrechners neu bauen.** Die
beigelegte ZIP verwendet Loopback für lokale Tests. Genaue Schritte, Port 80 und
die unterschiedlichen Smart-Hub-Menüs stehen in [INSTALL.md](docs/INSTALL.md).
Die Cloud-IP ist für einen Fernseher im Heimnetz kein Ersatz für diese LAN-IP.

## Was enthalten ist

- Native Orsay-Anbindung für Ready, Tasten, Return und Exit in `widget/tv-orsay.js`.
- Lokaler Player-Test über das Legacy-Player-Plugin; HTML5 nur in der Vorschau.
- Diagnose mit User-Agent, Viewport, API-Erkennung, Tastencodes und Fehlerlog.
- Kleiner UI-Ausschnitt aus Free My TV mit vollständigem MIT-Hinweis.
- Deterministischer Offline-Build, `widgetlist.xml`, ZIP und SHA256-Prüfsumme.
- HTTP-Server mit CORS-Probe und Byte-Range-Unterstützung für das Testvideo.

Kein Root, kein Firmwarewechsel, kein neuer Medienserver, kein Autostart und
kein Ersatz des Smart Hubs. Zugangsdaten werden weder benötigt noch mitgebaut.
`local.json`, Medien, Buildausgaben und die virtuelle Umgebung sind ignoriert.

## Dokumentation und Tests

| Datei | Inhalt |
| --- | --- |
| [Machbarkeit](docs/FEASIBILITY.md) | Quellenbewertung, Plattform, Plex, YouTube und Grenzen |
| [Installation](docs/INSTALL.md) | Reproduzierbarer Build und Installation im Heimnetz |
| [Gerätetests](docs/DEVICE_TESTS.md) | Benötigte Angaben, kurze Testfolge und Protokoll |
| [Prüfbericht](docs/VALIDATION.md) | Lokal geprüft / simuliert / auf dem TV offen |
| [Quellen](docs/SOURCES.md) | Gelesene Quellen und relevante Fundstellen |
| [Architektur](docs/ARCHITECTURE.md) | Portierungsgrenze und nächste Implementierungsschritte |
| [Lizenzen](THIRD_PARTY_NOTICES.md) | Übernommene UI-Bestandteile und Referenzen |

```bash
python3 -m unittest discover -s tests -v
# Player-Regressionstests mit Node.js 18+; keine npm-Pakete nötig
node --test tests/player.test.cjs
# Optional: pip install -r requirements-dev.txt
# Chromium installieren oder: python3 -m playwright install chromium
python3 tests/browser.py
```

Browserprüfungen verwenden vorhandenes Chromium, sonst Playwrights Chromium.
Sie prüfen die gebaute Vorschau und simulieren Orsay-APIs in einem getrennten
Browserkontext. Sie sind kein Orsay-Emulator. Der Browsertest erzeugt `dist` neu
mit einem temporären Port; vor einem TV-Test deshalb den LAN-Build wiederholen.

Die nächste Entscheidung fällt am Gerät: **Lässt sich das Widget installieren,
funktioniert die Fernbedienung und zeigt das lokale Video Bild plus Ton?** Erst
danach lohnt sich ein umfangreicherer Launcher oder Plex-Client.
