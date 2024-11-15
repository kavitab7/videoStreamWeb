const express = require('express')
const router = express.Router();
const videoController = require('../controllers/videoController')
const upload = require('../middleware/upload')

//gets all thumbnails
router.get('/thumbnails', videoController.getAllThumbnails);

// upload video with thumbnail
router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), videoController.uploadVideo);

// stream a video
router.get('/stream/:id', videoController.streamVideo);

// retrieve a thumbnail by ID
router.get('/thumbnail/:id', videoController.getThumbnail);

//add comments
router.post('/:videoId/comment', videoController.addComment);

//add reply
router.post('/:videoId/comment/:commentId/reply', videoController.addReply)

//get comments
router.get('/:videoId/comments', videoController.getComments)

module.exports = router;