// spec: specs/parent-onboarding.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Parent Onboarding Flow', () => {
  test('Selecting Parent profile navigates to Parent Home with personalized greeting and top picks', async ({ page }) => {
    // 1. Start from the seeded state: page is already at https://v2--budbright.netlify.app/who-is-using, authenticated via storageState (playwright/.auth/user.json).
    await page.goto('https://v2--budbright.netlify.app/who-is-using');
    await expect(page).toHaveURL('https://v2--budbright.netlify.app/who-is-using');
    await expect(page.getByRole('heading', { name: 'Who\'s using?' })).toBeVisible();
    await expect(page.getByText('Tap to enter your world')).toBeVisible();

    const parentButton = page.getByRole('button', { name: 'Parent' });
    await expect(parentButton).toBeVisible();
    await expect(parentButton).toContainText('Find play zones, classes & weekend events');
    await expect(page.getByRole('button', { name: 'Kid' })).toBeVisible();

    // 2. Click the "Parent" button.
    await parentButton.click();
    await expect(page).toHaveURL(/\/parent\/home/);

    // 3. On the Parent Home screen, locate the top banner/header region and verify a personalized greeting is visible.
    const banner = page.getByRole('banner');
    await expect(banner).toBeVisible();
    const greeting = banner.getByText(/^(Hi|Hello|Hey|Welcome)\b.*/i);
    await expect(greeting).toBeVisible();

    // 4. On the Parent Home screen, search the main content area for the personalized 'Top picks for <kid name>' section.
    const topPicks = page.getByText(/Top picks for .+/i);
    await expect(topPicks).toBeVisible();
    const topPicksText = await topPicks.textContent();
    const match = topPicksText?.match(/Top picks for (.+)/i);
    expect(match?.[1]?.trim().length ?? 0).toBeGreaterThan(0);

    // 5. (Sanity check) Verify other static Parent Home landmarks are present to confirm the correct screen loaded.
    await expect(page.getByRole('heading', { name: 'Browse by category' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Read · Watch' })).toBeVisible();
    const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(mainNav).toBeVisible();
    await expect(mainNav.getByRole('button', { name: 'Home' })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: 'Explore' })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: 'Profile' })).toBeVisible();
  });

  test('Kid profile button is visible but not selected (negative/independence check)', async ({ page }) => {
    // 1. Start from the seeded state at /who-is-using.
    await page.goto('https://v2--budbright.netlify.app/who-is-using');
    const parentButton = page.getByRole('button', { name: 'Parent' });
    const kidButton = page.getByRole('button', { name: 'Kid' });
    await expect(parentButton).toBeVisible();
    await expect(parentButton).toBeEnabled();
    await expect(kidButton).toBeVisible();
    await expect(kidButton).toBeEnabled();

    // 2. Assert that without any interaction, the page remains on /who-is-using and no navigation to /parent/home or /kid/home has occurred.
    await expect(page).toHaveURL('https://v2--budbright.netlify.app/who-is-using');
    await expect(page.getByText(/^(Hi|Hello|Hey|Welcome)\b.*/i)).not.toBeVisible();
    await expect(page.getByText(/Top picks for .+/i)).not.toBeVisible();
  });
});
