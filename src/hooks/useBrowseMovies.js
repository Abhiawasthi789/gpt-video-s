import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../shared/constants";
import { setBrowseMovies } from "../store/slices/moviesSlice";
import { startLoading, stopLoading } from "../store/slices/uiSlice";

const MOVIE_CATEGORIES = [
  {
    stateKey: "nowPlayingMovies",
    endpoint: "https://api.themoviedb.org/3/movie/now_playing?page=1",
  },
  {
    stateKey: "popularMovies",
    endpoint: "https://api.themoviedb.org/3/movie/popular?page=1",
  },
  {
    stateKey: "topRatedMovies",
    endpoint: "https://api.themoviedb.org/3/movie/top_rated?page=1",
  },
  {
    stateKey: "upcomingMovies",
    endpoint: "https://api.themoviedb.org/3/movie/upcoming?page=1",
  },
  {
    stateKey: "horrorMovies",
    endpoint:
      "https://api.themoviedb.org/3/discover/movie?with_genres=27&sort_by=popularity.desc&page=1",
  },
];

const useBrowseMovies = () => {
  const dispatch = useDispatch();
  const movies = useSelector((store) => store.movies);

  useEffect(() => {
    const missingCategories = MOVIE_CATEGORIES.filter(
      (category) => !movies[category.stateKey]
    );

    if (!missingCategories.length) return;

    const fetchBrowseData = async () => {
      dispatch(startLoading());
      try {
        const results = await Promise.all(
          missingCategories.map(async ({ stateKey, endpoint }) => {
            const response = await fetch(endpoint, API_OPTIONS);
            const json = await response.json();
            return [stateKey, json.results || []];
          })
        );

        dispatch(setBrowseMovies(Object.fromEntries(results)));
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchBrowseData();
  }, [dispatch, movies]);
};

export default useBrowseMovies;
