<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider } from 'naive-ui'
import { naiveThemeOverrides } from './theme/naiveTheme'
</script>

<template>
  <n-config-provider :theme-overrides="naiveThemeOverrides">
    <RouterView />
  </n-config-provider>
</template>
