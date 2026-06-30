import { Page, expect, Locator } from '@playwright/test'
import { Healer } from '../utils/Healer';

export class OnboardingPage {
    readonly page: Page;
    readonly url = 'https://v2--budbright.netlify.app';
    readonly brandName: Locator;
    readonly tagline: Locator;
    //readonly googleSigninButton: Locator;
    readonly emailButton: Locator;
    readonly healer: Healer;

    readonly googleAccountsURL = /accounts\.google\.com/;

    readonly magicLinkEmailInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.healer = new Healer(page);
        this.brandName = page.getByText('Budbright');
        this.tagline = page.getByText('Real Play. Real Growth');
        //this.googleSigninButton = this.getGoogleBtn();
        this.emailButton = page.getByRole('button', { name: 'Email' });

        this.magicLinkEmailInput = page.getByPlaceholder('Your email address');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async expectLoaded() {
        await expect(this.brandName).toBeVisible();
    }

    async getGoogleBtn() : Promise<Locator>{
        return this.healer.resolve('Google sign-in button', {
            role: {role: 'button', name: 'Gooogle'},
            text: 'Google',
        });
    }
}