#!/usr/bin/env python3
"""Offline Orsay widget packager; Python standard library only."""
import argparse
import hashlib
import ipaddress
import json
from pathlib import Path
import struct
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
import zipfile
import zlib

ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.1.0"
ZIP_NAME = "OrsayLab_0.1.0_Europe_20261022.zip"
DEFAULTS = {"mediaUrl": "", "plexBaseUrl": "", "probeUrl": "", "playerWidth": 960, "playerHeight": 540}


def configuration(host, port, path=None):
    base = "http://" + host + (":" + str(port) if port != 80 else "")
    config = dict(DEFAULTS, mediaUrl=base + "/media/test.mp4", probeUrl=base + "/health.txt")
    if path:
        supplied = json.loads(Path(path).read_text(encoding="utf-8"))
        if not isinstance(supplied, dict) or set(supplied) - set(DEFAULTS):
            raise ValueError("Only keys from local.example.json are permitted; no credentials")
        config.update(supplied)
    for key in ("mediaUrl", "plexBaseUrl", "probeUrl"):
        value = config[key]
        if not isinstance(value, str):
            raise ValueError(key + " must be a string")
        if not value:
            continue
        url = urlsplit(value)
        if (url.scheme not in ("http", "https") or not url.hostname or url.username or url.password
                or url.query or url.fragment or any(ord(c) < 32 for c in value)):
            raise ValueError(key + ": use an HTTP(S) URL without credentials, query or fragment")
    for key in ("playerWidth", "playerHeight"):
        if type(config[key]) is not int or not 1 <= config[key] <= 4096:
            raise ValueError(key + " must be an integer between 1 and 4096")
    return config


def icon(width, height):
    """Own simple RGB test pattern, no third-party artwork or imaging dependency."""
    def chunk(kind, data):
        return struct.pack("!I", len(data)) + kind + data + struct.pack("!I", zlib.crc32(kind + data) & 0xffffffff)
    pixels = b"".join(b"\x00" + b"".join(
        bytes((65, 195, 245)) if (width // 5 < x < width * 4 // 5 and height // 4 < y < height * 3 // 4)
        else bytes((17, 21, 29)) for x in range(width)) for y in range(height))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack("!2I5B", width, height, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(pixels, 9)) + chunk(b"IEND", b""))


def build(host="127.0.0.1", port=80, config_path=None, output=None):
    address = ipaddress.IPv4Address(host)
    if address.is_unspecified or address.is_multicast:
        raise ValueError("host must be the installation server's reachable IPv4 address")
    if not 1 <= port <= 65535:
        raise ValueError("port must be 1..65535")
    config = configuration(host, port, config_path)
    output = Path(output) if output else ROOT / "dist"
    # Never recursively delete an arbitrary user-selected path.
    output.mkdir(parents=True, exist_ok=True)
    files = {p.relative_to(ROOT / "widget").as_posix(): p.read_bytes()
             for p in sorted((ROOT / "widget").rglob("*")) if p.is_file()}
    ET.fromstring(files["config.xml"])
    files["config.js"] = ("var LAB_CONFIG = " + json.dumps(config, sort_keys=True, ensure_ascii=True) + ";\n").encode()
    for name, size in {"small": (106, 87), "big": (115, 95), "list": (85, 70), "biglist": (95, 78)}.items():
        files["icons/" + name + ".png"] = icon(*size)
    files["licenses/free-my-tv-MIT.txt"] = (ROOT / "licenses/free-my-tv-MIT.txt").read_bytes()
    files["LICENSE"] = (ROOT / "LICENSE").read_bytes()
    files["THIRD_PARTY_NOTICES.md"] = (ROOT / "THIRD_PARTY_NOTICES.md").read_bytes()
    zip_path = output / ZIP_NAME
    # Stored entries plus fixed timestamps/permissions give byte-identical packages.
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_STORED) as archive:
        for name, data in sorted(files.items()):
            entry = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, data)
    rsp = ET.Element("rsp", stat="ok")
    widget = ET.SubElement(ET.SubElement(rsp, "list"), "widget", id="OrsayLab")
    ET.SubElement(widget, "title").text = "Orsay Lab"
    ET.SubElement(widget, "compression", size=str(zip_path.stat().st_size), type="zip")
    ET.SubElement(widget, "description").text = "Remote and player diagnostic for Samsung Orsay"
    ET.SubElement(widget, "download").text = "http://" + host + (":" + str(port) if port != 80 else "") + "/" + ZIP_NAME
    ET.indent(rsp)
    (output / "widgetlist.xml").write_bytes(ET.tostring(rsp, encoding="utf-8", xml_declaration=True))
    preview = output / "preview"
    for name, data in files.items():
        target = preview / name
        target.parent.mkdir(parents=True, exist_ok=True)
        if name == "index.html":
            data = b"\n".join(line for line in data.split(b"\n") if b"$MANAGER_WIDGET" not in line)
        target.write_bytes(data)
    digest = hashlib.sha256(zip_path.read_bytes()).hexdigest()
    (output / "SHA256SUMS").write_text(digest + "  " + ZIP_NAME + "\n", encoding="ascii")
    return zip_path, digest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1", help="LAN IPv4 of the server, NOT the TV")
    parser.add_argument("--port", type=int, default=80)
    parser.add_argument("--config", type=Path)
    args = parser.parse_args()
    try:
        path, digest = build(args.host, args.port, args.config)
    except (ValueError, OSError) as error:
        parser.error(str(error))
    print(str(path) + "\nSHA256 " + digest)
    if args.host == "127.0.0.1":
        print("PREVIEW ONLY: rebuild with --host <LAN-IP> for the TV")


if __name__ == "__main__":
    main()
