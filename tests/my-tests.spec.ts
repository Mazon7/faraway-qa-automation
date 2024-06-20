// @ts-check
// const { test, expect } = require("@playwright/test");
import { test, expect } from '../pages/metamaskSetup';

const { MainPage } = require("../pages/mainPage");
const { LoginPage } = require("../pages/LoginPage");

// test.describe.configure({ retries: 2, timeout: 20_000 });

test.beforeEach(async ({ page}) => {
  const mainPage = new MainPage(page);

  console.log(`Running ${test.info().title}`);

  // Runs before each test and open main demo page.
  await mainPage.openPage();
});

test("Login with email", async ({ page, context }) => {
  const mainPage = new MainPage(page);

  // Handle new opened Tab
  const [newPage] = await Promise.all([
    // Start waiting for popup before clicking. Note no await.
    context.waitForEvent("page"),
    // page.waitForEvent("popup"), // in case of popup

    // Click the “Connect in new tab” button
    mainPage.connectInNewTab(),
  ]);

  // Login
  const loginPage = new LoginPage(newPage);
  await loginPage.logIn();

  await page.waitForTimeout(5000);
  page.close();
});

/*  Possible Autotests TODO: 
// Check code expiration time
// Check that request is ok https://sandbox-platform.faraway.com/auth.public.Auth/SendEmailConfirmationCode - part of the above test
// Resend email and check that code works
*/

test("Purchase Item", async ({ page }) => {
  // TODO: Setup MetaMask and get the browser context before the test starts
  
  const mainPage = new MainPage(page);

  // Handle new opened Tab
  const [newPage] = await Promise.all([
    // Start waiting for popup before clicking. Note no await.
    page.context().waitForEvent("page"),
    // page.waitForEvent("popup"), // in case of popup

    // Click the “Connect in new tab” button
    mainPage.connectInNewTab(),
  ]);

  // Login
  const loginPage = new LoginPage(newPage);
  await loginPage.logIn();

  // await page.bringToFront();

  await page.waitForTimeout(5000);

  // Select Ethereum network
  await mainPage.blockchain.selectOption({ value: "ETHEREUM" });

  // Copy Item’s image URL, paste it into the Purchase input
  const imgUrl = await mainPage.imgUrl;

  await mainPage.purchaseInput.fill(
    `${mainPage.mainUrl}${imgUrl.substring(1)}`
  );

  // Click the Submit button
  await mainPage.purchaseSubmitBtn.click();

  // Create Iframe
  const iframe = mainPage.page.frameLocator('//iframe[@allow="payment"]');

  await iframe.getByTestId("payrow").click();

  // Connect any Wallet (browser extension) to pay with (Metamask, Phantom or Coinbase)

  // Choose Metamask
  await iframe.getByAltText("MetaMask").click()
  await page.waitForTimeout(30000) // this is here so that it won't automatically close the browser window

  // Wait for MetaMask extension to load and navigate to it
  // await page.waitForTimeout(5000); // Wait a bit for the extension to load
  // await page.goto("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html",{ waitUntil: "load" });

  // Click the Buy button
  // Confirm transaction in the extension
  // Click the OK button

  // Close browser
  // await browser.close();
});


test("Check Metamask Extention", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}}/popup.html`);
  // chrome-extension://cldkbecclblpfiebjakimklejjepiaef/home.html#onboarding/welcome
  await page.waitForTimeout(30000) // this is here so that it won't automatically close the browser window


  // welcome - URL in the page

  // data-testid="onboarding-terms-checkbox"
  // data-testid="onboarding-import-wallet"
  
  
  // metametrics - URL in the page
  // data-testid="metametrics-i-agree"


  // import-with-recovery-phrase - URL in the page

  // await mainPage.blockchain.selectOption({ value: "n" }); n - number of words
  // data-testid="import-srp__srp-word-n" n - number of input (n-1)
  // data-testid="import-srp-confirm" - check that enabled and click it


  // create-password  - URL in page

  // data-testid="create-password-new"
  // data-testid="create-password-confirm"
  // data-testid="create-password-terms"
  // data-testid="create-password-import" - check that enabled and click it


  // completion - URL in page
  // data-testid="onboarding-complete-done" - check enabled and click it


  // pin-extension - URL in page
  // data-testid="pin-extension-next"
  // data-testid="pin-extension-done"

  // Popup
  // buttonn with text Enable

})