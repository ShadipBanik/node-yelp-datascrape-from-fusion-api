const YelpScraper = require("./yelp-scraper.js");
const YelpParser = require("./yelp-parser.js");

const cheerio = require("cheerio");
const fs = require("fs");
const zip = require("./zip.json");
const datajson = require("./user.json");
const axios = require("axios");
const axiosRetry = require("axios-retry");
const url = "https://api.yelp.com/v3/businesses/";
const token = "your yelp fusion api token";
const main = async () => {
  try {
    // const yelpScraper = new YelpScraper();
    // const yelpParser = new YelpParser();
    var scrapedData = [];
    for (let j = 0; j < zip.length; j++) {
      axiosRetry(axios, { retries: 5 });
      const statrtpage = await axios
        .get(`${url}search?term=Restaurants&location=${zip[j]}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          return result.data; // 'ok'
        });
      const pagenumber = Math.ceil(statrtpage.total / 50);

      for (let i = 0; i < pagenumber; i++) {
        if (i * 50 > 950) {
          break;
        }
        const link = `${url}search?term=Restaurants&location=${
          zip[j]
        }&limit=50&offset=${i * 50}`;
        console.log(link);
        const data = await axios
          .get(link, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((result) => {
            return result.data; // 'ok'
          });

        const businesses = data.businesses.map((el) => {
          const { id, name, url } = el;
          return { id: id, name: name, url: url, pagination: link };
        });
        // console.log(businesses);
        const jsonString = fs.readFileSync("./user.json");
        const bisData = JSON.parse(jsonString);
        const datajoin = await bisData?.concat(businesses);
        // const dataObjeact = { businesses: datajoin };
        fs.writeFile("./user.json", JSON.stringify(datajoin), (err) => {
          // Error checking
          if (err) throw err;
          console.log("New data added");
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

main();
