const mongoose = require('mongoose');
const { Schema } = mongoose;

const songSchema = new Schema({
    name: String,
    description: String,
    audioURL: String,
    promptUsed: String,
    upvoteCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
