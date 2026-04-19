import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  for (let i = 1; i <= 15; i++) {
    test(`should load the home page successfully - iteration ${i}`, async ({ page }) => {
      await page.goto('/');
      
      // Verify hero section elements
      await expect(page.locator('h1')).toContainText('Food Delivery');
      await expect(page.locator('.hero-content .badge')).toContainText('Gourmet Quality');
      
      // Verify features section
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(3);
    });

    test(`should navigate to menu when clicking Order Now - iteration ${i}`, async ({ page }) => {
      await page.goto('/');
      
      // Click on the Order Now button
      await page.click('text="Order Now"');
      
      // Verify it navigates to the menu page
      await expect(page).toHaveURL(/.*\/menu/);
    });
  }
});
