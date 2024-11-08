import React from 'react';
import { FaHome, FaFire, FaHistory, FaClock, FaPlayCircle, FaLayerGroup } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar bg-dark">
            <ul className="list-group list-group-flush">
                <li className="list-group-item bg-dark text-white">
                    <FaHome /> Home
                </li>
                <li className="list-group-item bg-dark text-white">
                    <FaFire /> Trending
                </li>
                <li className="list-group-item bg-dark text-white">
                    <FaPlayCircle /> Subscriptions
                </li>
                <li className="list-group-item bg-dark text-white">
                    <FaLayerGroup /> Library
                </li>
                <li className="list-group-item bg-dark text-white">
                    <FaHistory /> History
                </li>
                <li className="list-group-item bg-dark text-white">
                    <FaClock /> Watch Later
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
