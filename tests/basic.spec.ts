/**
 * E2E Tests - Site Functionality
 * 
 * These tests verify the site works correctly after code changes.
 * They are content-agnostic — they check structure and functionality,
 * not specific text content.
 * 
 * Run with: npm run test:e2e
 * Tests auto-start the dev server via playwright.config.ts
 */
import { test, expect } from '@playwright/test';

test.describe('Site functionality', () => {
  
  test('Homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Core page structure
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Project grid has cards
    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
    
    // No empty state
    await expect(page.locator('text=No work items found.')).toHaveCount(0);
  });

  test('Project cards link to valid pages', async ({ page }) => {
    await page.goto('/');
    
    const cards = page.locator('[data-testid="project-card"]');
    const firstCardHref = await cards.first().getAttribute('href');
    
    // Cards should link to /work/* pages
    expect(firstCardHref).toBeTruthy();
    expect(firstCardHref).toMatch(/^\/work\//);
    
    // Navigation works
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
    
    // Work page
    await page.click('nav >> text=Work');
    await expect(page).toHaveURL(/\/work/);
    
    // Contact page
    await page.click('nav >> text=Contact');
    await expect(page).toHaveURL('/contact');
    
    // Home
    await page.click('nav >> text=Home');
    await expect(page).toHaveURL('/');
  });

  test('About link scrolls to about section', async ({ page }) => {
    await page.goto('/');
    
    // Click the About link in the nav
    await page.click('nav >> text=About');
    
    // URL should have the hash
    await expect(page).toHaveURL('/#about');
    
    // About section should be visible
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Contact form renders correctly', async ({ page }) => {
    await page.goto('/contact');
    
    // Form elements are present
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // hCaptcha container is present
    await expect(page.locator('.h-captcha')).toBeVisible();
  });

  test('Images load without errors', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('[data-testid="project-card"] img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Each image is visible with valid src
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
    
    // Filter benign errors
    const realErrors = errors.filter(e => !e.includes('favicon'));
    expect(realErrors).toHaveLength(0);
  });
});
