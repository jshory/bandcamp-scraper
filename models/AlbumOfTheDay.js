const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumOfTheDaySchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    albumUrl: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    tracks: {
        type: [String]
    },
    description: {
        type: String
    },
    tags: { type: [String] }
});

module.exports = mongoose.model('AlbumOfTheDay', albumOfTheDaySchema);