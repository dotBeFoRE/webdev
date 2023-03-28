import { test, expect } from '@playwright/test';

test('gdprPopup accept', async ({ page, context }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Alles accepteren' }).click();

  const storage = await context.storageState();
  expect(
    storage.origins[0]?.localStorage.some(
      (item) => item.name === 'gdpr' && item.value === 'accepted',
    ),
  ).toBe(true);
});

test('gdprPopup deny', async ({ page, context }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Alleen essentieel' }).click();

  const storage = await context.storageState();
  expect(
    storage.origins[0]?.localStorage.some(
      (item) => item.name === 'gdpr' && item.value === 'declined',
    ),
  ).toBe(true);
});
