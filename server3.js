const { SerialPort } = require("serialport"); // 修正
const { ReadlineParser } = require("@serialport/parser-readline"); // 修正
const WebSocket = require("ws");

const port = new SerialPort({ path: "COM8", baudRate: 9600 }); // 修正
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

const wss = new WebSocket.Server({ port: 8080 });

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

console.log("WebSocket server running on ws://localhost:8080");
//node server.js  で起動