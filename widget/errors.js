/* ES5; deliberately loaded before native scripts so startup failures remain visible. */
var LabLog = (function () {
  'use strict';
  var lines = [], observer = null;
  var pending = [], logUrl = '', build = 'ungebaut', scheduled = 0, sending = false, remote = 'aus';
  function clean(text) {
    return String(text).replace(/https?:\/\/[^\s]+/g, '[URL ausgeblendet]')
      .replace(/(token|password|authorization)[=: ]+[^\s]+/ig, '$1=[entfernt]');
  }
  function add(text) {
    lines.push(new Date().toTimeString().slice(0, 8) + ' ' + clean(text));
    if (lines.length > 6) lines.shift();
    var node = document.getElementById('log');
    if (node) node.textContent = lines.join('\n');
    record('log', text);
    if (observer) observer();
  }
  function record(kind, text) {
    pending.push({time: new Date().toUTCString(), kind: String(kind).slice(0, 24), text: clean(text).slice(0, 1500)});
    if (pending.length > 64) pending.shift();
    schedule();
  }
  function schedule() {
    if (logUrl && pending.length && !sending && !scheduled) scheduled = setTimeout(flush, 250);
  }
  function flush() {
    scheduled = 0;
    if (!logUrl || !pending.length || sending) return;
    var xhr, timer, done = false, batch = pending.splice(0, 3);
    sending = true;
    function finish(result) {
      if (done) return;
      done = true; clearTimeout(timer); sending = false; remote = result;
      /* Failed batches are dropped. Never recursively log transport failures. */
      schedule();
      if (observer) observer();
    }
    try {
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () { if (xhr.readyState === 4) finish('HTTP ' + xhr.status); };
      xhr.onerror = function () { finish('Netzfehler'); };
      xhr.onabort = function () { finish('abgebrochen'); };
      timer = setTimeout(function () { finish('Timeout'); xhr.abort(); }, 3000);
      xhr.open('POST', logUrl, true);
      /* A simple CORS request avoids requiring a preflight on the legacy engine. */
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
      xhr.send(JSON.stringify({build: build, events: batch}));
    } catch (e) { finish('nicht verfügbar'); }
  }
  function configure(url, version) {
    logUrl = url || ''; build = version || 'ungebaut'; remote = logUrl ? 'wartet' : 'aus';
    schedule();
  }
  window.onerror = function (message, source, line) {
    add('JS-FEHLER: ' + message + ' (Zeile ' + line + ')');
    return false;
  };
  return {add: add, clean: clean, record: record, configure: configure,
    remoteStatus: function () { return logUrl && (pending.length || sending) ? 'wartet' : remote; },
    lines: function () { return lines.slice(0); },
    observe: function (fn) { observer = fn; }};
})();
