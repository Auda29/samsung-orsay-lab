/* ES5; deliberately loaded before native scripts so startup failures remain visible. */
var LabLog = (function () {
  'use strict';
  var lines = [], observer = null;
  function clean(text) {
    return String(text).replace(/https?:\/\/[^\s]+/g, '[URL ausgeblendet]')
      .replace(/(token|password|authorization)[=: ]+[^\s]+/ig, '$1=[entfernt]');
  }
  function add(text) {
    lines.push(new Date().toTimeString().slice(0, 8) + ' ' + clean(text));
    if (lines.length > 6) lines.shift();
    var node = document.getElementById('log');
    if (node) node.textContent = lines.join('\n');
    if (observer) observer();
  }
  window.onerror = function (message, source, line) {
    add('JS-FEHLER: ' + message + ' (Zeile ' + line + ')');
    return false;
  };
  return {add: add, clean: clean, lines: function () { return lines.slice(0); },
    observe: function (fn) { observer = fn; }};
})();
