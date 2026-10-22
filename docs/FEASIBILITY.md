# Machbarkeit · Stand 2026-10-22

## Einschätzung

**Ein schlankes Orsay-Widget ist ein sinnvoller Versuchsweg. Ein zuverlässiger
Plex-/YouTube-Ersatz direkt auf diesem TV ist noch nicht nachgewiesen.**
Die Installation ohne Firmwareänderung ist als Community-Verfahren dokumentiert,
aber vom konkreten Firmwarestand und verfügbaren Smart-Hub-Menüs abhängig.
Die drei ersten Freigabekriterien sind Installation, Fernbedienung und tatsächliche
Videowiedergabe. Kein Gerätetest wurde bisher durchgeführt.

| Teilziel | Beleg / Einschätzung | Offene Bestätigung |
| --- | --- | --- |
| Plattform | Samsung führt UJ4570 in 15TV_ENTRY, Legacy Platform, SDK 5.1 [S1] | Vollständiges Modell und Firmware am Gerät |
| Eigene Widgets | ZIP mit config.xml, widget.info und index.html; lokales HTTP + widgetlist.xml [S3–S5] | develop-Anmeldung, Sync-Menü, Installation auf UE32J4570 |
| Fernbedienung | Legacy Widget API und TVKeyValue; Codes aus Samsung-Implementierung [S6–S8] | Physische Tasten, Fokus, Return/Exit auf diesem TV |
| Lokales Video | Legacy Player Plugin dokumentiert; passende Referenzimplementierung [S6,S9] | Bild, Ton, Streamereignisse, Stop und Stabilität |
| Plex | Aktuelle offizielle Samsung-App: Tizen ab 2016 [S10]. Historischer Orca-Client als Kandidat [S11,S12] | Vorhandene Version, Login, heutiger PMS, Direct Play |
| YouTube | Keine belastbare modellspezifische Zusage in gelesenen Quellen [S13,S14] | Vorhandene App, anonyme Wiedergabe, Login |
| UI-Port | ES5 und kleine CSS-Helfer wiederverwendbar; bestehender Samsung-Adapter ist Tizen [S2] | Altes WebKit, Performance, Overscan |

Die Panelauflösung 1366×768 stammt aus dem Handoff und wurde hier nicht am
Gerät gemessen. Panelauflösung, Widget-Viewport und Player-Koordinaten können
verschieden sein. Deshalb misst die Diagnose den Viewport. Die UI arbeitet auf
1280×720 und skaliert; die Legacy-Videoebene beginnt bei 960×540 gemäß [S9].
Diese Annahmen sind am TV zu prüfen, keine zugesicherte Decoder-Spezifikation.

## Plattform und Installation

Nicht alle 2015er Samsung-TVs laufen mit Tizen. Die offizielle Zuordnung
`UJ4570 → 15TV_ENTRY → Samsung Legacy Platform → TV SDK 5.1` ist eindeutig
[S1]. Das komplette Suffix `SSXZG` wird dort nicht einzeln aufgeführt.

Samsung erklärt ausdrücklich, dass Legacy-config.xml und widget.info nicht mit
Tizen kompatibel sind. Ebenso unterscheiden sich Widget-Lifecycle, Tasten und
Player [S6]. Ein Tizen-WGT, SDB, TizenBrew oder die Tizen-Anleitung „Apps, 12345“
sind daher nicht der hier vorbereitete Installationsweg.

Der Referenzinstaller [S3] ist archiviert / EOL. Gelesen wurden dessen
Paketierung und Servercode [S4], keine Installer-Binary ausgeführt. Unser eigener
kleiner Packager erzeugt dieselbe Grundstruktur: stabile Widget-ID, ZIP-Größe in
Bytes, absolute HTTP-Downloadadresse. Die Community-Anleitung [S5] beschreibt
für H und ausgewählte J/K-Modelle develop-Login, langes OK auf einer App, IP Setting
und Start User App Sync. **J4570 wird dort nicht explizit als getestetes Modell
genannt.** Das macht den TV-Test notwendig.

Eine Firmwareänderung, ein Service-Menü, Root oder ein Smart-Hub-Reset sind keine
Voraussetzung. Fehlen die Menüs, wird zunächst der Ist-Zustand dokumentiert.
USB-Installation ist wegen modellabhängiger Unterschiede kein zugesicherter
Ausweichweg. Der Installationsserver muss aus dem TV-LAN erreichbar sein.

## Wiedergabe: getrennte Risiken

| Ebene | Bewertung und erster Test |
| --- | --- |
| Codec / Container | Eigenes MP4 mit H.264 Constrained Baseline, Level 3.1, 8-bit yuv420p, 1280×720/25 und AAC-LC Stereo. Konservativer Test, keine Hardwarezusage. Danach reale Plex-Dateien nach Codec, Profil, Level, Audio, Untertiteln und Bitrate einzeln testen. HEVC, AV1, DTS oder komplexe Untertitel sind nicht als unterstützt vorausgesetzt. |
| Netzwerk | Installation, XHR-Netzprobe und nativer Player sind verschiedene Pfade. Lokales HTTP, korrekte MIME-Typen, Content-Length und Range/206 zuerst testen. HTTP 200 auf /identity belegt nur Erreichbarkeit; XHR status 0 kann CORS, TLS oder Netzwerk bedeuten. LAN-Durchsatz getrennt von Decoderleistung betrachten. |
| TLS / Zertifikate | Legacy-Clients können an TLS-Version, Cipher Suites, SNI oder Root-Zertifikaten scheitern. proxy4plex nennt TLS bis 1.1 für E/F/H [S11]; daraus folgt keine gemessene J4570-Grenze. Plex dokumentiert Zertifikatsgrenzen für viele Samsung-Geräte [S10]. Ein lokales HTTP-Testvideo umgeht TLS nur für diesen Test. TLS-Prüfung wird nirgends abgeschaltet. |
| Dienst / Auth | plex.tv-Login, heutiger PMS, Tokenverwendung und YouTube-Playeranforderungen sind vom Decoder unabhängig. Ein abspielbares MP4 repariert keine Anmeldung, keine abgeschaltete App und keine veraltete Dienst-API. |

