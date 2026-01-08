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

We include scripts and automation to measure CSS/image usage and Lighthouse scores locally and in CI.

- Generate optimized images (AVIF/WebP + responsive srcsets):

```bash
# generate AVIF/WebP variants and mapping JSON
npm run gen:images
```

Generated files:
- `public/images/optimized/*` (AVIF/WebP/fallback images)
- `public/images/optimized/images.json` and `app/assets/optimized-images.json` (mapping used by components)

Notes: the image generator uses `sharp` and outputs sizes at 400, 800, 1200, 1600 px (quality 80). Import the mapping from `app/assets/optimized-images.json` in components to use AVIF/WebP `srcset`s and fallbacks.

- Run the Puppeteer CSS & image coverage report:

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

- CI automation:

A GitHub Actions workflow (`.github/workflows/perf.yml`) runs on pushes and pull requests to `main`. It:
- runs `npm run gen:images` and fails if generated images/mapping differ from what's committed (so PRs must include updated generated assets),
- builds the site, runs the preview server, executes the coverage script, runs Lighthouse, and uploads `coverage-report.json` and `lighthouse-report.json` as workflow artifacts.

---

If you'd like, I can also add a convenience script to run the build + preview + coverage + lighthouse end-to-end locally.
