const express = require('express');
const router = express.Router();
const Audio = require("../schemas/Audio");

router.get('/fetch/:jobId', async (req, res) => {
    try{
        const jobId = req.params.jobId;

        const audio = await Audio.findOne({ jobId });

        if (!audio) {
            return res.status(404).send('Audio with job ID not found');
        }

        res.status(200).json(audio);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;
