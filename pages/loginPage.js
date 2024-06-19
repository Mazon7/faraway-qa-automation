const { expect } = require("@playwright/test");
const { MainPage } = require("./MainPage");

exports.LoginPage = class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-form-email-input");
    this.submitBtn = page.getByTestId("email-form-submit-button");
    this.successPage = page.getByTestId("auth-email-verify-success-page");
    this.successMsg = page.getByTestId("success");
    this.authUrl = /https:\/\/connect-sandbox-v2\.faraway\.com\/auth\/email*/;
    this.verifyUrl =
      /https:\/\/connect-sandbox-v2\.faraway\.com\/auth\/email\/verify*/;
    this.successUrl =
      /https\:\/\/connect-sandbox-v2\.faraway\.com\/auth\/email\/verify-success*/;

    this.title = /Faraway Platform/;
    this.inputEls = page.locator(
      '[data-testid="verify-email-form-code-input"] input'
    );
    this.authCode = "378934";
    this.email = "ta.test.assignment@faraway.com";
  }

  // static async openNewTabAndWait(context, mainPage) {
  //   const [newPage] = await Promise.all([
  //     context.waitForEvent("page"), // Wait for the new tab to be opened
  //     mainPage.openNewTab(), // Perform the action that opens the new tab
  //   ]);
  //   const loginPage = new LoginPage(newPage);

  //   await loginPage.checkLoginPageLoaded();
  //   // loginPage.submitEmail();
  //   // loginPage.checkCodePageLoaded();
  //   // loginPage.inputCode();
  //   // loginPage.checkLoginSuccses();
  //   // loginPage.pageIsClosed();

  //   return loginPage;
  // }

  async checkLoginPageLoaded() {
    await this.page.waitForLoadState();
    await expect(this.page).toHaveURL(this.authUrl);
    await expect(this.page).toHaveTitle(this.title);
  }

  async submitEmail() {
    await this.emailInput.fill(this.email);
    await this.submitBtn.click();
  }

  async checkCodePageLoaded() {
    await this.page.waitForLoadState();
    await expect(this.page).toHaveURL(this.verifyUrl);
  }

  async inputCode() {
    const count = await this.inputEls.count();

    // Enter code in every input
    for (let i = 0; i < count; ++i) {
      await this.inputEls.nth(i).fill(`${this.authCode[i]}`);
    }
  }

  async checkLoginSuccses() {
    await this.page.waitForLoadState();

    await expect(this.page).toHaveURL(this.successUrl);

    await this.successPage.isVisible();
    await this.successMsg.isVisible();
  }

  // async pageIsClosed() {
  //   await this.page.close();
  //   await expect(this.page.isClosed()).toBe(true);
  // }

  async logIn() {
    await this.checkLoginPageLoaded();

    await this.submitEmail();

    await this.checkCodePageLoaded();

    await this.inputCode();

    await this.checkLoginSuccses();

    // await this.pageIsClosed();
  }
};
