const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicImagesDir = path.resolve(__dirname, '../public/images')
const slideshowDir = path.resolve(__dirname, '../app/assets/images/home_slideshow')
const outDir = path.resolve(__dirname, '../public/images/optimized')
const assetMappingPath = path.resolve(__dirname, '../app/assets/optimized-images.json')
const publicMappingPath = path.resolve(outDir, 'images.json')

const widths = [400, 800, 1200, 1600]
const formats = ['avif', 'webp']

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function basenameKey(filePath) {
  return path.basename(filePath)
}

async function processImage(srcPath, relativeOutDir) {
  const name = path.basename(srcPath, path.extname(srcPath))
  const outSubdir = path.join(outDir, relativeOutDir || '')
  ensureDir(outSubdir)

  const mappingEntry = { avif: [], webp: [], fallback: '' }

  for (const f of formats) {
    const srcset = []
    for (const w of widths) {
      const outName = `${name}-${w}.${f}`
      const outPath = path.join(outSubdir, outName)
      await sharp(srcPath).resize({ width: w }).toFormat(f, { quality: 80 }).toFile(outPath)
      srcset.push(`/images/optimized/${relativeOutDir ? relativeOutDir + '/' : ''}${outName} ${w}w`)
    }
    mappingEntry[f] = srcset.join(', ')
  }

  // fallback (copy original into optimized folder to have consistent set)
  const originalExt = path.extname(srcPath).slice(1)
  const fallbackName = `${name}.${originalExt}`
  const fallbackPath = path.join(outSubdir, fallbackName)
  fs.copyFileSync(srcPath, fallbackPath)
  mappingEntry.fallback = `/images/optimized/${relativeOutDir ? relativeOutDir + '/' : ''}${fallbackName}`

  return { key: basenameKey(srcPath), entry: mappingEntry }
}

async function main() {
  ensureDir(outDir)
  const mapping = {}

  // Process public images (top-level)
  if (fs.existsSync(publicImagesDir)) {
    const files = fs.readdirSync(publicImagesDir).filter(f => /\.(jpe?g|png)$/i.test(f))
    for (const f of files) {
      const srcPath = path.join(publicImagesDir, f)
      // skip optimized folder if already present
      if (f === 'optimized') continue
      const result = await processImage(srcPath, '')
      mapping[result.key] = result.entry
      console.log('Processed public image', f)
    }
  }

  // Process slideshow images (preserve subdir)
  if (fs.existsSync(slideshowDir)) {
    const files = fs.readdirSync(slideshowDir).filter(f => /\.(jpe?g|png)$/i.test(f))
    for (const f of files) {
      const srcPath = path.join(slideshowDir, f)
      const result = await processImage(srcPath, 'home_slideshow')
      mapping[result.key] = result.entry
      console.log('Processed slideshow image', f)
    }
  }

  // write mapping to public optimized dir and app assets for import
  ensureDir(path.dirname(publicMappingPath))
  fs.writeFileSync(publicMappingPath, JSON.stringify(mapping, null, 2))
  fs.writeFileSync(assetMappingPath, JSON.stringify(mapping, null, 2))

  console.log('Image generation complete. Mapping written to', publicMappingPath)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})