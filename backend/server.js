const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const songRoutes = require("./routes/songroutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully ✅");
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed ❌", error);
    });

app.use("/api/songs", songRoutes);

app.get("/", (req, res) => {
    res.send("VibeVault Backend is Running 🎵");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});