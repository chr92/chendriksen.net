const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { Vibrant } = require('node-vibrant/node')

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

// Check if image has already been optimized
function isAlreadyProcessed(srcPath, relativeOutDir) {
  const name = path.basename(srcPath, path.extname(srcPath))
  const outSubdir = path.join(outDir, relativeOutDir || '')
  
  // Check if the smallest AVIF exists (quick check)
  const checkFile = path.join(outSubdir, `${name}-400.avif`)
  if (!fs.existsSync(checkFile)) return false
  
  // Check if source is newer than output
  const srcStat = fs.statSync(srcPath)
  const outStat = fs.statSync(checkFile)
  return srcStat.mtime <= outStat.mtime
}

// Get existing mapping entry without reprocessing
function getExistingMapping(srcPath, relativeOutDir) {
  const name = path.basename(srcPath, path.extname(srcPath))
  const originalExt = path.extname(srcPath).slice(1)
  const prefix = relativeOutDir ? relativeOutDir + '/' : ''
  
  const mappingEntry = { avif: [], webp: [], fallback: '' }
  
  for (const f of formats) {
    const srcset = widths.map(w => `/images/optimized/${prefix}${name}-${w}.${f} ${w}w`)
    mappingEntry[f] = srcset.join(', ')
  }
  
  mappingEntry.fallback = `/images/optimized/${prefix}${name}.${originalExt}`
  return mappingEntry
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
    
    // Access properties directly (node-vibrant v4 API)
    const rgb = dominant._rgb
    const hsl = dominant._hsl
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2])
    
    return {
      hex,
      rgb: { r: Math.round(rgb[0]), g: Math.round(rgb[1]), b: Math.round(rgb[2]) },
      hsl: {
        h: Math.round(hsl[0] * 360),
        s: Math.round(hsl[1] * 100),
        l: Math.round(hsl[2] * 100)
      }
    }
  } catch (err) {
    console.warn(`Failed to extract colors from ${imagePath}:`, err.message)
    return null
  }
}

// Convert RGB to hex
function rgbToHex(r, g, b) {
  const toHex = (c) => Math.round(c).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

async function main() {
  ensureDir(outDir)
  const mapping = {}
  const colorData = {}
  let processedCount = 0
  let skippedCount = 0

  // Load existing color data to preserve it
  let existingColorData = {}
  if (fs.existsSync(colorDataPath)) {
    try {
      existingColorData = JSON.parse(fs.readFileSync(colorDataPath, 'utf-8'))
    } catch (e) {}
  }

  // Process public images (top-level)
  if (fs.existsSync(publicImagesDir)) {
    const files = fs.readdirSync(publicImagesDir).filter(f => /\.(jpe?g|png)$/i.test(f))
    for (const f of files) {
      const srcPath = path.join(publicImagesDir, f)
      // skip optimized folder if already present
      if (f === 'optimized') continue
      
      const imageKey = path.basename(srcPath, path.extname(srcPath))
      
      // Skip if already processed
      if (isAlreadyProcessed(srcPath, '')) {
        mapping[basenameKey(srcPath)] = getExistingMapping(srcPath, '')
        colorData[imageKey] = existingColorData[imageKey] || null
        skippedCount++
        continue
      }
      
      const result = await processImage(srcPath, '')
      mapping[result.key] = result.entry
      
      // Extract colors
      const colors = await extractColors(srcPath)
      if (colors) {
        colorData[imageKey] = colors
      }
      
      console.log('Processed public image', f)
      processedCount++
    }
  }

  // Process slideshow images (preserve subdir)
  if (fs.existsSync(slideshowDir)) {
    const files = fs.readdirSync(slideshowDir).filter(f => /\.(jpe?g|png)$/i.test(f))
    for (const f of files) {
      const srcPath = path.join(slideshowDir, f)
      
      // Skip if already processed
      if (isAlreadyProcessed(srcPath, 'home_slideshow')) {
        mapping[basenameKey(srcPath)] = getExistingMapping(srcPath, 'home_slideshow')
        skippedCount++
        continue
      }
      
      const result = await processImage(srcPath, 'home_slideshow')
      mapping[result.key] = result.entry
      console.log('Processed slideshow image', f)
      processedCount++
    }
  }

  // write mapping to public optimized dir and app assets for import
  ensureDir(path.dirname(publicMappingPath))
  fs.writeFileSync(publicMappingPath, JSON.stringify(mapping, null, 2))
  fs.writeFileSync(assetMappingPath, JSON.stringify(mapping, null, 2))
  fs.writeFileSync(colorDataPath, JSON.stringify(colorData, null, 2))

  console.log(`Image generation complete: ${processedCount} processed, ${skippedCount} skipped (already up-to-date)`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})