<script setup lang="ts">
import { ScPanel, ScButton } from 'shiny-colors-ui'

withDefaults(defineProps<{ title: string; tone?: 'error' | 'success'; closable?: boolean }>(), {
  tone: 'error',
  closable: false,
})
defineEmits<{ close: [] }>()
</script>

<template>
  <ScPanel
    :title="title"
    :class="['viewer-notice', `viewer-notice--${tone}`]"
    :role="tone === 'error' ? 'alert' : 'status'"
  >
    <ScButton
      v-if="closable"
      class="viewer-notice__close"
      variant="ghost"
      size="sm"
      :aria-label="`${title}を閉じる`"
      @click="$emit('close')"
    >
      ×
    </ScButton>
    <slot />
  </ScPanel>
</template>

<style scoped>
.viewer-notice {
  position: relative;
  padding: 12px 16px;
  font-size: 14px;
  overflow-wrap: anywhere;
}
.viewer-notice--error {
  border-color: #b94369;
}
.viewer-notice--success {
  border-color: var(--sc-blue);
}
.viewer-notice :deep(.sc-panel__title) {
  margin-bottom: 8px;
  padding-bottom: 8px;
  padding-right: 32px;
  font-size: 15px;
}
.viewer-notice__close {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 0 10px;
  font-size: 22px;
}
</style>