### Plex

1. Bereits installierte Plex-App vor Änderungen öffnen: Version, anonyme/offline
   erreichbare Bibliothek, Login und Wiedergabe einer passenden Datei notieren.
2. Historischer Kandidat ist **Orcas Samsung Plex-App 2.014**. proxy4plex [S11]
   beschreibt Paket, Netzwerk-Sideloading und einen TLS-Proxy für ältere E/F/H.
   Der Plex-Forumthread [S12] zeigt tatsächliche Login- und Installationsprobleme.
   Das sind historische Community-Quellen, keine aktuelle Freigabe für den J4570.
   Paketverfügbarkeit, Herkunft, Nutzungsrecht und heutige Serverkompatibilität
   wurden nicht verifiziert; die Binary wurde weder heruntergeladen noch verteilt.
3. Falls nur TLS für die Steuerung scheitert, kann ein begrenzter LAN-Vermittler
   untersucht werden. Er wäre kein neuer Plex-Server und keine Transcodinglösung.
   proxy4plex wird hier nicht installiert oder als notwendige Abhängigkeit gesetzt.
4. Falls der alte Client unbrauchbar ist, ist ein eigener kleiner ES5-Plex-Client
   technisch plausibel: geschützte Serververbindung, Bibliotheksmetadaten,
   Auswahl genau einer passenden Mediendatei, Direct Play über Orsay Player,
   später Resume/Seek. Das erfordert zusätzliche Implementierung und Gerätetests.

Die Plex-Kachel dieses Prototyps zeigt diese Prüfreihenfolge und kann optional
`/identity` am **bereits vorhandenen** PMS abrufen. Sie liest keine Bibliothek,
speichert keinen Token und startet keine vorhandene App. Der Free-My-TV-Code
verwendet hierfür `tizen.application.getAppsInfo/launch` [S2]. Ein funktionierender
Orsay-Aufrufweg und verlässliche IDs der vorhandenen Plex-/YouTube-Widgets wurden
in der untersuchten Dokumentation nicht bestätigt. Daher gibt es keine geratenen
App-IDs oder behauptete App-Startfunktion.

Jellyfin/Emby-Orsay-Code [S3,S9] belegt das technische Player-/Widgetmuster,
ersetzt jedoch keinen Plex-Client und verlangt ein anderes Serverprotokoll.
Der aktuelle Community-Plex-Client samsucks setzt Tizen voraus [S15]. Diese
Projekte sind deshalb keine direkt verwendbaren Plex-Orsay-Lösungen.

Der Raspberry Pi wird ausschließlich als vorhandener PMS betrachtet. Der erste
Plex-Test muss im Dashboard **Direct Play** anzeigen. Direct Stream (Remux) ist
getrennt zu messen; Audio-Transcoding und Video-Transcoding ebenfalls. Ein Pi kann
je nach Modell, Material und Untertiteln überfordert sein. Falls Video-Transcoding
notwendig wird, zunächst eine vorab konvertierte Kopie testen; keine beliebige
Echtzeitkonvertierung versprechen und keine Servereinstellungen automatisch ändern.

### YouTube

Zuerst vorhandene App im Smart Hub starten, ohne Login und dann mit bestehender
Anmeldung testen. Die allgemeine YouTube-Hilfe nennt außer Betrieb genommene
Geräte und geänderte Sicherheitsanforderungen [S13], aber keine eindeutige Aussage
für den UE32J4570. Eine pauschale Behauptung „geht“ oder „geht nicht“ wäre unbelegt.

Ein eigener dünner Web-Client löst das Kernproblem nicht automatisch. Die
offizielle IFrame Player API setzt einen eingebetteten YouTube-Player und HTML5
postMessage voraus [S14]; daraus folgt keine Kompatibilität mit diesem alten
WebKit oder dessen TLS/Video-Fähigkeiten. Das ist keine API zum Einspeisen einer
beliebigen YouTube-Seitenadresse in InitPlayer. Stream-Extraktion / externe
Resolver wären ein eigenes, wartungsintensives Projekt und sind hier nicht
implementiert. Ein verlässlich funktionierender aktueller Orsay-YouTube-Client
wurde in den genannten Quellen nicht nachgewiesen; das ist keine vollständige
Bestandsaufnahme aller Community-Projekte.

## Entscheidung nach den ersten Tests

- **Widget lässt sich nicht installieren:** Menü/Firmware/Netzweg prüfen; keine
  UI-Weiterentwicklung bis zur Klärung. HDMI bleibt ohne OS-Eingriff verfügbar.
- **Widget + Tasten + lokales MP4 funktionieren:** Plex-Direct-Play mit dem
  bestehenden Client prüfen; bei Bedarf kleinen eigenen Plex-Client bauen.
- **YouTube-Dienst scheitert:** Native Gesamtlösung erfüllt das Ziel noch nicht,
  auch wenn Plex funktioniert. HDMI-Ausweichlösung sachlich bewerten.
- **Beide Dienste funktionieren:** Erst dann den Free-My-TV-Launcher erweitern.
  Autostart und Smart-Hub-Ersatz bleiben eine spätere, getrennte Untersuchung.
