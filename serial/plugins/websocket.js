export default ({ app }, inject) => {
    if (process.client) {
      const socket = new WebSocket("ws://localhost:8080");
      // const socket = new WebSocket("ws://176.72.74.148:8080");
  
      socket.onopen = () => console.log("WebSocket Connected");
      socket.onmessage = (event) => console.log("Received:", event.data);
      socket.onerror = (error) => console.error("WebSocket Error:", error);
      socket.onclose = () => console.log("WebSocket Disconnected");
  
      inject("socket", socket);
    }
  };