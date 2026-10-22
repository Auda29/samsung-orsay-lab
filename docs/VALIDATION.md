# Lokaler Prüfbericht

Stand: 2026-10-22. Keine Verbindung zu TV oder Heimnetz, kein echter Plex-Server
abgerufen. Die Samsung-Modellzuordnung ist aus Dokumentation bestätigt; das ist
kein Laufzeitnachweis auf dem Gerät.

## Ausgeführt

Umgebung: Python 3.12.14, Playwright 1.62.0, Chromium 154.0.8037.57, FFmpeg.
Eine `.venv` wurde mit Zugriff auf vorinstallierte Systempakete angelegt.
Shell-Netzwerkzugriffe über den vorgegebenen Proxy waren nicht möglich; Quellen
wurden über Firecrawl und den GitHub-Connector gelesen. Der Build selbst arbeitet
offline. Lokale HTTP-/Browsertests liefen mit erlaubten Netzwerk-Sockets.

| Prüfung | Ergebnis und Aussagegrenze |
| --- | --- |
| Python-Unittests: 4 | Bestanden: ZIP-Struktur, Lizenzdateien, XML, Größe, identische ZIP-Bytes bei identischen Eingaben; Konfigurationsschutz; HTTP Range/HEAD/416; CORS/Probe/404. Keine formale Samsung-SDK-Zertifizierung. |
| Reales Chromium: gebaute Vorschau | Bestanden: Pfeile/Enter/Escape, Legacy-Codes, Fokus, Diagnose, Netzprobe HTTP 200 und Return/Exit-Anforderung im Browser. |
| Viewports | 960×540, 1280×720, 1366×768: Bühne bleibt im sichtbaren Fenster. Screenshot bei 1366×768 visuell geprüft. Kein Overscan-Test am TV. |
| Reale Browser-Medienwiedergabe | Erzeugtes MP4 über lokalen Range-Server geladen; HTML5 currentTime läuft vorwärts. Headless: kein manuell bestätigter Tonnachweis, kein Orsay-Decoder-Test. |
| Simulierte Orsay-APIs | Bestanden: Ready, native InitPlayer → SetDisplayArea → StartPlayback, Callback, Stop, Return, Exit. Fehlende native API ergibt sichtbaren Fehler und keinen stillen HTML5-Fallback. Mocks sind keine Hardwareemulation. |
| JS-Laufzeitfehler | Keine pageerror-Ereignisse in den erfolgreichen Browserprüfungen. |
| Testdatei mit ffprobe | 30,000 s; H.264 Constrained Baseline L3.1, 1280×720, 25 fps, yuv420p; AAC-LC, 2 Kanäle; 7.266.045 Bytes beim hier erzeugten Exemplar. |

Quellcode ist im ES5-Stil gehalten (var, Funktionen, keine Module, Klassen,
async/await oder Promise-Erzeugung), ohne Frameworks und externe Assets.
Es wurde kein formaler ES5-Parser und kein Legacy-WebKit ausgeführt. Chromium
akzeptiert auch moderne Sprachfeatures; diese Prüfung ersetzt daher keine
Kompatibilitätsprüfung auf Orsay.

Die Browservorschau entfernt nur die geräteeigenen `$MANAGER_WIDGET`-Script-Tags;
die eigentliche Widget-ZIP behält sie. Die native Integrationsprüfung setzt
explizite Mock-Objekte vor dem Laden der App.

## Nachprüfung der Playerkorrekturen unter Windows

Am 2026-10-22 mit Python 3.11.9 und Node.js 22.15.0 erneut geprüft:

- Alle vier Python-Unittests bestehen.
- 13 Player-Regressionstests mit virtueller Uhr und expliziten Native-/HTML5-Mocks
  bestehen. Abgedeckt sind Stillstand trotz wiederholter Zeit-Callbacks,
  ungültige/rückläufige Werte, echter Fortschritt unterhalb einer Sekunde,
  verspätete Ereignisse nach Stop/Neustart, rekursive Stop-Ereignisse,
  synchrone Startfehler, fehlende APIs, Start-Ablehnungen und Wiedergabeende.
- Die Mocktests sind ohne Browser und ohne Zusatzpakete über
  `node --test tests/player.test.cjs` ausführbar. Node.js ist nur eine
  Entwicklungsabhängigkeit; Build und Installationsserver bleiben bei Python.
- Der Browsertest besteht mit Playwright 1.62.0 und Chromium 151.0.7922.34
  in einer lokalen `.venv`. Das neu erzeugte Testvideo wird tatsächlich über
  HTML5 abgespielt. Navigation, Netzprobe, Viewports und der simulierte
  Orsay-Lifecycle bestehen ebenfalls, einschließlich Neustart mit einem
  verspäteten Ende-Callback der vorherigen Sitzung. Kein TV-/Tonnachweis.

## Noch nicht ausgeführt

- Installation, Menüs, Firmwareverträglichkeit und SDK-5.1-Laufzeit auf UE32J4570.
- Echte Fernbedienung, Defaultnavigation, App-Verlassen und Fokus nach Rückkehr.
- Legacy-Plugin-Callbacks, Videoebene, hörbarer Ton, Wiederholungsstarts und Langlauf.
- PMS-Authentifizierung, Direct Play realer Bibliotheksmedien und Pi-Last.
- Start / Funktion / Anmeldung der vorhandenen Plex- und YouTube-Apps.
- TLS-Versionen, Zertifikatsspeicher, Codecgrenzen und Dienstkompatibilität des TV.

## Wiederholen

```bash
python3 tools/make_sample.py
python3 -m unittest discover -s tests -v
node --test tests/player.test.cjs
python3 tests/browser.py
```

Das Video ist Voraussetzung für den Wiedergabeteil; ohne Datei meldet der
Browsertest diesen Abschnitt als übersprungen. Erzeugte Screenshots liegen unter
`artifacts/`. Der Browsertest baut auf einen temporären Port; danach für die
Heimnetzinstallation zwingend mit tatsächlicher Server-IP und Port 80 neu bauen.
