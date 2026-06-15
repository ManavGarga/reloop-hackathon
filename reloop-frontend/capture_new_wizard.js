import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Step 1: select item
    console.log('Navigating to return wizard...');
    await page.goto('http://localhost:3001/return/prod_samsung_m34_001');
    await page.waitForTimeout(2000);
    
    // Click "Continue to Condition Check"
    console.log('Clicking continue to Step 2...');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    
    // Step 2: condition check
    console.log('Filling out Step 2...');
    await page.selectOption('select', { index: 1 });
    await page.fill('textarea', 'Testing return reason details.');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Step 3: value assessment
    console.log('Waiting for Step 3 AI grading...');
    await page.waitForSelector('button:has-text("Continue to Drop-off")');
    await page.click('button:has-text("Continue to Drop-off")');
    await page.waitForTimeout(1000);
    
    // Step 4: drop-off
    console.log('Selecting drop-off...');
    await page.waitForSelector('button:has-text("Confirm Drop-off Location")');
    await page.click('button:has-text("Confirm Drop-off Location")');
    await page.waitForTimeout(1000);
    
    // Step 5: choices
    console.log('Reached Step 5. Capturing screenshot...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'step5_new.png' });
    
    // Click "Accept P2P Offer"
    console.log('Accepting P2P Offer...');
    await page.click('button:has-text("Accept P2P Offer")');
    
    // Step 6: success
    console.log('Reached Step 6. Capturing screenshot...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'step6_new.png' });
    console.log('Screenshots captured successfully');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
