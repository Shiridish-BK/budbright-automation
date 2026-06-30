import { Page, Locator } from '@playwright/test'

export interface LocatorOptions {
    testId?: string;
    role?: {
        role: Parameters<Page['getByRole']>[0];
        name: string | RegExp
    };
    text?: string;
}

export class Healer {
    constructor(private page: Page) { }


    async resolve(label: string, options: LocatorOptions): Promise<Locator> {
        const attempts: { tier: string; locator: Locator }[] = [];

        if (options.testId) {
            attempts.push({ tier: 'testId', locator: this.page.getByTestId(options.testId) });
        }

        if (options.role) {
            attempts.push({ tier: 'role', locator: this.page.getByRole(options.role.role, { name: options.role.name }) });
        }

        if (options.text) {
            attempts.push({ tier: 'text', locator: this.page.getByText(options.text) });
        }

        for (const attempt of attempts) {
            const visible = await attempt.locator
                .waitFor({ state: 'visible', timeout: 5000 })
                .then(() => true)
                .catch(() => false);

            if (visible) {
                if (attempt.tier !== attempts[0].tier) {
                    console.warn(`[Healer] "${label}" resolved via fallback tier "${attempt.tier}". Primary tier failed`);
                }
                return attempt.locator;
            }
        }
        throw new Error(`[Healder] "${label}" coudl not be resolved by any strategy: ${JSON.stringify(options)}`);
    }
}