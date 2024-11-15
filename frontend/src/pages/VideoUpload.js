import React, { useState } from "react";

const VideoUpload = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState('12345');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0])
    }

    const handleThumbnailChange = (e) => {
        setThumbnailFile(e.target.files[0])
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!title || !description || !userId || !videoFile) {
            alert('Please fill out all fields and select a video.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title)
        formData.append('description', description);
        formData.append('userId', userId);
        formData.append('video', videoFile)
        formData.append('thumbnail', thumbnailFile)

        try {
            setIsUploading(true)
            const response = await fetch('api/v1/videos/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const result = await response.json();
                alert('Please fill out all fields and select a video.');
                return;

                setTitle('');
                setDescription('');
                setVideoFile(null);
                setThumbnailFile(null);
                setUploadProgress(0);
            } else {
                const errorResponse = await response.json();
                alert('Failed to upload video: ' + errorResponse.message);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('An error occurred during the upload.');
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Upload Video</h2>
            <form onSubmit={handleUpload}>

                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter video description"
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Select Video</label>
                    <input type="file" className="form-control"
                        accept="video/mp4,video/mkv,video/avi"
                        onChange={handleVideoChange}
                        required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Select Thumbnail (Optional)</label>
                    <input type="file" accept="image/png,image/jpeg" className="form-control"
                        onChange={handleThumbnailChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    )
}