import { test as base } from '@playwright/test';
import { OnboardingPage } from './pages/OnboardingPage'

type Fixtures = {
    onboardingPage: OnboardingPage;
};

export const test = base.extend<Fixtures>({
    onboardingPage: async ({ page }, use) => {
        const onboarding = new OnboardingPage(page);
        await onboarding.goto();
        await onboarding.expectLoaded();
        await use(onboarding);
    }
});

export { expect } from '@playwright/test';
