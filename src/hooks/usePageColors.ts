import { useEffect } from 'react'
import colorData from '../../app/assets/image-colors.json'

export function usePageColors(heroImagePath?: string | null) {
  useEffect(() => {
    const applyColors = (imagePath: string | undefined | null) => {
      if (!imagePath) return
      const filename = imagePath.split('/').pop() || ''
      const colors = (colorData as Record<string, any>)[filename]
      if (colors && typeof document !== 'undefined') {
        const h = colors.hsl?.h ?? 186
        const s = colors.hsl?.s ?? 100
        const l = colors.hsl?.l ?? 50
        const hslStr = `${h} ${s}% ${l}%`
        document.documentElement.style.setProperty('--color-primary', hslStr)
      }
    }

    if (heroImagePath) {
      applyColors(heroImagePath)
      return () => {
        document.documentElement.style.setProperty('--color-primary', '186 100% 50%')
      }
    }
  }, [heroImagePath])
}
