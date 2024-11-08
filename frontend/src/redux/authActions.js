import axios from 'axios'
import { setUser } from './userSlice'

export const loginUser = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post('/api/v1/user/login', credentials, {
            withCredentials: true,
        });
        dispatch(setUser({ user: data.user, token: data.token }))
    } catch (error) {
        console.log("Login Error:", error)
    }
}

export const registerUser = (userDetails) => async (dispatch) => {
    try {
        const { data } = await axios.post('/api/v1/user/register', userDetails)
        dispatch(setUser({ user: data.user, token: data.token }))
    } catch (error) {
        console.log("Registration Error:", error)
    }
}