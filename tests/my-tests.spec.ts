// @ts-check
const { test, expect } = require("@playwright/test");
// import { test, expect } from '../pages/metamaskSetup';

const { MainPage } = require("../pages/MainPage");
const { LoginPage } = require("../pages/LoginPage");

// test.describe.configure({ retries: 2, timeout: 20_000 });

test.beforeEach(async ({ page }) => {
  const mainPage = new MainPage(page);

  console.log(`Running ${test.info().title}`);

  // Runs before each test and open main demo page.
  await mainPage.openNewTab();
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
  const child = await iframe.getByAltText("MetaMask")
  const parent = await iframe.locator("css=[div]").filter({ has: child });
  await parent.click()

  // Wait for MetaMask extension to load and navigate to it
  // await page.waitForTimeout(5000); // Wait a bit for the extension to load
  // await page.goto("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html",{ waitUntil: "load" });

  // Click the Buy button
  // Confirm transaction in the extension
  // Click the OK button

  // Close browser
  // await browser.close();
});


test.skip("Check Metamask Extention", async ({ page }) => {
  await page.goto(`chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/popup.html`);
  await page.waitForTimeout(30000) // this is here so that it won't automatically close the browser window
})