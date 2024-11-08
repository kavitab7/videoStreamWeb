import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const Register = () => {
    const [userDetails, setUserDetails] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setUser(userDetails))
    }
    return (
        <div className="mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Username</label>
                    <input type='text' name='username' onChange={handleChange} className='form-control'
                        value={userDetails.username} required />
                </div>
                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        value={userDetails.password}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;