import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";
import MovieList from "./MovieList";
import useMovieDetails from "../hooks/useMovieDetails";
import { IMG_CDN_URL } from "../shared/constants";

const formatRuntime = (runtime) => {
  if (!runtime) return "N/A";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  useMovieDetails(movieId);

  const entry = useSelector((store) => store.movieDetail.byId[movieId]);
  const movie = entry?.data;

  const trailer = useMemo(() => {
    const videos = movie?.videos?.results || [];
    return (
      videos.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
      videos.find((video) => video.site === "YouTube")
    );
  }, [movie]);

  const cast = movie?.credits?.cast?.slice(0, 12) || [];
  const crew = movie?.credits?.crew || [];
  const directors = crew
    .filter((member) => member.job === "Director")
    .map((member) => member.name)
    .join(", ");
  const writers = crew
    .filter((member) =>
      ["Writer", "Screenplay", "Story"].includes(member.job)
    )
    .slice(0, 5)
    .map((member) => member.name)
    .join(", ");

  const watchProviders = movie?.["watch/providers"]?.results?.IN;

  if (entry?.status === "failed") {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="px-6 pt-32 md:px-12">
          <button
            onClick={() => navigate(-1)}
            className="rounded bg-zinc-800 px-4 py-2 text-sm"
          >
            Back
          </button>
          <p className="mt-6 text-red-400">
            Failed to load movie details: {entry.error}
          </p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="relative h-[55vh] md:h-[72vh] w-full">
        {movie.backdrop_path && (
          <img
            className="h-full w-full object-cover opacity-60"
            src={IMG_CDN_URL + movie.backdrop_path}
            alt={movie.title}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-6 md:px-12 md:pb-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded bg-zinc-800/80 px-4 py-2 text-sm"
          >
            Back to Browse
          </button>
          <h1 className="text-3xl font-bold md:text-6xl">{movie.title}</h1>
          <p className="mt-2 text-sm text-zinc-300 md:text-base">
            {movie.tagline || "Discover more about this title"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs md:text-sm">
            <span className="rounded bg-zinc-800 px-3 py-1">
              {movie.release_date?.slice(0, 4) || "N/A"}
            </span>
            <span className="rounded bg-zinc-800 px-3 py-1">
              {formatRuntime(movie.runtime)}
            </span>
            <span className="rounded bg-zinc-800 px-3 py-1">
              {movie.vote_average?.toFixed(1)} IMDb
            </span>
            <span className="rounded bg-zinc-800 px-3 py-1">
              {movie.status || "Released"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3 md:px-12">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold md:text-2xl">Overview</h2>
          <p className="mt-3 leading-7 text-zinc-300">
            {movie.overview || "No overview available for this title."}
          </p>

          {trailer?.key && (
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold md:text-xl">Trailer</h3>
              <iframe
                className="aspect-video w-full rounded-lg"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Movie trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg bg-zinc-900/70 p-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Genres: </span>
            {movie.genres?.map((genre) => genre.name).join(", ") || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Original language: </span>
            {movie.original_language?.toUpperCase() || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Popularity: </span>
            {movie.popularity?.toFixed(1) || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Budget: </span>$
            {movie.budget?.toLocaleString() || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Revenue: </span>$
            {movie.revenue?.toLocaleString() || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Director(s): </span>
            {directors || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Writers: </span>
            {writers || "N/A"}
          </p>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-white">Available on: </span>
            {watchProviders?.flatrate?.map((provider) => provider.provider_name).join(", ") ||
              "Provider info unavailable"}
          </p>
        </div>
      </div>

      {cast.length > 0 && (
        <div className="px-6 pb-6 md:px-12">
          <h3 className="mb-4 text-xl font-semibold">Top Cast</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.map((member) => (
              <div key={member.cast_id || member.id} className="rounded bg-zinc-900 p-3">
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="mt-1 text-xs text-zinc-400">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black pb-8">
        {movie.recommendations?.results?.length > 0 && (
          <MovieList title="More Like This" movies={movie.recommendations.results} />
        )}
        {movie.similar?.results?.length > 0 && (
          <MovieList title="Similar Titles" movies={movie.similar.results} />
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
