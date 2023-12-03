from http.server import SimpleHTTPRequestHandler, HTTPServer

hostName = "localhost"
serverPort = 8000

class MyServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        sensitive_file_path = "/Lex/SIEM_Project/SimulateMalware.txt"
        
        with open(sensitive_file_path, "r") as file:
            content = file.read()

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("hi", "utf-8"))
        self.wfile.write(bytes(content, "utf-8"))
if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print(f"Server started http://{hostName}:{serverPort}")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
