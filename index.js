#! /usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
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

let log = console.log;
console.log = function () {
    log(chalk.gray('[' + new Date().toLocaleTimeString() + ']'), ...arguments);
};
program.option('-c, --channel <channel>', 'Channel to search in (not the URL, just the name, e.g. \'xQcOW\' or \'xqcow\' not \'https://www.twitch.tv/xqcow\')', (channel) => {
    config.channel = String(channel);
});
program.option('-s, --search <search>', 'Username to search for in chat (not the URL, just the name, e.g. \'xQcOW\' or \'xqcow\' not \'https://www.twitch.tv/xqcow\')', (search) => {
    config.search = String(search);
});
program.option('-h, --headless <headless>', 'true = no browser window, false = browser window', (headless) => {
    config.headless = headless === 'true';
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

console.log(chalk.blue('Twitch Chat Checker by ') + chalk.red('Mikka'));
console.log(chalk.green('Checking if ' + chalk.cyan.bold(config.search) + ' is in the chat of ' + chalk.cyan.bold(config.channel) + '.'));

const browserInstance = await startBrowser(config.headless);
console.log(chalk.greenBright('Browser started.\n'));

setInterval(async () => {
    if (config.limit === 0) {
        console.log(chalk.redBright('Limit reached, exiting.'));
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
        console.log(chalk.redBright('Couldn\'t find viewer list, exiting.'));
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
    
    console.log(chalk.gray(`Searching ${usernames.length} users for ${config.search}.`));

    for (let i = 0; i < usernames.length; i++) {
        if (usernames[i] === config.search.toLowerCase()) {
            console.log(chalk.greenBright.bold(chalk.yellowBright.bold(config.search) + " is in the chat.\n"));
            return;
        }
    }
    console.log(chalk.gray(`${config.search} is not in the chat.\n`));

}


