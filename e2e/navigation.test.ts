import { test, expect } from '@playwright/test';

test('navigation', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL('/contact');

  await page.getByRole('link', { name: 'Play Reversi' }).click();
  await expect(page).toHaveURL('/reversi');

  await page.getByRole('link', { name: 'Webdev CV' }).click();
  await expect(page).toHaveURL('/');

  await page.getByRole('link', { name: 'Go to contact' }).click();
  await expect(page).toHaveURL('/contact');
});
