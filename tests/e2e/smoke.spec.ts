import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const expectNoAccessibilityViolations = async (pageTitle: string, builder: AxeBuilder) => {
  const results = await builder.analyze();
  expect(results.violations, `Accessibility issues found on ${pageTitle}`).toEqual([]);
};

test.describe('Dashboard smoke navigation', () => {
  test('navigates from dashboard to gradebook to assignments and back', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { level: 1, name: 'Welcome to SchoolOS' })).toBeVisible();
    await expectNoAccessibilityViolations('Dashboard', new AxeBuilder({ page }));

    await page.getByRole('button', { name: 'Open Gradebook' }).click();
    await expect(page).toHaveURL(/\/dashboard\/gradebook$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Gradebook Overview' })).toBeVisible();
    await expectNoAccessibilityViolations('Gradebook', new AxeBuilder({ page }));

    await page.getByRole('button', { name: 'View Assignments' }).click();
    await expect(page).toHaveURL(/\/dashboard\/assignments$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Assignments' })).toBeVisible();
    await expectNoAccessibilityViolations('Assignments', new AxeBuilder({ page }));

    await page.getByRole('button', { name: 'Back to Gradebook' }).click();
    await expect(page).toHaveURL(/\/dashboard\/gradebook$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Gradebook Overview' })).toBeVisible();

    await page.getByRole('button', { name: 'Back to Dashboard' }).click();
    await expect(page).toHaveURL(/\/?$/);
  });
});
