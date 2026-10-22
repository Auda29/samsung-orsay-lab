#!/usr/bin/env python3
"""Generate an own 30s test pattern with audible 440 Hz sine, no downloads."""
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
ffmpeg = shutil.which("ffmpeg")
if not ffmpeg:
    raise SystemExit("Install FFmpeg with libx264 first (only needed to generate test media).")
target = root / "media/test.mp4"
target.parent.mkdir(exist_ok=True)
subprocess.run([
    ffmpeg, "-hide_banner", "-loglevel", "warning", "-y",
    "-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=25",
    "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000",
    "-t", "30", "-c:v", "libx264", "-preset", "fast", "-profile:v", "baseline",
    "-level:v", "3.1", "-pix_fmt", "yuv420p", "-b:v", "1800k", "-maxrate", "2200k",
    "-bufsize", "4400k", "-g", "50", "-c:a", "aac", "-ac", "2", "-b:a", "128k",
    "-movflags", "+faststart", "-map_metadata", "-1", str(target)
], check=True)
print(target)
