<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { ScInput } from '@mitian233/scui'

const model = defineModel<string>({ required: true })
const draft = shallowRef(model.value)
const error = computed(() =>
  /^#[0-9a-f]{6}$/i.test(draft.value) ? undefined : '#RRGGBB の形式で色を入力してください。'
)

watch(model, (color) => {
  draft.value = color
})

function updateColor(color: string) {
  draft.value = color
  if (/^#[0-9a-f]{6}$/i.test(color)) model.value = color
}
</script>

<template>
  <div class="viewer-color-picker">
    <ScInput
      :model-value="draft"
      label="背景色"
      :error="error"
      placeholder="#000000"
      maxlength="7"
      spellcheck="false"
      @update:model-value="updateColor"
    />
    <input
      type="color"
      class="sc-input viewer-color-picker__swatch"
      aria-label="背景色を選択"
      :value="model"
      @input="updateColor(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.viewer-color-picker {
  position: relative;
}

.viewer-color-picker :deep(.sc-input-field .sc-input) {
  padding-right: 64px;
}

.viewer-color-picker__swatch {
  position: absolute;
  right: 4px;
  top: 34px;
  width: 52px;
  height: 36px;
  padding: 3px;
  cursor: pointer;
}
</style>
