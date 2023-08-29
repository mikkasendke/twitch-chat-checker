export class Scraper {
    constructor(browser, url) {
        this.browser = browser;
        this.url = url;
    }
    async scrape(callback) {
        this.page = await this.browser.newPage();
        await this.page.goto(this.url);
        await callback(this.page);
        await this.page.close();
    }
}
