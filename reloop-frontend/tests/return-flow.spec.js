import { test, expect } from '@playwright/test';

test('ReLoop returns flow end-to-end and state reset test', async ({ page }) => {
  console.log('1. Navigating to returns page...');
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  await page.goto('http://localhost:3001/returns');

  console.log('2. Finding Samsung Galaxy return button...');
  // Find return button for Samsung product: prod_samsung_m34_001
  const samsungButton = page.locator('button:has-text("Return via ReLoop")').first();
  await samsungButton.click();

  console.log('3. Redirected to return flow for Samsung. Waiting for Step 1...');
  await expect(page).toHaveURL(/.*\/return\/prod_samsung_m34_001/);
  
  // Step 1: Click "Continue to Condition Check"
  const continueToConditionBtn = page.locator('button:has-text("Continue to Condition Check")');
  await expect(continueToConditionBtn).toBeVisible();
  await continueToConditionBtn.click();

  console.log('4. Step 2: Inputting return reason and uploading scans...');
  await expect(page.locator('h2:has-text("Describe the return reason & inspect condition")')).toBeVisible({ timeout: 15000 });
  
  // Select reason
  await page.locator('main select').selectOption({ index: 0 });
  await page.locator('main textarea').fill('The screen is fine but battery life is extremely poor.');

  // Click on front & back scan boxes to upload
  await page.getByText('Front Scan', { exact: true }).click();
  await page.getByText('Back Scan', { exact: true }).click();
  
  // Submit scans
  const submitScansBtn = page.locator('button:has-text("Submit Scans")');
  await submitScansBtn.click();

  console.log('5. Step 3: Waiting for AI grading to complete...');
  // Wait for grading to finish - wait for "Proceed to Circular Choices" button
  const proceedToChoicesBtn = page.locator('button:has-text("Proceed to Circular Choices")');
  await proceedToChoicesBtn.waitFor({ state: 'visible', timeout: 15000 });
  await proceedToChoicesBtn.click();

  console.log('6. Step 4: Confirming drop-off/pickup...');
  // Choose pickup and proceed
  const continueToChoicesBtn = page.locator('button:has-text("Continue to Choices")');
  await expect(continueToChoicesBtn).toBeVisible({ timeout: 15000 });
  await continueToChoicesBtn.click();

  console.log('7. Step 5: Choosing circular recommendation options...');
  const continueToConfirmationBtn = page.locator('button:has-text("Continue to Confirmation")');
  await expect(continueToConfirmationBtn).toBeVisible({ timeout: 15000 });
  await continueToConfirmationBtn.click();

  console.log('8. Step 6: Finalizing return and redirecting...');
  // Wait for completion (Go to Dashboard button visible)
  const goToDashboardBtn = page.locator('button:has-text("Go to Dashboard")');
  await goToDashboardBtn.waitFor({ state: 'visible', timeout: 15000 });
  await goToDashboardBtn.click();

  console.log('9. Returned to Eco Dashboard. Verifying navigation...');
  await expect(page).toHaveURL(/.*\/dashboard/);

  console.log('10. Navigating back to Returns page...');
  await page.goto('http://localhost:3001/returns');

  console.log('11. Clicking Return via ReLoop on Levi\'s Jacket...');
  // Find return button for Levis: prod_levis_jacket_001
  const levisButton = page.locator('button:has-text("Return via ReLoop")').nth(1);
  await levisButton.click();

  console.log('12. Redirected to return flow for Levi\'s. Verifying wizard resets to Step 1...');
  await expect(page).toHaveURL(/.*\/return\/prod_levis_jacket_001/);
  
  // Verify that it starts at Step 1 Product Select showing Levis Jacket details
  const levisTitle = page.locator('h3:has-text("Levi\'s Trucker Denim Jacket")');
  await expect(levisTitle).toBeVisible({ timeout: 5000 });
  
  const step1Header = page.locator('h2:has-text("Which item would you like to return?")');
  await expect(step1Header).toBeVisible();

  console.log('SUCCESS: Wizard successfully reset and started fresh for Levi\'s Jacket!');
});
