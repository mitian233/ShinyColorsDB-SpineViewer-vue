<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NConfigProvider,
  NDrawer,
  NDrawerContent,
  NModal,
  NSpace,
  NSpin,
  NText,
} from 'naive-ui'
import AnimationPanel from '../components/AnimationPanel.vue'
import CanvasStage from '../components/CanvasStage.vue'
import ViewerControls from '../components/ViewerControls.vue'
import { useViewerShared } from '../composables/useViewerShared'

const canvasStageRef = ref<InstanceType<typeof CanvasStage> | null>(null)
const canvasElementRef = computed(() => canvasStageRef.value?.canvasRef ?? null)

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
  selectedDressIndex,
  showAnimationDrawer,
  showCopiedToast,
  showMobilePrompt,
  showThanksModal,
  showWebGLModal,
  typeOptions,
  updateDress,
  updateIdol,
  updateType,
} = useViewerShared(canvasElementRef, { detectMobilePrompt: true })

function toMobileUI() {
  window.location.href = 'https://mspine.shinycolors.moe'
}
</script>

<template>
  <n-config-provider>
    <div class="desktop-viewer">
      <n-modal v-model:show="showWebGLModal" :mask-closable="false">
        <n-card title="Legacy Mode Detected" role="dialog" aria-modal="true" class="modal-card">
          <n-text>Hardware acceleration is required for PIXI.js to run in WebGL mode.</n-text>
          <template #action>
            <n-space justify="end">
              <n-button type="primary" @click="showWebGLModal = false">閉じる</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>

      <n-modal v-model:show="showMobilePrompt" :mask-closable="false">
        <n-card title="Mobile Device Detected" role="dialog" aria-modal="true" class="modal-card">
          <n-text>Mobile Device Detected, redirect to mobile UI?</n-text>
          <template #action>
            <n-space justify="end">
              <n-button @click="showMobilePrompt = false">No</n-button>
              <n-button type="primary" @click="toMobileUI">Yes</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>

      <n-modal v-model:show="showThanksModal">
        <n-card title="特別感謝" role="dialog" aria-modal="true" class="modal-card">
          <n-space vertical :size="8">
            <n-text strong>技術諮詢</n-text>
            <n-text>TWY</n-text>
            <n-text strong>爆肝小夥伴</n-text>
            <n-text>木下梨花 KaiOuO Lycoris 剎那 十秒十六胎 匿名小夥伴一號</n-text>
          </n-space>
          <template #action>
            <n-space justify="end">
              <n-button @click="showThanksModal = false">閉じる</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>

      <n-drawer v-model:show="showAnimationDrawer" placement="left" :width="360">
        <n-drawer-content title="Animation">
          <AnimationPanel
            :animations="animations"
            @toggle="handleAnimationToggle"
            @reset="handleAnimationReset"
            @close="showAnimationDrawer = false"
          />
        </n-drawer-content>
      </n-drawer>

      <div v-if="showCopiedToast" class="copied-toast">
        <n-alert type="success" title="Copied" :show-icon="false">Link is copied!</n-alert>
      </div>

      <div class="main-container">
        <aside class="sidebar">
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

        <section class="canvas-container">
          <CanvasStage ref="canvasStageRef" @drop="handleDrop" />
          <div v-if="loading" class="status-mask">
            <n-spin size="large" />
          </div>
          <div v-if="error" class="status-error">
            <n-alert type="error" title="Load Failed">{{ error.message }}</n-alert>
          </div>
        </section>
      </div>
    </div>
  </n-config-provider>
</template>

<style scoped>
.desktop-viewer {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(120deg, #0f172a 0%, #192339 40%, #202b3d 100%);
  overflow: hidden;
}

.main-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: min(360px, 32vw);
  min-width: 260px;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(12, 17, 28, 0.75);
  backdrop-filter: blur(8px);
}

.canvas-container {
  position: relative;
  flex: 1;
}

.status-mask {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.35);
}

.status-error {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
}

.copied-toast {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 50;
  width: 240px;
}

.modal-card {
  width: min(560px, calc(100vw - 2rem));
}
</style>
