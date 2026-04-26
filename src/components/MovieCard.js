import { IMG_CDN_URL } from "../shared/constants";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ posterPath, movieId, title }) => {
  const navigate = useNavigate();
  if (!posterPath) return null;

  return (
    <button
      className="w-36 shrink-0 text-left transition-transform duration-200 hover:scale-105 md:w-48"
      onClick={() => navigate(`/browse/movie/${movieId}`)}
      aria-label={`View details for ${title || "movie"}`}
    >
      <img className="block w-full" alt={title || "Movie Card"} src={IMG_CDN_URL + posterPath} />
    </button>
  );
};
export default MovieCard;
