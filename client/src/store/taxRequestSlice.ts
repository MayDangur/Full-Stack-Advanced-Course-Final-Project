import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
};

const taxRequestSlice = createSlice({
  name: "taxRequests",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
    },

    clearRequests(state) {
      state.requests = [];
    },
  },
});

export const {
  setRequests,
  clearRequests,
} = taxRequestSlice.actions;

export default taxRequestSlice.reducer;