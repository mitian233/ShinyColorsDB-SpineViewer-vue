<script setup lang="ts">
import { NButton, NCheckbox, NScrollbar, NSpace, NThing } from 'naive-ui'
import type { AnimationItem } from '../types'

const props = defineProps<{
  animations: AnimationItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle', trackIndex: number, checked: boolean): void
  (e: 'reset'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="animation-panel">
    <n-thing>
      <template #header>Animation</template>
      <template #header-extra>
        <n-button quaternary @click="emit('close')">閉じる</n-button>
      </template>
    </n-thing>
    <n-scrollbar class="animation-scroll">
      <n-space vertical :size="8">
        <n-checkbox
          v-for="anim in props.animations"
          :key="anim.name"
          :checked="anim.checked"
          @update:checked="(checked: boolean) => emit('toggle', anim.trackIndex, checked)"
        >
          {{ anim.name }}
        </n-checkbox>
      </n-space>
    </n-scrollbar>
    <n-space vertical :size="8">
      <n-button type="error" block @click="emit('reset')">リセット</n-button>
      <n-button type="primary" block @click="emit('close')">閉じる</n-button>
    </n-space>
  </div>
</template>

<style scoped>
.animation-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
}

.animation-scroll {
  flex: 1;
  padding-right: 0.25rem;
}
</style>
