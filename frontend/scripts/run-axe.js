import { chromium } from 'playwright-core';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const targetUrl = process.argv[2] ?? 'http://localhost:4173';
const outputPath = process.argv[3] ?? path.resolve(process.cwd(), '../reports/frontend-axe.json');

const executablePath = process.env.PLAYWRIGHT_CHROME_PATH || '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => document.querySelector('h1') !== null,
    undefined,
    { timeout: 10000 }
  );
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const results = await page.evaluate(async () => {
    return await window.axe.run({
      resultTypes: ['violations', 'incomplete', 'inapplicable']
    });
  });

  await browser.close();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
