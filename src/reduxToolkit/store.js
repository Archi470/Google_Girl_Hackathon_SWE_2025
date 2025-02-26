import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice';  // Import the authReducer

export const store = configureStore({
    reducer: {
        user: authReducer,  // Use 'user' to store the authentication state
    }
});
