const express = require("express");
const Song = require("../models/song");

const router = express.Router();

// GET all songs
router.get("/", async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch songs",
            error: error.message
        });
    }
});

// POST a new song
router.post("/", async (req, res) => {
    try {
        const song = new Song(req.body);
        const savedSong = await song.save();

        res.status(201).json(savedSong);
    } catch (error) {
        res.status(500).json({
            message: "Failed to add song",
            error: error.message
        });
    }
});

module.exports = router;