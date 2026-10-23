# Device tests and results

For the first attempt, follow the [short TV test guide](TV_TEST.md).
No tests have been confirmed on the TV yet. The checks below must be performed
on the device. Do not include account details or tokens in shared results.

## Information to collect

- Full model code from the label or normal Support menu.
- Firmware/software version and any known update history.
- Visible Smart Hub, Samsung Account and My Apps menus. Are develop login,
  IP Setting and User App Sync available? Record exact errors if not.
- TV IP, server IP, wired/Wi-Fi connection and any guest network/client isolation.
- Remote type and available Return, Exit and color keys.
- Installed Plex/YouTube versions and behavior before syncing.
- Pi model, Plex Media Server version and a test file's container, video/audio
  codecs, profile, resolution, bitrate and subtitles.

## Test order

1. Build with the LAN IP and port 80 using [INSTALL.md](INSTALL.md), then try
   develop login and sync. Record server GETs for the XML and ZIP, TV messages
   and the Orsay Lab icon. Compare the displayed build version with the package.
   Resolve installation failures before extending the UI.
2. Open Orsay Lab. Test arrows, OK, Return from a panel, Return from the home
   screen and Exit. The diagnostics screen shows recent raw key codes.
   Expected Legacy codes are Left 4, Right 5, Up 29460, Down 29461, OK 29443,
   Return 88 and Exit 45. Actual TVKeyValue values are also accepted.
   Each press must be processed once, and Return within a panel must not close
   the app. Record INFOLINK, SEF and AVPlay detection and check incoming events
   in `artifacts/tv-log.jsonl`. Detection does not prove playback.
3. Keep the server running with `media/test.mp4` available. Open **Testvideo**.
   Watch the moving pattern and listen for the 440 Hz tone for at least
   20 seconds. Stop with Return, restart twice, then test Exit during playback.
   A time callback or startup message alone is not a pass. For black video,
   investigate the video plane/transparency and network; check audio separately.
4. Open the existing Plex app directly from Smart Hub. Play a suitable MP4
   without subtitles. The first test should show **Direct Play** in the Plex
   dashboard. Record image, sound, duration and Pi load. Evaluate login/TLS,
   library access, playback and seeking separately. The prototype's `/identity`
   probe checks connectivity only, not authentication or client functionality.
5. Open the existing YouTube app. Play an ordinary video without signing in,
   then test the existing signed-in account. Record exact errors. Loading the
   home page does not count as working video playback.

After the initial checks, test a longer film, pause/seek/resume, subtitles and
restarts before treating the setup as suitable for daily use.

## Results template

| Test / information | Result on the device |
| --- | --- |
| Date, model, firmware | pending |
| TV IP / installation server IP | pending; redact for public reports if needed |
| Menu path, develop login and sync | pending |
| widgetlist.xml / ZIP in server console | pending |
| Widget startup / visible API mode | pending |
| Displayed build / remote logging HTTP 204 | pending |
| INFOLINK / SEF / Legacy AVPlay detected | pending |
| Viewport / panel / player plane | pending |
| Raw Left/Right/Up/Down/OK codes | pending |
| Return from panel / Return from home / Exit | pending |
| MP4: moving picture / audible sound | pending / pending |
| MP4: stable for 20 seconds / stop / repeated starts | pending |
| Player errors / callbacks / HTTP status | pending |
| Plex version / PMS version / Pi model | pending |
| Plex login / library / picture / sound | pending |
| Plex: Direct Play / Direct Stream / transcoding | pending |
| YouTube version / signed out / signed in | pending |
| Decision: continue native development / blockers / HDMI | pending |
