import { computed } from 'vue'
import colorData from '~/assets/image-colors.json'

/**
 * Apply dynamic colors to the page based on the hero image
 * Sets CSS custom property --color-primary to the extracted HSL values
 */
export function usePageColors(heroImagePath?: string) {
  const applyColors = (imagePath: string) => {
    if (!imagePath) return

    // Extract the filename from the path
    const filename = imagePath.split('/').pop() || ''
    const colors = colorData[filename as keyof typeof colorData]

    if (colors && typeof document !== 'undefined') {
      const hslStr = `${colors.hsl.h} ${colors.hsl.s}% ${colors.hsl.l}%`
      document.documentElement.style.setProperty('--color-primary', hslStr)
    }
  }

  const resetColors = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-primary', '186 100% 50%') // default cyan
    }
  }

  // Apply colors when heroImagePath is provided
  if (process.client && heroImagePath) {
    applyColors(heroImagePath)
  }

  return {
    applyColors,
    resetColors,
  }
}
