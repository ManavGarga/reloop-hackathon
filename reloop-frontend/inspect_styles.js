import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3001/return/prod_samsung_m34_001');
    await page.waitForTimeout(2000);
    const styles = await page.evaluate(() => {
      const el = document.querySelector('.max-w-4xl');
      if (!el) return 'No .max-w-4xl element found';
      const computed = window.getComputedStyle(el);
      const parentComputed = window.getComputedStyle(el.parentElement);
      return {
        el: {
          className: el.className,
          width: computed.width,
          maxWidth: computed.maxWidth,
          marginLeft: computed.marginLeft,
          marginRight: computed.marginRight,
          display: computed.display,
        },
        parent: {
          className: el.parentElement.className,
          width: parentComputed.width,
          display: parentComputed.display,
          flexDirection: parentComputed.flexDirection,
          alignItems: parentComputed.alignItems,
          justifyContent: parentComputed.justifyContent,
        }
      };
    });
    console.log(JSON.stringify(styles, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
