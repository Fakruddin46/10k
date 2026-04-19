import { test, expect } from '@playwright/test';

test.describe('Admin Dashboards', () => {
  test('should load Orders page correctly', async ({ page }) => {
    // Mock login state for admin
    await page.addInitScript(() => {
      window.localStorage.setItem('isAdmin', 'true');
    });
    
    await page.goto('/admin/orders');
    
    // Check heading
    await expect(page.locator('h1')).toContainText('Orders Management');
    
    // Check that the table renders
    const table = page.locator('.admin-table');
    await expect(table).toBeVisible();
    
    // Check columns
    await expect(page.locator('th').filter({ hasText: 'Order ID' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Status' })).toBeVisible();
  });

  test('should load Manage Menu page and open Add Item modal', async ({ page }) => {
    // Mock login state for admin
    await page.addInitScript(() => {
      window.localStorage.setItem('isAdmin', 'true');
    });

    await page.goto('/admin/menu');
    
    // Check heading
    await expect(page.locator('h1')).toContainText('Manage Menu');
    
    // Click on 'Add New Item' and wait for the modal to be visible
    await page.click('button:has-text("Add New Item")');
    
    // Check if the modal opened successfully
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2')).toContainText('Add New Item');
    
    // Close the modal
    await page.click('.modal-header button.icon-btn');
    await expect(modal).not.toBeVisible();
  });

  for (let i = 1; i <= 50; i++) {
    test(`should see the details of the customers details in the Order Management - Test ${i}`, async ({ page }) => {
      await page.addInitScript(() => {
        window.localStorage.setItem('isAdmin', 'true');
      });
      await page.goto('/admin/orders');
      
      const table = page.locator('.admin-table');
      await expect(table).toBeVisible();
      
      // Verify Customer column is present
      await expect(page.locator('th').filter({ hasText: 'Customer' })).toBeVisible();
    });
  }
});
