import { configureStore } from "@reduxjs/toolkit";
import taxRequestReducer from "./taxRequestSlice";

export const store = configureStore({
  reducer: {
    taxRequests: taxRequestReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;