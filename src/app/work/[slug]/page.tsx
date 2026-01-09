import { allWork } from 'contentlayer/generated'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return allWork.map((w) => ({ slug: w.slug }))
}

import ProjectLayout from '../../../components/ProjectLayout'

export default function WorkPage({ params }: { params: { slug: string } }) {
  const doc = allWork.find((w) => w.slug === params.slug)
  if (!doc) return notFound()

  return <ProjectLayout page={doc} />
}
