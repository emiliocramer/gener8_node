const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const express = require('express');
const router = express.Router();
const Song = require("../schemas/Song");
const fs = require("fs");
const { Storage } = require('@google-cloud/storage');

const key = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
const storage = new Storage({ credentials: key });
const bucket = storage.bucket('prototype-one-bucket');

router.post('/upload', upload.single('audioFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('audio file required to upload.');
        }

        const { name, description, promptUsed } = req.body;

        const audioFileUploadResult = await bucket.upload(req.file.path, {
            destination: `songs/${req.file.originalname}`,
        });

        const audioFileUrl = audioFileUploadResult[0].publicUrl();
        console.log(audioFileUrl)

        const song = new Song({
            name: name,
            description: description,
            audioURL: audioFileUrl,
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

module.exports = router;
