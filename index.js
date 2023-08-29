import { startBrowser } from './browser.js';
import { Scraper } from './pageScraper.js';

const config = {
    channel: 'Channel to search in (not the URL, just the name, e.g. "xQcOW" not "https://www.twitch.tv/xqcow")',
    search: 'Username to search for in chat',
    headless: true, // true = no browser window, false = browser window
    limit: -1, // -1 = no limit
    delay: 5000 // delay between each check in ms, be careful with this.
}

console.log(`Checking if ${config.search} is in the chat of ${config.channel}.`)

const browserInstance = await startBrowser(config.headless);

setInterval(async () => {
    if (config.limit === 0) {
        console.log('Limit reached, exiting.');
        process.exit(0);
    }
    config.limit--;
    const scraper = new Scraper(browserInstance, `https://www.twitch.tv/popout/${config.channel.toLowerCase()}/chat?popout=`);
    await scraper.scrape(callback);

}, config.delay);


const callback = async (page) => {
    // click viewer list button
    await page.click('[data-test-selector="chat-viewer-list"]');
    // wait for the list to load
    await page.waitForSelector('[aria-labelledby="chat-viewers-list-header-VIPs"]');

    const usernames = await page.evaluate(() => {
        let users = [];
        const elements = document.getElementsByClassName('chat-viewers-list__button');
        for (let i = 0; i < elements.length; i++) {
            users.push(elements[i].dataset.username);
        }
        return users;
    });
    
    console.log(`\nSearching ${usernames.length} users for ${config.search}.`);

    for (let i = 0; i < usernames.length; i++) {
        if (usernames[i] === config.search.toLowerCase()) {
            console.log(`${config.search} is in the chat`);
            return;
        }
    }
    console.log(`${config.search} is not in the chat`);

}


