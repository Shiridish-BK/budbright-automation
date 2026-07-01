import { test, expect } from '@playwright/test';

// test('Who\'s using screen shows kid card when children exist', async ({ page }) => {
//   await page.route('**/rest/v1/children**', async (route) => {
//     await route.fulfill({
//       status: 200,
//       contentType: 'application/json',
//       body: JSON.stringify([{ name: 'Test Kid' }]),
//     });
//   });

//   await page.goto('https://v2--budbright.netlify.app/who-is-using');
//   await expect(page.getByText('Test Kid')).toBeVisible();
// });

test('test who is using screen when fetch child fails', async({page})=>{
  await page.route('**/rest/v1/children**', async(route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({error: 'Internal Server Error'}),
    });
  });

  await page.goto('https://v2--budbright.netlify.app/who-is-using');
  await page.waitForTimeout(3000);
  await page.screenshot({path: 'test-results/who-is-using-500-state.png', fullPage:true});
});