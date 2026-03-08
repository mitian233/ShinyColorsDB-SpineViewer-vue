<script setup lang="ts">
import type { AnimationItem } from '../types'

defineProps<{
  animations: AnimationItem[]
}>()

const emit = defineEmits<{
  (e: 'toggle', trackIndex: number, checked: boolean): void
  (e: 'reset'): void
}>()

function handleCheckboxChange(anim: AnimationItem, event: Event) {
  const target = event.target as HTMLInputElement
  emit('toggle', anim.trackIndex, target.checked)
}
</script>

<template>
  <div class="animation-panel">
    <div class="animation-header">
      <h5 class="animation-title">Animation</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
    </div>
    <div class="animation-body">
      <div class="animation-list">
        <div v-for="anim in animations" :key="anim.name" class="animation-item">
          <input
            type="checkbox"
            :id="anim.name"
            :name="anim.name"
            :checked="anim.checked"
            class="form-check-input"
            @change="handleCheckboxChange(anim, $event)"
          />
          <label :for="anim.name" class="form-check-label">{{ anim.name }}</label>
        </div>
      </div>
      <div class="animation-actions">
        <button type="button" class="btn btn-danger w-100" @click="emit('reset')">リセット</button>
        <button
          type="button"
          class="btn btn-primary w-100"
          data-bs-dismiss="offcanvas"
          data-bs-target="#animationPanel"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.animation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.animation-title {
  margin: 0;
  font-size: 1.1rem;
}

.animation-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.animation-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
}

.animation-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.animation-actions {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
