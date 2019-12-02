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

// app.get('/', (req, res) => {
//scrape the bandcamp album of the day daily at 5:00pm
scraper()
    .then((aotd) => {
        const albumOfTheDay = new AlbumOfTheDay(aotd);
        albumOfTheDay.save().then(() => console.log('album of the day saved')).catch(error => console.log(error));
    })
    .then(() => {
        process.exit();
    })
    .catch((error) => console.log(error));
// res.send('Bandcamp Scraper');
// });