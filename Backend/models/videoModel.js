const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
})

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [replySchema],
})

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoId: { type: mongoose.Types.ObjectId, required: true },
    thumbnailId: { type: mongoose.Types.ObjectId },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    uploadedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema)