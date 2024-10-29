const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConnection');


dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'));


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})