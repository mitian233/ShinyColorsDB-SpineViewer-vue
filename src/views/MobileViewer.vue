<script setup lang="ts">
import { computed, ref } from 'vue'
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
  <div style="position: relative; width: 100vw; height: 100vh; overflow: hidden">
    <CanvasStage ref="canvasStageRef" @drop="handleDrop" />
    <n-spin
      v-if="loading"
      style="
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.35);
      "
      size="large"
    />
    <n-alert
      v-if="error"
      type="error"
      title="Load Failed"
      style="position: absolute; left: 12px; right: 12px; bottom: 76px"
    >
      {{ error.message }}
    </n-alert>

    <n-space
      class="absolute right-3 bottom-3 left-3 z-20 rounded-sm border border-slate-200/80 bg-white/88 p-2 shadow-[0_12px_34px_rgba(15,23,42,0.16)] backdrop-blur-md"
      justify="space-between"
    >
      <n-button class="min-w-20" @click="showMenuDrawer = true">Menu</n-button>
      <n-button class="min-w-20" @click="handleShare">Share</n-button>
      <n-button class="min-w-20" type="primary" @click="handleSave">Save</n-button>
    </n-space>

    <n-alert
      v-if="showCopiedToast"
      type="success"
      title="Copied"
      style="
        position: fixed;
        left: 50%;
        bottom: 84px;
        transform: translateX(-50%);
        z-index: 50;
        width: min(320px, calc(100vw - 24px));
      "
    >
      Link is copied!
    </n-alert>
  </div>

  <n-modal v-model:show="showWebGLModal" :mask-closable="false">
    <n-card title="Legacy Mode Detected" style="width: min(520px, calc(100vw - 24px))">
      <n-text>Hardware acceleration is required for PIXI.js to run in WebGL mode.</n-text>
      <template #action>
        <n-space justify="end">
          <n-button type="primary" @click="showWebGLModal = false">閉じる</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showThanksModal">
    <n-card title="特別感謝" style="width: min(520px, calc(100vw - 24px))">
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

  <n-drawer v-model:show="showMenuDrawer" placement="bottom" height="78vh">
    <n-drawer-content title="Controls" closable>
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

  <n-drawer v-model:show="showAnimationDrawer" placement="bottom" height="78vh">
    <n-drawer-content title="Animation" closable>
      <AnimationPanel
        :animations="animations"
        @toggle="handleAnimationToggle"
        @reset="handleAnimationReset"
        @close="showAnimationDrawer = false"
      />
    </n-drawer-content>
  </n-drawer>
</template>
