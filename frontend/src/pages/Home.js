import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoThumbnail from '../components/VideoThumbnail';


export const Home = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    return (
        <div className="home-page">
            <div className="container-fluid">
                <div className="row">
                    {videos.map((video) => (
                        <VideoThumbnail
                            key={video._id}
                            title={video.title}
                            uploader={video.uploader}
                            thumbnailUrl={video.thumbnailUrl}
                        />
                    ))}
                </div>
                {loading && <p>Loading...</p>}
            </div>
        </div>
    );
};