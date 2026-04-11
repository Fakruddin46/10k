import { test, expect } from '@playwright/test';

test('User can place an order successfully', async ({ page, context }) => {
  // 1. Intercept the WhatsApp redirection so the test doesn't stall by opening a new window
  await context.route('**/*', (route) => {
    if (route.request().url().includes('wa.me')) {
      return route.fulfill({ status: 200, body: 'Mocked WhatsApp Redirect!' });
    }
    return route.continue();
  });

  // 2. Go to Menu
  await page.goto('/menu');

  // 3. Wait for the mock items to load (checking for at least one "Add to Cart" button)
  await page.waitForSelector('.add-to-cart-btn');

  // 4. Click the very first "Add to Cart" button
  await page.locator('.add-to-cart-btn').first().click();

  // 5. Check if the Cart indicator updated to '1'
  await expect(page.locator('.cart-badge')).toHaveText('1');

  // 6. Force-click the cart button in case the drawer overlay is covering it, 
  // or just skip because the drawer might be open!
  await page.locator('.cart-btn').click({ force: true });

  // 7. Proceed to Checkout
  await page.click('text="Proceed to Checkout"');

  // 8. Assert we are actually successfully on the checkout page
  await expect(page).toHaveURL(/.*checkout/);

  // 9. Fill out the order form 
  await page.fill('input[name="name"]', 'Automated Robot');
  await page.fill('input[name="email"]', 'robot@test.com');
  await page.fill('input[name="mobile"]', '8888888888');
  await page.fill('input[name="address"]', '101 Cyber Street');
  await page.fill('input[name="city"]', 'Techville');

  // 10. Click Place Order
  await page.click('button[type="submit"]');

  // 11. Assert Success! 
  // We check if the URL transitioned to /tracking/...
  await expect(page).toHaveURL(/.*tracking/);
});
