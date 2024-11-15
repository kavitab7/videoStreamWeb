const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        let bucketName;
        if (file.mimetype.startsWith('image/')) {
            bucketName = 'thumbnails';
        } else if (file.mimetype.startsWith('video/')) {
            bucketName = 'videos';
        }
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName,
        };
    },
});

const upload = multer({ storage });
module.exports = upload;
