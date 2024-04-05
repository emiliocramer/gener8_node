const { Storage } = require('@google-cloud/storage');
const { fetch } = require('node-fetch');
const jobs = [];

const key = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
const storage = new Storage({ credentials: key });
const bucket = storage.bucket('prototype-one-bucket');

async function generateSong(job) {
    const { run } = await import('./huggingface.mjs');

    try {
        console.log('Processing job:', job.jobId);
        const { promptUsed } = job.data;

        const tmpFilePath =  run(promptUsed);
        const audioFilePublicUrl = `https://emiliocramer-prototypeone.hf.space/file=${tmpFilePath}`;

        try {
            console.log('Fetching audio file...');
            const response = await fetch(audioFilePublicUrl);
            if (!response.ok) {
                console.log(`Failed to fetch audio file: ${response.status}`);
            }

            const audioFileData = await response.buffer();

            const filename = tmpFilePath.split('/').pop();
            const file = bucket.file(`audios/${filename}`);
            await file.save(audioFileData);
            const audioFileUrl = file.publicUrl();

            console.log('Audio file uploaded to Google Cloud Storage:', audioFileUrl);

        } catch (error) {
            console.error('Error fetching or uploading audio:', error);
        }

    } catch (error) {
        console.error('Job processing error:', error);
        throw error;
    }
}

setInterval(async () => {
    if (jobs.length > 0) {
        const job = jobs.shift();
        try {
            const result = await generateSong(job);
            console.log('Job completed with result:', result);
        } catch (error) {
            console.error('Job processing error:', error);
        }
    }
}, 500);

const addJob = async (jobName, data) => {
    const jobId = Date.now();
    jobs.push({ jobName, data, jobId });
};

module.exports = { addJob };
