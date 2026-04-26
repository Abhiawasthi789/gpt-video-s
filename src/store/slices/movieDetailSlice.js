import { createSlice } from "@reduxjs/toolkit";

const movieDetailSlice = createSlice({
  name: "movieDetail",
  initialState: {
    byId: {},
  },
  reducers: {
    setMovieDetailLoading: (state, action) => {
      const movieId = action.payload;
      state.byId[movieId] = {
        ...(state.byId[movieId] || {}),
        status: "loading",
        error: null,
      };
    },
    setMovieDetailSuccess: (state, action) => {
      const { movieId, data } = action.payload;
      state.byId[movieId] = {
        status: "succeeded",
        error: null,
        data,
      };
    },
    setMovieDetailError: (state, action) => {
      const { movieId, error } = action.payload;
      state.byId[movieId] = {
        ...(state.byId[movieId] || {}),
        status: "failed",
        error,
      };
    },
  },
});

export const {
  setMovieDetailLoading,
  setMovieDetailSuccess,
  setMovieDetailError,
} = movieDetailSlice.actions;

export default movieDetailSlice.reducer;
