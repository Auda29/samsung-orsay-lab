/* Independent Orsay adapter. No Tizen/Luna APIs and no fabricated app IDs. */
var OrsayTV = (function () {
  'use strict';
  var widget = null, keys = null, ready = false, seen = [], nativeMode = false;
  var fallback = {left: 4, right: 5, up: 29460, down: 29461, ok: 29443, back: 88, exit: 45, stop: 70};
  var names = {left: 'KEY_LEFT', right: 'KEY_RIGHT', up: 'KEY_UP', down: 'KEY_DOWN',
    ok: 'KEY_ENTER', back: 'KEY_RETURN', exit: 'KEY_EXIT', stop: 'KEY_STOP'};
  function init() {
    if (window.Common && Common.API && Common.API.Widget) {
      try { widget = new Common.API.Widget(); nativeMode = true; }
      catch (e) { LabLog.add('Widget API: ' + e.message); }
    }
    if (window.Common && Common.API && Common.API.TVKeyValue) {
      try { keys = new Common.API.TVKeyValue(); }
      catch (e2) { LabLog.add('TVKeyValue: ' + e2.message); }
    }
    focus();
    if (widget) {
      try { widget.sendReadyEvent(); ready = true; LabLog.add('sendReadyEvent gesendet; TV-Funktion noch prüfen.'); }
      catch (e3) { LabLog.add('Ready FEHLER: ' + e3.message); }
    } else {
      LabLog.add('Kein Widget API: Browser / fehlende TV-API.');
    }
  }
  function focus() {
    var a = document.getElementById('key-anchor');
    if (a) a.focus();
  }
  function action(code) {
    var k;
    seen.push(code);
    if (seen.length > 12) seen.shift();
    for (k in fallback) {
      if (fallback.hasOwnProperty(k) && (code === fallback[k] || (keys && code === keys[names[k]]))) return k;
    }
    return ({37: 'left', 38: 'up', 39: 'right', 40: 'down', 13: 'ok', 27: 'back', 8: 'back', 413: 'stop', 120: 'exit'})[code] || '';
  }
  function block(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (widget && widget.blockNavigation) {
      try { widget.blockNavigation(); } catch (e) { LabLog.add('blockNavigation FEHLER'); }
    }
  }
  function leave(exit) {
    if (!widget) { LabLog.add('BROWSER: ' + (exit ? 'Exit' : 'Return') + ' angefordert.'); return false; }
    try {
      if (exit) widget.sendExitEvent(); else widget.sendReturnEvent();
      return true; /* request only; actual transition must be observed on the TV */
    } catch (e) { LabLog.add('Verlassen FEHLER: ' + e.message); return false; }
  }
  function diagnostics() {
    var player = document.getElementById('pluginPlayer');
    var navi = document.getElementById('pluginNNavi'), model = 'nicht ermittelt';
    try { if (navi && navi.GetModelCode) model = String(navi.GetModelCode()); }
    catch (e) { model = 'GetModelCode fehlgeschlagen'; }
    return [
      'Modus: ' + (nativeMode ? 'Orsay Widget API erkannt (kein Funktionsnachweis)' : 'Browser / TV-API fehlt'),
      'Widget API: ' + !!widget + ' | Ready gesendet: ' + ready + ' | TVKeyValue: ' + !!keys,
      'Modell (NNavi, optional): ' + model,
      'Player InitPlayer: ' + !!(player && player.InitPlayer) + ' | StartPlayback: ' + !!(player && player.StartPlayback),
      'Viewport: ' + window.innerWidth + ' x ' + window.innerHeight + ' | Screen: ' + screen.width + ' x ' + screen.height,
      'User-Agent: ' + navigator.userAgent,
      'Letzte rohe Tastencodes: ' + seen.join(', '),
      'Firmware: manuell am TV ablesen. Keine Firmwareänderung nötig / vorgesehen.'
    ].join('\n');
  }
  return {init: init, focus: focus, action: action, block: block, leave: leave,
    diagnostics: diagnostics, nativeMode: function () { return nativeMode; }};
})();
