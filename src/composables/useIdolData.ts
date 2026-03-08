import { ref } from 'vue'
import type { IdolInfo, DressInfo } from '../types'

const idolInfoMap = ref<Map<number, IdolInfo> | null>(null)
const idolDressMap = ref<Map<string, DressInfo[]>>(new Map())

const API_BASE = 'https://api.shinycolors.moe/spine'
const CF_BASE = 'https://cf-static.shinycolors.moe'

export function useIdolData() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchIdolList(): Promise<Map<number, IdolInfo>> {
    if (idolInfoMap.value) {
      return idolInfoMap.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE}/idollist`)
      const data: IdolInfo[] = await response.json()
      const map = new Map<number, IdolInfo>()
      data.forEach((item) => {
        map.set(item.idolId, item)
      })
      idolInfoMap.value = map
      return map
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDressList(idolId: number, idolName: string): Promise<DressInfo[]> {
    if (idolDressMap.value.has(idolName)) {
      return idolDressMap.value.get(idolName)!
    }

    loading.value = true
    error.value = null

    try {
      let data: DressInfo[]
      if (idolId === 91) {
        const response = await fetch(`${CF_BASE}/others/hazuki.json`)
        data = await response.json()
      } else {
        const response = await fetch(`${API_BASE}/dressList?idolId=${idolId}`)
        data = await response.json()
      }
      idolDressMap.value.set(idolName, data)
      return data
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  function getIdolName(idolId: number): string | undefined {
    return idolInfoMap.value?.get(idolId)?.idolName
  }

  return {
    idolInfoMap,
    idolDressMap,
    loading,
    error,
    fetchIdolList,
    fetchDressList,
    getIdolName,
  }
}
