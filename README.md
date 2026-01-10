# Christiaan Hendriksen Portfolio

A portfolio site built with Nuxt 4, Vue 3, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test:e2e` | Run Playwright tests |
| `npm run gen:images` | Generate optimized AVIF/WebP images |

## Project Structure

```
app/
├── pages/              # File-based routing
├── components/         # Vue components
├── composables/        # Shared logic (images, colors)
├── assets/css/         # Global styles
└── app.vue             # Root component

content/
├── homepage.md         # Homepage content
└── work/               # Project pages (markdown)

public/images/          # Source images
scripts/                # Build scripts
tests/                  # Playwright E2E tests
```

## Adding Content

### New Project

1. Add your project image to `public/images/` (e.g., `my-project.jpg`)

2. Create `content/work/my-project.md`:

```markdown
---
title: "Project Title"
description: "Short description"
year: 2024
image: "/images/my-project.jpg"
headerImage: "/images/my-project-hero.jpg"  # optional, uses image if not set
---

Your content here...
```

3. Commit and push to `main` — images are automatically optimized during deployment

### New Slideshow Image

Add images to the homepage background slideshow:

1. Add your image to `app/assets/images/home_slideshow/`
2. Commit and push to `main`

The slideshow auto-discovers all images in that folder.

### Image Optimization

Images are automatically optimized during Vercel deployment. To preview optimized images locally:

```bash
npm run gen:images
```

This creates AVIF/WebP versions at multiple sizes in `public/images/optimized/`.

## Deployment

Deploys automatically via Vercel when you push to `main`. GitHub Actions runs E2E tests in parallel.

### CI/CD Workflow

| Changes | Tests | Deploy |
|---------|-------|--------|
| Only markdown/content files | ⏭️ Skip | ✅ Yes |
| Code changes | ✅ Run | ✅ Yes |

Tests run via GitHub Actions. Vercel deploys independently (doesn't wait for tests).

## Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt configuration |
| `tailwind.config.ts` | Theme (colors, fonts) |
| `app/router.options.ts` | Page transition scroll behavior |
| `.github/workflows/test-and-deploy.yml` | CI/CD workflow |

## License

MIT License - see [LICENSE](LICENSE) file.
