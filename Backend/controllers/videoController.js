const { getGfs } = require('../config/dbConnection')
const Video = require('../models/videoModel')
const mongoose = require('mongoose')

//get all thumbnails
exports.getAllThumbnails = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const videos = await Video.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const thumbnails = videos.map(video => ({
            id: video._id,
            title: video.title,
            description: video.description,
            thumbnailId: video.thumbnailId
        }))
        const totalThumbnails = thumbnails.length
        const totalPages = Math.ceil(totalThumbnails / limit);
        const hasMorePages = page < totalPages;

        res.status(200).json({
            thumbnailsCount: totalThumbnails,
            totalPages,
            currentPage: page,
            hasMorePages,
            success: true,
            thumbnails,
            message: "Thumnails fetched successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while retrieving thumbnails" });
    }
};

//get video details 
exports.getVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.findById(videoId).populate('uploadedBy', 'username');
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video details", error });
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
        if (!req.files || !req.files.video) {
            return res.status(400).json({ message: "Video file is required." });
        }


        const videoFile = req.files?.video?.[0];

        const thumbnailFile = req.files?.thumbnail?.[0];

        const writestream = gfs.createWriteStream({
            filename: `${Date.now()}-${videoFile.originalname}`,
            content_type: videoFile.mimetype || 'video/mp4',
        });

        writestream.end(videoFile.buffer)

        writestream.on('close', async (file) => {
            try {
                const video = new Video({
                    title,
                    description,
                    videoId: file._id,
                    thumbnailId: req.thumbnailFile?.id || null,
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

// get likes for a video
exports.getLikes = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.findById(videoId).populate('likes', 'username email');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({
            likesCount: video.likes.length,
            likedUsers: video.likes
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving likes', error });
    }
};

//toggle like unlike
exports.toggleLike = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { userId } = req.body;
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const likeIndex = video.likes.indexOf(userId);

        if (likeIndex === -1) {
            video.likes.push(userId);
            await video.save();
            return res.status(200).json({ message: 'Video liked successfully', likesCount: video.likes.length });
        } else {
            video.likes.splice(likeIndex, 1);
            await video.save();
            return res.status(200).json({ message: 'Video unliked successfully', likesCount: video.likes.length });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error toggling like', error: err.message });
    }
};
