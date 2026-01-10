import Link from 'next/link'
import ProjectCard from './ProjectCard'
import { allWorks } from 'contentlayer/generated'

export default function ProjectGrid() {
  const projects = [...allWorks].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 6)

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Recent Work</h2>
            <p className="mt-2 text-lg text-muted">A selection of latest productions and projects.</p>
          </div>
          <Link href="/work" className="group flex items-center gap-2 text-primary hover:text-primary/80">
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} title={p.title} description={p.description} image={p.image} path={`/work/${p.slug}`} meta={{ year: p.year }} />
          ))}
        </div>
      </div>
    </section>
  )
}
