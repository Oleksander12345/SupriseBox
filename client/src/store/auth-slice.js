import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {
            isLogged: false,
            name: '',
            email: '',
            role: '',
            token: '',
        },

    },
    reducers: {
        register(state, action) {
            state.user.name = action.payload.name;
            state.user.email = action.payload.email;
            state.user.role = action.payload.role;
        },
        login(state, action) {
            state.user.isLogged = true;
            state.user.name = action.payload.name;
            state.user.email = action.payload.email;
            state.user.role = action.payload.role;
            state.user.token = action.payload.token;
        },
        logout(state, action) {
            state.user.isLogged = false;
            state.user.name = "";
            state.user.email = "";
        },
        setIsLogged(state) {
            state.user.isLogged = true
        }
    }
})
export const authActions = authSlice.actions

export default authSlice