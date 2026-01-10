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
├── pages/
│   ├── index.vue          # Homepage (hero, projects, about)
│   ├── work.vue           # All projects listing
│   ├── [...slug].vue      # Dynamic project pages
│   └── contact.vue        # Contact page
├── components/
│   ├── AppHeader.vue      # Navigation
│   ├── AppFooter.vue      # Footer
│   ├── ProjectGrid.vue    # Homepage project grid
│   ├── ProjectCard.vue    # Project card component
│   └── HomeSlideshow.vue  # Hero background slideshow
├── composables/
│   ├── useOptimizedImage.ts  # Image optimization lookup
│   └── usePageColors.ts      # Dynamic accent colors
├── assets/css/main.css    # Global styles + transitions
├── router.options.ts      # Page transition scroll fix
└── app.vue                # Root component (transitions)

content/
├── homepage.md            # Homepage content
└── work/                  # Project pages (markdown)
    └── project-name.md

public/images/             # Source images
scripts/                   # Build scripts (image gen, etc.)
tests/                     # Playwright E2E tests
```

## Adding a Project

Create `content/work/project-name.md`:

```markdown
---
title: "Project Title"
description: "Short description"
year: 2024
image: "/images/project.jpg"
headerImage: "/images/project-hero.jpg"  # optional
tags: ["tag1", "tag2"]                   # optional
---

Your content here...
```

Then add the image to `public/images/` and run:

```bash
npm run gen:images   # Generate optimized versions
```

## Image Optimization

Images are automatically optimized to AVIF/WebP with responsive srcsets.

1. Add source image to `public/images/`
2. Run `npm run gen:images`
3. Components automatically use optimized versions

Generated files:
- `public/images/optimized/` (optimized images)
- `app/assets/optimized-images.json` (mapping file)

## Testing

Tests verify site functionality without checking specific content:

```bash
npm run test:e2e
```

Tests check:
- Pages render correctly
- Navigation works
- Images load
- No console errors

## Deployment

Configured for Vercel with static generation. Run tests locally before deploying:

```bash
npm run test:e2e && npm run build
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt configuration |
| `tailwind.config.ts` | Tailwind theme (colors, fonts) |
| `app/router.options.ts` | Scroll behavior during transitions |
| `app/assets/css/main.css` | Global styles, transition CSS |
| `playwright.config.ts` | Test configuration |
| `vercel.json` | Deployment settings |

### Favicon

SVG favicon at `public/favicon.svg` with configuration in `nuxt.config.ts`:
```typescript
app: {
  head: {
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
    ]
  }
}
```

## Deployment

### Vercel Setup

The project is configured for **Vercel static deployments** with:
- `vercel.json` specifying build command
- Automatic pre-rendering of all routes
- Tests running before deployment

```json
{
  "buildCommand": "npm run build && npm run test:e2e"
}
```

**Build Output**: `.vercel/output/static` (can be deployed directly or via `vercel deploy --prebuilt`)

### Environment Variables

No required environment variables for basic functionality. Optional:
- `BASE_URL`: For Lighthouse and coverage scripts (defaults to localhost:3000)
- PostHog API key in `app/composables/usePostHog.js` (for analytics)

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Production build (runs tests via postbuild) |
| `npm run preview` | Preview production build locally |
| `npm run test:e2e` | Run Playwright tests |
| `npm run gen:images` | Generate optimized image variants |
| `npm run lighthouse` | Run Lighthouse audit |
| `npm run coverage` | CSS/image coverage analysis |
| `npm run perf:e2e` | Full perf suite (images → build → preview → tests → lighthouse) |

## Code Quality

### TypeScript

- Strict mode enabled via Nuxt defaults
- Type-safe markdown frontmatter parsing
- Type definitions for all composables

### Linting & Type Checking

The project includes proper TypeScript configuration:
- `@types/node` for Node module definitions
- Type annotations on all test functions
- Strict parameter typing in test utilities

No linting errors or TypeScript compilation errors.

## Git Management

### Ignored Files

- `.gitignore` excludes:
  - `node_modules/`
  - `.nuxt/` (build artifacts)
  - `.vercel/` (deployment output)
  - `coverage-report.json`
  - `lighthouse-report.json`
  - `test-results/`

## Contributing Notes

### Adding Features

1. **New Content**: Add markdown files to `content/` with proper frontmatter
2. **New Components**: Place in `app/components/` with `.vue` extension
3. **New Pages**: Add to `app/pages/` (file-based routing)
4. **Styling**: Use Tailwind classes or add to `app/assets/css/main.css`
5. **Tests**: Add to `tests/` directory (Playwright tests auto-discover)

### Testing New Features

Always run tests after making changes:
```bash
npm run build    # Builds and tests
npm run test:e2e # Tests only
```

Tests automatically verify:
- Page structure and content
- Dynamic markdown content is correctly rendered
- Navigation and routing work
- Images load without errors

## License

Personal portfolio site — customize as needed.
