<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { ScImageButton } from 'shiny-colors-ui'
import { useOverlayFocus } from '../composables/useOverlayFocus'

withDefaults(defineProps<{ title: string; placement?: 'left' | 'right' | 'bottom' }>(), {
  placement: 'right',
})
const open = defineModel<boolean>('open', { default: false })
const restoreFocus = useOverlayFocus(open)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="sc-dialog-overlay" />
      <DialogContent
        :class="['viewer-drawer', `viewer-drawer--${placement}`]"
        @close-auto-focus="restoreFocus"
      >
        <header class="sc-dialog__header viewer-drawer__header">
          <DialogTitle class="sc-dialog__title">{{ title }}</DialogTitle>
          <DialogClose as-child><ScImageButton preset="close" label="閉じる" /></DialogClose>
        </header>
        <DialogDescription class="sc-sr-only">{{ title }}</DialogDescription>
        <div class="viewer-drawer__body"><slot /></div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.viewer-drawer {
  position: fixed;
  z-index: 101;
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  max-height: 100dvh;
  background: var(--sc-surface);
  color: var(--sc-ink);
  font-family: var(--sc-font);
  border: 2px solid var(--sc-ink);
  outline: none;
}

.viewer-drawer--left,
.viewer-drawer--right {
  top: 0;
  bottom: 0;
  width: min(360px, 88vw);
}

.viewer-drawer--left {
  left: 0;
  border-left: 0;
}

.viewer-drawer--right {
  right: 0;
  border-right: 0;
}

.viewer-drawer--bottom {
  right: 0;
  bottom: 0;
  left: 0;
  height: 78dvh;
  border-radius: 14px 14px 0 0;
}

.viewer-drawer__header {
  flex-shrink: 0;
  margin: 0 16px;
  padding-top: 12px;
}

.viewer-drawer__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
}
</style>
