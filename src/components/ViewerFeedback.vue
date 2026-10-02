<script setup lang="ts">
import {
  AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from 'reka-ui'
import { ScButton, ScDialog } from 'shiny-colors-ui'
import ViewerNotice from './ViewerNotice.vue'
import { useOverlayFocus } from '../composables/useOverlayFocus'

withDefaults(defineProps<{ copied: boolean; mobile?: boolean }>(), { mobile: false })
const webglOpen = defineModel<boolean>('webglOpen', { required: true })
const thanksOpen = defineModel<boolean>('thanksOpen', { required: true })
const saveError = defineModel<string | null>('saveError', { required: true })
const restoreWebglFocus = useOverlayFocus(webglOpen)
useOverlayFocus(thanksOpen)
</script>

<template>
  <AlertDialogRoot v-model:open="webglOpen">
    <AlertDialogPortal>
      <AlertDialogOverlay class="sc-dialog-overlay" />
      <AlertDialogContent class="sc-dialog" @close-auto-focus="restoreWebglFocus">
        <header class="sc-dialog__header">
          <AlertDialogTitle class="sc-dialog__title">WebGL を利用できません</AlertDialogTitle>
        </header>
        <AlertDialogDescription class="sc-dialog__description">
          アニメーションを表示するには、ブラウザーのハードウェアアクセラレーションを有効にしてください。
        </AlertDialogDescription>
        <footer class="sc-dialog__footer viewer-webgl-footer">
          <AlertDialogAction as-child>
            <ScButton variant="primary">閉じる</ScButton>
          </AlertDialogAction>
        </footer>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
  <ScDialog v-model:open="thanksOpen" title="スペシャルサンクス" close-label="閉じる">
    <div class="viewer-thanks">
      <strong>技術協力</strong>
      <p>TWY</p>
      <strong>ご協力いただいた皆さま</strong>
      <p>木下梨花 KaiOuO Lycoris 剎那 十秒十六胎 匿名小夥伴一號 原田蜜柑</p>
    </div>
  </ScDialog>
  <div :class="['viewer-toasts', { 'viewer-toasts--mobile': mobile }]">
    <ViewerNotice v-if="copied" title="コピーしました" tone="success">
      共有リンクをクリップボードにコピーしました。
    </ViewerNotice>
    <ViewerNotice v-if="saveError" title="保存に失敗しました" closable @close="saveError = null">
      画像を保存できませんでした。もう一度お試しください。
    </ViewerNotice>
  </div>
</template>

<style scoped>
.viewer-webgl-footer {
  margin-top: 24px;
}
.viewer-thanks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.viewer-thanks p {
  margin: 0;
}
.viewer-toasts {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 130;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(320px, calc(100vw - 24px));
  pointer-events: none;
}
.viewer-toasts :deep(.viewer-notice) {
  pointer-events: auto;
}
.viewer-toasts--mobile {
  right: 50%;
  bottom: calc(84px + env(safe-area-inset-bottom, 0px));
  transform: translateX(50%);
}
</style>
