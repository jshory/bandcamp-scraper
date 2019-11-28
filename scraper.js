const $ = require('cheerio');
const puppeteer = require('puppeteer');

let albumOfTheDay = {
    date: new Date(),
    albumUrl: '',
    artist: '',
    album: '',
    tracks: [],
    description: '',
    tags: []
};

const bandcampUrl = 'https://daily.bandcamp.com/album-of-the-day';

//starts at bandcamp homepage, returns URL for the Album of the Day
const getAlbumOfTheDayUrl = async bandcampUrl => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    try {
        const page = await browser.newPage();
        await page.goto(bandcampUrl);
        let bandcampHomepageHtml = await page.evaluate(() => document.body.innerHTML);

        var dailyLinks = [];
        $('.title', bandcampHomepageHtml).each((i, item) => {
            dailyLinks.push($(item).attr('href'));
        });

        var dailyLink = 'https://daily.bandcamp.com/album-of-the-day' + dailyLinks[0];
    } catch (error) {
        console.log(error);
        await browser.close();
    } finally {
        await browser.close();
        return dailyLink;
    }
}

//starts at Album of the Day URL, returns the album's URL
const getAlbumUrl = async dailyLink => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    try {
        const page = await browser.newPage();
        await page.goto(dailyLink);
        let dailyLinkHtml = await page.evaluate(() => document.body.innerHTML);
        var albumLink = $('.mptralbum', dailyLinkHtml).attr('href');
        albumLink = albumLink.slice(0, -5);
    } catch (error) {
        console.log(error);
        await browser.close();
    } finally {
        await browser.close();
        return albumLink;
    }
}

//starts at album's URL, retrieves all album data
const getAlbumDetails = async () => {
    let albumLink;
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    let dailyLink;

    try {
        dailyLink = await getAlbumOfTheDayUrl(bandcampUrl);
        albumLink = await getAlbumUrl(dailyLink);
        albumOfTheDay.albumUrl = albumLink;

        const page = await browser.newPage();
        await page.goto(albumLink);

        let albumPageHtml = await page.evaluate(() => document.body.innerHTML);

        //get artist and album name
        var artist = $('#name-section span', albumPageHtml).text().trim();
        albumOfTheDay.artist = artist;

        var album = $('#name-section h2', albumPageHtml).text().trim();
        albumOfTheDay.album = album;

        //get tracks, description, tags
        var tracks = [];
        $('.track-title', albumPageHtml).each((i, item) => {
            tracks.push($(item).text());
        });
        albumOfTheDay.tracks = tracks;

        var description = $('.tralbum-about', albumPageHtml).text();
        description = description.slice(0, -5);
        albumOfTheDay.description = description;

        var tags = [];
        $('.tag', albumPageHtml).each((i, item) => {
            if ($(item).text() !== '') {
                tags.push($(item).text());
            }
        });
        albumOfTheDay.tags = tags;

    } catch (error) {
        console.log(error);
        await browser.close();
    } finally {
        await browser.close();
        return albumOfTheDay;
    }
}

module.exports = getAlbumDetails;