import { ref, watch } from 'vue'
import type { DressTypeKey, UrlParams } from '../types'

const urlParams = new URLSearchParams(window.location.search)

function getInitialParams(): UrlParams {
  const params: UrlParams = {}

  if (urlParams.has('idolId')) {
    const idolId = Number(urlParams.get('idolId'))
    if (!isNaN(idolId)) {
      params.idolId = idolId
    }
  }

  if (urlParams.has('enzaId')) {
    params.enzaId = urlParams.get('enzaId')!
  }

  if (urlParams.has('dressType')) {
    const dt = urlParams.get('dressType') as DressTypeKey
    if (['sml_cloth0', 'sml_cloth1', 'big_cloth0', 'big_cloth1'].includes(dt)) {
      params.dressType = dt
    }
  }

  if (urlParams.has('renderer')) {
    const r = urlParams.get('renderer') as 'webgl' | 'webgpu'
    if (['webgl', 'webgpu'].includes(r)) {
      params.renderer = r
    }
  }

  return params
}

export function useUrlState() {
  const idolId = ref<number | undefined>(getInitialParams().idolId ?? 1)
  const enzaId = ref<string | undefined>(getInitialParams().enzaId)
  const dressType = ref<DressTypeKey | undefined>(getInitialParams().dressType)
  const renderer = ref<'webgl' | 'webgpu'>(getInitialParams().renderer ?? 'webgpu')
  const urlFlag = ref(false)

  function updateUrl() {
    const params = new URLSearchParams()

    if (idolId.value !== undefined) {
      params.set('idolId', String(idolId.value))
    }
    if (enzaId.value) {
      params.set('enzaId', enzaId.value)
    }
    if (dressType.value) {
      params.set('dressType', dressType.value)
    }
    params.set('renderer', renderer.value)

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }

  function getShareLink(): string {
    const params = new URLSearchParams()
    params.set('idolId', String(idolId.value ?? 1))
    if (enzaId.value) {
      params.set('enzaId', enzaId.value)
    }
    if (dressType.value) {
      params.set('dressType', dressType.value)
    }
    return `https://spine.shinycolors.moe/?${params.toString()}`
  }

  watch([idolId, enzaId, dressType, renderer], () => {
    updateUrl()
  })

  return {
    idolId,
    enzaId,
    dressType,
    renderer,
    urlFlag,
    getShareLink,
    updateUrl,
  }
}
