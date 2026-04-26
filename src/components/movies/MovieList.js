import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  return (
    <div className="px-6 py-2">
      <h1 className="py-4 text-lg text-white md:text-3xl">{title}</h1>
      <div className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory custom-scrollbar">
        <div className="flex gap-4">
          {movies?.map((movie) => (
            <MovieCard
              key={movie.id}
              movieId={movie.id}
              title={movie.title || movie.original_title}
              posterPath={movie.poster_path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;

