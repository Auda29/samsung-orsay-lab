/* Legacy Player plugin first. HTML5 is a clearly labelled desktop test only. */
var LabPlayer = (function () {
  'use strict';
  var player = null, video = null, active = false, timer = 0, notify = null, nativePlayer = false;
  function state(text) { LabLog.add('Player: ' + text); if (notify) notify(text); }
  function stop() {
    clearTimeout(timer);
    if (active) {
      try {
        if (nativePlayer) player.Stop();
        else if (video) { video.pause(); video.removeAttribute('src'); video.load(); video.style.display = 'none'; }
      } catch (e) { LabLog.add('Stop FEHLER: ' + e.message); }
    }
    active = false;
  }
  function fail(text) { stop(); state(text); }
  function play(url, onState) {
    stop(); notify = onState; lastSecond = -1;
    if (!/^https?:\/\//i.test(url || '')) { state('Keine gültige Testvideo-URL. Build-Konfiguration prüfen.'); return; }
    player = document.getElementById('pluginPlayer');
    nativePlayer = OrsayTV.nativeMode();
    if (nativePlayer && (!player || !player.InitPlayer || !player.StartPlayback)) {
      state('Orsay Player API fehlt. Kein automatischer HTML5-Ersatz auf dem TV.'); return;
    }
    active = true;
    timer = setTimeout(function () { fail('TIMEOUT: 20 s ohne Fortschritt. Serverlog / Codec / TLS prüfen.'); }, 20000);
    try {
      if (nativePlayer) {
        /* Native plugins resolve callbacks by global name on legacy firmwares. */
        player.OnBufferingStart = 'LabPlayer.buffering';
        player.OnBufferingComplete = 'LabPlayer.buffered';
        player.OnStreamInfoReady = 'LabPlayer.streamInfo';
        player.OnCurrentPlayTime = 'LabPlayer.progress';
        player.OnRenderingComplete = 'LabPlayer.ended';
        player.OnConnectionFailed = 'LabPlayer.connectionFailed';
        player.OnNetworkDisconnected = 'LabPlayer.disconnected';
        player.OnRenderError = 'LabPlayer.renderError';
        player.OnStreamNotFound = 'LabPlayer.notFound';
        var result = player.InitPlayer(url);
        if (result === false || result === 0) { fail('InitPlayer abgelehnt'); return; }
        /* Legacy video plane commonly uses 960x540, independently of UI/panel resolution. */
        player.SetDisplayArea(0, 0, LAB_CONFIG.playerWidth, LAB_CONFIG.playerHeight);
        result = player.StartPlayback(0);
        if (result === false || result === 0) { fail('StartPlayback abgelehnt'); return; }
        state('Orsay: Start angefordert. Bild und Ton am TV bestätigen.');
      } else {
        video = document.getElementById('browser-video');
        video.style.display = 'block';
        video.onplaying = function () { state('BROWSER: playing-Ereignis; kein TV-Nachweis.'); };
        video.ontimeupdate = function () { if (video.currentTime > 0) progress(Math.round(video.currentTime * 1000)); };
        video.onerror = function () { fail('BROWSER: media error ' + (video.error ? video.error.code : '?')); };
        video.onended = ended;
        video.src = url;
        var promise = video.play();
        if (promise && promise['catch']) promise['catch'](function () { fail('BROWSER: Wiedergabe abgelehnt / Autoplay.'); });
        state('BROWSER: HTML5-Test gestartet; kein Orsay-Nachweis.');
      }
    } catch (e) { fail('FEHLER: ' + e.message); }
  }
  var lastSecond = -1;
  function progress(ms) {
    if (!active) return;
    clearTimeout(timer);
    var seconds = Math.floor(Number(ms) / 1000);
    if (seconds !== lastSecond) {
      lastSecond = seconds;
      if (notify) notify((nativePlayer ? 'Orsay Callback' : 'BROWSER') + ': ' + seconds + ' s · Bild/Ton separat beurteilen');
    }
    timer = setTimeout(function () { fail('TIMEOUT: 20 s kein weiterer Fortschritt.'); }, 20000);
  }
  function ended() { stop(); state('Wiedergabe beendet. Bild und Ton beobachtet? Ergebnis im Testprotokoll erfassen.'); }
  return {play: play, stop: stop, progress: progress, ended: ended,
    buffering: function () { state('Puffert …'); }, buffered: function () { state('Puffer bereit; warte auf Fortschritt.'); },
    streamInfo: function () { state('StreamInfoReady; noch kein Bild-/Tonnachweis.'); },
    connectionFailed: function () { fail('Verbindung fehlgeschlagen'); },
    disconnected: function () { fail('Netzwerk getrennt'); },
    notFound: function () { fail('Stream nicht gefunden'); },
    renderError: function (code) { fail('Renderfehler ' + code); }};
})();
