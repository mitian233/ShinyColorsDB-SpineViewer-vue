<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ScButton, ScLoader } from 'shiny-colors-ui'
import ViewerDrawer from '../components/ViewerDrawer.vue'
import ViewerFeedback from '../components/ViewerFeedback.vue'
import ViewerNotice from '../components/ViewerNotice.vue'
import AnimationPanel from '../components/AnimationPanel.vue'
import CanvasStage from '../components/CanvasStage.vue'
import ViewerControls from '../components/ViewerControls.vue'
import { useViewerShared } from '../composables/useViewerShared'

const canvasStageRef = ref<InstanceType<typeof CanvasStage> | null>(null)
const canvasElementRef = computed(() => canvasStageRef.value?.canvasRef ?? null)
const showMenuDrawer = ref(false)
const viewportWidth = ref(window.innerWidth)
const SIDEBAR_BREAKPOINT = 1280
const isWideLayout = computed(() => viewportWidth.value >= SIDEBAR_BREAKPOINT)

const {
  animations,
  backgroundColor,
  dressOptions,
  dressType,
  error,
  handleAnimationReset,
  handleAnimationToggle,
  handleColorChange,
  handleContinuousShootingChange,
  handleDrop,
  handleSave,
  handleShare,
  idolId,
  idolOptions,
  isContinuousShootingEnabled,
  loading,
  openDatabase,
  saveError,
  selectedDressIndex,
  showAnimationDrawer,
  showCopiedToast,
  showThanksModal,
  showWebGLModal,
  typeOptions,
  updateDress,
  updateIdol,
  updateType,
  destroy,
} = useViewerShared(canvasElementRef)

function handleResize() {
  viewportWidth.value = window.innerWidth
}

watch(isWideLayout, (wide) => {
  if (wide) {
    showMenuDrawer.value = false
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  destroy()
})
</script>

<template>
  <div class="desktop-viewer">
    <aside v-if="isWideLayout" class="desktop-viewer__sidebar" aria-label="設定">
      <ViewerControls
        :idol-id="idolId ?? null"
        :selected-dress-index="selectedDressIndex"
        :dress-type="dressType ?? null"
        :background-color="backgroundColor"
        :idol-options="idolOptions"
        :dress-options="dressOptions"
        :type-options="typeOptions"
        :continuous-shooting-enabled="isContinuousShootingEnabled"
        @update:idol="updateIdol"
        @update:dress="updateDress"
        @update:type="updateType"
        @update:background-color="handleColorChange"
        @update:continuous-shooting-enabled="handleContinuousShootingChange"
        @open-animation="showAnimationDrawer = true"
        @open-database="openDatabase"
        @open-thanks="showThanksModal = true"
        @share="handleShare"
        @save="handleSave"
      />
    </aside>
    <main class="desktop-viewer__stage">
      <ScButton
        v-if="!isWideLayout"
        class="desktop-viewer__menu"
        size="sm"
        @click="showMenuDrawer = true"
      >
        設定
      </ScButton>
      <CanvasStage ref="canvasStageRef" @drop="handleDrop" />
      <Transition name="loading-overlay" appear>
        <div v-if="loading" class="loading-backdrop">
          <ScLoader size="lg" label="読み込み中…" />
        </div>
      </Transition>
      <ViewerNotice v-if="error" title="読み込みに失敗しました" class="desktop-viewer__error">
        アニメーションを読み込めませんでした。通信環境を確認して、もう一度お試しください。
      </ViewerNotice>
    </main>
  </div>

  <ViewerDrawer v-model:open="showAnimationDrawer" title="アニメーション">
    <AnimationPanel
      :animations="animations"
      @toggle="handleAnimationToggle"
      @reset="handleAnimationReset"
      @close="showAnimationDrawer = false"
    />
  </ViewerDrawer>

  <ViewerDrawer v-model:open="showMenuDrawer" title="設定" placement="left">
    <ViewerControls
      :idol-id="idolId ?? null"
      :selected-dress-index="selectedDressIndex"
      :dress-type="dressType ?? null"
      :background-color="backgroundColor"
      :idol-options="idolOptions"
      :dress-options="dressOptions"
      :type-options="typeOptions"
      :continuous-shooting-enabled="isContinuousShootingEnabled"
      @update:idol="updateIdol"
      @update:dress="updateDress"
      @update:type="updateType"
      @update:background-color="handleColorChange"
      @update:continuous-shooting-enabled="handleContinuousShootingChange"
      @open-animation="showAnimationDrawer = true"
      @open-database="openDatabase"
      @open-thanks="showThanksModal = true"
      @share="handleShare"
      @save="handleSave"
    />
  </ViewerDrawer>

  <ViewerFeedback
    v-model:webgl-open="showWebGLModal"
    v-model:thanks-open="showThanksModal"
    v-model:save-error="saveError"
    :copied="showCopiedToast"
  />
</template>

<style scoped>
.desktop-viewer {
  display: flex;
  height: 100dvh;
}
.desktop-viewer__sidebar {
  flex: 0 0 320px;
  overflow-y: auto;
  padding: 16px;
  background: var(--sc-surface);
  border-right: 2px solid var(--sc-line);
}
.desktop-viewer__stage {
  position: relative;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.desktop-viewer__menu {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
}
.desktop-viewer__error {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
}

.loading-backdrop {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(0.3rem);
  z-index: 10;
}

.loading-overlay-enter-active,
.loading-overlay-leave-active {
  transition: opacity 0.25s ease;
}

.loading-overlay-enter-from,
.loading-overlay-leave-to {
  opacity: 0;
}
</style>
