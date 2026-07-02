import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('https://v2--budbright.netlify.app/who-is-using');

    await expect(page.getByRole('heading', {name: 'Who\'s using?'}), 'Session expired. Rerun auth.setup.spec.ts').toBeVisible({timeout: 5000});
  });
});
