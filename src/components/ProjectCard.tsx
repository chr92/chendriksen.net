import Link from 'next/link'
import { resolveOptimizedImage } from '../hooks/useOptimizedImage'

type Props = {
  title: string
  description?: string
  image?: string
  path: string
  role?: string
  meta?: { image?: string; year?: number }
}

export default function ProjectCard({ title, description, image, path, role, meta }: Props) {
  const imageUrl = image || meta?.image
  const year = meta?.year
  const key = imageUrl ? imageUrl.split('/').pop() : undefined
  const mapping = key ? resolveOptimizedImage(imageUrl) : null

  return (
    <Link href={path} className="group relative block overflow-hidden rounded-lg bg-surface">
      <div className="aspect-[3/4] w-full overflow-hidden">
        {mapping ? (
          <picture>
            <source type="image/avif" srcSet={mapping.avif} sizes="(max-width: 768px) 100vw, 33vw" />
            <source type="image/webp" srcSet={mapping.webp} sizes="(max-width: 768px) 100vw, 33vw" />
            <img src={mapping.fallback} alt={title} className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110" loading="lazy" decoding="async" />
          </picture>
        ) : (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110" loading="lazy" decoding="async" />
        )}
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-all duration-500 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="relative z-10">
          {year && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-primary/50 px-2.5 py-1 rounded-full">{year}</span>
              <div className="h-px flex-1 bg-primary/60" />
            </div>
          )}
          {role && <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-primary">{role}</span>}
          <h3 className="mb-1 text-2xl font-bold text-white">{title}</h3>
          {description && <p className="line-clamp-2 text-sm text-gray-200">{description}</p>}
        </div>
      </div>
    </Link>
  )
}
