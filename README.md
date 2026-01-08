# Christiaan Hendriksen personal website

This is the personal website of Christiaan Hendriksen. It's built automatically with vercel and served at https://www.chendriksen.net


## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

---

## Performance testing ✅

We include scripts to measure CSS/image usage and Lighthouse scores **locally** during development.

- Generate optimized images (AVIF/WebP + responsive srcsets):

```bash
# generate AVIF/WebP variants and mapping JSON
npm run gen:images
```

Generated files:
- `public/images/optimized/*` (AVIF/WebP/fallback images)
- `public/images/optimized/images.json` and `app/assets/optimized-images.json` (mapping used by components)

Notes: the image generator uses `sharp` and outputs sizes at 400, 800, 1200, 1600 px (quality 80). Import the mapping from `app/assets/optimized-images.json` in components to use AVIF/WebP `srcset`s and fallbacks.

- Run the Puppeteer CSS & image coverage report (manual steps):

```bash
# build and preview (in a separate terminal)
npm run build
npm run preview -- -p 61900

# in another terminal (point BASE_URL at preview server)
BASE_URL=http://localhost:61900 npm run coverage
# writes coverage-report.json
```

- Run Lighthouse locally against the preview server:

```bash
# set BASE_URL (optional) and run the lighthouse script
export BASE_URL=http://localhost:61900
npm run lighthouse
# writes lighthouse-report.json
```

- One-command e2e perf run (local):

```bash
# runs gen:images -> build -> preview -> coverage -> lighthouse
npm run perf:e2e
```

### Adding new images (pages & homepage slideshow)

- Page images (content pages)
  - Add your source image to `public/images/` (e.g., `public/images/new-project.jpg`).
  - Reference it in the page frontmatter: `image: /images/new-project.jpg` (or `meta.image`). For galleries, use `gallery: ['/images/a.jpg', '/images/b.jpg']`.
  - Run `npm run gen:images` — this will generate AVIF/WebP variants and a mapping file (`app/assets/optimized-images.json` and `public/images/optimized/images.json`). Mapping keys are the image filename (basename), e.g. `new-project.jpg`.
  - Components (`ProjectLayout`, `ProjectCard`) automatically use optimized AVIF/WebP `srcset`s when a mapping exists; otherwise they fall back to the original URL.

- Homepage slideshow images
  - Add slide files to `app/assets/images/home_slideshow/` (e.g., `app/assets/images/home_slideshow/slide-1.jpg`). `HomeSlideshow.vue` imports images from this directory automatically via `import.meta.glob`.
  - Run `npm run gen:images` — slideshow images will be processed and added under `public/images/optimized/home_slideshow/` with mapping entries.
  - The slideshow will use optimized assets automatically when present.

- File types & limitations
  - The generator currently processes JPEG/JPG and PNG files. If you add other formats (SVG/WebP) they will not be processed unless the script is extended.

- Commit generated assets (recommended)
  - Since builds (Vercel) may not run `gen:images` for you, commit the generated `public/images/optimized/*` and `app/assets/optimized-images.json` so Preview and Production use the optimized images.
  - Alternatively, add `npm run gen:images` to your build step if you want generation to happen automatically during deployment.

- Quick verification
  - Use `npm run perf:e2e` to generate images, build, preview, and run coverage & Lighthouse locally.

> The performance tooling is intentionally local-only; run the generator locally and commit the outputs before deploying to ensure optimized images are available in production.

--
