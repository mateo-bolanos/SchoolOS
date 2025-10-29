#!/usr/bin/env node
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_URL = 'http://127.0.0.1:4173/dashboard';
const PORT = 4173;
const HOST = '0.0.0.0';

const budgets = {
  lcp: 3300,
  cls: 0.1,
  tbt: 200
};

const waitForServerReady = (server) =>
  new Promise((resolve, reject) => {
    const onData = (data) => {
      if (data.toString().includes('Local:')) {
        cleanup();
        resolve();
      }
    };

    const onError = (data) => {
      if (data.toString().toLowerCase().includes('error')) {
        cleanup();
        reject(new Error(`Preview server failed: ${data.toString()}`));
      }
    };

    const onExit = (code) => {
      cleanup();
      reject(new Error(`Preview server exited with code ${code}`));
    };

    const cleanup = () => {
      server.stdout.off('data', onData);
      server.stderr.off('data', onError);
      server.off('exit', onExit);
    };

    server.stdout.on('data', onData);
    server.stderr.on('data', onError);
    server.on('exit', onExit);
  });

const run = async () => {
  const preview = spawn('npm', ['--prefix', 'frontend', 'run', 'preview', '--', '--host', HOST, '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServerReady(preview);

    const chrome = await launch({
      chromePath: chromium.executablePath(),
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const result = await lighthouse(
        TARGET_URL,
        {
          port: chrome.port,
          output: ['json', 'html'],
          disableStorageReset: false,
          onlyCategories: ['performance']
        },
        {
          extends: 'lighthouse:default',
          settings: { preset: 'desktop' }
        }
      );

      const [jsonReport, htmlReport] = Array.isArray(result.report) ? result.report : [result.report];
      const reportDir = path.resolve('reports', 'lighthouse');
      fs.mkdirSync(reportDir, { recursive: true });
      fs.writeFileSync(path.join(reportDir, 'report.json'), jsonReport);
      if (htmlReport) {
        fs.writeFileSync(path.join(reportDir, 'report.html'), htmlReport);
      }

      const lhr = result.lhr;
      const metrics = {
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        tbt: lhr.audits['total-blocking-time'].numericValue
      };

      const failures = [];
      if (metrics.lcp > budgets.lcp) {
        failures.push(`LCP ${metrics.lcp.toFixed(0)}ms exceeded budget ${budgets.lcp}ms`);
      }
      if (metrics.cls > budgets.cls) {
        failures.push(`CLS ${metrics.cls.toFixed(3)} exceeded budget ${budgets.cls}`);
      }
      if (metrics.tbt > budgets.tbt) {
        failures.push(`TBT ${metrics.tbt.toFixed(0)}ms exceeded budget ${budgets.tbt}ms`);
      }

      if (failures.length) {
        failures.forEach((message) => console.error(message));
        process.exitCode = 1;
      } else {
        console.log(
          `Performance budgets satisfied: LCP ${metrics.lcp.toFixed(0)}ms, CLS ${metrics.cls.toFixed(3)}, TBT ${metrics.tbt.toFixed(0)}ms`
        );
      }
    } finally {
      await chrome.kill();
    }
  } finally {
    preview.kill();
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
