const puppeteer = require("puppeteer");
const assert = require("assert");

const CRX_ID = "nkbihfbeogaeaoehlefnkodbefgpgknn";
const CRX_PATH =
  "/home/arosh/.config/google-chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/4.8.0_0";

/**
 * @param {puppeteer.Page} page
 * @param {string} text
 */
const waitForButtonByMessage = async (page, text) => {
  const xpath = `//button[text() = "${text.replace(/"/g, '"')}"]`;
  await page.waitForXPath(xpath);
};

/**
 * @param {puppeteer.Page} page
 * @param {string} text
 */
const clickButtonByText = async (page, text) => {
  const xpath = `//button[text() = "${text.replace(/"/g, '"')}"]`;
  await page.waitForXPath(xpath);
  await (await page.$x(xpath))[0].click();
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // https://github.com/GoogleChrome/puppeteer/tree/master/examples#load-a-chrome-extension
    args: [
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`
    ]
    // slowMo: 50,
  });
  const metamaskPage = await browser.newPage();
  await metamaskPage.waitFor(3000);
  await metamaskPage.bringToFront();
  await metamaskPage.goto(`chrome-extension://${CRX_ID}/popup.html`);

  await waitForButtonByMessage(metamaskPage, "Accept");

  await metamaskPage.evaluate(() => {
    // https://developer.mozilla.org/ja/docs/Introduction_to_using_XPath_in_JavaScript
    const xpathResult = document.evaluate(
      '//*[@class="notice-box"]/..',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    );
    const element = xpathResult.singleNodeValue;
    const scrollHeight = element.scrollHeight;
    element.scrollTop = scrollHeight;
  });
  await metamaskPage.waitFor(500);
  await clickButtonByText(metamaskPage, "Accept");

  await metamaskPage.waitFor(500);
  await clickButtonByText(metamaskPage, "Accept");

  await metamaskPage.waitForSelector(".notice-box");
  await metamaskPage.evaluate(() => {
    // https://developer.mozilla.org/ja/docs/Introduction_to_using_XPath_in_JavaScript
    const xpathResult = document.evaluate(
      '//*[@class="notice-box"]/..',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    );
    const element = xpathResult.singleNodeValue;
    const scrollHeight = element.scrollHeight;
    element.scrollTop = scrollHeight;
  });
  await metamaskPage.waitFor(500);
  await clickButtonByText(metamaskPage, "Accept");

  await metamaskPage.waitForSelector("#password-box");
  await metamaskPage.type("#password-box", "password");
  await metamaskPage.type("#password-box-confirm", "password");
  await clickButtonByText(metamaskPage, "Create");

  await clickButtonByText(metamaskPage, "I've copied it somewhere safe");

  const accountsSelector = ".accounts-selector";
  await metamaskPage.waitForSelector(accountsSelector);
  await metamaskPage.click(accountsSelector);

  const importAccountSelector = '//*[text() = "Import Account"]/..';
  await metamaskPage.waitFor(500);
  await (await metamaskPage.$x(importAccountSelector))[0].click();

  await metamaskPage.waitForSelector("#private-key-box");
  await metamaskPage.type(
    "#private-key-box",
    "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
  );
  await clickButtonByText(metamaskPage, "Import");
  await metamaskPage.click("#network_component");
  await metamaskPage.waitFor(500);
  await (await metamaskPage.$x('//*[text() = "Localhost 8545"]'))[0].click();

  const page = await browser.newPage();
  await page.bringToFront();
  await page.goto("localhost:8080");
  await page.waitFor(500);
  assert.strictEqual((await page.$$("#tokens > tr")).length, 0);
  await clickButtonByText(page, "mint");

  await metamaskPage.bringToFront();
  await metamaskPage.waitForSelector(
    ".transaction-list-item:nth-child(1) > div"
  );
  await metamaskPage.click(".transaction-list-item:nth-child(1) > div");
  await metamaskPage.waitForSelector("input.confirm");
  await metamaskPage.click("input.confirm");

  await page.bringToFront();
  await page.waitFor(10000);
  await page.reload()
  await page.waitFor(500);
  assert.strictEqual((await page.$$("#tokens > tr")).length, 1);

  await browser.close();
})();
