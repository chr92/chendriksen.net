import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Home = defineDocumentType(() => ({
  name: 'Home',
  filePathPattern: 'homepage.md',
  fields: {
    title: { type: 'string', required: false },
    hero_title: { type: 'string', required: false },
    description: { type: 'string', required: false },
  },
}))

export const Work = defineDocumentType(() => ({
  name: 'Work',
  filePathPattern: 'work/*.md',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: false },
    description: { type: 'string', required: false },
    image: { type: 'string', required: false },
    headerImage: { type: 'string', required: false },
    year: { type: 'number', required: false },
  },
  computedFields: {
    slug: { type: 'string', resolve: (doc) => doc._raw.sourceFileName.replace(/\.md$/, '') },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Home, Work],
})
