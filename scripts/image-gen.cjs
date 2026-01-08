const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { default: Vibrant } = require('node-vibrant/node')

const publicImagesDir = path.resolve(__dirname, '../public/images')
const slideshowDir = path.resolve(__dirname, '../app/assets/images/home_slideshow')
const outDir = path.resolve(__dirname, '../public/images/optimized')
const assetMappingPath = path.resolve(__dirname, '../app/assets/optimized-images.json')
const publicMappingPath = path.resolve(outDir, 'images.json')
const colorDataPath = path.resolve(__dirname, '../app/assets/image-colors.json')

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

// Extract vibrant color from image
async function extractColors(imagePath) {
  try {
    const palette = await Vibrant.from(imagePath).getPalette()
    const dominant = palette.Vibrant || palette.Muted || palette.DarkVibrant || palette.DarkMuted
    
    if (!dominant) return null
    
    const rgb = dominant.getRgb()
    const hex = dominant.getHex()
    
    return {
      hex,
      rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
      hsl: rgbToHsl(rgb[0], rgb[1], rgb[2])
    }
  } catch (err) {
    console.warn(`Failed to extract colors from ${imagePath}:`, err.message)
    return null
  }
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

async function main() {
  ensureDir(outDir)
  const mapping = {}
  const colorData = {}

  // Process public images (top-level)
  if (fs.existsSync(publicImagesDir)) {
    const files = fs.readdirSync(publicImagesDir).filter(f => /\.(jpe?g|png)$/i.test(f))
    for (const f of files) {
      const srcPath = path.join(publicImagesDir, f)
      // skip optimized folder if already present
      if (f === 'optimized') continue
      const result = await processImage(srcPath, '')
      mapping[result.key] = result.entry
      
      // Extract colors
      const colors = await extractColors(srcPath)
      if (colors) {
        const imageKey = path.basename(srcPath, path.extname(srcPath))
        colorData[imageKey] = colors
      }
      
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
  fs.writeFileSync(colorDataPath, JSON.stringify(colorData, null, 2))

  console.log('Image generation complete. Mapping written to', publicMappingPath)
  console.log('Color data written to', colorDataPath)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})