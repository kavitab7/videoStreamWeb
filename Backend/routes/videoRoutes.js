const express = require('express')
const router = express.Router();
const videoController = require('../controllers/videoController')
const upload = require('../middleware/upload')

//gets all thumbnails
router.get('/thumbnails', videoController.getAllThumbnails);

//get video by id
router.get('/:videoId', videoController.getVideoDetails);

// upload video with thumbnail
router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), videoController.uploadVideo);

// stream video
router.get('/stream/:id', videoController.streamVideo);

// retrieve thumbnail by ID
router.get('/thumbnail/:id', videoController.getThumbnail);

//add comments
router.post('/:videoId/comment', videoController.addComment);

//add reply
router.post('/:videoId/comment/:commentId/reply', videoController.addReply)

//get comments
router.get('/:videoId/comments', videoController.getComments)

// get likes for video
router.get('/:videoId/likes', videoController.getLikes);

// toggle like unlike
router.post('/:videoId/like', videoController.toggleLike);

module.exports = router;