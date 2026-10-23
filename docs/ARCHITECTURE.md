# Architecture and porting plan

Source IDs refer to [SOURCES.md](SOURCES.md).

## Prototype

```text
widget/ui.js + ui.css      small Free My TV adaptation, focus and diagnostics
        |
widget/tv-orsay.js         Common.API.Widget, TVKeyValue, lifecycle
widget/player.js           SAMSUNG-INFOLINK-PLAYER, named global callbacks
        |
Device: $MANAGER_WIDGET    Samsung libraries remain on the TV

tools/build.py             offline ZIP, widgetlist.xml and browser preview
tools/serve.py             local HTTP/range server and POST /log
tools/make_sample.py       one-time generation of H.264/AAC test material
```

The Orsay adapter uses no Tizen or webOS APIs. It does not scan or launch installed
apps. Errors, missing APIs and requests to leave the widget are shown explicitly.

The screen retains six log entries and twelve key codes. The installation server
also writes sanitized events to `artifacts/tv-log.jsonl`. `LabLog` queues errors
that occur before configuration and sends them asynchronously to the build's log
URL. There is one sending path, including for `window.onerror`. Transport failures
do not generate further log events.

Configuration is read at build time, so the TV does not need an on-screen
keyboard. Credential and token handling are not implemented.

The SEF/Legacy AVPlay diagnostics inspect available methods without opening
another player or requesting playback resources. Actual playback still uses
INFOLINK. The focused anchor handles keys directly and stops propagation to the
document handler, which remains a fallback for other event targets.

Native player callbacks are registered as global names, following the Legacy
reference client [S9]. Each start gets names of the form
`LabPlayer.session<id>_<name>`. Stop deactivates the session before calling the
native Stop method. Retired names remain callable as empty functions until the
widget closes, so delayed native events cannot stop the next stream or call
missing functions. Old session objects can be released. HTML5 events and play
rejections are also bound to their sessions. The TV firmware's resolution of
these callback names still needs a device test.

Method calls can fail or return ambiguous values. Startup return values are
logged; image and sound must be confirmed on the TV. Playback times out after
20 seconds without an increasing, finite play time. Repeated, decreasing or
invalid time values and buffering events do not extend that deadline.

Stop, Return, unload and pause clean up the player. UI and HTML backgrounds
become transparent for the video plane. Its coordinates remain configurable.

## Adapted Free My TV code

- `web/home.js`: fit scaling and the setClass helper.
- `web/home.css`: a smaller adaptation of tile, word and focus styling.

Source, retrieval date and SHA256 hashes are under `research/`. The widget ZIP
includes the MIT license.

The full upstream home.js also uses Prefs, Data, I18N, weather, images, multiple
apps, inputs and settings. Copying it wholesale would introduce those dependencies
and untested platform behavior. Only the small UI portion listed above is ported.
The upstream `web/tv.js` is retained for research and is not loaded by the widget.

## After a successful device test

1. Record the actual viewport, key codes and player coordinates in the adapter.
   Add SDK 5.1 API alternatives only where the results show a need.
2. Inventory existing Plex/YouTube apps and versions. A documented Orsay app-launch
   path is a separate device-test goal; do not transfer Tizen app IDs.
3. If the old Plex client fails, design a minimal library view for the existing
   PMS, authentication and token handling. Add secret handling before that
   expansion. Directly play one suitable file, show incompatible-format errors
   and do not automatically force video transcoding on the Pi.
4. Then consider porting more of the Free My TV app list and settings. Plex and
   YouTube remain the service targets; weather, TMDB and crypto are out of scope.
5. Investigate autostart and Smart Hub replacement separately. Neither is a
   prerequisite for installation, input handling or playback.

The complete native solution still depends on usable YouTube playback.
If the service no longer works on this device, a UI change cannot restore it.
HDMI remains the planned fallback.
