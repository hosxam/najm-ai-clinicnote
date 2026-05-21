import http.server, os, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"REQ: path={self.path!r}", file=sys.stderr)
        local = self.translate_path(self.path)
        print(f"     local={local!r}", file=sys.stderr)
        print(f"     isdir={os.path.isdir(local)}", file=sys.stderr)
        if os.path.isdir(local):
            idx = os.path.join(local, 'index.html')
            print(f"     idx exists={os.path.isfile(idx)}", file=sys.stderr)
            if os.path.isfile(idx):
                self.path = os.path.join(self.path, 'index.html')
                local2 = self.translate_path(self.path)
                print(f"     redirected to {local2!r}", file=sys.stderr)
        super().do_GET()

http.server.HTTPServer(('0.0.0.0', 8082), Handler).serve_forever()
