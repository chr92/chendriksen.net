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
tags: ["tag1", "tag2"]                      # optional
---

Your content here...
```

3. Push to `main` — images are automatically optimized during deployment

### New Slideshow Image

Add images to the homepage background slideshow:

1. Add your image to `app/assets/images/home_slideshow/`
2. Push to `main` — automatically included and optimized

The slideshow auto-discovers all images in that folder.

### Image Optimization

Images are automatically optimized to AVIF/WebP during CI/CD when new images are detected. To preview optimized images locally:

```bash
npm run gen:images
```

## Deployment

Deploys automatically via GitHub Actions when you push to `main`.

### CI/CD Workflow

| Changes | Tests | Image Gen | Deploy |
|---------|-------|-----------|--------|
| Only markdown files | ⏭️ Skip | ⏭️ Skip | ✅ Yes |
| Code changes | ✅ Run | ⏭️ Skip | ✅ If pass |
| New images | ✅ Run | ✅ Run | ✅ If pass |

### Setup

1. Add `VERCEL_TOKEN` secret in GitHub repo settings
2. Run `vercel link` locally once to connect to your Vercel project

## Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt configuration |
| `tailwind.config.ts` | Theme (colors, fonts) |
| `app/router.options.ts` | Page transition scroll behavior |
| `.github/workflows/test-and-deploy.yml` | CI/CD workflow |

## License

MIT License - see [LICENSE](LICENSE) file.
