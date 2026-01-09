const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Color extraction: use Sharp stats to compute an average color. This keeps
// the script deterministic and avoids fragile ESM/CJS interop issues with
// optional palette libraries. We can add a palette step later if desired.


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

// Extract color information from image
async function extractColors(imagePath) {
  // Compute average color using Sharp stats (fast and reliable without extra deps)
  try {
    const stats = await sharp(imagePath).stats()
    const r = stats.channels[0].mean
    const g = stats.channels[1].mean
    const b = stats.channels[2].mean
    const hex = rgbToHex(Math.round(r), Math.round(g), Math.round(b))
    return {
      hex,
      rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b) },
      hsl: rgbToHsl(r, g, b)
    }
  } catch (err) {
    console.warn(`Sharp color extraction failed for ${imagePath}:`, err && err.message ? err.message : err)
    return null
  }
}

// Helper to convert RGB -> HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
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
      
// Extract colors (fallback to default if extraction fails)
    const colors = await extractColors(srcPath)
    const imageKey = path.basename(srcPath, path.extname(srcPath))
    if (colors) {
      colorData[imageKey] = colors
    } else {
      // default to cyan-ish HSL used as a safe fallback
      colorData[imageKey] = { hex: '#00bcd4', rgb: { r: 0, g: 188, b: 212 }, hsl: { h: 186, s: 100, l: 50 } }
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