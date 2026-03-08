<script setup lang="ts">
import { computed } from 'vue'
import type { IdolInfo, DressInfo, DressTypeKey } from '../types'

const props = defineProps<{
  idolList: IdolInfo[]
  dressList: DressInfo[]
  typeList: { value: DressTypeKey; label: string; available: boolean }[]
  selectedIdolId: number
  selectedDressIndex: number
  selectedType: DressTypeKey
  backgroundColor: string
  continuousShootingEnabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedIdolId', value: number): void
  (e: 'update:selectedDressIndex', value: number): void
  (e: 'update:selectedType', value: DressTypeKey): void
  (e: 'update:backgroundColor', value: string): void
  (e: 'update:continuousShootingEnabled', value: boolean): void
  (e: 'share'): void
  (e: 'save'): void
  (e: 'openAnimation'): void
  (e: 'openThanks'): void
}>()

const dressListGroupedByType = computed(() => {
  const groups: Record<string, (DressInfo & { index: number })[]> = {}

  props.dressList.forEach((dress, index) => {
    const dressType = dress.dressType || 'unknown'
    if (!groups[dressType]) {
      groups[dressType] = []
    }
    groups[dressType].push({ ...dress, index })
  })

  return Object.entries(groups).map(([label, items]) => ({ label, items }))
})

function handleIdolChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:selectedIdolId', Number(target.value))
}

function handleDressChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:selectedDressIndex', Number(target.value))
}

function handleTypeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:selectedType', target.value as DressTypeKey)
}

function handleColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:backgroundColor', target.value)
}

function handleContinuousShootingChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:continuousShootingEnabled', target.checked)
}
</script>

<template>
  <div class="sidebar-panel">
    <label>Idol:</label>
    <select class="form-select" :value="selectedIdolId" @change="handleIdolChange">
      <option v-for="idol in idolList" :key="idol.idolId" :value="idol.idolId">
        {{ idol.idolName }}
      </option>
    </select>

    <label>Dress:</label>
    <select class="form-select" :value="selectedDressIndex" @change="handleDressChange">
      <optgroup v-for="group in dressListGroupedByType" :key="group.label" :label="group.label">
        <option
          v-for="item in group.items"
          :key="item.index"
          :value="item.index"
          :disabled="!item.exist"
        >
          {{ item.dressName }}
        </option>
      </optgroup>
    </select>

    <label>Type:</label>
    <select class="form-select" :value="selectedType" @change="handleTypeChange">
      <option
        v-for="type in typeList.filter((t) => t.available)"
        :key="type.value"
        :value="type.value"
      >
        {{ type.label }}
      </option>
    </select>

    <label>Animation:</label>
    <button
      type="button"
      class="btn btn-primary"
      @click="emit('openAnimation')"
      data-bs-toggle="offcanvas"
      data-bs-target="#animationPanel"
    >
      AnimationList
    </button>

    <label>Background Color:</label>
    <input
      type="color"
      class="form-control w-100 mb-3"
      :value="backgroundColor"
      @input="handleColorChange"
    />

    <a href="https://shinycolors.moe" class="btn btn-info mb-3" target="_blank">
      ShinyColors Database
    </a>
    <button
      type="button"
      class="btn btn-info mb-3"
      @click="emit('openThanks')"
      data-bs-toggle="modal"
      data-bs-target="#thanksModal"
    >
      Special Thanks
    </button>

    <button class="btn btn-secondary mb-3" type="button" @click="emit('share')">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 13.5L15 16.5M15 7.5L9 10.5M18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21ZM6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15ZM18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      share
    </button>
    <button class="btn btn-secondary mb-3" type="button" @click="emit('save')">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <path
          d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <polyline
          points="7.9 12.3 12 16.3 16.1 12.3"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <line
          x1="12"
          y1="2.7"
          x2="12"
          y2="14.2"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
      save
    </button>

    <div class="form-check form-switch">
      <input
        id="continuousShootingSwitch"
        class="form-check-input"
        type="checkbox"
        role="switch"
        :checked="continuousShootingEnabled"
        @change="handleContinuousShootingChange"
      />
      <label class="form-check-label" for="continuousShootingSwitch">
        <span>Enable continuous shooting</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.sidebar-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #212529;
  height: 100%;
}

.sidebar-panel label {
  color: #fff;
  padding: 4px;
  margin-top: 0.5rem;
}

.sidebar-panel select {
  font-family: 'LINESEED', sans-serif;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}
</style>
