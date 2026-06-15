import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3001/return/prod_samsung_m34_001');
    await page.waitForTimeout(2000);
    const rects = await page.evaluate(() => {
      const el = document.querySelector('.max-w-4xl');
      if (!el) return 'No .max-w-4xl element found';
      const elRect = el.getBoundingClientRect();
      const parentRect = el.parentElement.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      return {
        body: { left: bodyRect.left, right: bodyRect.right, width: bodyRect.width },
        parent: { left: parentRect.left, right: parentRect.right, width: parentRect.width },
        el: { left: elRect.left, right: elRect.right, width: elRect.width }
      };
    });
    console.log(JSON.stringify(rects, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
