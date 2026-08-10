const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true'

export const API_BASE_URL = USE_PROXY ? '/api' : 'https://api.shinycolors.moe/spine'

export const CF_BASE_URL = USE_PROXY ? '/cf' : 'https://cf-static.shinycolors.moe'

/**
 * Build a Spine asset URL.
 * Asset paths from the API already include the `spine/` prefix
 * (e.g. `spine/idols/stand/101/data.json`, `spine/awake_idols/...`).
 * - direct: https://cf-static.shinycolors.moe/spine/...
 * - proxy:  /spine/...  (rewritten by Vite/Vercel to cf-static)
 */
export function getSpineUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  // Proxy base is empty: path already starts with /spine/...
  const base = USE_PROXY ? '' : 'https://cf-static.shinycolors.moe'
  return `${base}${normalized}`
}

export const config = {
  useProxy: USE_PROXY,
  apiBaseUrl: API_BASE_URL,
  cfBaseUrl: CF_BASE_URL,
  getSpineUrl,
}
