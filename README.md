## Bandcamp Scraper

A web scraper that pulls Album of the Day data from bandcamp.com every afternoon. The scraper stores the data in a MongoDB database, with the goal being to create an API open to developers to access all previous (and future) Album of the Day selections by Bandcamp. My goal with this project was to learn scraping, and to automate the population of a database that will be used for a RESTful API.

### Technology

The Bandcamp Scraper is built with Node.js (version 8.11.1), Puppeteer (version 2.0.0), and Cheerio (version 1.0.0-rc.3). Node-Cron (version 2.0.3) is used to schedule a daily scrape (currently scheduled for 4:30pm EST), and Mongoose (version 5.7.12) allows for database connectivity.

### Status

To be implemented in the future:
* data validation, to ensure that the data pulled today is not the same as yesterday's scrape (accounting for days when Bandcamp does not post/update an Album of the Day)
* build the API to allow for querying/fetching from the database of Albums