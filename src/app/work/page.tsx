import { allWorks } from 'contentlayer/generated'
import Link from 'next/link'

export default function WorkIndex() {
  const projects = [...allWorks].sort((a, b) => (b.year || 0) - (a.year || 0))
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Work</h1>
      <p className="text-muted mb-8">A selection of recent productions and projects.</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.slug} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <Link href={`/work/${project.slug}`} className="text-blue-600 mt-2 inline-block">Read</Link>
          </article>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No work items found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
