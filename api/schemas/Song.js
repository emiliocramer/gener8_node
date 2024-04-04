const mongoose = require('mongoose');
const { Schema } = mongoose;

const songSchema = new Schema({
    name: String,
    description: String,
    audioID: {
        type: Schema.Types.ObjectId,
        ref: 'Audio',
    },
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
