import optimized from '~/assets/optimized-images.json'

export type ImageMapping = {
  avif: string
  webp: string
  fallback: string
}

export function resolveOptimizedImage(url?: string | null): ImageMapping | null {
  if (!url) return null
  const key = url.split('/').pop() || ''
  return (optimized as Record<string, ImageMapping>)[key] || null
}
