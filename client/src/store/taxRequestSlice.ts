import { createSlice } from "@reduxjs/toolkit";

interface TaxRequest {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

interface TaxRequestState {
  requests: TaxRequest[];
  loading: boolean;
  error: string;
}

const initialState: TaxRequestState = {
  requests: [],
  loading: false,
  error: "",
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

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = "";
    },
  },
});

export const {
  setRequests,
  clearRequests,
  setLoading,
  setError,
  clearError,
} = taxRequestSlice.actions;

export default taxRequestSlice.reducer;