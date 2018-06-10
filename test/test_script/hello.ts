import puppeteer from "puppeteer";

import {assert} from "chai";

// declare global {
//   let browser: puppeteer.Browser;
// }

let browser: puppeteer.Browser;

before(async () => {
  const opts = {
    headless: false,
    slowMo: 100,
    timeout: 10000,
  };
  browser = await puppeteer.launch(opts);
});

after(async () => {
  browser.close();
});

describe("hoge", () => {
  it("fuga", async () => {
    console.log(await browser.version());
    assert.isTrue(true);
  });
});
