# Gelesene Quellen

Abrufdatum: 2026-10-22. Offizielle Dokumentation und Community-Beobachtungen
werden getrennt bewertet. Nicht gelesene Folge-Downloads gelten nicht als geprüft.

| ID | Quelle | Relevante Feststellung |
| --- | --- | --- |
| S1 | [Samsung TV Model Groups](https://developer.samsung.com/smarttv/develop/specifications/tv-model-groups.html) | 2015, 15TV_ENTRY, UJ4570, Samsung Legacy Platform, TV SDK 5.1. Samsung nennt hier die Modellfamilie, nicht das volle regionale Suffix. |
| S2 | [Free My TV](https://github.com/simbasjungles/free-my-tv), [tv.js](https://github.com/simbasjungles/free-my-tv/blob/main/web/tv.js), [home.js](https://github.com/simbasjungles/free-my-tv/blob/main/web/home.js), [home.css](https://github.com/simbasjungles/free-my-tv/blob/main/web/home.css), [MIT](https://github.com/simbasjungles/free-my-tv/blob/main/LICENSE) | ES5-Weboberfläche, Tizen-Erkennung über window.tizen.application, getAppsInfo/launch, Return 10009. Kein vorhandener Orsay-Adapter. README nennt Tizen 3+ ab 2017. |
| S3 | [Jellyfin-Orsay-Installer](https://github.com/Apps2Samsung/Jellyfin-Orsay-Installer) | EOL/archiviert. Widget packen, lokaler Server, develop/IP/Sync. Nur Referenz, keine getestete Installation auf J4570. |
| S4 | [OrsayPackager.cs](https://github.com/Apps2Samsung/Jellyfin-Orsay-Installer/blob/master/Jellyfin-Orsay-Installer/Services/OrsayPackager.cs), [KestrelOrsayServer.cs](https://github.com/Apps2Samsung/Jellyfin-Orsay-Installer/blob/master/Jellyfin-Orsay-Installer/Services/KestrelOrsayServer.cs) | rsp stat=ok, list/widget, compression size/type, absolute download-URL, HTTP-Auslieferung. Eigenes Tool verwendet diese Struktur ohne .NET-Abhängigkeit. |
| S5 | [Emby Orsay Community Install Instructions](https://emby.media/community/topic/9869-samsung-orsay-smarttv-2011-2015-community-app-install-instructions/) | H und ausgewählte J/K: develop, langes Enter auf App, IP Setting, User App Sync. Eigener HTTP-Server auf Port 80. Genannte J-Modelle umfassen nicht explizit J4570. Historische Community-Anleitung. |
| S6 | [Samsung: Migrating Legacy Platform to Tizen](https://developer.samsung.com/smarttv/develop/migrating-applications/migrating-legacy-platform-to-tizen.html) | Legacy config.xml/widget.info inkompatibel zu Tizen; Widget.js sendReadyEvent/sendReturnEvent/sendExitEvent; andere Keycodes und Player-Plugin. Manche Codeblöcke werden auf der aktuellen Seite leer ausgeliefert; keine fehlenden Signaturen daraus erfunden. |
| S7 | [Samsung Legacy API References](https://developer.samsung.com/smarttv/legacy/api-references.html) | Archivierte Legacy-Klassen, u.a. NNavi, TaskManager, AppCommon und Player. Klassenliste alleine belegt keinen verwendbaren App-Launch-Vertrag. |
| S8 | [Samsung cordova-sectv-orsay platform.js](https://github.com/samsung/cordova-sectv-orsay/blob/master/cordova-js-src/platform.js) | Original-Samsung-Code mit Orsay-Tasten 29460/29461/4/5/29443/88 und Exit 45; Ready-/Return-Lifecycle. Keine Cordova-Abhängigkeit übernommen. |
| S9 | [MediaBrowser/SamsungSmartTV](https://github.com/MediaBrowser/SamsungSmartTV), [config.xml](https://github.com/MediaBrowser/SamsungSmartTV/blob/master/config.xml), [widget.info](https://github.com/MediaBrowser/SamsungSmartTV/blob/master/widget.info), [index.html](https://github.com/MediaBrowser/SamsungSmartTV/blob/master/index.html), [GuiPlayer.js](https://github.com/MediaBrowser/SamsungSmartTV/blob/master/app/javascript/Gui/GuiPlayer/GuiPlayer.js) | Samsung-XML-Namespace, Root-Dateien, Common API-Pfade, classid SAMSUNG-INFOLINK-PLAYER; benannte globale Callback-Strings, SetDisplayArea mit 960×540. Als API-/Paketreferenz gelesen, kein Serverwechsel. |
| S10 | [Plex: Which Smart TV models are supported?](https://support.plex.tv/articles/204080173-which-smart-tv-models-are-supported/) | Aktuelle Samsung-App für Tizen-Geräte ab Modelljahr 2016. Zertifikatsgrenzen bei vielen Samsung-Modellen. Keine aktuelle Supportzusage für Orsay/J4570. Die generische „Limited Playback“-Tabelle ist keine J4570-Spezifikation. |
| S11 | [kadrim/proxy4plex README](https://github.com/kadrim/proxy4plex/blob/main/README.md) | Historischer Orsay-Kandidat: Orcas Plex-App 2.014, Netzwerk-Sideloading, TLS-Proxy für E/F/H mit TLS bis 1.1 laut Projekt. J4570-TLS und heutige Funktion nicht belegt. Kein Download der verlinkten Client-Binary, keine Übernahme oder Installation. |
| S12 | [Plex Community: link not generating code](https://forums.plex.tv/t/plex-tv-link-not-generating-code-on-samsung-smart-tv/763431/19) | Beiträge aus 2021 zeigen Login-/Sideload-Probleme und proxy4plex-Versuche. Historische Beobachtung, keine Gewähr für denselben Firmwarestand oder dieses Modell. |
| S13 | [YouTube: Unsupported device models](https://support.google.com/youtube/answer/6098135?hl=en) | Alte Geräte/Apps können wegen neuer Anforderungen ausgesperrt werden. Keine eindeutige J4570-Liste. Hinweise auf mögliche Firmwareupdates sind keine Voraussetzung dieses Projekts. |
| S14 | [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) | Eingebetteter Player, HTML5 postMessage erforderlich. Keine Zusage für Orsay, keine direkte InitPlayer-URL-Schnittstelle. |
| S15 | [rfaile313/samsucks](https://github.com/rfaile313/samsucks) | Im Recherchetreffer und Repositorybeschreibung Tizen-Player/AVPlay und neuere TV-Jahrgänge; kein direkt passender Orsay-Client. Keine tiefgehende Codeprüfung dieses Projekts. |

Die Originaldateien von Free My TV wurden über GitHub gelesen und als lokale
Inhaltssnapshots behalten. `research/upstream-manifest.json` enthält ihre SHA256.
Der Abruf von `main` ist mit diesen Bytes nachvollziehbar; es wird kein nicht
ermittelter Git-Commit behauptet. Der Build lädt keine beweglichen Upstream-Refs.

Recherchegrenze: Die Samsung-Legacy-Seite verlinkt außerdem ein API-Archiv.
Dieses Archiv und ein altes SDK wurden nicht heruntergeladen. Die vorhandenen
offiziellen Migrationshinweise und gelesenen Beispielimplementierungen reichen
für den ersten Prototyp; weitere gerätespezifische APIs bleiben zu verifizieren.
