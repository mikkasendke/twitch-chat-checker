import * as puppeteer from 'puppeteer';
import chalk from 'chalk';

export async function startBrowser(headless) {
	let browser;
	try {
	    console.log(chalk.gray.bold("Opening the browser..."));
	    browser = await puppeteer.launch({
            headless: headless ? "new" : false,
	        args: ["--disable-setuid-sandbox"],
	        ignoreHTTPSErrors: true
	    });
	} catch (err) {
	    console.log(chalk.redBright("Failed to create a browser instance, error: ", err));
        process.exit(1);
	}
	return browser;
}

