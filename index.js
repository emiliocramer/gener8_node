const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./api/routes/auth');
const modelRoutes = require('./api/routes/model');
const userRoutes= require('./api/routes/user');
const songRoutes = require('./api/routes/song');
const userStatusRoutes = require('./api/routes/status/user');
const modelStatusRoutes = require('./api/routes/status/model');
const songStatusRoutes = require('./api/routes/status/song');

require('dotenv').config();
const app = express();
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.use(cors())


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected to ' + mongoose.connection.db.databaseName))
    .catch(err => console.log(err));


app.use('/routes/auth', authRoutes);
app.use('/routes/model', modelRoutes);
app.use('/routes/user', userRoutes);
app.use('/routes/song', songRoutes);
app.use('/routes/status/user', userStatusRoutes);
app.use('/routes/status/model', modelStatusRoutes);
app.use('/routes/status/song', songStatusRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
