import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            // Handle both direct userData and wrapped payload
            const userData = action.payload.userData || action.payload;
            state.userData = {
                $id: userData.$id,
                name: userData.name,
                email: userData.email,
                $createdAt: userData.$createdAt,
                $updatedAt: userData.$updatedAt,
                status: userData.status,
                emailVerification: userData.emailVerification
            };
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;