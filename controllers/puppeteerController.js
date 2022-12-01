import puppeteer from 'puppeteer';

export const doWork = () => {
    let browser;
    let page;

    browser = puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    }).then(async (browser) => {
        page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 800,
            isMobile: false,
        });
        await page.goto("https://huddleco.app/cloud/login", {
            waitUntil: "networkidle2",
        });
        await page.waitForSelector('input[name=email]');
        await page.type('input[name=email]', 'Huddle123@tlp', {});
        await page.waitForSelector('input[name=password]');
        await page.type('input[name=password]', 'Huddle2TLP!', {});

        await page.waitForSelector(".login100-form-btn");
        await page.click(".login100-form-btn");
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });

        await page.waitForSelector(".nav-item");
        await page.goto("https://huddleco.app/cloud/inbox", { waitUntil: 'domcontentloaded' });
        await page.click("#ractive > div.content > div.page-inbox > div.page-inbox-header > div:nth-child(3)");

        await page.waitForTimeout(10000);
        const conversations = await page.evaluate(() => {
            return document.querySelector("#ractive > div.content > div.page-inbox > div.page-inbox-header > div:nth-child(3) > div > a.dropdown-item.active > div").textContent;
        });
        const interested = await page.evaluate(() => {
            return document.querySelector("#ractive > div.content > div.page-inbox > div.page-inbox-header > div.dropdown.ml-3.show > div > a:nth-child(3) > div").textContent;
        });
        const not_interested = await page.evaluate(() => {
            return document.querySelector("#ractive > div.content > div.page-inbox > div.page-inbox-header > div.dropdown.ml-3.show > div > a:nth-child(4) > div").textContent;
        });

        console.log(conversations);
        console.log(interested);
        console.log(not_interested);


    }).catch((err) => {
        console.log("Could not create a browser instance => : ", err);
    });
};
