#!/usr/bin/env python3
"""Local installation/preview server with single byte-range media support."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    extensions_map = dict(SimpleHTTPRequestHandler.extensions_map,
                          **{".xml": "text/xml; charset=utf-8", ".zip": "application/zip"})

    def __init__(self, *args, directory=None, media=None, **kwargs):
        self.media_path = Path(media or ROOT / "media/test.mp4")
        super().__init__(*args, directory=str(directory or ROOT / "dist"), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Range")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_HEAD(self):
        self.dispatch(head=True)

    def do_GET(self):
        self.dispatch(head=False)

    def dispatch(self, head):
        self.path = urlsplit(self.path).path  # logs/paths never need query strings
        if self.path == "/health.txt":
            data = b"Orsay Lab installation server OK\n"
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            if not head:
                self.wfile.write(data)
            return
        if self.path == "/media/test.mp4":
            self.media(head)
            return
        resolved = Path(self.translate_path(self.path)).resolve()
        if not resolved.is_relative_to(Path(self.directory).resolve()) or resolved.is_dir():
            self.send_error(404)
            return
        if head:
            super().do_HEAD()
        else:
            super().do_GET()

    def media(self, head):
        if not self.media_path.is_file():
            self.send_error(404, "Generate media/test.mp4 with tools/make_sample.py first")
            return
        size = self.media_path.stat().st_size
        start, end = 0, size - 1
        header = self.headers.get("Range")
        if header:
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", header.strip())
            valid = bool(match and any(match.groups()))
            if valid:
                first, last = match.groups()
                if first:
                    start = int(first)
                    end = min(int(last), end) if last else end
                else:
                    start = max(0, size - int(last))
                valid = 0 <= start <= end < size
            if not valid:
                self.send_response(416)
                self.send_header("Content-Range", "bytes */" + str(size))
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
        length = end - start + 1
        self.send_response(206 if header else 200)
        self.send_header("Content-Type", "video/mp4")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        if header:
            self.send_header("Content-Range", "bytes " + str(start) + "-" + str(end) + "/" + str(size))
        self.end_headers()
        if head:
            return
        try:
            with self.media_path.open("rb") as stream:
                stream.seek(start)
                remaining = length
                while remaining:
                    block = stream.read(min(65536, remaining))
                    if not block:
                        break
                    self.wfile.write(block)
                    remaining -= len(block)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        # Strip queries from the original request line too; never log tokens.
        message = re.sub(r"\?[^ ]*", "?[redacted]", fmt % args)
        super().log_message("%s", message)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", default="127.0.0.1", help="Use the server LAN IP for TV access")
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    if not (ROOT / "dist/widgetlist.xml").exists():
        parser.error("Run tools/build.py first")
    try:
        server = ThreadingHTTPServer((args.bind, args.port), Handler)
    except OSError as error:
        parser.error(str(error) + "; use an available port / follow INSTALL.md for port 80")
    print("Serving dist + /health.txt + /media/test.mp4 at http://" + args.bind + ":" + str(args.port), flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
