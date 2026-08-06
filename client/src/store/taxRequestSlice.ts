import { createSlice } from "@reduxjs/toolkit";

interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

interface TaxRequestState {
  requests: TaxRequest[];
}

const initialState: TaxRequestState = {
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