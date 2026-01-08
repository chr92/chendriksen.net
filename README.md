# Christiaan Hendriksen personal website
--

## Content — editing & site structure

This repo stores site content as Markdown files under the `content/` folder. Follow these notes when editing content or adding new pages.

- Homepage content
  - The homepage components live under `app/components/` (e.g. `HomeSlideshow.vue`, `ProjectGrid.vue`).
  - The slideshow uses images from `app/assets/images/home_slideshow/` and the generator will create optimized variants under `public/images/optimized/home_slideshow/` when you run `npm run gen:images`.

- Adding a `work` page
  - Create a file under `content/work/` (e.g. `content/work/new-project.md`).
  - Required frontmatter fields used by the site:
    - `title`: page title
    - `description`: short description used in SEO and listings
    - `image`: path to the thumbnail used on the homepage / project card (e.g. `/images/new-project.jpg`)
    - `headerImage` (optional but recommended): path to the hero/header image used at the top of the project page. If omitted, `image` is used as fallback.
  - Optional frontmatter fields that the layout will read (add as needed):
    - `tags`: displayed as small pill tags beneath the hero/title.
    - `role`, `director`, `year`, `company`: shown in the metadata bar below the hero.
    - `gallery`: array of image paths; rendered in the gallery section on the project page.
    - `navigation`: a flag you can add for editorial control, but it is NOT used by the homepage selection query by default (see below). To make the homepage only list pages with `navigation: true`, update `app/components/ProjectGrid.vue` and add a `.where('navigation', '==', true)` to the content query.

Example frontmatter for a `work` page:

```markdown
---
title: "New Project"
description: "Short blurb about the project."
image: "/images/new-project.jpg"        # thumbnail used on homepage and next-to-text image
headerImage: "/images/new-project-hero.jpg"  # hero image for the top of the project page
tags: ["theatre", "clown"]
role: "Performer"
gallery: ["/images/gallery-1.jpg", "/images/gallery-2.jpg"]
---
```

- Work page structure
  - The page layout (`app/components/layouts/ProjectLayout.vue`) displays a hero/header (from `headerImage`) and a content image (the `image` field — this keeps the homepage / cards consistent with the image next to the text).
  - The page content body is the Markdown content; the layout trims the top-level H1 from the Markdown so the hero title is the authoritative page title.

- How projects are selected for the homepage
  - The homepage component `app/components/ProjectGrid.vue` queries the content API:

```js
queryCollection('content')
  .where('path', 'LIKE', '/work/%')
  .limit(6)
  .all()
```

  - This means by default the homepage shows up to 6 `content/work/*` pages. To change selection criteria (e.g. only show pages with `navigation: true`, or sort by a `date` field), edit `ProjectGrid.vue` and modify the query accordingly.

## Images & optimized assets

- Image workflow
  1. Add source images to `public/images/` (or `app/assets/images/home_slideshow/` for slideshow slides).
  2. Run `npm run gen:images` to generate AVIF/WebP variants and a mapping file at `app/assets/optimized-images.json`.
  3. Components import the mapping and automatically use `srcset` + fallback when a mapping exists.

- Mapping keys
  - The optimized mapping keys are the filename basenames (e.g. `new-project.jpg`). Components extract the basename to look up the mapping.

## Tech / code side — building, running, testing

- Development
  - Run the dev server with `npm run dev` and open `http://localhost:3000`.

- Generating optimized images
  - `npm run gen:images` (uses Sharp). Output files are written to `public/images/optimized/` and the JSON mapping is updated at `app/assets/optimized-images.json`.
  - As a convenience, commit generated optimized assets to the repo if your host doesn't run the generator during deploy.

- Build & preview
  - `npm run build` then `npm run preview` to test production output locally.

- Performance tooling
  - See the Performance testing section above for instructions to run image/CSS coverage and Lighthouse locally.

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