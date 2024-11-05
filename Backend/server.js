const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

const connectDB = require('./config/dbConnection');
const videoRoutes = require('./routes/videoRoutes')
const userRoutes = require('./routes/userRoutes')

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/v1/video', videoRoutes)
app.use('/api/v1/user', userRoutes)


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})