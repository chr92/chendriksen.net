import { test, expect } from '@playwright/test';

test.describe('Site functionality', () => {
  
  test('Homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Page structure exists
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Project grid renders with cards
    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
    
    // No empty state shown
    await expect(page.locator('text=No work items found.')).toHaveCount(0);
  });

  test('Project cards link to valid pages', async ({ page }) => {
    await page.goto('/');
    
    const cards = page.locator('[data-testid="project-card"]');
    const firstCardHref = await cards.first().getAttribute('href');
    expect(firstCardHref).toBeTruthy();
    expect(firstCardHref).toMatch(/^\/work\//);
    
    // Click first card and verify page loads
    await cards.first().click();
    await expect(page).toHaveURL(/\/work\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Work page lists all projects', async ({ page }) => {
    await page.goto('/work');
    
    await expect(page.locator('h1')).toBeVisible();
    const projectLinks = page.locator('a[href^="/work/"]');
    expect(await projectLinks.count()).toBeGreaterThan(0);
  });

  test('Navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Work
    await page.click('nav >> text=Work');
    await expect(page).toHaveURL(/\/work/);
    
    // Navigate to Contact
    await page.click('nav >> text=Contact');
    await expect(page).toHaveURL('/contact');
    
    // Navigate Home
    await page.click('nav >> text=Home');
    await expect(page).toHaveURL('/');
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Images load without errors', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('[data-testid="project-card"] img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify each image has a src and loads successfully
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('No console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.goto('/work');
    await page.goto('/contact');
    
    // Filter out known benign errors (like favicon 404 in dev)
    const realErrors = errors.filter(e => !e.includes('favicon'));
    expect(realErrors).toHaveLength(0);
  });
});
