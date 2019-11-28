const express = require('express');
const app = express();
const cron = require('node-cron');
const mongoose = require('mongoose');
const scraper = require('./scraper');
require('dotenv').config();
const AlbumOfTheDay = require('./models/AlbumOfTheDay');

let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});

mongoose.connect(process.env.MONGOURI, { useMongoClient: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error));

//scrape the bandcamp album of the day daily at 4:30pm
cron.schedule("30 16 * * *", function () {
    console.log("running cron job");
    scraper()
        .then((aotd) => {
            const albumOfTheDay = new AlbumOfTheDay(aotd);
            albumOfTheDay.save().then(() => console.log('album of the day saved')).catch(error => console.log(error));
        })
        .catch((error) => console.log(error));
});