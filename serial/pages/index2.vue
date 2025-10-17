<template>
  <div>
    <h1>Arduino Data:</h1>
    <h2>気温：{{ message.temperature }} ℃　　　湿度：{{ message.humidity }} ％</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Waiting for data...",
    };
  },
  mounted() {
    if (this.$socket) {
      this.$socket.onmessage = (event) => {

        console.log(event.data)
        this.message = JSON.parse(event.data);
      };
    } else {
      console.error("WebSocket connection failed");
    }
  },
};
</script>
