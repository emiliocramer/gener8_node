const express = require('express');
const router = express.Router();
global.EventSource = require('eventsource');
const { addJob } = require('../jobQueue');
const { v4: uuidv4 } = require('uuid');

const { Storage } = require('@google-cloud/storage');

const key = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
const storage = new Storage({ credentials: key });
const bucket = storage.bucket('prototype-one-bucket');

router.post('/run', async (req, res) => {
    try {
        const { promptUsed } = req.body;
        if (!promptUsed) {
            return res.status(400).send('prompt required to run.');
        }

        const jobId = uuidv4();
        await addJob('generateSong', { promptUsed }, jobId);

        res.status(202).json({ message: "Song generation started", id: jobId });
    } catch (error) {
        console.error('Run Error:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;

