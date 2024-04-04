const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const express = require('express');
const router = express.Router();
const Song = require("../schemas/Song");
const fs = require("fs");

router.post('/upload', async (req, res) => {
    try {

        const { name, description, promptUsed, audioID } = req.body;
        if (!name || !description || !promptUsed, !audioID) {
            return res.status(400).send('name, description, prompt, and audio are required');
        }

        const song = new Song({
            name: name,
            description: description,
            audioID: audioID,
            promptUsed: promptUsed,
        });

        await song.save();

        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: "Song uploaded successfully", song });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send(error.message);
    }
});

router.post('/toggleUpvote/:songId', async (req, res) => {
    try {
        const songId = req.params.songId;
        const cookies = req.cookies;
        const upvotedSongs = cookies.upvotedSongs ? JSON.parse(cookies.upvotedSongs) : [];

        const upvoteIndex = upvotedSongs.indexOf(songId);
        if (upvoteIndex !== -1) {
            upvotedSongs.splice(upvoteIndex, 1);
            await Song.findByIdAndUpdate(songId, { $inc: { upvoteCount: -1 } });
        } else {
            upvotedSongs.push(songId);
            await Song.findByIdAndUpdate(songId, { $inc: { upvoteCount: 1 } });
        }

        res.cookie('upvotedSongs', JSON.stringify(upvotedSongs));
        res.status(200).json({ message: 'Upvote toggled' });
    } catch (error) {
        console.error('Upvote Error:', error);
        res.status(500).send(error.message);
    }
});

router.get('/songs/recent', async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).send(error.message);
    }
});

router.get('/songs/popular', async (req, res) => {
    try {
        const songs = await Song.find().sort({ upvoteCount: -1 });
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;
