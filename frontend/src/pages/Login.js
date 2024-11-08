import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authActions';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(credentials))
    };
    return (
        <div className='mt-5'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group mb-3'>
                    <labell>Email</labell>
                    <input type='email' name='email' className='form-control' onChange={handleChange}
                        value={credentials.email} required />
                </div>
                <div className='form-group mb-3'>
                    <labell>Password</labell>
                    <input type='password' name='password' className='form-control' onChange={handleChange}
                        value={credentials.password} required />
                </div>
                <button type='submit' className="btn btn-success">Login</button>
            </form>
        </div>
    )
}

export default Login;