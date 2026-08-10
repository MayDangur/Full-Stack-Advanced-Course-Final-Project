import { createSlice } from "@reduxjs/toolkit";

// Structure of a tax request stored in Redux
interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

// Shape of the tax requests state
interface TaxRequestState {
  requests: TaxRequest[];
}

// Start with an empty list of requests
const initialState: TaxRequestState = {
  requests: [],
};

// Redux slice for managing tax requests
const taxRequestSlice = createSlice({
  name: "taxRequests",

  initialState,

  reducers: {
    // Replace the current list with the latest requests
    setRequests(state, action) {
      state.requests = action.payload;
    },

    // Clear the requests when they are no longer needed
    clearRequests(state) {
      state.requests = [];
    },
  },
});

// Export the actions for use in components
export const {
  setRequests,
  clearRequests,
} = taxRequestSlice.actions;

// Export the reducer for the Redux store
export default taxRequestSlice.reducer;