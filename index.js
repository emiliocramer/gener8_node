const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const songRoutes = require('./api/routes/song');
const huggingfaceRoutes = require('./api/routes/huggingface');

require('dotenv').config();
const app = express();
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.use(cors())


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected to ' + mongoose.connection.db.databaseName))
    .catch(err => console.log(err));


app.use('/api/song', songRoutes);
app.use('/api/huggingface', huggingfaceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
