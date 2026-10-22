/* Legacy Player plugin first. HTML5 is a clearly labelled desktop test only. */
var LabPlayer = (function () {
  'use strict';
  var current = null, nextSession = 0;
  function ignore() {}
  function isCurrent(session) { return current === session && session.active; }
  function state(session, text) {
    LabLog.add('Player: ' + text);
    if (session.notify) session.notify(text);
  }
  function guard(session, fn) {
    return function (value) { if (isCurrent(session)) fn(session, value); };
  }
  function nativeCallback(session, name, fn) {
    var key = 'session' + session.id + '_' + name;
    LabPlayer[key] = guard(session, fn);
    session.callbacks.push(key);
    return 'LabPlayer.' + key;
  }
  function stop() {
    var session = current, i;
    if (!session) return;
    current = null;
    session.active = false;
    clearTimeout(session.timer);
    /* Keep retired names callable for queued native events, without retaining sessions. */
    for (i = 0; i < session.callbacks.length; i++) LabPlayer[session.callbacks[i]] = ignore;
    if (session.video) {
      session.video.onplaying = session.video.ontimeupdate = null;
      session.video.onerror = session.video.onended = null;
      session.video.style.display = 'none';
    }
    try {
      if (session.nativePlayer) session.player.Stop();
      else if (session.video) {
        session.video.pause(); session.video.removeAttribute('src'); session.video.load();
      }
    } catch (e) { LabLog.add('Stop FEHLER: ' + e.message); }
  }
  function fail(session, text) {
    if (!isCurrent(session)) return;
    stop(); state(session, text);
  }
  function watch(session) {
    clearTimeout(session.timer);
    session.timer = setTimeout(function () {
      fail(session, 'TIMEOUT: 20 s ohne Fortschritt. Serverlog / Codec / TLS prüfen.');
    }, 20000);
  }
  function progress(session, ms) {
    ms = Number(ms);
    if (!isFinite(ms) || ms <= session.lastTime) return;
    session.lastTime = ms;
    watch(session);
    var seconds = Math.floor(ms / 1000);
    if (seconds !== session.lastSecond) {
      session.lastSecond = seconds;
      if (session.notify) session.notify((session.nativePlayer ? 'Orsay Callback' : 'BROWSER') +
        ': ' + seconds + ' s · Bild/Ton separat beurteilen');
    }
  }
  function ended(session) {
    stop(); state(session, 'Wiedergabe beendet. Bild und Ton beobachtet? Ergebnis im Testprotokoll erfassen.');
  }
  function play(url, onState) {
    stop();
    var session = {id: ++nextSession, active: false, timer: 0, notify: onState,
      nativePlayer: OrsayTV.nativeMode(), player: null, video: null, callbacks: [], lastTime: 0, lastSecond: -1};
    if (!/^https?:\/\//i.test(url || '')) {
      state(session, 'Keine gültige Testvideo-URL. Build-Konfiguration prüfen.'); return;
    }
    var player = document.getElementById('pluginPlayer');
    session.player = player;
    if (session.nativePlayer && (!player || !player.InitPlayer || !player.StartPlayback ||
        !player.SetDisplayArea || !player.Stop)) {
      state(session, 'Orsay Player API fehlt. Kein automatischer HTML5-Ersatz auf dem TV.'); return;
    }
    current = session; session.active = true;
    watch(session);
    try {
      if (session.nativePlayer) {
        /* Unique global names keep callbacks from previous streams out of this session. */
        player.OnBufferingStart = nativeCallback(session, 'buffering', function (s) { state(s, 'Puffert …'); });
        player.OnBufferingComplete = nativeCallback(session, 'buffered', function (s) { state(s, 'Puffer bereit; warte auf Fortschritt.'); });
        player.OnStreamInfoReady = nativeCallback(session, 'streamInfo', function (s) { state(s, 'StreamInfoReady; noch kein Bild-/Tonnachweis.'); });
        player.OnCurrentPlayTime = nativeCallback(session, 'progress', progress);
        player.OnRenderingComplete = nativeCallback(session, 'ended', ended);
        player.OnConnectionFailed = nativeCallback(session, 'connectionFailed', function (s) { fail(s, 'Verbindung fehlgeschlagen'); });
        player.OnNetworkDisconnected = nativeCallback(session, 'disconnected', function (s) { fail(s, 'Netzwerk getrennt'); });
        player.OnRenderError = nativeCallback(session, 'renderError', function (s, code) { fail(s, 'Renderfehler ' + code); });
        player.OnStreamNotFound = nativeCallback(session, 'notFound', function (s) { fail(s, 'Stream nicht gefunden'); });
        var result = player.InitPlayer(url);
        if (!isCurrent(session)) return;
        if (result === false || result === 0) { fail(session, 'InitPlayer abgelehnt'); return; }
        /* Legacy video plane commonly uses 960x540, independently of UI/panel resolution. */
        player.SetDisplayArea(0, 0, LAB_CONFIG.playerWidth, LAB_CONFIG.playerHeight);
        if (!isCurrent(session)) return;
        result = player.StartPlayback(0);
        if (!isCurrent(session)) return;
        if (result === false || result === 0) { fail(session, 'StartPlayback abgelehnt'); return; }
        state(session, 'Orsay: Start angefordert. Bild und Ton am TV bestätigen.');
      } else {
        var video = document.getElementById('browser-video');
        session.video = video;
        video.style.display = 'block';
        video.onplaying = guard(session, function (s) { state(s, 'BROWSER: playing-Ereignis; kein TV-Nachweis.'); });
        video.ontimeupdate = guard(session, function (s) { progress(s, Math.round(video.currentTime * 1000)); });
        video.onerror = guard(session, function (s) { fail(s, 'BROWSER: media error ' + (video.error ? video.error.code : '?')); });
        video.onended = guard(session, ended);
        video.src = url;
        var promise = video.play();
        if (promise && promise['catch']) promise['catch'](guard(session, function (s) { fail(s, 'BROWSER: Wiedergabe abgelehnt / Autoplay.'); }));
        if (isCurrent(session)) state(session, 'BROWSER: HTML5-Test gestartet; kein Orsay-Nachweis.');
      }
    } catch (e) { fail(session, 'FEHLER: ' + e.message); }
  }
  return {play: play, stop: stop};
})();
