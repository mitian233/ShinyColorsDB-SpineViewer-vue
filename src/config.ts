const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true'

export const API_BASE_URL = USE_PROXY ? '/api' : 'https://api.shinycolors.moe/spine'

export const CF_BASE_URL = USE_PROXY ? '/cf' : 'https://cf-static.shinycolors.moe'

export function getSpineUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : '/' + path
  if (USE_PROXY) {
    // API asset paths already include the /spine directory.
    return normalizedPath === '/spine' || normalizedPath.startsWith('/spine/')
      ? normalizedPath
      : `/spine${normalizedPath}`
  }
  return `https://cf-static.shinycolors.moe${normalizedPath}`
}

export const config = {
  useProxy: USE_PROXY,
  apiBaseUrl: API_BASE_URL,
  cfBaseUrl: CF_BASE_URL,
  getSpineUrl,
}
