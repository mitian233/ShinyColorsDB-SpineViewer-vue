export function useExport(
  getApp: () => any,
  getContainer: () => any,
  getIdolName: () => string,
  getDressInfo: () => { category: string; name: string; type: string }
) {
  function isIOS(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }

  function getFileName(): string {
    const idolName = getIdolName()
    const dressInfo = getDressInfo()
    const fileName = `${idolName}-${dressInfo.category}-${dressInfo.name}-${dressInfo.type}.png`
    return fileName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_')
  }

  async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob from canvas'))
        },
        'image/png'
      )
    })
  }

  async function downloadViaAnchor(blob: Blob, fileName: string): Promise<void> {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.download = fileName
    anchor.href = url
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function downloadViaShare(blob: Blob, fileName: string): Promise<boolean> {
    if (!navigator.share) return false

    try {
      const file = new File([blob], fileName, { type: 'image/png' })
      await navigator.share({ files: [file] })
      return true
    } catch {
      return false
    }
  }

  async function saveImage(): Promise<void> {
    const app = getApp()
    const container = getContainer()
    if (!app || !container || container.children.length === 0) {
      throw new Error('No content to export')
    }

    const renderer = app.renderer
    const canvas = renderer.extract.canvas(container)
    const blob = await canvasToBlob(canvas)
    const fileName = getFileName()

    // iOS: try navigator.share first, fall back to anchor download
    if (isIOS()) {
      const shared = await downloadViaShare(blob, fileName)
      if (shared) return
    }

    await downloadViaAnchor(blob, fileName)
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
