/* Transport failures must not break the UI or create recursive log traffic. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function setup() {
  let clock = 0, next = 0;
  const timers = new Map(), requests = [], node = {textContent: ''};
  const context = {
    window: {}, document: {getElementById() { return node; }},
    setTimeout(fn, delay) { timers.set(++next, {at: clock + delay, fn}); return next; },
    clearTimeout(id) { timers.delete(id); },
    XMLHttpRequest: function () {
      requests.push(this);
      this.open = (method, url, async) => { this.method = method; this.url = url; this.async = async; };
      this.setRequestHeader = () => {};
      this.send = body => { this.body = JSON.parse(body); };
      this.abort = () => { if (this.onabort) this.onabort(); };
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../widget/errors.js'), 'utf8'), context);
  return {log: context.LabLog, window: context.window, requests, node, timers,
    tick(ms) {
      const end = clock + ms;
      while (true) {
        const nextTimer = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0];
        if (!nextTimer || nextTimer[1].at > end) break;
        clock = nextTimer[1].at; timers.delete(nextTimer[0]); nextTimer[1].fn();
      }
      clock = end;
    }};
}

test('startup errors are queued once, redacted and sent after configuration', () => {
  const h = setup();
  h.window.onerror('Error token=private http://host/private', '', 3);
  h.tick(1000);
  assert.equal(h.requests.length, 0);
  h.log.configure('http://server/log', '0.1.7'); h.tick(250);
  const request = h.requests[0];
  assert.equal(request.method, 'POST'); assert.equal(request.async, true);
  assert.equal(request.body.build, '0.1.7'); assert.equal(request.body.events.length, 1);
  assert.match(request.body.events[0].text, /JS-FEHLER/);
  assert.doesNotMatch(JSON.stringify(request.body), /private/);
  request.readyState = 4; request.status = 204; request.onreadystatechange();
  h.tick(10000);
  assert.equal(h.requests.length, 1); assert.equal(h.log.remoteStatus(), 'HTTP 204');
});

test('timeouts and late error callbacks do not recurse; local logging still works', () => {
  const h = setup(); h.log.configure('http://server/log', '0.1.7'); h.log.add('first');
  h.tick(3250);
  assert.equal(h.log.remoteStatus(), 'Timeout'); assert.equal(h.requests.length, 1);
  h.requests[0].onerror(); h.tick(20000);
  assert.equal(h.requests.length, 1); assert.equal(h.timers.size, 0);
  assert.equal(h.log.lines().length, 1);
  h.log.add('second'); h.tick(250);
  assert.match(h.node.textContent, /second/); assert.equal(h.requests.length, 2);
});

test('backlog is bounded and only one batch is in flight', () => {
  const h = setup();
  for (let i = 0; i < 100; i++) h.log.record('key', String(i));
  h.log.configure('http://server/log', '0.1.7'); h.tick(250);
  assert.equal(h.requests[0].body.events[0].text, '36');
  assert.equal(h.requests[0].body.events.length, 3);
  h.tick(1000); assert.equal(h.requests.length, 1);
  h.requests[0].readyState = 4; h.requests[0].status = 204; h.requests[0].onreadystatechange();
  h.tick(250); assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1].body.events[0].text, '39');
});
