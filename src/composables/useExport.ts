export function useExport(
  getApp: () => any,
  getContainer: () => any,
  getIdolName: () => string,
  getDressInfo: () => { category: string; name: string; type: string }
) {
  async function saveImage(): Promise<void> {
    const app = getApp()
    const container = getContainer()
    if (!app || !container) return

    const renderer = app.renderer
    const image = await renderer.extract.image(container)
    const anchor = document.createElement('a')

    const idolName = getIdolName()
    const dressInfo = getDressInfo()
    const fileName = `${idolName}-${dressInfo.category}-${dressInfo.name}-${dressInfo.type}.png`
    const invalidRegex = /[<>:"\/\\|?*\x00-\x1F]/g
    const validFileName = fileName.replace(invalidRegex, '_')

    anchor.download = validFileName
    anchor.href = image.src
    anchor.click()
  }

  async function copyLinkToClipboard(link: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(link)
    } catch (e) {
      console.error('Failed to copy link:', e)
    }
  }

  return {
    saveImage,
    copyLinkToClipboard,
  }
}
