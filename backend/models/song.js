const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    artist: {
        type: String,
        required: true
    },

    album: {
        type: String,
        default: "Single"
    },

    genre: {
        type: String,
        default: "Unknown"
    },

    coverImage: {
        type: String,
        default: ""
    },

    audioUrl: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;