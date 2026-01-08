const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

async function main() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const contentDir = path.resolve(__dirname, '../content/work')

  const pages = ['/', '/work', '/contact']

  // add work pages from content files
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
    for (const f of files) {
      if (f === 'index.md') continue
      const slug = path.basename(f, '.md')
      pages.push(`/work/${slug}`)
    }
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })

  const cssCoverageEntries = []
  const requestedImages = new Set()

  for (const p of pages) {
    const page = await browser.newPage()
    // collect requested image URLs
    page.on('request', req => {
      const url = req.url()
      if (/\.(png|jpe?g|webp|svg)$/i.test(url)) {
        requestedImages.add(url)
      }
    })

    await page.coverage.startCSSCoverage()
    try {
      await page.goto(baseUrl + p, { waitUntil: 'networkidle0', timeout: 30000 })
    } catch (err) {
      console.error(`Failed to open ${baseUrl + p}:`, err.message)
    }
    const entries = await page.coverage.stopCSSCoverage()
    cssCoverageEntries.push(...entries)
    await page.close()
    console.log(`Visited ${p}`)
  }

  await browser.close()

  // analyze CSS coverage
  let totalBytes = 0
  let usedBytes = 0
  for (const entry of cssCoverageEntries) {
    totalBytes += entry.text.length
    for (const range of entry.ranges) usedBytes += range.end - range.start
  }

  const unusedBytes = totalBytes - usedBytes
  const unusedPercent = totalBytes === 0 ? 0 : (unusedBytes / totalBytes) * 100

  // Check image usage against public/images
  const publicImagesDir = path.resolve(__dirname, '../public/images')
  const publicImages = fs.existsSync(publicImagesDir) ? fs.readdirSync(publicImagesDir).filter(f => !f.startsWith('.')) : []

  const unusedImages = []
  for (const img of publicImages) {
    const possiblePaths = [
      `/images/${img}`
    ]
    const used = [...requestedImages].some(url => possiblePaths.some(p => url.includes(p)))
    if (!used) unusedImages.push(img)
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    pages,
    css: {
      totalBytes,
      usedBytes,
      unusedBytes,
      unusedPercent: Number(unusedPercent.toFixed(2))
    },
    images: {
      totalPublicImages: publicImages.length,
      unusedImages
    },
    requestedImages: Array.from(requestedImages).slice(0, 200)
  }

  fs.writeFileSync(path.resolve(__dirname, '../coverage-report.json'), JSON.stringify(report, null, 2))
  console.log('Coverage report written to coverage-report.json')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
