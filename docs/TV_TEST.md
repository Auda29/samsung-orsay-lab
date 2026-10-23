# Quick TV test

Goal: install Orsay Lab, check the remote and play the local test video.
Installation on the UE32J4570 is not yet confirmed.

## 1. Prepare the computer

You need Python 3.10+, FFmpeg with libx264 on PATH, and the project folder.
Connect the computer and TV to the same home network.

In PowerShell, run `ipconfig` and find the active adapter's IPv4 address.
The example below uses `192.168.1.20`. Replace it with your computer's address,
not the TV's address or `127.0.0.1`.

Run from the project folder:

```powershell
python tools/make_sample.py
python tools/build.py --host 192.168.1.20 --port 80 --build-number 1
python tools/serve.py --bind 192.168.1.20 --port 80
```

Leave this window open. Allow Python through the Windows firewall on the private
network if prompted. On a phone on the same Wi-Fi, open
`http://192.168.1.20/health.txt`. It should show `Orsay Lab installation server OK`.
If it does not, fix the connection before continuing.

## 2. Install on the TV

Note the model, firmware and installed community apps first. Sync can replace
other user apps on some older Smart Hub versions.

1. In Smart Hub, sign in to the developer account `develop`. Some models ask
   for no password; the community instructions otherwise list `000000`.
2. Open Samsung Apps / My Apps and highlight an installed app.
3. Hold OK/Enter, choose **IP Setting**, and enter the computer's IP address.
4. Hold OK again and choose **Start User App Sync**.
5. Open **Orsay Lab**. The heading should show **Build 0.1.1**.

Menu names vary. If these options are missing, record the menus and stop.
Do not reset the TV or change its firmware. See [INSTALL.md](INSTALL.md) for details.

## 3. Check the remote and logs

Press each arrow once. Selection should move once per press when another tile
exists in that direction. Open **Diagnose** and look for **Log-Rückkanal: HTTP 204**.
Return should close the panel.

Logs appear on the computer in `artifacts/tv-log.jsonl`. Once the file exists,
you can watch it in a second PowerShell window:

```powershell
Get-Content artifacts/tv-log.jsonl -Wait
```

## 4. Play the video

Open **Testvideo**. Check for a moving pattern and an audible tone for at least
20 seconds. Press Return to stop it, then repeat twice. Finally test Exit.
Keep the server running throughout.

A running time counter alone is not a pass. You need visible movement and sound.
Plex and YouTube playback are separate tests; this widget does not include clients.

## 5. Save the result

Record the model, firmware, displayed build, installation result, remote behavior,
picture, sound and any error text. Keep `artifacts/tv-log.jsonl`. If remote logging
fails, photograph the diagnostics screen. Use [DEVICE_TESTS.md](DEVICE_TESTS.md)
for the full results template and later Plex/YouTube checks.
