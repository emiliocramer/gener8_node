const mongoose = require('mongoose');
const { Schema } = mongoose;

const audioSchema = new Schema({
    audioUrl: String,
});

const Audio = mongoose.model('Audio', audioSchema);
module.exports = Audio;
