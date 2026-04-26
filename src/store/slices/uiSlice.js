import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    pendingRequests: 0,
    authChecked: false,
  },
  reducers: {
    startLoading: (state) => {
      state.pendingRequests += 1;
    },
    stopLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    setAuthChecked: (state, action) => {
      state.authChecked = Boolean(action.payload);
    },
  },
});

export const { startLoading, stopLoading, setAuthChecked } = uiSlice.actions;

export default uiSlice.reducer;
