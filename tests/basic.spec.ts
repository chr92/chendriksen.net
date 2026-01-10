
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Dynamically load all work project frontmatter from markdown files
function getWorkProjects() {
  const dir = path.resolve(__dirname, '../content/work');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const file = fs.readFileSync(path.join(dir, filename), 'utf-8');
    const { data } = matter(file);
    return {
      title: data.title,
      year: String(data.year),
      description: data.description,
      slug: filename.replace(/\.md$/, ''),
    };
  });
}

const latestProjects = getWorkProjects();

test.describe('Site basic functionality', () => {
  test('Homepage loads with expected content', async ({ page }) => {
    await page.goto('/');
    // Accept either hero_title or title from homepage
    const h1Text = await page.locator('h1').first().innerText();
    expect(["Hi, I'm Christiaan", 'Christiaan Hendriksen']).toContain(h1Text.trim());
    await expect(page.locator('text=Get in Touch')).toBeVisible();
    // Accept About Me heading only
    await expect(page.locator('h2', { hasText: 'About Me' })).toBeVisible();
    await expect(page.locator('img[alt="Christiaan Hendriksen"]')).toBeVisible();
    await expect(page.locator('text=Recent Work')).toBeVisible();
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(6);
    // No empty state
    await expect(page.locator('text=No work items found.')).toHaveCount(0);
  });

  test('Homepage latest work grid contains correct items', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards).toHaveCount(6);
    // Dynamically get card data from DOM and compare to markdown data (order-agnostic)
    const foundTitles = [];
    for (let i = 0; i < await cards.count(); i++) {
      const card = cards.nth(i);
      const cardText = (await card.innerText()).replace(/\s+/g, ' ');
      // Find a matching project for this card
      const match = latestProjects.find(p => cardText.includes(p.title) && cardText.includes(p.description) && cardText.includes(p.year));
      expect(match).toBeTruthy();
      foundTitles.push(match.title);
      // Check image loads
      const img = card.locator('img');
      await expect(img).toBeVisible();
    }
    // Ensure all markdown projects are present
    expect(foundTitles.sort()).toEqual(latestProjects.map(p => p.title).sort());
  });

  test('Individual work pages render correctly', async ({ page }) => {
    for (const project of latestProjects) {
      await page.goto('/');
      // Find the card with an exact title and year match
      const cards = page.locator('[data-testid="project-card"]');
      let foundHref = null;
      for (let i = 0; i < await cards.count(); i++) {
        const card = cards.nth(i);
        const cardText = (await card.innerText()).replace(/\s+/g, ' ');
        if (cardText.includes(project.title) && cardText.includes(project.year)) {
          foundHref = await card.getAttribute('href');
          // Ensure href matches expected slug
          if (foundHref && foundHref.includes(project.slug)) {
            break;
          }
        }
      }
      expect(foundHref).toBeTruthy();
      await page.goto(foundHref!);
      await expect(page.locator('h1')).toContainText(project.title);
      // Use less strict matching for description and year (at least one match)
      const descCount = await page.locator(`text=${project.description}`).count();
      expect(descCount).toBeGreaterThan(0);
      const yearCount = await page.locator(`text=${project.year}`).count();
      expect(yearCount).toBeGreaterThan(0);
      // Check at least one image is visible (hero or content image)
      const imgCount = await page.locator('img').count();
      expect(imgCount).toBeGreaterThan(0);
      for (let i = 0; i < imgCount; i++) {
        await expect(page.locator('img').nth(i)).toBeVisible();
      }
    }
  });

  test('Navigation links work (desktop)', async ({ page }) => {
    await page.goto('/');
    // Home
    await page.click('nav >> text=Home');
    await expect(page).toHaveURL('/');
    // About (scrolls to section)
    await page.click('nav >> text=About');
    await expect(page.locator('h2', { hasText: 'About Me' })).toBeVisible();
    // Work (dropdown)
    await page.click('nav >> text=Work');
    await expect(page).toHaveURL(/\/work/);
    await expect(page.locator('h1')).toContainText('Work');
    // Dropdown links to each project
    for (const project of latestProjects) {
      await page.goto('/');
      await page.hover('nav >> text=Work');
      const dropdownLink = page.locator('nav .group-hover\\:block a', { hasText: project.title });
      await expect(dropdownLink).toBeVisible();
      const href = await dropdownLink.getAttribute('href');
      expect(href).toBeTruthy();
      await page.goto(href!);
      await expect(page.locator('h1')).toContainText(project.title);
    }
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
    await expect(page.locator('text=Contact form coming soon')).toBeVisible();
  });

  test('No broken images in homepage grid', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('[data-testid="project-card"] img');
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const img = imgs.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      // Optionally, check image loads (status 200)
      const resp = await page.request.get(src!);
      expect(resp.status()).toBe(200);
    }
  });
});
