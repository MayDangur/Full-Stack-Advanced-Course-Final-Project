import { configureStore } from "@reduxjs/toolkit";
import taxRequestReducer from "./taxRequestSlice";

// Main Redux store for the application
export const store = configureStore({
  reducer: {
    // Manage tax requests through the tax request slice
    taxRequests: taxRequestReducer,
  },
});

// Type of the complete Redux state
export type RootState = ReturnType<
  typeof store.getState
>;

// Type used for dispatching Redux actions
export type AppDispatch = typeof store.dispatch;