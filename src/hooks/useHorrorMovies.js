import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../shared/constants";
import { addHorrorMovies } from "../store/slices/moviesSlice";
import { startLoading, stopLoading } from "../store/slices/uiSlice";

const useHorrorMovies = () => {
  const dispatch = useDispatch();
  const horrorMovies = useSelector((store) => store.movies.horrorMovies);

  const getHorrorMovies = async () => {
    dispatch(startLoading());
    try {
      const data = await fetch(
        "https://api.themoviedb.org/3/discover/movie?with_genres=27&sort_by=popularity.desc&page=1",
        API_OPTIONS
      );
      const json = await data.json();
      dispatch(addHorrorMovies(json.results));
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    !horrorMovies && getHorrorMovies();
  }, []);
};

export default useHorrorMovies;
