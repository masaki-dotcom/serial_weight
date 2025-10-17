const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");
const http = require("http");

// シリアルポート設定
const port = new SerialPort({ path: "COM8", baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// HTTPサーバーを作成
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running\n");
});

// WebSocketサーバー作成
const wss = new WebSocket.Server({ server });

//WebSocketサーバー (wss) に新しいクライアント (ws) が接続されたとき
wss.on("connection", (ws) => {
  console.log("Client connected");

 //Arduino から送られてきたデータが格納される
  parser.on("data", (data) => {
    console.log("Arduino Data:", data);
    ws.send(data);
  });

  //WebSocketから"tare"を受け取ったら、Arduinoに送信する処理を追加
  ws.on("message", (message) => {
    const command = message.toString().trim();  // ←ここでBuffer→文字列に変換
  
    console.log("Received from client:", command);
  
    if (command === "tare") {
      port.write("tare\n");  // Arduinoに送信
      console.log("Sent 'tare' command to Arduino");
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// HTTPサーバーを起動
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});
