// yelp-parser.js

const cheerio = require("cheerio");
const ip_addresses = require("./ip_adress.js");
const fs = require("fs");

class YelpParser {
  getPagesAmount(listingPageHtml) {
    const $ = cheerio.load(listingPageHtml);
    const paginationTotalText = $(
      ".pagination__09f24__VRjN4 .css-chan6m"
    ).text();

    const totalPages = paginationTotalText.match(/of.([0-9]+)/)[1];

    return Number(totalPages);
  }

  getBusinessLinks(listingPageHtml) {
    const $ = cheerio.load(listingPageHtml);

    const links = $("a.css-1kb4wkh")
      .filter((i, el) => /^\/biz\//.test($(el).attr("href")))
      .map((i, el) => $(el).attr("href"))
      .toArray();
    console.log(links);
    return links;
  }

  extractBusinessInformation(businessPageHtml, pageLink) {
    const $ = cheerio.load(businessPageHtml);

    const title = $('div[data-testid="photoHeader"]').find("h1").text().trim();

    const address = $("address")
      .children("p")
      .map((i, el) => $(el).text().trim())
      .toArray();

    const fullAddress = address.join(",");
    const citystateszip = fullAddress.split(",");
    const city = citystateszip[1]?.trim();
    const statezip = citystateszip[2]?.trim().split(" ");
    const state = statezip ? statezip[0] : null;
    const zip = statezip ? statezip[1] : null;
    const businessesPage = "https://www.yelp.com" + pageLink;
    const phone = $('p[class=" css-1p9ibgf"]')
      .filter((i, el) => /\(\d{3}\)\s\d{3}-\d{4}/g.test($(el).text()))
      .map((i, el) => $(el).text().trim())
      .toArray()[0];

    const sitelink =
      "https://www.yelp.com" +
      $("a.css-zyaz5k")
        .filter((i, el) => $(el).attr("rel") == "noopener nofollow")
        .map((i, el) => $(el).attr("href"))
        .toArray()[0];
    const companySite = this.urlQueryParser(sitelink, "url");
    const days = $("table>tbody>tr")
      .filter((i, el) => $(el).text() != "")
      .map((i, el) => $(el).text()?.trim())
      .toArray();
    //review
    return {
      title,
      fullAddress,
      phone,
      companySite,
      businessesPage,
      days,
      city,
      state,
      zip,
      // hours,
    };
  }

  urlQueryParser(url, param) {
    const params = new URL(url).searchParams;
    return params.get(param);
  }
  proxyGenerator() {
    const random_number = Math.floor(Math.random() * 100);
    let proxy = `http://${ip_addresses.ip_adresss[random_number]}:${ip_addresses.port_numbers[random_number]}`;
    return proxy;
  }
}

module.exports = YelpParser;
