<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  Label,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'reka-ui'
import { ScIcon } from 'shiny-colors-ui'
import type { ViewerSelectGroupOption } from '../composables/useViewerShared'

defineProps<{ groups: ViewerSelectGroupOption[] }>()
const model = defineModel<number>({ required: true })
const value = computed({
  get: () => String(model.value),
  set: (value: string) => {
    if (value !== '' && Number.isInteger(Number(value))) model.value = Number(value)
  },
})
const id = useId()
</script>

<template>
  <div class="sc-select-field">
    <Label :for="id" class="sc-field-label">衣装</Label>
    <SelectRoot v-model="value" :disabled="groups.length === 0">
      <SelectTrigger :id="id" class="sc-select__trigger" aria-label="衣装">
        <SelectValue placeholder="衣装を選択" />
        <SelectIcon>
          <ScIcon name="next_arrow.png" :size="14" class="sc-select__arrow" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="sc-select__content" position="popper" :side-offset="6">
          <SelectViewport>
            <SelectGroup v-for="group in groups" :key="group.key">
              <SelectLabel class="dress-group-label">{{ group.label }}</SelectLabel>
              <SelectItem
                v-for="item in group.children"
                :key="item.value"
                :value="String(item.value)"
                :disabled="item.disabled"
                class="sc-select__item"
              >
                <SelectItemText>{{ item.label }}</SelectItemText>
                <SelectItemIndicator>
                  <ScIcon name="check_icon.png" :size="20" />
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<style scoped>
.dress-group-label {
  padding: 8px 12px 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--sc-ink-muted);
}
</style>
