# Technischer Schnitt und Portierungsplan

## Prototyp

```text
widget/ui.js + ui.css      kleine Free-My-TV-Adaption, Fokus und Diagnose
        │
widget/tv-orsay.js         Common.API.Widget, TVKeyValue, Lifecycle
widget/player.js           SAMSUNG-INFOLINK-PLAYER, benannte globale Callbacks
        │
Gerät: $MANAGER_WIDGET      Samsung-Bibliotheken bleiben auf dem Fernseher

tools/build.py             Offline-ZIP + widgetlist.xml + Browser-Vorschau
tools/serve.py             lokaler HTTP-/Range-Server und POST /log
tools/make_sample.py       einmalig eigenes H.264/AAC-Testmaterial erzeugen
```

Keine Tizen- oder webOS-Funktionen im Orsay-Adapter. Kein automatischer App-Scan
und kein erfundener erfolgreicher App-Start im Browser. Fehler, fehlende APIs
und Anfragen zum Verlassen sind sichtbar. Auf dem Bildschirm ist der Log auf sechs
Einträge begrenzt, die Tastencodeanzeige auf zwölf. Zusätzlich schreibt der
Installationsserver bereinigte Ereignisse nach `artifacts/tv-log.jsonl`.
`LabLog` puffert auch Fehler vor der Konfiguration und sendet sie anschließend
asynchron an die beim Build gesetzte Logadresse. Es gibt nur einen Versandpfad,
auch für `window.onerror`. Transportfehler erzeugen keine weiteren Logereignisse.
Konfiguration wird nur beim Build eingelesen; der Fernseher braucht noch keine
Bildschirmtastatur. Daher sind keine Credentials oder Tokens implementiert.

Die zusätzliche SEF-/Legacy-AVPlay-Diagnose prüft vorhandene Methoden, ohne einen
zweiten Player zu öffnen oder Ressourcen anzufordern. Der vorhandene
INFOLINK-Wiedergabepfad bleibt der Gerätetest. Der fokussierte Anchor verarbeitet
Tasten direkt und stoppt deren Weiterleitung an den Document-Handler; dieser
bleibt als Fallback für andere Eventziele erhalten.

Native Player-Callbacks werden als globale Namen registriert, wie im
Legacy-Referenzclient [S9]. Jeder Start erhält eigene Namen nach dem Muster
`LabPlayer.session<id>_<name>`. Stop deaktiviert die Sitzung vor dem nativen
Stop-Aufruf. Alte Namen bleiben bis zum Schließen des Widgets als leere
Funktionen erhalten, damit verzögerte Aufrufe weder die nächste Wiedergabe
stoppen noch fehlende Funktionen aufrufen. Die alten Sitzungsobjekte werden
dabei freigegeben. Auch HTML5-Ereignisse und Play-Ablehnungen sind an ihre
Sitzung gebunden. Die Auflösung dieser Namen durch die TV-Firmware bleibt
Teil des Gerätetests.

Methodenaufrufe können fehlschlagen oder keine
eindeutigen Rückgabewerte liefern; Erfolg wird erst durch die TV-Beobachtung
festgestellt. Nach 20 s ohne steigende, endliche Wiedergabezeit gibt es einen
Timeout. Gleiche, rückläufige oder ungültige Zeitwerte und reine Pufferereignisse
verlängern die Frist nicht. Stop/Return,
Unload und Pause räumen den gestarteten Player auf. Die UI und HTML-Hintergründe
werden für die Videoebene transparent. Deren Koordinaten bleiben konfigurierbar.

## Tatsächlich übernommene Free-My-TV-UI

`web/home.js`: fit-Skalierung und setClass-Helfer.
`web/home.css`: verkleinerte .tile/.word/Fokus-Gestaltung.
Quelle, Abrufdatum und SHA256 der gelesenen Originaldateien stehen unter
`research/`, die MIT-Lizenz ist auch im installierbaren Widget enthalten.

Die komplette home.js verwendet zusätzlich Prefs, Data, I18N, Wetter, Bilder,
mehrere Apps, Eingänge und Einstellungen. Ein pauschales Kopieren würde diese
Abhängigkeiten samt nicht geprüftem Plattformverhalten übernehmen. Deshalb ist
hier zunächst nur ein kleiner Teil portiert; es wird kein vollständiger
Free-My-TV-Port behauptet. `web/tv.js` bleibt als untersuchte Quelle erhalten,
wird jedoch nicht in das Orsay-Widget geladen.

## Nach erfolgreichem Gerätetest

1. Tatsächlichen Viewport, Keycodes und Player-Koordinaten im Adapter festhalten.
   Erst bei Bedarf SDK-5.1-spezifische API-Alternativen ergänzen.
2. Vorhandene Plex-/YouTube-Apps mit Versionen inventarisieren. Ein dokumentierter
   Orsay-App-Aufruf ist ein eigenes Gerätetestziel. Tizen-IDs nicht übertragen.
3. Wenn Plex-Altclient scheitert: minimale Bibliotheksliste für den bestehenden
   PMS, Authentifizierung und Tokenverwaltung entwerfen; Secret-Handling erst
   vor diesem Ausbau hinzufügen. Eine passende Datei direkt wiedergeben,
   Fehler bei inkompatiblen Formaten sichtbar anzeigen; nicht automatisch
   Video-Transcoding auf dem Pi erzwingen.
4. Erst danach mehr von der Free-My-TV-Ablage und den Einstellungen portieren;
   nur Plex und YouTube als Dienstziele. Keine Wetter-/TMDB-/Krypto-Abhängigkeiten.
5. Autostart und Ersatz des Smart Hubs separat untersuchen, ohne sie für
   Installation, Bedienung oder Wiedergabe vorauszusetzen.

Die native Gesamtlösung bleibt von funktionierendem YouTube abhängig. Wenn der
Dienst auf dem Gerät nicht mehr nutzbar ist, kann eine schönere Oberfläche diese
Grenze nicht aufheben. HDMI bleibt die bereits vorgesehene Ausweichlösung.
