import React from 'react';
import { FaSearch, FaUpload, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const dispactch = useDispatch();
    const navigate = useNavigate()
    const { user, token } = useSelector((state) => state.user)

    const handleLogout = async () => {
        try {
            await axios.get('api/v1/user/logout', { withCredentials: true });
            dispactch(logout());

            navigate('/login')
        } catch (error) {
            console.log('Logout Error:', error)
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">

                <a className="navbar-brand" href="/">VidFloW</a>

                <div className="d-flex mx-auto">
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-secondary">
                        <FaSearch />
                    </button>
                </div>

                <div className="d-flex align-items-center">
                    {token && (
                        <button
                            className="btn btn-secondary mx-2"
                            onClick={() => navigate('/upload')}
                        >
                            <FaUpload /> Upload
                        </button>
                    )}

                    <div className="dropdown">
                        <FaUserCircle
                            size={30}
                            color="white"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ cursor: 'pointer' }}
                        />
                        <ul className="dropdown-menu dropdown-menu-end">
                            {token ? (
                                <>
                                    <li className="dropdown-item text-center">
                                        {user?.username || 'User'}
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate('/login')}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate('/register')}
                                    >
                                        Sign Up
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
