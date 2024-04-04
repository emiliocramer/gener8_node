const { Storage } = require('@google-cloud/storage');

const jobs = [];

async function generateSong(job) {
    const { run } = await import('./huggingface.mjs');

    try {
        console.log('Processing job:', job.jobId);
        const { promptUsed } = job.data;

        const audioFileData = run(promptUsed);
        const filename = `generated_audio_${Date.now()}.wav`;

        const key = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
        const storage = new Storage({ credentials: key });
        const bucket = storage.bucket('prototype-one-bucket');

        const file = bucket.file(`audios/${filename}`);
        await file.save(audioFileData);

        const audioFileUrl = file.publicUrl();
        return audioFileUrl;
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
