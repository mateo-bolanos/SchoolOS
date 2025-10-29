import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const formatViolations = (violations) =>
  violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `  • ${node.target.join(' ')}\n    ${node.failureSummary}`)
        .join('\n');
      return `${violation.id} (${violation.impact})\n${violation.help}: ${violation.description}\n${nodes}`;
    })
    .join('\n\n');

const expectNoAccessibilityViolations = async (page, context) => {
  const results = await new AxeBuilder({ page }).analyze();
  const { violations } = results;

  expect(
    violations,
    violations.length
      ? `Accessibility issues detected on ${context}:\n${formatViolations(violations)}`
      : undefined
  ).toEqual([]);
};

test.describe('Primary navigation smoke test', () => {
  test('dashboard → gradebook → assignments → dashboard remains healthy and accessible', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await expectNoAccessibilityViolations(page, 'Dashboard');

    await page.getByRole('link', { name: 'Gradebook' }).click();
    await expect(page).toHaveURL(/\/sections\/.*\/gradebook$/);
    const gradebookHeading = page.getByRole('heading', { level: 1 });
    await expect(gradebookHeading).toHaveText(/Foundations of Teaching/i);
    await expectNoAccessibilityViolations(page, 'Gradebook');

    await page.getByRole('link', { name: 'Assignments' }).click();
    await expect(page).toHaveURL(/\/assignments$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Assignments' })).toBeVisible();
    await expectNoAccessibilityViolations(page, 'Assignments');

    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await expectNoAccessibilityViolations(page, 'Dashboard (return)');
  });
});
