import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import moviesReducer from "./slices/moviesSlice";
import gptReducer from "./slices/gptSlice";
import configReducer from "./slices/configSlice";
import uiReducer from "./slices/uiSlice";
import movieDetailReducer from "./slices/movieDetailSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    gpt: gptReducer,
    config: configReducer,
    ui: uiReducer,
    movieDetail: movieDetailReducer,
  },
});

export default appStore;
