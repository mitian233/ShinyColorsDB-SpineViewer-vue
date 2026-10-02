<script setup lang="ts">
import { ScButton, ScCheckbox } from 'shiny-colors-ui'
import type { AnimationItem } from '../types'

const props = defineProps<{ animations: AnimationItem[] }>()
const emit = defineEmits<{
  (e: 'toggle', trackIndex: number, checked: boolean): void
  (e: 'reset'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="animation-panel">
    <div class="animation-panel__list">
      <ScCheckbox
        v-for="anim in props.animations"
        :key="anim.name"
        :label="anim.name"
        :model-value="anim.checked"
        @update:model-value="emit('toggle', anim.trackIndex, $event)"
      />
    </div>
    <div class="animation-panel__actions">
      <hr class="viewer-divider" />
      <ScButton variant="danger" @click="emit('reset')">リセット</ScButton>
      <ScButton variant="primary" @click="emit('close')">閉じる</ScButton>
    </div>
  </div>
</template>

<style scoped>
.animation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.animation-panel__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  overflow-y: auto;
  padding: 4px;
  min-height: 0;
  overflow-wrap: anywhere;
}

.animation-panel__actions {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
}
</style>
