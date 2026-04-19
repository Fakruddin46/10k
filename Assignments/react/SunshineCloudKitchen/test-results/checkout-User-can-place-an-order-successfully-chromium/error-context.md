# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> User can place an order successfully
- Location: tests\checkout.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.add-to-cart-btn') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Sunshine Cloud Kitchen" [ref=e6] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - link "Home" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Menu" [ref=e9] [cursor=pointer]:
          - /url: /menu
        - link "About Us" [ref=e10] [cursor=pointer]:
          - /url: /about
      - generic [ref=e11]:
        - button [ref=e12] [cursor=pointer]:
          - img [ref=e13]
        - button [ref=e16] [cursor=pointer]:
          - img [ref=e17]
  - main [ref=e21]:
    - generic [ref=e23]:
      - heading "Our Menu" [level=1] [ref=e24]
      - paragraph [ref=e25]: Explore our wide variety of delicious meals.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('User can place an order successfully', async ({ page, context }) => {
  4  |   // 1. Intercept the WhatsApp redirection so the test doesn't stall by opening a new window
  5  |   await context.route('**/*', (route) => {
  6  |     if (route.request().url().includes('wa.me')) {
  7  |       return route.fulfill({ status: 200, body: 'Mocked WhatsApp Redirect!' });
  8  |     }
  9  |     return route.continue();
  10 |   });
  11 | 
  12 |   // 2. Go to Menu
  13 |   await page.goto('/menu');
  14 | 
  15 |   // 3. Wait for the mock items to load (checking for at least one "Add to Cart" button)
> 16 |   await page.waitForSelector('.add-to-cart-btn');
     |              ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  17 | 
  18 |   // 4. Click the very first "Add to Cart" button
  19 |   await page.locator('.add-to-cart-btn').first().click();
  20 | 
  21 |   // 5. Check if the Cart indicator updated to '1'
  22 |   await expect(page.locator('.cart-badge')).toHaveText('1');
  23 | 
  24 |   // 6. Force-click the cart button in case the drawer overlay is covering it, 
  25 |   // or just skip because the drawer might be open!
  26 |   await page.locator('.cart-btn').click({ force: true });
  27 | 
  28 |   // 7. Proceed to Checkout
  29 |   await page.click('text="Proceed to Checkout"');
  30 | 
  31 |   // 8. Assert we are actually successfully on the checkout page
  32 |   await expect(page).toHaveURL(/.*checkout/);
  33 | 
  34 |   // 9. Fill out the order form 
  35 |   await page.fill('input[name="name"]', 'Automated Robot');
  36 |   await page.fill('input[name="email"]', 'robot@test.com');
  37 |   await page.fill('input[name="mobile"]', '8888888888');
  38 |   await page.fill('input[name="address"]', '101 Cyber Street');
  39 |   await page.fill('input[name="city"]', 'Techville');
  40 | 
  41 |   // 10. Click Place Order
  42 |   await page.click('button[type="submit"]');
  43 | 
  44 |   // 11. Assert Success! 
  45 |   // We check if the URL transitioned to /tracking/...
  46 |   await expect(page).toHaveURL(/.*tracking/);
  47 | });
  48 | 
```