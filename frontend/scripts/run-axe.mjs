import { chromium } from 'playwright';
import fs from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

const [, , targetUrl, outputPathArg] = process.argv;

if (!targetUrl) {
  console.error('Usage: node scripts/run-axe.mjs <url> [outputPath]');
  process.exit(1);
}

const outputPath = outputPathArg ?? 'axe-report.json';

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome'
});

const page = await browser.newPage();
await page.goto(targetUrl, { waitUntil: 'networkidle' });

const axeScriptPath = require.resolve('axe-core/axe.min.js');
await page.addScriptTag({ path: axeScriptPath });

const results = await page.evaluate(async () => {
  return await window.axe.run(document, { resultTypes: ['violations', 'incomplete', 'passes', 'inapplicable'] });
});

await browser.close();

const outputDir = path.dirname(outputPath);
if (outputDir && outputDir !== '.') {
  await fs.mkdir(outputDir, { recursive: true });
}
await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

const criticalViolations = results.violations.filter((violation) => violation.impact === 'critical');
if (criticalViolations.length > 0) {
  console.error(`Found ${criticalViolations.length} critical accessibility issues.`);
  process.exitCode = 1;
}
