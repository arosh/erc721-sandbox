const assert = require("chai").assert;

describe("hoge", () => {
  it("fuga", () => {
    browser.url("/");
    assert.strictEqual(browser.getTitle(), "ERC721 sandbox");
  });
});
