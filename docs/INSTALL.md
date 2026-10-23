# Build und Installation

## 1. Vorbereitung am Fernseher

Noch nichts zurücksetzen. Im normalen Menü unter Unterstützung / Samsung
kontaktieren / Softwareinformationen Modell und Firmware notieren; unter
Netzwerk die TV-IP ermitteln. Menünamen hängen vom Firmwarestand ab.
Vorhandene Plex-/YouTube-App-Version und deren heutige Funktion erfassen.
Vor einem Sync vorhandene Community-Widgets notieren: bei manchen alten
Smart-Hub-Versionen kann eine Synchronisierung vorherige Benutzer-Apps ersetzen.

PC oder vorhandener Pi und TV müssen im selben erreichbaren Heimnetz sein.
Gastnetz-/Client-Isolation darf die Verbindung nicht blockieren. Verwende die
IPv4 des **Installationsservers**, nicht die des Fernsehers. Für die Beispiele
ist dies `192.168.1.20`; überall durch die tatsächliche Adresse ersetzen.

Für die Installation das Projekt auf einem Rechner im Heimnetz ausführen.
Weder Tizen Studio noch ein alter SDK-Download ist nötig.

## 2. Reproduzierbarer Build

Python 3.10+ genügt. Zuerst im Projektordner:

```bash
python3 tools/build.py --host 192.168.1.20 --port 80 --build-number 1
python3 tools/make_sample.py
```

FFmpeg mit libx264 wird nur für den zweiten Befehl gebraucht. Die Generierung
ist eine einmalige Offline-Konvertierung, keine Lastannahme für den Plex-Pi.
Das Testvideo besteht aus eigenem bewegtem Testmuster und 440-Hz-Ton.

Ergebnis:

```text
dist/widgetlist.xml
dist/OrsayLab_0.1.1_Europe.zip
dist/SHA256SUMS
dist/preview/index.html
media/test.mp4
```

Die ZIP enthält config.xml, widget.info und index.html direkt im Root, keine
zusätzliche Verzeichnisebene. Der Build verwendet eine feste Widget-ID
`OrsayLab`, feste Dateizeiten und sortierte ZIP-Einträge. Gleiche Eingaben bei
gleicher Python-/zlib-Version ergeben identische ZIP-Bytes. Eine andere Server-IP
oder lokale Konfiguration ändert die Prüfsumme erwartungsgemäß.
Das erzeugte Testvideo ist kein Bestandteil der ZIP und muss erreichbar bleiben.

Die Versionsquelle ist `<ver>` in `widget/config.xml`. `--build-number N` ersetzt
ausdrücklich die letzte der drei Versionskomponenten, hier `0.1.1`. Für den nächsten
TV-Stand beispielsweise `--build-number 2` verwenden. Ohne diese Option bleibt
die Quellversion erhalten. Es gibt keinen automatischen Zähler und kein aktuelles
Datum im ZIP-Namen. ZIP, Paketmanifest, TV-Kopfzeile, Diagnose und Log verwenden
dieselbe Version. Nach dem Sync diese Kennung am TV kontrollieren.

Optional für den Netztest zum bestehenden Plex-Server eine ignorierte Datei
`local.json` anlegen, beispielsweise nur:

```json
{"plexBaseUrl": "http://192.168.1.30:32400"}
```

Dann `python3 tools/build.py --host 192.168.1.20 --port 80 --build-number 1 --config local.json`.
Nicht gesetzte Felder behalten die automatisch erzeugten Test-/Probe-URLs.
`local.example.json` zeigt alle unterstützten Schlüssel. Leere Felder
überschreiben Defaults ausdrücklich. Medien-/Probe-URLs und Player-Koordinaten
können so geändert werden; danach neu bauen und synchronisieren.
Keine Tokens, Passwörter oder Plex-Login-Daten eintragen. Der Builder lehnt
unbekannte Schlüssel, URL-Benutzerdaten, Query und Fragment ab.
HTTP zum PMS ist eine optionale LAN-Diagnose; keine globale Lockerung der
Plex-Serveranmeldung oder TLS-Einstellungen ist erforderlich.

## 3. Lokalen HTTP-Server starten

Das alte TV-IP-Menü akzeptiert üblicherweise nur eine IP, deshalb muss
`/widgetlist.xml` über **Port 80** erreichbar sein [S5,S11]. Ein anderer Port ist
für die Browservorschau möglich, aber nicht als Installationsweg zugesichert.

```bash
python3 tools/serve.py --bind 192.168.1.20 --port 80
```

Build und Server verwenden ohne `--port` beide 8080 für die Vorschau. Der Server
prüft die Downloadadresse aus `dist/widgetlist.xml` und warnt bei abweichendem
Port oder Bind-Host. `--bind 0.0.0.0` ist eine gültige Bindung für alle IPv4-Adressen
und erzeugt keine Hostwarnung. Die im Build angegebene LAN-IP muss trotzdem stimmen.

Falls das Betriebssystem Port 80 nur mit erhöhten Rechten erlaubt, kann unter
Linux/macOS ausschließlich dieser Standardbibliothek-Server so gestartet werden:

```bash
sudo python3 tools/serve.py --bind 192.168.1.20 --port 80
```

Wenn Port 80 belegt ist, einen anderen Installationsrechner oder den vorhandenen
lokalen Webserver mit passender Auslieferung verwenden. Bestehende Dienste nicht
ungeprüft stoppen. Bei einem anderen Webserver müssen `/widgetlist.xml`, die ZIP,
`/health.txt` und das Video unter den generierten URLs erreichbar sein; für Video
Content-Length, video/mp4 und Byte-Range/206 unterstützen.
Für den Log-Rückkanal zusätzlich `POST /log` an den Python-Server weiterleiten
oder denselben Empfangsvertrag implementieren.
Unter Windows den Server ggf. durch die lokale Firewall im privaten Netz zulassen.
Es ist keine Router-Portfreigabe nötig.

