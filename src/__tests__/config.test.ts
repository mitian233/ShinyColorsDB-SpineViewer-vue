import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('config.ts', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should use direct URLs when VITE_USE_PROXY is not true', async () => {
    vi.stubEnv('VITE_USE_PROXY', 'false')

    // We must dynamically import because config.ts evaluates import.meta.env on load
    const { config, getSpineUrl, API_BASE_URL, CF_BASE_URL } = await import('../config')

    expect(config.useProxy).toBe(false)
    expect(API_BASE_URL).toBe('https://api.shinycolors.moe/spine')
    expect(CF_BASE_URL).toBe('https://cf-static.shinycolors.moe')

    // Asset paths already include the spine/ prefix
    expect(getSpineUrl('/spine/idols/stand/101/data.json')).toBe(
      'https://cf-static.shinycolors.moe/spine/idols/stand/101/data.json',
    )
    expect(getSpineUrl('spine/awake_idols/cb_costume/1040030110/data.atlas')).toBe(
      'https://cf-static.shinycolors.moe/spine/awake_idols/cb_costume/1040030110/data.atlas',
    )
    expect(getSpineUrl('/spine/support_idols/picture_motion/201/data.json')).toBe(
      'https://cf-static.shinycolors.moe/spine/support_idols/picture_motion/201/data.json',
    )
    expect(getSpineUrl('/spine/idol_evolution_skins/cb_costume/12301/data.json')).toBe(
      'https://cf-static.shinycolors.moe/spine/idol_evolution_skins/cb_costume/12301/data.json',
    )
  })

  it('should use proxy paths when VITE_USE_PROXY is true', async () => {
    vi.stubEnv('VITE_USE_PROXY', 'true')

    const { config, getSpineUrl, API_BASE_URL, CF_BASE_URL } = await import('../config')

    expect(config.useProxy).toBe(true)
    expect(API_BASE_URL).toBe('/api')
    expect(CF_BASE_URL).toBe('/cf')

    // Proxy keeps the full /spine/... path (no double-prefix); Vercel/Vite rewrite it
    expect(getSpineUrl('/spine/idols/stand/101/data.json')).toBe('/spine/idols/stand/101/data.json')
    expect(getSpineUrl('spine/awake_idols/cb_costume/1040030110/data.atlas')).toBe(
      '/spine/awake_idols/cb_costume/1040030110/data.atlas',
    )
    expect(getSpineUrl('/spine/support_idols/picture_motion/201/data.json')).toBe(
      '/spine/support_idols/picture_motion/201/data.json',
    )
    expect(getSpineUrl('/spine/idol_evolution_skins/cb_costume/12301/data.json')).toBe(
      '/spine/idol_evolution_skins/cb_costume/12301/data.json',
    )
  })
})
