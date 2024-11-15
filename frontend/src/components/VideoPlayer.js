import React, { useEffect, useRef, useState } from 'react'

const VideoPlayer = ({ videoId }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(1);

    //fetch and stream 
    const fetchVideoStream = async () => {
        try {
            const response = await fetch(`api/v1/videos/${videoId}`, {
                method: 'GET',
                headers: {
                    Range: 'bytes=0-',
                },
            })
            if (response.ok) {
                const videoBlob = await response.blob();

                const videoUrl = URL.createObjectURL(videoBlob)

                videoRef.current.src = videoUrl
            } else {
                console.error('Failed to fetch video stream');
            }
        } catch (error) {
            console.error('Error streaming video:', error);
        }
    }

    useEffect(() => {
        fetchVideoStream()
    }, [videoId]);

    //toggle play pause 
    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    //progress bar update 
    const handleTimeUpdate = () => {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        setProgress((currentTime / duration) * 100)
    }

    //volume control
    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        videoRef.current.volume = newVolume
    }

    return (
        <div className='video-player-container' >
            <video ref={videoRef} className='video-player' controls={false}
                onTimeUpdate={handleTimeUpdate}></video>
            {/* video controls */}
            <div className="video-controls bg-dark text-light p-2 d-flex align-items-center justify-content-between">
                {/* Play/Pause button */}
                <button className="btn btn-light" onClick={handlePlayPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* progress bar */}
                <div className="progress-container flex-grow-1 mx-3">
                    <div className="progress">
                        <div
                            className="progress-bar bg-danger"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                {/* volume control */}
                <div className="volume-control">
                    <FaVolumeUp className="me-2" />
                    <input type='range' min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className='form-range' />
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer