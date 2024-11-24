import React, { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VideoPage = () => {
    const { videoId } = useParams();
    const [videoData, setVideoData] = useState({});
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState({});
    const [subscribed, setSubscribed] = useState(false);

    const user = useSelector((state) => state.user.user);
    const userId = user ? user._id : null;

    // Fetch video data
    const fetchVideoData = async () => {
        try {
            const response = await axios.get(`/api/v1/videos/${videoId}`);
            setVideoData(response.data);
            setLikes(response.data.likes.length);
            setSubscribed(response.data.isSubscribed);  // Ensure API sends subscription status
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    };

    // Fetch comments
    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/v1/videos/${videoId}/comments`);
            setComments(response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Handle like
    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/v1/videos/${videoId}/like`, { userId });
            setLikes(response.data.likesCount);
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking the video:', error);
        }
    };

    // Handle subscribe/unsubscribe
    const handleSubscribe = async () => {
        try {
            if (subscribed) {
                // Unsubscribe
                await axios.post(`/api/v1/users/unsubscribe/${videoData.uploadedBy._id}`, {}, { withCredentials: true });
                setSubscribed(false);
            } else {
                // Subscribe
                await axios.post(`/api/v1/users/subscribe/${videoData.uploadedBy._id}`, {}, { withCredentials: true });
                setSubscribed(true);
            }
        } catch (error) {
            console.error('Error subscribing/unsubscribing to user:', error);
        }
    };

    // Handle add comment
    const handleAddComment = async () => {
        try {
            await axios.post(`/api/v1/videos/${videoId}/comments`, { userId, text: commentText });
            setCommentText('');
            fetchComments(); 
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Handle add reply
    const handleAddReply = async (commentId) => {
        try {
            await axios.post(`/api/v1/videos/${videoId}/comments/${commentId}/replies`, { userId, text: replyText[commentId] });
            setReplyText({ ...replyText, [commentId]: '' });
            fetchComments();
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    useEffect(() => {
        fetchVideoData();
        fetchComments();
    }, [videoId]);

    return (
        <div className="container mt-4">
            {/* Video player */}
            <VideoPlayer videoId={videoId} />

            {/* Video details */}
            <div className="mt-3">
                <h3>{videoData.title}</h3>
                <div className="d-flex align-items-center">
                    <FaUserCircle size={40} />
                    <span className="ms-2">{videoData.uploadedBy?.username}</span>
                    <button
                        className={`btn ${subscribed ? 'btn-secondary' : 'btn-outline-primary'} ms-3`}
                        onClick={handleSubscribe}
                    >
                        {subscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                </div>
                <p className="text-muted">{new Date(videoData.createdAt).toLocaleString()}</p>
                <p>{videoData.description}</p>

                {/* Like */}
                <div className="d-flex align-items-center">
                    <button className={`btn ${liked ? 'btn-success' : 'btn-outline-success'} me-2`} onClick={handleLike}>
                        <FaThumbsUp /> {likes}
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
                <h5>Comments</h5>
                <textarea
                    className="form-control mb-2"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button className="btn btn-primary mb-3" onClick={handleAddComment}>
                    Add Comment
                </button>

                {comments.map((comment) => (
                    <div key={comment._id} className="mb-3">
                        <div className="d-flex align-items-start">
                            <FaUserCircle size={30} />
                            <div className="ms-2">
                                <strong>{comment.userId?.username}</strong>
                                <p>{comment.text}</p>

                                {/* Reply Section */}
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Add a reply..."
                                    value={replyText[comment._id] || ''}
                                    onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                                />
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleAddReply(comment._id)}>
                                    Reply
                                </button>

                                {/* Display replies */}
                                {comment.replies && comment.replies.map((reply) => (
                                    <div key={reply._id} className="ms-4 mt-2">
                                        <FaUserCircle size={20} />
                                        <strong className="ms-2">{reply.userId?.username}</strong>
                                        <p className="ms-4">{reply.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPage;
