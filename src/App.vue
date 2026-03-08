<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
@font-face {
  font-family: 'LINESEED';
  src: url('https://cf-static.shinycolors.moe/fonts/LINESeedJP_OTF_Bd.woff2') format('woff2');
}

* {
  box-sizing: border-box;
  font-family: 'LINESEED', 'Meiryo', Arial, Helvetica, sans-serif;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
