import { nextTick, watch, type Ref } from 'vue'

// SCUI dialogs can be opened from controls outside their DialogRoot.
export function useOverlayFocus(open: Ref<boolean>) {
  let opener: HTMLElement | null = null

  function restoreFocus(event?: Event) {
    event?.preventDefault()
    if (opener?.isConnected) opener.focus()
  }

  watch(
    open,
    (value) => {
      if (value) {
        opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
      } else {
        void nextTick(() => restoreFocus())
      }
    },
    { flush: 'sync' }
  )

  return restoreFocus
}
