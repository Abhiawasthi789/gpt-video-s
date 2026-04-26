import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    pendingRequests: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.pendingRequests += 1;
    },
    stopLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
  },
});

export const { startLoading, stopLoading } = uiSlice.actions;

export default uiSlice.reducer;
