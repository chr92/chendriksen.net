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

> CI automation for performance checks has been removed from this repo. The site is still deployed via Vercel; performance tooling is available to run locally and should be executed before opening PRs if you want up-to-date reports.

--
