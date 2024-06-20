const { expect } = require("@playwright/test");

exports.MainPage = class MainPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.mainUrl = "https://sandbox-platform.faraway.com/demo/";
    this.connectNewTabBtn = page.locator('css=button[id="connect-tab"]');
    this.blockchain = page.locator('css=select[id="blockchain"]');
    this.imgUrl = page.getByRole("img").getAttribute("src");
    this.purchaseInput = page.locator('css=input[id="purchase-image-url"]');
    this.purchaseSubmitBtn = page.locator('css=button[id="purchase"]');
  }

  async waitForEvent() {
    await this.page.waitForEvent("popup");
  }

  async openPage() {
    await this.page.goto(this.mainUrl);
    await this.page.waitForLoadState();
  }

  async connectInNewTab() {
    await this.connectNewTabBtn.click();
    await this.page.waitForLoadState();
  }

  // Click the Submit button
  // Connect any Wallet (browser extension) to pay with (Metamask, Phantom or Coinbase)
  // Click the Buy button
  // Confirm transaction in the extension
  // Click the OK button
};
