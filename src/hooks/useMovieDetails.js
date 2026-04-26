import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../shared/constants";
import {
  setMovieDetailError,
  setMovieDetailLoading,
  setMovieDetailSuccess,
} from "../store/slices/movieDetailSlice";
import { startLoading, stopLoading } from "../store/slices/uiSlice";

const useMovieDetails = (movieId) => {
  const dispatch = useDispatch();
  const movieDetailEntry = useSelector((store) =>
    movieId ? store.movieDetail.byId[movieId] : null
  );

  useEffect(() => {
    if (!movieId || movieDetailEntry?.status === "succeeded") return;

    const getMovieDetails = async () => {
      dispatch(setMovieDetailLoading(movieId));
      dispatch(startLoading());

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,videos,images,recommendations,similar,watch/providers,release_dates`,
          API_OPTIONS
        );
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.status_message || "Failed to fetch movie details");
        }

        dispatch(setMovieDetailSuccess({ movieId, data: json }));
      } catch (error) {
        dispatch(
          setMovieDetailError({
            movieId,
            error: error.message || "Unable to load details",
          })
        );
      } finally {
        dispatch(stopLoading());
      }
    };

    getMovieDetails();
  }, [dispatch, movieId, movieDetailEntry?.status]);
};

export default useMovieDetails;
