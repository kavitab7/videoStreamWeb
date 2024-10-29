const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, res) => {
        return {
            filename: `${Date.now()}-thumbnail`,
            bucketName: 'thumbnails'
        }
    }
})

const upload = multer({ storage });
module.exports = upload;