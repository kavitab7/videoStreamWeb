const { getGfs } = require('../config/dbConnection')
const Video = require('../models/videoModel')
const mongoose = require('mongoose')

//upload video and thumbnail
exports.uploadVideo = async (req, res) => {
    try {
        const gfs = getGfs();
        if (!gfs) throw new Error("GridFs instance is not available");
        const { title, description, userId } = req.body;

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error while uploading video', error });
    }
}


//add comment
exports.addComment = async (req, res) => {
    const { videoId } = req.params;
    const { userId, text } = req.body

    try {
        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const comment = { userId, text }
        video.comments.push(comment);
        await video.save();
        res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

//add replies to comment
exports.addReply = async (req, res) => {
    const { videoId, commentId } = req.params;
    const { userId, text } = req.body;

    try {
        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const comment = video.comments.id(commentId)
        if (!comment) return res.status(404).json({ message: 'comment not found' })

        comment.replies.push({ userId, text });
        await video.save();
        res.status(201).json({ message: 'Reply added', reply: comment.replies[comment.replies.length - 1] })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error in adding reply', error })
    }
}

//get comments foe a video
exports.getComments = async (req, res) => {
    const { videoId } = req.params;
    try {
        const video = await Video.findById(videoId).populate('comments.userId', 'username')
        if (!video) return res.status(404).json({ message: 'video not found' });

        res.status(200).json({ comments: video.comments })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'error retriving comments', error })
    }
}