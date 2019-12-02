const express = require('express');
const app = express();
const mongoose = require('mongoose');
const scraper = require('./scraper');
require('dotenv').config();
const AlbumOfTheDay = require('./models/AlbumOfTheDay');

let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});

mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error));

//scrape the bandcamp album of the day daily at 5:00pm
scraper()
    .then((aotd) => {
        const albumOfTheDay = new AlbumOfTheDay(aotd);
        AlbumOfTheDay.find({ album: albumOfTheDay.album }, (err, docs) => {
            if (docs.length) {
                console.log('album already exists in db');
            } else {
                albumOfTheDay.save().then(() => console.log('album of the day saved')).catch(error => console.log(error));
            }
        });
    })
    .catch((error) => console.log(error));