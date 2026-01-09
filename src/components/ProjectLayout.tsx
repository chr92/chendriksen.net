import { useEffect } from 'react'
import { resolveOptimizedImage } from '../hooks/useOptimizedImage'
import { usePageColors } from '../hooks/usePageColors'

function trimFirstH1(html?: string) {
  if (!html) return ''
  return html.replace(/^\s*<h1[^>]*>.*?<\/h1>/is, '')
}

export default function ProjectLayout({ page }: { page: any }) {
  const heroUrl = page?.headerImage || page?.image
  const heroMapping = heroUrl ? resolveOptimizedImage(heroUrl) : null
  const contentImageUrl = page?.image
  const contentImageMapping = contentImageUrl ? resolveOptimizedImage(contentImageUrl) : null

  useEffect(() => {
    usePageColors(heroUrl)
  }, [heroUrl])

  const trimmed = trimFirstH1(page?.body?.html)

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroMapping ? (
            <picture>
              <source type="image/avif" srcSet={heroMapping.avif} sizes="100vw" />
              <source type="image/webp" srcSet={heroMapping.webp} sizes="100vw" />
              <img src={heroMapping.fallback} alt={page.title} className="h-full w-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
            </picture>
          ) : (
            <img src={heroUrl} alt={page.title} className="h-full w-full object-cover" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container relative flex h-full items-end pb-12">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/40 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm border border-primary/60">
                {page?.year}
              </span>
              {(page?.tags || []).map((tag: string) => (
                <span key={tag} className="rounded-full bg-primary/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-primary/50">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">{page.title}</h1>
            {page.description && <p className="mt-4 text-xl text-gray-200">{page.description}</p>}
          </div>
        </div>
      </div>

      <div className="container relative z-10 pt-16">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: trimmed }} />
          </div>

          <div className="lg:col-span-7">
            {contentImageUrl ? (
              <div className="sticky top-24 space-y-6">
                <div className="relative w-full overflow-hidden rounded-xl bg-surface shadow-lg ring-1 ring-white/10">
                  {contentImageMapping ? (
                    <picture>
                      <source type="image/avif" srcSet={contentImageMapping.avif} sizes="(max-width: 768px) 100vw, 50vw" />
                      <source type="image/webp" srcSet={contentImageMapping.webp} sizes="(max-width: 768px) 100vw, 50vw" />
                      <img src={contentImageMapping.fallback} alt={page.title + ' content image'} className="w-full h-auto object-contain" loading="lazy" decoding="async" />
                    </picture>
                  ) : (
                    <img src={contentImageUrl} alt={page.title + ' content image'} className="w-full h-auto object-contain" loading="lazy" decoding="async" />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-surface/20 py-24">
                <p className="text-muted">Image placeholder</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
