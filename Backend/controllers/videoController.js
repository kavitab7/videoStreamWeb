const { getGfs } = require('../config/dbConnection')
const Video = require('../models/videoModel')
const mongoose = require('mongoose')

//get all thumbnails
exports.getAllThumbnails = async (req, res) => {
    try {
        const videos = await Video.find({}, 'title description videoId thumbnailId')
        const thumbnails = videos.map(video => ({
            id: video._id,
            title: video.title,
            description: video.description,
            thumbnailId: video.thumbnailId
        }))

        res.status(200).json(thumbnails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while retrieving thumbnails" });
    }
};

//upload video and thumbnail
exports.uploadVideo = async (req, res) => {
    try {
        const gfs = getGfs();
        if (!gfs) throw new Error("GridFs instance is not available");
        const { title, description, userId } = req.body;

        if (!title || !description || !userId) {
            return res.status(400).json({ message: "Title, description, and userId are required." });
        }

        const writestream = gfs.createWriteStream({
            filename: `${Date.now()}-video.mp4`,
            content_type: 'video/mp4',
        })
        req.pipe(writestream);

        writestream.on('close', async (file) => {
            try {
                const video = new Video({
                    title,
                    description,
                    videoId: file._id,
                    thumbnailId: req.file?.id,
                    uploadedBy: userId,
                })

                await video.save();
                res.status(201).json({ message: 'Video uploaded successfully', video });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Error saving video details to the database" });
            }
        });
        writestream.on('error', (err) => {
            console.log(err)
            res.status(500).json({ message: "Error uploading video to GridFS" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error occurred during the video upload process" });
    }
};

//stream video
exports.streamVideo = async (req, res) => {
    try {
        const gfs = getGfs();
        if (!gfs) throw new Error("GridFS instance is not available")

        const { id } = req.params
        const range = req.headers.range;
        if (!range) return res.status(400).json({ message: "Range header is required for streaming" })

        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const videoFile = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(video.videoId) });
        if (!videoFile) return res.status(404).json({ message: 'Video file not found in GridFS' })

        const videoSize = videoFile.length;

        const [start, end] = range.replace(/bytes=/, '').splice('-').map(Number);
        const calculatedEnd = end ? Math.min(end, videoSize - 1) : videoSize - 1;
        const chunkSize = (calculatedEnd - start) + 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${calculatedEnd}/${videoSize}`,
            'Accept-Range': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': videoFile.contentType,
        })

        const readStream = gfs.createReadStream({ _id: video.videoId, range: { start, end: calculatedEnd } })
        readStream.pipe(res);

        readStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ message: "Error streaming video." });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while streaming the video." });
    }
};

//Retrieve thumbnail
exports.getThumbnail = async (req, res) => {
    try {
        const gfs = getGfs();
        if (!gfs) throw new Error("GridFS instance is not available")
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid thumbnail ID" })
        }

        const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(id), root: 'thumbnails' });
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'Thumbnail not found' })
        }
        res.setHeader('Content-Type', file.contentType);
        const readStream = gfs.createReadStream({ _id: file._id, root: 'thumbnails' })
        readStream.pipe(res);

        readStream.on('error', (err) => {
            console.log(err)
            res.status(500).json({ message: "Error streaming thumbnail" });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while retrieving the thumbnail" });
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