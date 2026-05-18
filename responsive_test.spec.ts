import { test, expect } from '@playwright/test';

const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
];

for (const viewport of viewports) {
    test(`Responsive check: ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Check Landing
        await page.goto('http://localhost:5174/#/');
        // Use first() to avoid strict mode violation with resume previews
        await expect(page.locator('h1').first()).toContainText('Build a resume');
        await page.screenshot({ path: `responsive_landing_${viewport.name}.png` });

        // Check Templates
        await page.goto('http://localhost:5174/#/templates');
        await expect(page.locator('h1').first()).toContainText('Choose Your Template');
        await page.screenshot({ path: `responsive_templates_${viewport.name}.png` });

        // Check Dashboard
        await page.goto('http://localhost:5174/#/builder');
        await expect(page.locator('h1').first()).toContainText('My Resumes');
        await page.screenshot({ path: `responsive_dashboard_${viewport.name}.png` });
    });
}
