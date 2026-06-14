import { test, expect } from '@playwright/test';

test('ReLoop Profile Settings and Conversion Test', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('1. Navigating to Profile page...');
  await page.goto('http://localhost:3001/profile');

  console.log('2. Verifying Profile Header details...');
  const creditsSummary = page.locator('#profile-green-credits-bal[data-loaded="true"]');
  await expect(creditsSummary).toBeVisible({ timeout: 10000 });
  const initialCredits = await creditsSummary.innerText();
  const initialCreditsVal = parseFloat(initialCredits);
  console.log(`Initial Credits Balance: ${initialCreditsVal}`);

  console.log('4. Testing Login & Security edit flow...');
  const securityCard = page.locator('#login-security-card');
  await expect(securityCard).toBeVisible();
  await securityCard.click();

  // Verify email is visible in Login & Security subpage
  const userEmail = page.locator('p:has-text("priya.sharma@example.com")');
  await expect(userEmail).toBeVisible();

  // Click edit name trigger
  const editNameTrigger = page.locator('#edit-name-trigger');
  await expect(editNameTrigger).toBeVisible();
  await editNameTrigger.click();

  // Fill in new name
  const nameInput = page.locator('#edit-name-input');
  await expect(nameInput).toBeVisible();
  await nameInput.fill('Priya S. Sharma');

  // Save changes
  const saveNameBtn = page.locator('#save-name-btn');
  await saveNameBtn.click();

  // Toast confirmation
  const toastMessage = page.locator('span:has-text("Saved details for name successfully!")');
  await expect(toastMessage).toBeVisible();

  // Return to menu
  const backToMenuBtn = page.locator('#back-to-menu-btn');
  await backToMenuBtn.click();

  console.log('5. Testing Circular Prime Pass display...');
  const primeCard = page.locator('#prime-card');
  await expect(primeCard).toBeVisible();
  await primeCard.click();

  const primePass = page.locator('span:has-text("CIRCULAR PRIME PASS")');
  await expect(primePass).toBeVisible();

  const backToMenuBtn2 = page.locator('#back-to-menu-btn');
  await backToMenuBtn2.click();

  console.log('6. Testing Green Credits conversion form...');
  const paymentCard = page.locator('#payment-options-card');
  await expect(paymentCard).toBeVisible();
  await paymentCard.click();

  const conversionHeader = page.locator('h3:has-text("Convert Green Credits to Pay Balance")');
  await expect(conversionHeader).toBeVisible();

  // Input credits conversion amount (e.g. 50)
  const convertInput = page.locator('#convert-credits-input');
  await expect(convertInput).toBeVisible();
  await convertInput.fill('50');

  // Click convert button
  const executeBtn = page.locator('#execute-convert-btn');
  await expect(executeBtn).toBeVisible();
  await executeBtn.click();

  // Verify toast appears
  const successToast = page.locator('span:has-text("wallet balance successfully!")');
  await expect(successToast).toBeVisible({ timeout: 10000 });

  // Return to menu
  const backToMenuBtn3 = page.locator('#back-to-menu-btn');
  await backToMenuBtn3.click();

  // Verify updated balance on the header card
  const finalCredits = await creditsSummary.innerText();
  const finalCreditsVal = parseFloat(finalCredits);
  console.log(`Final Credits Balance: ${finalCreditsVal}`);
  expect(finalCreditsVal).toBeLessThan(initialCreditsVal);

  console.log('SUCCESS: All Profile Page enhancements validated successfully!');
});
