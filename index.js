#! /usr/bin/env node
import { program } from 'commander';
import * as chalk from 'chalk';
import { startBrowser } from './browser.js';
import { Scraper } from './pageScraper.js';

const config = {
    channel: '', // Channel to search in (not the URL, just the name, e.g. 'xQcOW' or 'xqcow' not 'https://www.twitch.tv/xqcow')
    search: '', // Username to search for in chat
    headless: true, // true = no browser window, false = browser window
    limit: -1, // -1 = no limit
    delay: 5000, // delay between each check in ms, be careful with this.
    prepend_url: "" // prepend url if you want to use a proxy.
}

program.option('-c, --channel <channel>', 'Channel to search in (not the URL, just the name, e.g. \'xQcOW\' or \'xqcow\' not \'https://www.twitch.tv/xqcow\')', (channel) => {
    config.channel = String(channel);
});
program.option('-s, --search <search>', 'Username to search for in chat', (search) => {
    config.search = String(search);
});
program.option('-h, --headless <headless>', 'true = no browser window, false = browser window', (headless) => {
    config.headless = Boolean(headless);
});
program.option('-l, --limit <limit>', '-1 = no limit', (limit) => {
    config.limit = Number(limit);
});
program.option('-d, --delay <delay>', 'delay between each check in ms, be careful with this.', (delay) => {
    config.delay = Number(delay);
});
program.option('-p, --prepend_url <prepend_url>', 'prepend url if you want to use a proxy.', (prepend_url) => {
    config.prepend_url = String(prepend_url);
});

program.parse();

console.log(`Checking if ${config.search} is in the chat of ${config.channel}.`)

const browserInstance = await startBrowser(config.headless);

setInterval(async () => {
    if (config.limit === 0) {
        console.log('Limit reached, exiting.');
        process.exit(0);
    }
    config.limit--;
    const scraper = new Scraper(browserInstance, `${config.prepend_url}https://www.twitch.tv/popout/${config.channel.toLowerCase()}/chat?popout=`);
    await scraper.scrape(callback);

}, config.delay);


const callback = async (page) => {

    try {
        // click on the viewer list button and wait for it to load.
        await page.click('[data-test-selector="chat-viewer-list"]');
        await page.waitForSelector('[aria-labelledby="chat-viewers-list-header-VIPs"]');
    }
    catch (e) {
        console.log('Couldn\'t find viewer list, exiting.');
        process.exit(1);
    }

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


