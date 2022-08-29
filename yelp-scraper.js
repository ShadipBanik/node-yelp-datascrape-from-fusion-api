// yelp-scraper.js

const puppeteer = require("puppeteer");
const blockResourceType = [
  "beacon",
  "csp_report",
  "font",
  "image",
  "imageset",
  "media",
  "object",
  "texttrack",
];
// we can also block by domains, like google-analytics etc.
const blockResourceName = [
  "adition",
  "adzerk",
  "analytics",
  "cdn.api.twitter",
  "clicksor",
  "clicktale",
  "doubleclick",
  "exelator",
  "facebook",
  "fontawesome",
  "google",
  "google-analytics",
  "googletagmanager",
  "mixpanel",
  "optimizely",
  "quantserve",
  "sharethrough",
  "tiqcdn",
  "zedo",
];
class YelpScraper {
  async scrape(url) {
    let browser = null;
    let page = null;
    let content = null;

    try {
      browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        // args: ["--proxy-server=zproxy.lum-superproxy.i0:22225"],
      });
      page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const requestUrl = req.url();
        if (
          req.resourceType() in blockResourceType ||
          blockResourceName.some((resource) => requestUrl.includes(resource))
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(
        `http://api.proxiesapi.com/?auth_key=a9ae75f1ce2c1c081f33dcf28cf2fc60_sr98766_ooPq87&url=${url}`,
        { waitUntil: "domcontentloaded", timeout: 0 }
      );

      content = await page.content();
    } catch (e) {
      console.log(e.message);
    } finally {
      if (page) {
        await page.close();
      }

      if (browser) {
        await browser.close();
      }
    }

    return content;
  }
}

module.exports = YelpScraper;
