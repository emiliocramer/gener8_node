const express = require('express');
const router = express.Router();
global.EventSource = require('eventsource');

const { Storage } = require('@google-cloud/storage');

const key = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
const storage = new Storage({ credentials: key });
const bucket = storage.bucket('prototype-one-bucket');

router.post('/run', async (req, res) => {
    try {
        const { run } = await import('../huggingface.mjs');
        const { promptUsed } = req.body;
        if (!promptUsed) {
            return res.status(400).send('prompt required to run.');
        }

        const audioFileData = await run(promptUsed);
        const filename = `generated_audio_${Date.now()}.wav`;

        const file = bucket.file(`audios/${filename}`);
        await file.save(audioFileData);
        const audioFileUrl = file.publicUrl();

        res.status(201).json({ message: "Run executed and song uploaded", result: audioFileUrl });
    } catch (error) {
        console.error('Run Error:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;

