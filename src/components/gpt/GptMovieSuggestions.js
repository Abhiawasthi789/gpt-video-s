import { useSelector } from "react-redux";
import MovieList from "../movies/MovieList";

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);
  if (!movieNames) return null;

  const hasAnyMovies =
    Array.isArray(movieResults) &&
    movieResults.some((list) => Array.isArray(list) && list.length > 0);

  return (
    <div className="p-4 m-4 bg-black text-white bg-opacity-90">
      {!hasAnyMovies ? (
        <div className="p-6 text-center text-white/80">
          No results found. Try a different prompt.
        </div>
      ) : (
        <div>
          {movieNames.map((movieName, index) => {
            const movies = movieResults?.[index] || [];
            if (!Array.isArray(movies) || movies.length === 0) return null;
            return <MovieList key={movieName} title={movieName} movies={movies} />;
          })}
        </div>
      )}
    </div>
  );
};
export default GptMovieSuggestions;

