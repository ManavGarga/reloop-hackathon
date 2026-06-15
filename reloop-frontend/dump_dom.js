import { chromium } from '@playwright/test';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3001/return/prod_samsung_m34_001');
    await page.waitForTimeout(2000);
    const html = await page.content();
    fs.writeFileSync('dom_dump.html', html);
    console.log('DOM dumped successfully');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
