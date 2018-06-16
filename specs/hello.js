const puppeteer = require('puppeteer');

const CRX_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
const CRX_PATH = '/Users/arosh/Library/Application Support/Google/Chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/4.7.4_1';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 10000,
        args: [
            `--disable-extensions-except=${CRX_PATH}`,
            `--load-extension=${CRX_PATH}`
        ],
        devtools: true
    })
    
    const page = await browser.newPage();
    await page.waitFor(3000);
    await page.bringToFront();
    await page.goto(`chrome-extension://${CRX_ID}/popup.html`);
    const acceptBtn = '#app-content > div > div.app-primary.from-right > div > div.flex-column.flex-center.flex-grow > button'
    await page.waitForSelector(acceptBtn);
    await page.click(acceptBtn);
    await page.waitFor(100);
    await page.waitForSelector(acceptBtn);
    await page.evaluate((() => {
        const element = document.querySelector('#app-content > div > div.app-primary.from-right > div > div.flex-column.flex-center.flex-grow > div');
        const scrollHeight = element.scrollHeight;
        element.scrollTop = scrollHeight;
    }))
    await page.click(acceptBtn);
    await page.type('#password-box', 'password');
    await page.type('#password-box-confirm', 'password');
    await page.click('#app-content > div > div.app-primary.from-right > div > button');
    const copied = '#app-content > div > div.app-primary.from-right > div > button:nth-child(4)';
    await page.waitForSelector(copied);
    await page.click(copied);
    // await browser.close();
})();
