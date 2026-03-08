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
  font-family: Meiryo, Arial, Helvetica, sans-serif;
}

div span {
  color: #fff;
  padding: 4px;
}

select,
option {
  font-family: 'LINESEED';
}

.form-select {
  padding: 0.5rem 2.25rem 0.375rem 1rem;
  outline: none;
}

select:focus {
  box-shadow: 0 0 3pt 2pt #569ce2;
}

.form-input {
  border-radius: 0.4rem;
  box-shadow: none;
}

.form-input:focus {
  outline: none !important;
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
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
