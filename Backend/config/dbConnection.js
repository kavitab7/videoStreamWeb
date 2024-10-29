const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);

        //initialize gfs 
        gfs = Grid(conn.connection.db, mongoose.mongo)
        gfs.collection('uploads') //bucket for video files
        console.log(`mongoDb connected ${mongoose.connection.host}`)
    } catch (error) {
        console.log('mongoDb connection error')
    }
}

module.exports = { connectDB, getGfs: () => gfs };