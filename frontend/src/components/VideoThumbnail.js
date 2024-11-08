import React from 'react';

const VideoThumbnail = ({ title, uploader, thumbnailUrl }) => {
    return (
        <div className="col-md-4 col-sm-6 mb-4">
            <div className="card">
                <img src={thumbnailUrl} className="card-img-top" alt="thumbnail" />
                <div className="card-body">
                    <h6 className="card-title">{title}</h6>
                    <p className="card-text text-muted">{uploader}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoThumbnail;
