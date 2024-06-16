// @ts-check
const { test, expect } = require("@playwright/test");

test.describe.configure({ retries: 2, timeout: 20_000 });

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);

  // Runs before each test and signs in each page.
  await page.goto("https://sandbox-platform.faraway.com/demo/");
  await page.waitForLoadState();
});

test("Login with email", async ({ page }) => {
  const [newPage] = await Promise.all([
    // Start waiting for popup before clicking. Note no await.
    page.waitForEvent("popup"),

    // Click the “Connect in new tab” button
    page.locator('css=button[id="connect-tab"]').click(),

    // Interact with the new popup normally.
    // await popup.getByRole('button').click();
  ]);

  await newPage.waitForLoadState();

  // Check that URL has been changed to 'https://connect-sandbox-v2.faraway.com/auth/email?...'
  await expect(newPage).toHaveURL(
    /https:\/\/connect-sandbox-v2\.faraway\.com\/auth\/email*/
  );

  // Expect a title "to contain" a substring.
  await expect(newPage).toHaveTitle(/Faraway Platform/);

  // Enter email: ta.test.assignment@faraway.com
  await newPage
    .getByTestId("email-form-email-input")
    .fill("ta.test.assignment@faraway.com");

  await newPage.getByTestId("email-form-submit-button").click();

  await newPage.waitForLoadState();

  // Check that URL has been changed to 'https://connect-sandbox-v2.faraway.com/auth/email/verify...'
  await expect(newPage).toHaveURL(
    /https:\/\/connect-sandbox-v2\.faraway\.com\/auth\/email\/verify*/
  );

  const inputEls = newPage.locator(
    '[data-testid="verify-email-form-code-input"] input'
  );

  const code = "378934";
  const count = await inputEls.count();

  // Enter code in every input: 378934
  for (let i = 0; i < count; ++i) {
    await inputEls.nth(i).fill(`${code[i]}`);
  }

  // Url has changed to "https://connect-sandbox-v2.faraway.com/auth/email/verify-success"
  await expect(newPage).toHaveURL(
    /https\:\/\/connect-sandbox-v2\.faraway\.com\/auth\/email\/verify-success*/
  );

  // Chceck that success section and message are present and visible
  await newPage.getByTestId("auth-email-verify-success-page").isVisible();
  await newPage.getByTestId("success").isVisible();

  // Check that page is closed
  await newPage.close();
  await expect(newPage.isClosed()).toBe(true);
});

/*  TODO: 
// Check code expiration time
// Check that request is ok https://sandbox-platform.faraway.com/auth.public.Auth/SendEmailConfirmationCode
// Resend email and check that code works
*/
