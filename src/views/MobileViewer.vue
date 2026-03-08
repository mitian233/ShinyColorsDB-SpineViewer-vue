<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import CanvasStage from '../components/CanvasStage.vue'
import AnimationPanel from '../components/AnimationPanel.vue'
import { useIdolData } from '../composables/useIdolData'
import { useUrlState } from '../composables/useUrlState'
import { useSpineRuntime } from '../composables/useSpineRuntime'
import { useExport } from '../composables/useExport'
import type { DressTypeKey, DressInfo, IdolInfo } from '../types'
import { DRESS_TYPE_LABELS } from '../types'

declare global {
  interface Window {
    PIXI: any
  }
}

const canvasStageRef = ref<InstanceType<typeof CanvasStage> | null>(null)

const { idolId, enzaId, dressType, renderer, urlFlag, getShareLink } = useUrlState()

const { idolInfoMap, idolDressMap, fetchIdolList, fetchDressList, getIdolName } = useIdolData()

const {
  app,
  container,
  animations,
  isContinuousShootingEnabled,
  setBackgroundColor,
  loadSpine,
  loadDroppedSpine,
  toggleAnimation,
  resetAllAnimation,
} = useSpineRuntime(
  computed(() => canvasStageRef.value?.canvasRef ?? null),
  renderer
)

const idolList = computed<IdolInfo[]>(() => {
  if (!idolInfoMap.value) return []
  return Array.from(idolInfoMap.value.values())
})

const dressList = computed<DressInfo[]>(() => {
  const idolName = getIdolName(idolId.value ?? 1)
  if (!idolName) return []
  return idolDressMap.value.get(idolName) ?? []
})

const dressListGroupedByType = computed(() => {
  const groups: Record<string, (DressInfo & { index: number })[]> = {}
  dressList.value.forEach((dress, index) => {
    const dressType = dress.dressType || 'unknown'
    if (!groups[dressType]) {
      groups[dressType] = []
    }
    groups[dressType].push({ ...dress, index })
  })
  return Object.entries(groups).map(([label, items]) => ({ label, items }))
})

const selectedDressIndex = ref(0)
const backgroundColor = ref('#000000')

const currentDress = computed<DressInfo | undefined>(() => {
  return dressList.value[selectedDressIndex.value]
})

const typeList = computed(() => {
  if (!currentDress.value) return []
  const dress = currentDress.value
  return [
    {
      value: 'sml_cloth0' as DressTypeKey,
      label: DRESS_TYPE_LABELS['sml_cloth0'],
      available: !!dress.sml_Cloth0,
    },
    {
      value: 'sml_cloth1' as DressTypeKey,
      label: DRESS_TYPE_LABELS['sml_cloth1'],
      available: !!dress.sml_Cloth1,
    },
    {
      value: 'big_cloth0' as DressTypeKey,
      label: DRESS_TYPE_LABELS['big_cloth0'],
      available: !!dress.big_Cloth0,
    },
    {
      value: 'big_cloth1' as DressTypeKey,
      label: DRESS_TYPE_LABELS['big_cloth1'],
      available: !!dress.big_Cloth1,
    },
  ]
})

const { saveImage, copyLinkToClipboard } = useExport(
  () => app.value,
  () => container.value,
  () => idolInfoMap.value?.get(idolId.value ?? 1)?.idolName ?? '',
  () => {
    const dress = currentDress.value
    const type = typeList.value.find((t) => t.value === dressType.value)
    const dressInfo = dressListGroupedByType.value.find((g) =>
      g.items.some((i) => i.index === selectedDressIndex.value)
    )
    return {
      category: dressInfo?.label ?? '',
      name: dress?.dressName ?? '',
      type: type?.label ?? '',
    }
  }
)

const showCopiedToast = ref(false)
const showWebGLModal = ref(false)
const showThanksModal = ref(false)

