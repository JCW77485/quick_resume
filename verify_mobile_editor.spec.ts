import { test, expect } from '@playwright/test';

test('mobile editor preview tab', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5174/#/builder');

  // Create a resume
  await page.click('button:has-text("New resume")');
  await expect(page).toHaveURL(/\/builder\/r_/);

  // We should be in the editor. Check for Content tab.
  await expect(page.locator('button:has-text("Content")')).toBeVisible();
  await expect(page.locator('button:has-text("Preview")')).toBeVisible();

  // Click Preview tab
  await page.click('button:has-text("Preview")');

  // Verify preview is visible. We use .first() because there might be multiple (hidden) ones.
  await expect(page.locator('.resume-preview-stage').first()).toBeVisible();

  await page.screenshot({ path: 'mobile_editor_preview.png' });
});
