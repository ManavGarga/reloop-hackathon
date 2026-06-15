import { test, expect } from '@playwright/test';

test('ReLoop Eco Dashboard Interactivity Test', async ({ page }) => {
  console.log('1. Navigating to Eco Dashboard...');
  await page.goto('http://localhost:3001/dashboard');

  console.log('2. Verifying Rank Badge click opens Leaderboard Modal...');
  const rankBadge = page.locator('#rank-leaderboard-badge');
  await expect(rankBadge).toBeVisible({ timeout: 15000 });
  await rankBadge.click();

  const leaderboardHeader = page.locator('h2:has-text("National Leaderboard")');
  await expect(leaderboardHeader).toBeVisible();

  console.log('3. Closing Leaderboard Modal...');
  const closeLeaderboardBtn = page.locator('button:has-text("Close")').first();
  await closeLeaderboardBtn.click();
  await expect(leaderboardHeader).not.toBeVisible();

  console.log('4. Verifying Green Credits card click expands Transaction Ledger...');
  const creditsCard = page.locator('#credits-balance-card');
  await expect(creditsCard).toBeVisible();
  await creditsCard.click();

  // Verify transaction ledger is expanded (it should display transaction notes)
  const ledgerNotes = page.locator('p:has-text("Refurbished Samsung Galaxy M34 5G"), p:has-text("Return completed:"), p:has-text("Redeemed:")').first();
  await expect(ledgerNotes).toBeVisible();

  console.log('5. Verifying CO2 Saved card click...');
  const co2Card = page.locator('#co2-saved-card');
  await expect(co2Card).toBeVisible();
  await co2Card.click();

  console.log('6. Verifying Circular Returns table product link...');
  const samsungProductLink = page.locator('span:has-text("Samsung Galaxy M34 5G")').first();
  await expect(samsungProductLink).toBeVisible();
  await samsungProductLink.click();

  // Verify redirection to Circular Lifecycle Passport
  await expect(page).toHaveURL(/.*\/passport\/prod_samsung_m34_001/);

  // Go back to dashboard
  await page.goto('http://localhost:3001/dashboard');

  console.log('7. Verifying View Listing button on refurbished row...');
  const viewListingBtn = page.locator('span:has-text("View Listing ➜")').first();
  await expect(viewListingBtn).toBeVisible();
  await viewListingBtn.click();

  // Verify redirection to Amazon Renewed page
  await expect(page).toHaveURL(/.*\/renewed\/prod_samsung_m34_001/);

  // Go back to dashboard
  await page.goto('http://localhost:3001/dashboard');

  console.log('8. Verifying coupon redemption and copy-to-clipboard toast...');
  // Find a reward we can afford. Default balance is 240, so reward NGO plant (50 credits) is affordable.
  const ngoReward = page.locator('#redeem-reward-ngo_plant');
  await expect(ngoReward).toBeVisible();
  await ngoReward.click();

  const confirmRedeemBtn = page.locator('button:has-text("Confirm Redeem")');
  await expect(confirmRedeemBtn).toBeVisible();
  await confirmRedeemBtn.click();

  // Wait for success screen
  const successText = page.locator('p:has-text("Redemption Successful!")');
  await expect(successText).toBeVisible({ timeout: 10000 });

  // Click coupon code block to copy
  const couponBlock = page.locator('div[title="Click to copy voucher code"]');
  await expect(couponBlock).toBeVisible();
  await couponBlock.click();

  // Verify toast appears
  const toastMessage = page.locator('span:has-text("Voucher code copied to clipboard!")');
  await expect(toastMessage).toBeVisible();

  console.log('SUCCESS: All Eco Dashboard interactive features validated successfully!');
});