async function initialize() {
  const PIXI = window.PIXI

  if (!PIXI.isWebGLSupported() && !PIXI.isWebGPUSupported()) {
    showWebGLModal.value = true
  }

  await fetchIdolList()
  await loadInitialDress()
}

async function loadInitialDress() {
  const idolName = getIdolName(idolId.value ?? 1)
  if (!idolName) return

  const dresses = await fetchDressList(idolId.value ?? 1, idolName)

  if (!urlFlag.value && enzaId.value) {
    const idx = dresses.findIndex((d) => d.enzaId === enzaId.value)
    if (idx >= 0) {
      selectedDressIndex.value = idx
    }
    urlFlag.value = true
  }

  await loadCurrentSpine()
}

async function loadCurrentSpine() {
  const dress = currentDress.value
  if (!dress) return

  const type = dressType.value ?? getDefaultDressType(dress)
  dressType.value = type

  if (dress.idolId === 0 && dress.path) {
    await loadSpine(dress.path, type, true)
  } else {
    await loadSpine(dress.enzaId, type)
  }
}

function getDefaultDressType(dress: DressInfo): DressTypeKey {
  if (dress.big_Cloth0) return 'big_cloth0'
  if (dress.big_Cloth1) return 'big_cloth1'
  if (dress.sml_Cloth0) return 'sml_cloth0'
  return 'sml_cloth1'
}

async function handleIdolChange(newIdolId: number) {
  idolId.value = newIdolId
  selectedDressIndex.value = 0

  const idolName = getIdolName(newIdolId)
  if (idolName) {
    await fetchDressList(newIdolId, idolName)
    await nextTick()
    await loadCurrentSpine()
  }
}

async function handleDressChange(newIndex: number) {
  selectedDressIndex.value = newIndex
  await loadCurrentSpine()
}

async function handleTypeChange(newType: DressTypeKey) {
  dressType.value = newType
  await loadCurrentSpine()
}

function handleColorChange(color: string) {
  backgroundColor.value = color
  setBackgroundColor(color)
}

function handleShare() {
  const link = getShareLink()
  copyLinkToClipboard(link)
  showCopiedToast.value = true
  setTimeout(() => {
    showCopiedToast.value = false
  }, 2000)
}

async function handleSave() {
  await saveImage()
}

async function handleDrop(atlas: string, json: string, textures: Map<string, File>) {
  await loadDroppedSpine(atlas, json, textures)
}

function handleAnimationToggle(trackIndex: number, checked: boolean) {
  toggleAnimation(trackIndex, checked)
}

function handleAnimationReset() {
  resetAllAnimation()
}

function handleContinuousShootingChange(enabled: boolean) {
  isContinuousShootingEnabled.value = enabled
}

watch(backgroundColor, (color) => {
  setBackgroundColor(color)
})

onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="mobile-viewer d-flex flex-column vh-100">
    <!-- Modals -->
    <div v-if="showWebGLModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Legacy Mode Detected</h5>
            <button type="button" class="btn-close" @click="showWebGLModal = false" />
          </div>
          <div class="modal-body">
            <div class="text-center">
              Hardware acceleration is required for PIXI.js to run in WebGL mode.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="showWebGLModal = false">
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showThanksModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">特別感謝</h5>
            <button type="button" class="btn-close" @click="showThanksModal = false" />
          </div>
          <div class="modal-body">
            <span class="text-primary">技術諮詢</span>
            <div class="ms-2">TWY</div>
            <span class="text-primary">爆肝小夥伴</span>
            <div class="ms-2">木下梨花 KaiOuO Lycoris 剎那 十秒十六胎 匿名小夥伴一號</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showThanksModal = false">
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 11">
      <div v-if="showCopiedToast" class="toast show" role="alert">
        <div class="toast-header">
          <strong class="me-auto">Copied!</strong>
          <button type="button" class="btn-close" @click="showCopiedToast = false" />
        </div>
        <div class="toast-body">
          <div class="text-center">Link is copied!</div>
        </div>
      </div>
    </div>

    <!-- Animation Offcanvas -->
    <div class="offcanvas offcanvas-start bg-secondary" id="animationPanel" tabindex="-1">
      <AnimationPanel
        :animations="animations"
        @toggle="handleAnimationToggle"
        @reset="handleAnimationReset"
      />
    </div>

    <!-- Menu Offcanvas -->
    <div class="offcanvas offcanvas-start p-3 bg-dark" id="menuPanel" tabindex="-1">
      <label>Idol:</label>
      <select
        class="form-select"
        :value="idolId"
        @change="(e) => handleIdolChange(Number((e.target as HTMLSelectElement).value))"
      >
        <option v-for="idol in idolList" :key="idol.idolId" :value="idol.idolId">
          {{ idol.idolName }}
        </option>
      </select>

      <label>Dress:</label>
      <select
        class="form-select"
        :value="selectedDressIndex"
        @change="(e) => handleDressChange(Number((e.target as HTMLSelectElement).value))"
      >
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
      <select
        class="form-select"
        :value="dressType"
        @change="(e) => handleTypeChange((e.target as HTMLSelectElement).value as DressTypeKey)"
      >
        <option v-for="t in typeList.filter((t) => t.available)" :key="t.value" :value="t.value">
          {{ t.label }}
        </option>
      </select>

      <label>Animation:</label>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-target="#animationPanel"
      >
        AnimationList
      </button>

      <label>Background Color:</label>
      <input
        type="color"
        class="form-control mb-3"
        :value="backgroundColor"
        @input="(e) => handleColorChange((e.target as HTMLInputElement).value)"
      />

      <a href="https://shinycolors.moe" class="btn btn-info mb-3" target="_blank">
        ShinyColors Database
      </a>
      <button
        type="button"
        class="btn btn-info mb-3"
        data-bs-toggle="modal"
        data-bs-target="#thanksModal"
        @click="showThanksModal = true"
      >
        Special Thanks
      </button>

      <input
        type="button"
        class="btn btn-secondary"
        data-bs-toggle="offcanvas"
        data-bs-target="#menuPanel"
        value="back"
      />

      <div class="form-check form-switch mt-3">
        <input
          id="continuousShootingSwitchMobile"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="isContinuousShootingEnabled"
          @change="(e) => handleContinuousShootingChange((e.target as HTMLInputElement).checked)"
        />
        <label class="form-check-label" for="continuousShootingSwitchMobile">
          <span>Enable continuous shooting</span>
        </label>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="flex-shrink-0 w-100 h-100">
      <div class="justify-content-center p-0 d-flex w-100 h-100">
        <CanvasStage ref="canvasStageRef" @drop="handleDrop" />
      </div>
    </div>

    <!-- Footer -->
    <footer
      class="footer mt-auto py-3 bg-dark w-100 position-absolute bottom-0 start-50 translate-middle-x"
    >
      <div class="container d-flex gap-2">
        <button
          class="btn btn-secondary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#menuPanel"
        >
          <svg viewBox="0 0 100 80" width="20" height="20">
            <rect width="80" height="10" />
            <rect y="30" width="80" height="10" />
            <rect y="60" width="80" height="10" />
          </svg>
          menu
        </button>
        <button class="btn btn-secondary" type="button" @click="handleShare">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 13.5L15 16.5M15 7.5L9 10.5M18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21ZM6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15ZM18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9Z"
              stroke="#000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          share
        </button>
        <button class="btn btn-secondary" type="button" @click="handleSave">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000"
          >
            <path
              d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
              fill="none"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
            <polyline
              points="7.9 12.3 12 16.3 16.1 12.3"
              fill="none"
              stroke="#000"
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
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          save
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.mobile-viewer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.mobile-viewer label {
  color: #fff;
  padding: 4px;
  margin-top: 0.5rem;
}

.footer {
  bottom: 0;
}
</style>
