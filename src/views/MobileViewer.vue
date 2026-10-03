<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ScButton, ScLoader } from '@mitian233/scui'
import ViewerDrawer from '../components/ViewerDrawer.vue'
import ViewerFeedback from '../components/ViewerFeedback.vue'
import ViewerNotice from '../components/ViewerNotice.vue'
import AnimationPanel from '../components/AnimationPanel.vue'
import CanvasStage from '../components/CanvasStage.vue'
import ViewerControls from '../components/ViewerControls.vue'
import { useViewerShared } from '../composables/useViewerShared'

const canvasStageRef = ref<InstanceType<typeof CanvasStage> | null>(null)
const canvasElementRef = computed(() => canvasStageRef.value?.canvasRef ?? null)
const viewportWidth = ref(window.innerWidth)

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

const showMenuDrawer = ref(false)

function handleResize() {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  destroy()
})
</script>

<template>
  <main class="mobile-viewer">
    <CanvasStage ref="canvasStageRef" @drop="handleDrop" />
    <Transition name="loading-overlay" appear>
      <div v-if="loading" class="loading-backdrop"><ScLoader size="lg" label="読み込み中…" /></div>
    </Transition>
    <ViewerNotice v-if="error" title="読み込みに失敗しました" class="mobile-viewer__error">
      アニメーションを読み込めませんでした。通信環境を確認して、もう一度お試しください。
    </ViewerNotice>
    <nav class="mobile-viewer__actions" aria-label="ビューアーの操作">
      <ScButton size="sm" @click="showMenuDrawer = true">メニュー</ScButton>
      <ScButton size="sm" @click="handleShare">リンクを共有</ScButton>
      <ScButton size="sm" variant="primary" @click="handleSave">画像を保存</ScButton>
    </nav>
  </main>

  <ViewerDrawer v-model:open="showMenuDrawer" title="設定" placement="bottom">
    <ViewerControls
      :idol-id="idolId ?? null"
      :selected-dress-index="selectedDressIndex"
      :dress-type="dressType ?? null"
      :background-color="backgroundColor"
      :idol-options="idolOptions"
      :dress-options="dressOptions"
      :type-options="typeOptions"
      :continuous-shooting-enabled="isContinuousShootingEnabled"
      :show-action-buttons="false"
      @update:idol="updateIdol"
      @update:dress="updateDress"
      @update:type="updateType"
      @update:background-color="handleColorChange"
      @update:continuous-shooting-enabled="handleContinuousShootingChange"
      @open-animation="showAnimationDrawer = true"
      @open-database="openDatabase"
      @open-thanks="showThanksModal = true"
    />
  </ViewerDrawer>

  <ViewerDrawer v-model:open="showAnimationDrawer" title="アニメーション" placement="bottom">
    <AnimationPanel
      :animations="animations"
      @toggle="handleAnimationToggle"
      @reset="handleAnimationReset"
      @close="showAnimationDrawer = false"
    />
  </ViewerDrawer>

  <ViewerFeedback
    v-model:webgl-open="showWebGLModal"
    v-model:thanks-open="showThanksModal"
    v-model:save-error="saveError"
    :copied="showCopiedToast"
    mobile
  />
</template>

<style scoped>
.mobile-viewer {
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}
.mobile-viewer__actions {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--sc-line);
  border-radius: var(--sc-radius);
  background: var(--sc-surface);
  box-shadow: 0 12px 34px #30233829;
}
.mobile-viewer__actions :deep(.sc-button) {
  min-width: 0;
  padding-inline: 8px;
}
.mobile-viewer__error {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: calc(76px + env(safe-area-inset-bottom, 0px));
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
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.loading-overlay-enter-from,
.loading-overlay-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
