import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

const initialState = {
    user: null,
    token: Cookies.get('token') || null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            Cookies.set('token', action.payload.token);
        },
        logout: (state, action) => {
            state.user = null;
            state.token = null;
            Cookies.remove('token');
        },
    },
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;