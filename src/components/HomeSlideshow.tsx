import { useEffect, useState } from 'react'
import { resolveOptimizedImage } from '../hooks/useOptimizedImage'

const SLIDES = [
  '/images/optimized/home_slideshow/vaudeville-800.avif',
  '/images/optimized/home_slideshow/withollie-800.avif',
  '/images/optimized/home_slideshow/withphilippe-800.avif',
  '/images/optimized/home_slideshow/zeus-energy-800.avif',
]

export default function HomeSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window?.matchMedia('(prefers-reduced-motion: reduce)').matches) return // respect reduced motion
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const current = SLIDES[index]
  const mapping = resolveOptimizedImage(current)

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-background">
      <div className="absolute inset-0 h-full w-full">
        {mapping ? (
          <picture>
            <source type="image/avif" srcSet={mapping.avif} sizes="100vw" />
            <source type="image/webp" srcSet={mapping.webp} sizes="100vw" />
            <img src={mapping.fallback} alt="Atmospheric Background" className="h-full w-full object-cover opacity-40 transition-transform duration-[10000ms] ease-linear transform scale-100 animate-ken-burns" loading={"eager"} decoding="async" />
          </picture>
        ) : (
          <img src={current} alt="Atmospheric Background" className="h-full w-full object-cover opacity-40 transition-transform duration-[10000ms] ease-linear transform scale-100 animate-ken-burns" loading={"eager"} decoding="async" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

      <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 10s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
