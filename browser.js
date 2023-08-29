import * as puppeteer from 'puppeteer';

export async function startBrowser(headless) {
	let browser;
	try {
	    console.log("Opening the browser...");
	    browser = await puppeteer.launch({
	        headless: headless,
	        args: ["--disable-setuid-sandbox"],
	        ignoreHTTPSErrors: true
	    });
	} catch (err) {
	    console.log("Failed to create a browser instance, error: ", err);
	}
	return browser;
}

