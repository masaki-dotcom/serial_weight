<template>
  <div>
    <h1>Arduino Data:</h1>
    <h2>{{ message }}</h2>
    <button @click="sendTare">ゼロリセット</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Waiting for data...",
      socket: null,
    };
  },
  mounted() {
    this.socket = new WebSocket("ws://localhost:8080");
    // this.socket = new WebSocket("ws://176.72.74.148:8080");

    this.socket.onmessage = (event) => {
      console.log(event.data);
      this.message = event.data;
    };

    this.socket.onopen = () => console.log("WebSocket connected");
    this.socket.onerror = (error) => console.error("WebSocket error:", error);
    this.socket.onclose = () => console.log("WebSocket disconnected");
  },
  methods: {
    sendTare() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send("tare");
        console.log("Sent 'tare' command to server");
      } else {
        console.error("WebSocket not connected");
      }
    },
  },
};
</script>
