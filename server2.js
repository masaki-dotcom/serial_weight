const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");
const http = require("http");

// シリアルポート設定
const port = new SerialPort({ path: "COM8", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// HTTPサーバーを作成（WebSocketのエラーを防ぐ）
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running\n");
});

// WebSocketサーバーを作成
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  parser.on("data", (data) => {
    console.log("Arduino Data:", data);
    ws.send(data);
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// HTTPサーバーとWebSocketサーバーを同じポートで起動
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});
//node server.js  で起動