Von einem **zweiten Gerät im selben Heimnetz** prüfen:

```text
http://192.168.1.20/widgetlist.xml
http://192.168.1.20/health.txt
http://192.168.1.20/media/test.mp4
http://192.168.1.20/preview/index.html
```

widgetlist.xml muss die aktuelle ZIP-Adresse und tatsächliche ZIP-Größe zeigen.
Ein reiner PC-Selbsttest beweist die Erreichbarkeit vom TV nicht.

### Diagnose vom TV empfangen

Der Builder setzt die Logadresse unabhängig von einer angepassten Probe-URL
auf `http://<Build-Host>:<Build-Port>/log`. Der laufende Server schreibt jede
empfangene Ereignisgruppe als JSON-Zeile nach `artifacts/tv-log.jsonl`, mit
Empfangszeit, Client-IP und Buildversion. Die Datei liegt außerhalb von `dist`.
Unter PowerShell lässt sie sich live lesen:

```powershell
Get-Content artifacts/tv-log.jsonl -Wait
```

Erfasst werden Startdiagnose, Diagnoseaufrufe, rohe Tastencodes, Player-Startwerte
und die Einträge des sichtbaren Logs einschließlich `window.onerror`. URLs und
bekannte Zugangsdatenmuster werden vor dem Versand und beim Empfang bereinigt.
API-Prüfungen zeigen nur vorhandene Schnittstellen; SEF und AVPlay werden weder
geöffnet noch zur Wiedergabe verwendet.

Der Versand erfolgt asynchron in kleinen Gruppen mit maximal 64 gepufferten
Ereignissen. Fehlgeschlagene Gruppen werden verworfen, ohne rekursive Fehlerlogs
oder automatische Wiederholung. Bei vielen Ereignissen werden die ältesten
gepufferten Einträge verdrängt; beim Schließen können noch ausstehende Einträge
verloren gehen. Der Bildschirm-Log bleibt verfügbar. Der Server begrenzt POSTs auf
32 KiB. Für den Gerätetest weiterhin Bild und Ton direkt beurteilen.

## 4. Auf dem TV synchronisieren — Gerätetest, noch nicht bestätigt

Quellengrundlage: Community-Anleitung für H und ausgewählte J/K [S5] sowie der
archivierte Installer [S3]. J4570 ist in diesen Installationsberichten nicht
explizit verifiziert. Zuerst den H/J-Menüweg versuchen:

1. Menü → Smart Hub → Samsung-Konto → Anmelden. Das spezielle lokale
   Entwicklerkonto heißt `develop`. Je nach Modell wird kein Passwort verlangt;
   die Referenz nennt sonst `000000`. Das ist kein persönliches Samsung-Passwort.
2. Smart Hub → Samsung Apps / Meine Apps vollständig öffnen.
3. Eine installierte App markieren und OK/Enter einige Sekunden halten.
4. Falls vorhanden: **IP Setting / Server-IP einstellen** wählen und die
   Server-IP `192.168.1.20` eintragen.
5. Erneut OK halten → **Start User App Sync / Benutzeranwendungen
   synchronisieren**. Serverlog beobachten.
6. „Orsay Lab“ in Meine Apps suchen und öffnen. Bei Bedarf Smart Hub verlassen
   und erneut öffnen. Ergebnis und exakten Menüpfad protokollieren.

Andere Orsay-Oberflächen haben Tools → Einstellungen → Entwicklung → Server-IP
und Benutzeranwendungen synchronisieren. Der RED/BLUE-Menüweg aus [S3] betrifft
andere Orsay-Versionen und ist keine gesicherte J4570-Anleitung.
Keine Tizen-„12345“-Anleitung auf Verdacht anwenden.

Fehlen Konto, IP-Einstellung oder Sync: Firmware und sichtbare Menüs erfassen
und dort stoppen. Kein Service-Menü, kein Werksreset und kein Firmware-Downgrade
als Standardlösung. Es werden keine Änderungen am Firmwareimage benötigt.

## 5. Eingrenzen anhand des Serverlogs

| Beobachtung | Nächster Schritt |
| --- | --- |
| Kein GET auf widgetlist.xml | LAN-IP, Port 80, Firewall, develop-Login und Sync-Menü prüfen |
| XML geladen, ZIP nicht geladen | Downloadadresse, Port, Widgetliste und ZIP-Name prüfen |
| ZIP geladen, App fehlt | TV-Fehlermeldung erfassen; Paket-/Firmwareverträglichkeit offen |
| App startet und bleibt leer | Bildschirmfoto und API-/JS-Fehler erfassen; Legacy-WebKit nicht durch Chromium bewiesen |
| Navigation fehlt | Diagnose-Tastencodes, Key-Anchor-Fokus und TVKeyValue prüfen |
| Video schwarz | UI-Alpha/Videoebene, Pluginereignisse, Range-Requests und Codec getrennt prüfen |
| Video ohne Ton | Lautstärke/Ausgang und AAC-Spur prüfen; Callback ist kein Tonnachweis |
| XHR status 0 | CORS/TLS/Netzwerk nicht unterscheidbar; Serverlog und lokales HTTP vergleichen |

Nach Installation kann der Server beendet werden; die lokale Oberfläche liegt
im Widget. Für den Testfilm und Netzproben muss er laufen. Zum Aktualisieren mit
derselben ID neu bauen und erneut synchronisieren. Zum Entfernen Orsay Lab über
die normale App-Verwaltung löschen und den Server mit Ctrl-C beenden.
