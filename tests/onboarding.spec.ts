import { devices } from '@playwright/test';
import { OnboardingPage } from './pages/OnboardingPage';
import { test, expect } from './fixtures';

// test.use({ ...devices['iPhone SE'] });

test('onboarding page loads with budbright branding', async ({ onboardingPage }) => {
    await expect(onboardingPage.tagline).toBeVisible();
});

test('Verify google signin button visible', async ({ onboardingPage }) => {
    const googlebtn = await onboardingPage.getGoogleBtn();
    await expect(googlebtn).toBeVisible();
});

test('Verify nav to google accounts page', async ({ onboardingPage }) => {
    const googlebtn = await onboardingPage.getGoogleBtn();
    await googlebtn.click();
    await expect(onboardingPage.page).toHaveURL(onboardingPage.googleAccountsURL);
});

test('Verify nav to magic link page', async ({ onboardingPage }) => {

    await onboardingPage.emailButton.click();
    await expect(onboardingPage.magicLinkEmailInput).toBeVisible();
});
