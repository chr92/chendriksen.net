# Christiaan Hendriksen Personal Website

A high-performance, fully tested portfolio site built with **Nuxt 4**, **Vue 3**, and **Playwright E2E testing**.

## ✨ Features

- **Smooth Page Transitions**: 0.35s fade transitions between all routes using Nuxt's native `<Transition>` component
- **Comprehensive E2E Testing**: Automated Playwright tests verify content, navigation, images, and functionality
- **Optimized Images**: AVIF/WebP generation with responsive srcsets using Sharp
- **SEO Optimized**: Perfect Lighthouse scores for SEO (100) and Best Practices (100)
- **Accessibility**: 96+ Lighthouse accessibility score
- **Performance**: Optimized bundle with static pre-rendering on Vercel
- **Dynamic Test Data**: Tests automatically read markdown files instead of maintaining hardcoded test data
- **Automated Deployment**: Tests run automatically on Vercel before deployment

## Performance Metrics

Latest Lighthouse audit (http://localhost:3000):
- **Performance**: 69
- **Accessibility**: 96
- **Best Practices**: 100
- **SEO**: 100

## 🚀 Quick Start

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build & Test

```bash
# Build for production
npm run build

# This automatically runs E2E tests after build (postbuild script)
# npm run test:e2e runs separately

# Preview the production build
npm run preview
```

### Testing

```bash
# Run E2E tests (tests automatically read markdown content)
npm run test:e2e

# Run Lighthouse audit
BASE_URL=http://localhost:3000 npm run lighthouse

# Generate optimized images
npm run gen:images

# Complete performance suite (gen:images → build → preview → coverage → lighthouse)
npm run perf:e2e
```

## Content Management

### Homepage

The homepage is composed of:
- **Hero Section**: Title and description from `content/homepage.md` with rotating background slideshow
- **Project Grid**: Displays up to 6 latest work projects from `content/work/*` markdown files
- **About Section**: Content from `content/homepage.md`

### Adding a Work Page

Create a file under `content/work/` with required frontmatter fields:

```markdown
---
title: "Project Title"
description: "Short description for listings and SEO"
image: "/images/project.jpg"              # Card/content image
headerImage: "/images/project-hero.jpg"   # Hero image (optional, defaults to image)
year: 2024                                 # Displayed in project cards
tags: ["theatre", "clown"]                # Display as pills (optional)
---

# Project Name

Your markdown content here...
```

**Note**: The H1 header in the markdown is automatically removed in favor of the `title` frontmatter field.

## Image Optimization

### Workflow

1. **Add source images**:
   - Portfolio images: `public/images/` (e.g., `new-project.jpg`)
   - Slideshow images: `app/assets/images/home_slideshow/`

2. **Generate optimized variants**:
   ```bash
   npm run gen:images
   ```
   - Creates AVIF and WebP variants at sizes: 400px, 800px, 1200px, 1600px
   - Generates mapping files:
     - `app/assets/optimized-images.json`
     - `public/images/optimized/images.json`

3. **Components use mappings automatically** via the `resolveOptimizedImage` composable

### Image Optimization Details

- **Tool**: Sharp (command: `node scripts/image-gen.cjs`)
- **Formats**: AVIF (primary), WebP (fallback), JPEG (browser fallback)
- **Quality**: 80 (balanced quality/size)
- **Color Extraction**: Uses `node-vibrant` to extract dominant colors
- **Output**: Responsive srcsets with proper fallbacks

## Testing

### E2E Testing

The project uses **Playwright** for comprehensive browser testing. Tests are configured to:
- Auto-start the Nuxt dev server
- Dynamically read markdown files from `content/work/*`
- Never need hardcoded test data updates

Run tests with:
```bash
npm run test:e2e
```

**Test Coverage**:
- Homepage loads with expected content and structure
- Project grid displays all work items with correct metadata
- Navigation works across all pages
- Individual project pages render correctly with hero images
- Contact page loads properly
- No broken images in the grid

Tests automatically parse markdown frontmatter using the `gray-matter` library, so adding a new project automatically makes it testable.

### Running Tests on Vercel

Tests run automatically as part of the build pipeline via `vercel.json`:
```json
{
  "buildCommand": "npm run build && npm run test:e2e"
}
```

This ensures no broken deployments reach production.

## Architecture

### Tech Stack

- **Framework**: Nuxt 4.2.2 (Vue 3.5.26, Vite 7.3.1)
- **Styling**: Tailwind CSS 3 with custom animations
- **Content**: Nuxt Content 3.10.0 (markdown with frontmatter)
- **Testing**: Playwright 1.57.0
- **Image Optimization**: Sharp 0.34.5
- **Color Extraction**: node-vibrant 4.0.3
- **YAML Parsing**: gray-matter 4.0.3
- **Analytics**: PostHog (optional, client-side)
- **Database**: SQLite (via better-sqlite3, internal to Nuxt Content)
- **Hosting**: Vercel (static preset with pre-rendering)

### Component Structure

```
app/
├── components/
│   ├── AppHeader.vue          # Navigation with dropdown menu
│   ├── AppFooter.vue          # Footer
│   ├── HomeSlideshow.vue      # Rotating background images
│   ├── ProjectGrid.vue        # Homepage project listing
│   ├── ProjectCard.vue        # Individual project card
│   └── layouts/
│       └── ProjectLayout.vue  # Project page layout
├── pages/
│   ├── index.vue              # Homepage
│   ├── work.vue               # Work index
│   ├── [...slug].vue          # Dynamic project pages
│   └── contact.vue            # Contact page
├── composables/
│   ├── useOptimizedImage.ts   # Image optimization lookup
│   ├── usePageColors.ts       # Dynamic hero colors
│   └── usePostHog.js          # Analytics
└── assets/
    └── css/
        └── main.css           # Global styles + fade transitions
```

### Page Transitions

Smooth fade transitions between pages (0.35s, cubic-bezier easing):
- Implemented in `app/app.vue` wrapping `<NuxtPage />`
- CSS defined in `app/assets/css/main.css`
- Uses CSS opacity transitions (no layout shift)

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
