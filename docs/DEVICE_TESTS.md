# Nächste Gerätetests

**Bisher auf dem Fernseher bestätigt: nichts.** Alle folgenden Schritte erfolgen
erst vor Ort. Keine persönlichen Kontodaten oder Tokens im Ergebnisbericht teilen.

## Benötigte Informationen

- Vollständiger Modellcode vom Typenschild oder normalen Support-Menü.
- Firmware-/Softwareversion; bisherige Updates nur notieren, zunächst nichts ändern.
- Foto oder Abschrift der Smart-Hub-/Samsung-Konto-/Meine-Apps-Menüs: develop,
  IP Setting und User App Sync vorhanden? Genaue Fehlermeldung bei fehlenden Optionen.
- TV-IP, Server-IP und Verbindung per LAN/WLAN; Gastnetz oder Client-Isolation?
- Fernbedienungstyp und vorhandene Return-/Exit-/Farbtasten.
- Installierte Plex-/YouTube-Versionen und Funktion **vor** der Synchronisierung.
- Pi-Modell, Plex-Media-Server-Version und Eigenschaften einer Testdatei
  (Container, Video-/Audiocodec, Profil, Auflösung, Bitrate, Untertitel).

## Kurze Reihenfolge mit Abbruchkriterien

1. **Installation:** LAN-Build nach INSTALL.md erzeugen, auf Port 80 ausliefern,
   develop/Sync versuchen. Server-GETs auf XML und ZIP, TV-Meldung und sichtbares
   Orsay-Lab-Icon erfassen. Sichtbare Buildversion mit dem erzeugten Paket vergleichen.
   Ohne Installation noch keine UI-Portierung erweitern.
2. **Start und Tasten:** Orsay Lab öffnen. Pfeile in beide Richtungen, OK,
   Return aus einer Unterseite, Return auf der Startseite und Exit prüfen.
   Diagnose zeigt die letzten rohen Tastencodes. Erwartete Legacy-Codes:
   links 4, rechts 5, hoch 29460, runter 29461, OK 29443, Return 88, Exit 45.
   Tatsächliche TVKeyValue-Werte haben ebenfalls Gültigkeit. Auswahl darf pro
   Tastendruck nur einmal wechseln. Return intern darf die App nicht schließen.
   Diagnose öffnen, INFOLINK-/SEF-/AVPlay-Erkennung notieren und eingehende
   Ereignisse in `artifacts/tv-log.jsonl` prüfen. API-Erkennung ist kein Playertest.
3. **Lokales Video:** Server mit media/test.mp4 laufen lassen. „Testvideo“
   wählen. Bewegtes Muster **sehen**, 440-Hz-Ton **hören**, mindestens 20 s laufen
   lassen, per Return stoppen, zweimal erneut starten, Exit während Wiedergabe.
   Zeit-Callback oder „Start angefordert“ allein ist kein Erfolg. Bei schwarz:
   Player-Ebene/Alpha und Netzwerk prüfen; bei Stille Audio separat untersuchen.
4. **Plex am vorhandenen Server:** Bestehende App aus Smart Hub öffnen. Passende
   MP4-Datei ohne Untertitel abspielen. Plex-Dashboard muss zunächst **Direct
   Play** zeigen. Bild, Ton, Dauer und Pi-Last notieren. Login/TLS, Bibliothek,
   Wiedergabe und Seek getrennt bewerten. `/identity` aus dem Prototyp ist nur
   ein Netztest, keine Anmeldung oder Clientfunktion.
5. **YouTube:** Bestehende App aus Smart Hub öffnen. Ein gewöhnliches Video ohne
   Anmeldung testen, dann bestehende Anmeldung. Fehlermeldungen exakt erfassen.
   Eine YouTube-Startseite zählt nicht als funktionierende Videowiedergabe.

Erst nach diesen Ergebnissen UI ausbauen. Für eine belastbare Alltagsfreigabe
später einen längeren Film, Pause/Seek/Resume, Untertitel und Neustarts prüfen.

## Ausfüllbares Protokoll

| Test / Information | Ergebnis vor Ort |
| --- | --- |
| Datum, Modell, Firmware | offen |
| TV-IP / Installationsserver-IP | offen; ggf. im öffentlichen Bericht kürzen |
| Menüweg, develop und Sync | offen |
| widgetlist.xml / ZIP im Serverlog | offen |
| Widget gestartet / sichtbarer API-Modus | offen |
| Buildversion am TV / Logempfang HTTP 204 | offen |
| INFOLINK / SEF / Legacy-AVPlay erkannt | offen |
| Viewport / Panel / Player-Ebene | offen |
| Links/rechts/hoch/runter/OK: rohe Codes | offen |
| Return Unterseite / Return Start / Exit | offen |
| MP4: sichtbares Bild / hörbarer Ton | offen / offen |
| MP4: 20 s stabil / Stop / wiederholter Start | offen |
| Playerfehler / Callback / HTTP-Status | offen |
| Plex-Version / PMS-Version / Pi-Modell | offen |
| Plex-Anmeldung / Bibliothek / Bild / Ton | offen |
| Plex: Direct Play / Direct Stream / Transcode | offen |
| YouTube-Version / anonym / angemeldet | offen |
| Entscheidung: native Fortsetzung / offene Blocker / HDMI | offen |
