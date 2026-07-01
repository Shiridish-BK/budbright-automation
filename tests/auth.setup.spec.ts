import { chromium, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via existing Chrome session', async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];

  const pages = context.pages();
  const budbrightPage = pages.find(p => p.url().includes('budbright.netlify.app'));

  if (!budbrightPage) {
    throw new Error('Could not find an open Budbright tab.');
  }

  console.log('Found tab:', budbrightPage.url());

  // Force a reload on that exact page to ensure Playwright's CDP session is properly bound to it
  await budbrightPage.reload();
  await budbrightPage.waitForLoadState('networkidle');

  await context.storageState({ path: authFile });
  console.log('Session saved to', authFile);

  await browser.close();
});