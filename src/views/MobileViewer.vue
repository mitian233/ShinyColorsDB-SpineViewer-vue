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
  showThanksModal,
  showWebGLModal,
  typeOptions,
  updateDress,
  updateIdol,
  updateType,
} = useViewerShared(canvasElementRef)

const showMenuDrawer = ref(false)
</script>

<template>
  <n-config-provider>
    <div class="mobile-viewer">
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

      <n-drawer v-model:show="showMenuDrawer" placement="left" width="88vw">
        <n-drawer-content title="Controls">
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
        </n-drawer-content>
      </n-drawer>

      <n-drawer v-model:show="showAnimationDrawer" placement="left" width="88vw">
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

      <div class="canvas-wrap">
        <CanvasStage ref="canvasStageRef" @drop="handleDrop" />
        <div v-if="loading" class="status-mask">
          <n-spin size="large" />
        </div>
        <div v-if="error" class="status-error">
          <n-alert type="error" title="Load Failed">{{ error.message }}</n-alert>
        </div>
      </div>

      <footer class="mobile-toolbar">
        <n-space :size="10" justify="space-between">
          <n-button @click="showMenuDrawer = true">Menu</n-button>
          <n-button @click="handleShare">Share</n-button>
          <n-button type="primary" @click="handleSave">Save</n-button>
        </n-space>
      </footer>
    </div>
  </n-config-provider>
</template>

<style scoped>
.mobile-viewer {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 70% 10%, #233453 0%, #151a2f 36%, #0f172a 100%);
}

.canvas-wrap {
  position: absolute;
  inset: 0;
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
  left: 0.75rem;
  right: 0.75rem;
  bottom: 4.75rem;
}

.mobile-toolbar {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.75rem;
  padding: 0.6rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.copied-toast {
  position: fixed;
  left: 50%;
  bottom: 5.25rem;
  transform: translateX(-50%);
  z-index: 50;
  width: min(320px, calc(100vw - 1.5rem));
}

.modal-card {
  width: min(520px, calc(100vw - 1.5rem));
}
</style>
