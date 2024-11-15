import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoThumbnail from '../components/VideoThumbnail';

const PAGE_NUMBER = 1

const Home = () => {
    const [thumbnails, setThumbnails] = useState([]);
    const [page, setPage] = useState();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(PAGE_NUMBER)
    const [hasMorePages, setHasMorePages] = useState(true);

    useEffect(() => {
        setLoading(true)
        setTimeout(async () => {
            try {
                const { data } = await axios.get(`api/vq/videos/thumbnails?page=${page}`)
                if (data.success) {
                    setThumbnails((prev) => [...prev, ...data.thumbnails]);
                    setTotalPages(data.totalPages)
                    setHasMorePages(data.hasMorePages)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }, 1500)
    }, [page])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement

        if (scrollTop + clientHeight >= scrollHeight && hasMorePages) {
            setPage((prev) => prev + 1)
        }
    }
    return (
        <div className="home-page">
            <div className="container-fluid">
                <div className="row">
                    {thumbnails.map((video) => (
                        <VideoThumbnail
                            key={video._id}
                            title={video.title}
                            uploader={video.uploader}
                            thumbnailUrl={video.thumbnailUrl}
                        />
                    ))}
                </div>
                {hasMorePages && loading && <p>Loading...</p>}
            </div>
        </div>
    );
};

export default Home