/* Player regressions with a virtual clock and explicit native/HTML5 mocks. No TV emulation. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../widget/player.js'), 'utf8');

function setup(native = true) {
  let now = 0, next = 0;
  const timers = new Map(), calls = [], messages = [], logs = [], rejections = [];
  const plugin = {
    InitPlayer() { calls.push('init'); return 1; },
    SetDisplayArea() { calls.push('area'); },
    StartPlayback() { calls.push('play'); return 1; },
    Stop() { calls.push('stop'); }
  };
  const video = {
    style: {}, currentTime: 0,
    play() { calls.push('play'); return {catch(fn) { rejections.push(fn); }}; },
    pause() { calls.push('pause'); },
    removeAttribute(name) { delete this[name]; },
    load() { calls.push('load'); }
  };
  const context = {
    LabLog: {add(text) { logs.push(text); }},
    LAB_CONFIG: {playerWidth: 960, playerHeight: 540},
    OrsayTV: {nativeMode() { return native; }},
    document: {getElementById(id) { return id === 'pluginPlayer' ? plugin : video; }},
    setTimeout(fn, delay) { timers.set(++next, {at: now + delay, fn}); return next; },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  function resolve(name) {
    return name.split('.').reduce((value, key) => value[key], context);
  }
  return {
    api: context.LabPlayer, plugin, video, calls, messages, logs, rejections, timers, resolve,
    play() { context.LabPlayer.play('http://127.0.0.1/test.mp4', text => messages.push(text)); },
    emit(event, value) { resolve(plugin[event])(value); },
    advance(ms) {
      const end = now + ms;
      while (true) {
        const first = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0];
        if (!first || first[1].at > end) break;
        now = first[1].at;
        timers.delete(first[0]);
        first[1].fn();
      }
      now = end;
    }
  };
}

test('no progress times out after 20 seconds and stop is idempotent', () => {
  const h = setup(); h.play();
  h.advance(19999);
  assert.equal(h.calls.includes('stop'), false);
  h.advance(1);
  assert.match(h.messages.at(-1), /TIMEOUT/);
  h.api.stop();
  assert.equal(h.calls.filter(call => call === 'stop').length, 1);
  assert.equal(h.timers.size, 0);
});

test('duplicate, backwards, invalid and buffering callbacks cannot mask a stall', () => {
  const h = setup(); h.play(); h.emit('OnCurrentPlayTime', 1000);
  h.advance(10000);
  for (const value of [1000, 0, -1, NaN, Infinity, 'invalid']) h.emit('OnCurrentPlayTime', value);
  h.emit('OnBufferingStart'); h.emit('OnBufferingComplete'); h.emit('OnStreamInfoReady');
  h.advance(9999);
  assert.equal(h.calls.includes('stop'), false);
  h.advance(1);
  assert.match(h.messages.at(-1), /TIMEOUT/);
});

test('real subsecond progress extends the deadline even within the same displayed second', () => {
  const h = setup(); h.play(); h.emit('OnCurrentPlayTime', 100);
  h.advance(19000); h.emit('OnCurrentPlayTime', '200');
  h.advance(19000);
  assert.equal(h.calls.includes('stop'), false);
  h.advance(1000);
  assert.match(h.messages.at(-1), /TIMEOUT/);
});

test('old native callback names and captured functions cannot affect a restarted stream', () => {
  const h = setup(); h.play();
  const events = Object.keys(h.plugin).filter(key => key.startsWith('On'));
  const old = events.map(event => ({name: h.plugin[event], fn: h.resolve(h.plugin[event])}));
  h.api.stop(); h.play();
  for (let i = 0; i < events.length; i++) assert.notEqual(h.plugin[events[i]], old[i].name);
  h.emit('OnCurrentPlayTime', 1000); h.advance(10000);
  const messages = h.messages.slice(), calls = h.calls.slice(), logs = h.logs.slice();
  for (const callback of old) { h.resolve(callback.name)(2000); callback.fn(2000); }
  assert.deepEqual(h.messages, messages);
  assert.deepEqual(h.calls, calls);
  assert.deepEqual(h.logs, logs);
  h.advance(10000);
  assert.match(h.messages.at(-1), /TIMEOUT/);
});

test('native callbacks delivered from inside Stop cannot recurse or overwrite status', () => {
  const h = setup(); h.play();
  const oldEnd = h.resolve(h.plugin.OnRenderingComplete);
  h.plugin.Stop = function () {
    h.calls.push('stop');
    oldEnd(); h.emit('OnRenderingComplete'); h.emit('OnNetworkDisconnected');
  };
  const messages = h.messages.slice();
  h.api.stop(); h.api.stop(); h.advance(60000);
  assert.equal(h.calls.filter(call => call === 'stop').length, 1);
  assert.deepEqual(h.messages, messages);
  assert.equal(h.timers.size, 0);
});

test('synchronous InitPlayer failure callback prevents subsequent startup calls', () => {
  const h = setup();
  h.plugin.InitPlayer = function () { h.calls.push('init'); h.emit('OnConnectionFailed'); return 1; };
  h.play();
  assert.deepEqual(h.calls, ['init', 'stop']);
  assert.equal(h.messages.at(-1), 'Verbindung fehlgeschlagen');
  assert.equal(h.timers.size, 0);
});

test('synchronous StartPlayback failure remains visible', () => {
  const h = setup();
  h.plugin.StartPlayback = function () { h.calls.push('play'); h.emit('OnRenderError', 7); return 1; };
  h.play();
  assert.equal(h.messages.at(-1), 'Renderfehler 7');
  assert.equal(h.timers.size, 0);
});

test('HTML5 events and rejected play requests from an old stream are ignored after restart', () => {
  const h = setup(false); h.play();
  const old = [h.video.onplaying, h.video.ontimeupdate, h.video.onerror, h.video.onended, h.rejections[0]];
  h.api.stop();
  assert.equal(h.video.onended, null);
  assert.equal(h.video.src, undefined);
  assert.equal(h.video.style.display, 'none');
  h.play();
  h.video.currentTime = 1; h.video.ontimeupdate(); h.advance(10000);
  const messages = h.messages.slice(), calls = h.calls.slice();
  old.forEach(fn => fn());
  assert.deepEqual(h.messages, messages);
  assert.deepEqual(h.calls, calls);
  assert.equal(h.video.style.display, 'block');
  h.advance(10000);
  assert.match(h.messages.at(-1), /TIMEOUT/);
});

test('the current HTML5 play rejection still stops and reports the failure', () => {
  const h = setup(false); h.play(); h.rejections[0]();
  assert.match(h.messages.at(-1), /Wiedergabe abgelehnt/);
  assert.deepEqual(h.calls, ['play', 'pause', 'load']);
  assert.equal(h.timers.size, 0);
});

test('all required native methods are checked without HTML5 fallback', () => {
  for (const method of ['InitPlayer', 'StartPlayback', 'SetDisplayArea', 'Stop']) {
    const h = setup(); h.plugin[method] = null; h.play();
    assert.match(h.messages.at(-1), /Player API fehlt/);
    assert.deepEqual(h.calls, []);
    assert.equal(h.video.src, undefined);
    assert.equal(h.timers.size, 0);
  }
});

test('rejected native startup results clean up without continuing playback', () => {
  for (const method of ['InitPlayer', 'StartPlayback']) {
    for (const result of [false, 0]) {
      const h = setup(); h.plugin[method] = function () { return result; }; h.play();
      assert.equal(h.messages.at(-1), method + ' abgelehnt');
      assert.equal(h.calls.at(-1), 'stop');
      assert.equal(h.timers.size, 0);
    }
  }
});

test('native startup exceptions clean up and leave a visible error', () => {
  const h = setup(); h.plugin.SetDisplayArea = function () { throw new Error('display failed'); };
  h.play();
  assert.equal(h.messages.at(-1), 'FEHLER: display failed');
  assert.deepEqual(h.calls, ['init', 'stop']);
  assert.equal(h.timers.size, 0);
});

test('natural completion stops once and ignores subsequent failure callbacks', () => {
  const h = setup(); h.play(); h.emit('OnRenderingComplete');
  const messages = h.messages.slice();
  h.emit('OnConnectionFailed'); h.emit('OnRenderingComplete'); h.advance(60000);
  assert.match(messages.at(-1), /Wiedergabe beendet/);
  assert.deepEqual(h.messages, messages);
  assert.equal(h.calls.filter(call => call === 'stop').length, 1);
});
