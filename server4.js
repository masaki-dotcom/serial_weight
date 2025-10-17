const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");
const http = require("http");

// シリアルポート設定
const port = new SerialPort({ path: "COM8", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// HTTPサーバーを作成
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

    // 温度と湿度のフォーマットを確認し、適切に送信
    const match = data.match(/温度:\s*([\d.]+)\s*C.*湿度:\s*([\d.]+)%/);
    if (match) {
      const temperature = match[1];
      const humidity = match[2];
      ws.send(JSON.stringify({ temperature, humidity }));
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// サーバーを起動
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});


//node server.js  で起動