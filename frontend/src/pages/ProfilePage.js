import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import VideoThumbnail from '../components/VideoThumbnail';

const ProfilePage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => state.user.user)
  const [userData, setUserData] = useState({});
  const history = useHistory();
  const [videos, setVideos] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const loggedInUserId = user ? user._id : null;

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/v1/users/${userId}`);
      setUserData(response.data);
      setVideos(response.data.videos);

      setIsOwnProfile(loggedInUserId === userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleThumbnailClick = (videoId) => {
    history.push(`/videos/${videoId}`);
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <div className="container mt-5">
      <div className="profile-header d-flex align-items-center mb-4 shadow p-4 rounded bg-light">
        <FaUserCircle size={100} className="text-primary" />
        <div className="ms-3">
          <h2 className="text-dark">{userData.username}</h2>
          <p className="text-muted">{userData.email}</p>
          <p><strong>Subscribers:</strong> {userData.subscribersCount}</p>
          <p><strong>Videos:</strong> {userData.videoCount}</p>

          {/* Show subscribe/unsubscribe button only if it's not the personal profile */}
          {!isOwnProfile && (
            <button
              className={`btn ${userData.subscribed ? 'btn-danger' : 'btn-primary'} mt-2`}
              onClick={() => history.push('/login')}
            >
              {userData.subscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>

      {/* Display video thumbnails */}
      <div className="mt-4">
        <h4 className="mb-3">Videos</h4>
        {videos.length === 0 ? (
          <div className="text-center">
            <h5>No videos available</h5>
          </div>
        ) : (
          <div className="row">
            {videos.map((video) => (
              <div
                key={video._id}
                className="col-md-4 mb-3"
                onClick={() => handleThumbnailClick(video._id)}
              >
                <VideoThumbnail
                  title={video.title}
                  uploader={userData.username}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
