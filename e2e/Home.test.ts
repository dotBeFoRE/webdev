import { test, expect } from '@playwright/test';

test('home', async ({ page }) => {
  await page.goto('/');

  const accept = page.getByRole('button', { name: 'Alles accepteren' });
  expect(accept).toBeTruthy();

  const messageHeading = page.getByRole('heading', { name: 'Message' });
  expect(messageHeading).toBeTruthy();

  const skillsHeading = page.getByRole('heading', { name: 'Skills' });
  expect(skillsHeading).toBeTruthy();

  const profileHeading = page.getByRole('heading', { name: 'Profiel' });
  expect(profileHeading).toBeTruthy();

  const title = page.getByRole('heading', { name: 'Ayrton-Taede Tromp' });
  expect(title).toBeTruthy();
});
