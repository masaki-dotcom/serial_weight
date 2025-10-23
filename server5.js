// 必要なモジュール
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");
const http = require("http");

// --------------------
// シリアルポート設定
// --------------------
const port = new SerialPort({ path: "COM8", baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

let latestData = null;

// Arduinoからデータ受信
parser.on("data", (data) => {
  latestData = data.trim(); // 最新データを保存
  // 受信と同時に全WebSocketクライアントへ送信
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(latestData);
    }
  });
});

// --------------------
// HTTP + WebSocketサーバー
// --------------------
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running\n");
});

const wss = new WebSocket.Server({ server });

// WebSocket接続処理
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const command = message.toString().trim();
    console.log("Received from client:", command);

    // "tare"コマンドをArduinoに送信
    if (command === "tare") {
      port.write("tare\n");
      console.log("Sent 'tare' command to Arduino");
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// サーバー起動
server.listen(8080, () => {
  console.log("Server running at http://localhost:8080/");
});

// --------------------
// 1分ごとにログ表示
// --------------------
setInterval(() => {
  const now = new Date();
  const timeStr = now.toLocaleString();
  console.log(`${timeStr} : ${latestData ?? "No data yet"}`);
}, 60 * 1000); // 60秒ごと
//node server.js  で起動