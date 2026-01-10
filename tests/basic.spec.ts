  test('Mobile menu navigation works', async ({ page, browserName }) => {
    // Only run for webkit/chromium (not Firefox, which has issues with viewport emulation sometimes)
    test.skip(browserName === 'firefox', 'Mobile menu test skipped on Firefox');
    await page.setViewportSize({ width: 375, height: 800 }); // iPhone size
    await page.goto('/');
    // Open mobile menu
    await page.click('button[aria-label="Open Menu"], button:has-text("Open Menu")');
    // Home link
    await page.click('.container .text-2xl:has-text("Home")');
    await expect(page).toHaveURL('/');
    // Open menu again
    await page.click('button[aria-label="Open Menu"], button:has-text("Open Menu")');
    // Work link
    await page.click('.container .text-2xl:has-text("Work")');
    await expect(page).toHaveURL('/work');
    // Open menu again
    await page.click('button[aria-label="Open Menu"], button:has-text("Open Menu")');
    // Work sub-items
    for (const project of latestProjects) {
      await page.click('button[aria-label="Open Menu"], button:has-text("Open Menu")');
      const subLink = page.locator('.pl-4 .text-lg', { hasText: project.title });
      await expect(subLink).toBeVisible();
      await subLink.click();
      await expect(page).toHaveURL(new RegExp(project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
    }
    // Open menu again
    await page.click('button[aria-label="Open Menu"], button:has-text("Open Menu")');
    // About link
    await page.click('.container .text-2xl:has-text("About")');
    await expect(page.locator('text=About Me')).toBeVisible();
    // Open menu again
    await page.click('button[aria-label="Open Menu"], button:has-text("Open Menu")');
    // Contact link
    await page.click('.container .text-2xl:has-text("Contact")');
    await expect(page.locator('h1')).toContainText('Contact');
  });
import { test, expect } from '@playwright/test';

// The 6 latest work projects (sorted by year desc)
const latestProjects = [
  {
    title: 'Treeeee',
    year: '2025',
    description: 'A clown show about nature.'
  },
  {
    title: 'Waiting For Freedom',
    year: '2026',
    description: 'A documentary about Philippe Gaulier.'
  },
  {
    title: 'Werewolves of London',
    year: '2024',
    description: 'from Big Zeus Energy.'
  },
  {
    title: 'Big Zeus Energy',
    year: '2022',
    description: 'High energy comedy.'
  },
  {
    title: 'An Interview with Philippe Gaulier',
    year: '2022',
    description: 'Podcast episode.'
  },
  {
    title: 'The Jazz Man',
    year: '2020',
    description: 'What is Jazz?'
  }
];

test.describe('Site basic functionality', () => {
  test('Homepage loads with expected content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(["Hi, I'm Christiaan", 'Christiaan Hendriksen']);
    await expect(page.locator('text=Get in Touch')).toBeVisible();
    await expect(page.locator('text=About Me')).toBeVisible();
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
    for (let i = 0; i < latestProjects.length; i++) {
      const card = cards.nth(i);
      await expect(card).toContainText(latestProjects[i].title);
      await expect(card).toContainText(latestProjects[i].description);
      await expect(card).toContainText(latestProjects[i].year);
      // Check image loads
      const img = card.locator('img');
      await expect(img).toBeVisible();
    }
  });

  test('Individual work pages render correctly', async ({ page }) => {
    for (const project of latestProjects) {
      // Find the card and get its href
      await page.goto('/');
      const card = page.locator('[data-testid="project-card"]', { hasText: project.title });
      const href = await card.getAttribute('href');
      expect(href).toBeTruthy();
      await page.goto(href!);
      await expect(page.locator('h1')).toContainText(project.title);
      await expect(page.locator('text=' + project.description)).toBeVisible();
      await expect(page.locator('text=' + project.year)).toBeVisible();
      // Check hero image
      await expect(page.locator('img')).toBeVisible();
    }
  });

  test('Navigation links work (desktop)', async ({ page }) => {
    await page.goto('/');
    // Home
    await page.click('nav >> text=Home');
    await expect(page).toHaveURL('/');
    // About (scrolls to section)
    await page.click('nav >> text=About');
    await expect(page.locator('text=About Me')).toBeVisible();
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
