<script setup lang="ts">
import { computed } from 'vue'
import { ScButton, ScSelect, ScSwitch } from 'shiny-colors-ui'
import ViewerDressSelect from './ViewerDressSelect.vue'
import ViewerColorPicker from './ViewerColorPicker.vue'
import type { ViewerSelectGroupOption, ViewerSelectOption } from '../composables/useViewerShared'

const props = withDefaults(
  defineProps<{
    idolId: number | null
    selectedDressIndex: number
    dressType: string | null
    backgroundColor: string
    idolOptions: ViewerSelectOption[]
    dressOptions: ViewerSelectGroupOption[]
    typeOptions: ViewerSelectOption[]
    continuousShootingEnabled: boolean
    showActionButtons?: boolean
  }>(),
  { showActionButtons: true }
)

const emit = defineEmits<{
  (e: 'update:idol', value: string | number | null): void
  (e: 'update:dress', value: string | number | null): void
  (e: 'update:type', value: string | number | null): void
  (e: 'update:backgroundColor', value: string): void
  (e: 'update:continuousShootingEnabled', value: boolean): void
  (e: 'openAnimation'): void
  (e: 'openDatabase'): void
  (e: 'openThanks'): void
  (e: 'share'): void
  (e: 'save'): void
}>()

const idolItems = computed(() =>
  props.idolOptions.map((item) => ({ ...item, value: String(item.value) }))
)
const typeItems = computed(() =>
  props.typeOptions.map((item) => ({ ...item, value: String(item.value) }))
)

function updateIdol(value?: string) {
  if (value !== undefined && value !== '' && Number.isInteger(Number(value))) {
    emit('update:idol', Number(value))
  }
}
</script>

<template>
  <div class="viewer-controls">
    <ScSelect
      label="アイドル"
      :model-value="props.idolId === null ? undefined : String(props.idolId)"
      :items="idolItems"
      :disabled="idolItems.length === 0"
      placeholder="アイドルを選択"
      @update:model-value="updateIdol"
    />
    <ViewerDressSelect
      :model-value="props.selectedDressIndex"
      :groups="props.dressOptions"
      @update:model-value="emit('update:dress', $event)"
    />
    <ScSelect
      label="表示タイプ"
      :model-value="props.dressType ?? undefined"
      :items="typeItems"
      :disabled="typeItems.length === 0"
      placeholder="表示タイプを選択"
      @update:model-value="emit('update:type', $event ?? null)"
    />
    <div class="viewer-controls__field">
      <span class="sc-field-label">アニメーション</span>
      <ScButton variant="primary" @click="emit('openAnimation')">アニメーション一覧</ScButton>
    </div>
    <ViewerColorPicker
      :model-value="props.backgroundColor"
      @update:model-value="emit('update:backgroundColor', $event)"
    />
    <ScSwitch
      label="連続撮影"
      :model-value="props.continuousShootingEnabled"
      @update:model-value="emit('update:continuousShootingEnabled', $event)"
    />
    <hr class="viewer-divider" />
    <ScButton size="sm" @click="emit('openDatabase')">シャイニーカラーズDB</ScButton>
    <ScButton size="sm" @click="emit('openThanks')">スペシャルサンクス</ScButton>
    <div v-if="props.showActionButtons" class="viewer-controls__actions">
      <ScButton size="sm" @click="emit('share')">リンクを共有</ScButton>
      <ScButton size="sm" variant="primary" @click="emit('save')">画像を保存</ScButton>
    </div>
  </div>
</template>

<style scoped>
.viewer-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.viewer-controls__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viewer-controls__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
</style>
