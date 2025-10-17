<template>
    <div>
      <h1>Arduino Data:</h1>
      <h2> {{ message }} </h2>
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
          this.message = event.data;
        };
      } else {
        console.error("WebSocket connection failed");
      }
    },
  };
  </script>
  