import { allHomes } from 'contentlayer/generated'
import Link from 'next/link'
import ProjectGrid from '../components/ProjectGrid'
import HomeSlideshow from '../components/HomeSlideshow'

export default function HomePage() {
  const home = allHomes[0]
  return (
    <div className="relative">
      <HomeSlideshow />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{home?.hero_title ?? home?.title}</h1>
          {home?.description && <p className="text-muted">{home.description}</p>}
        </header>

        <section>
          <div dangerouslySetInnerHTML={{ __html: home?.body?.html || '' }} className="prose mb-8" />
        </section>

        <ProjectGrid />
      </div>
    </div>
  )
}
