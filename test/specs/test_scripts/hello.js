describe("hoge", () => {
  it("fuga", () => {
    browser.url("/");
    const title = browser.execute(() => {
      return document.title;
    })
    expect(title.value).to.equal("ERC721 sandbox");
  });
});
