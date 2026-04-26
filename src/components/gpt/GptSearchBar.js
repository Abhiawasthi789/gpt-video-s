import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../../shared/languageConstants";
import { addGptMovieResult, resetGptMovieResuts } from "../../store/slices/gptSlice";
import { startLoading, stopLoading } from "../../store/slices/uiSlice";
import { useOllamaMovieNames } from "../../hooks/useOllamaMovieNames";
import { useTmdbPromptRecommendations } from "../../hooks/useTmdbPromptRecommendations";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const [query, setQuery] = useState("");

  const AI_MODE = (process.env.REACT_APP_AI_MODE || "tmdb").toLowerCase();
  const { getMovieNames } = useOllamaMovieNames();
  const { searchMovie, recommendFromPrompt } = useTmdbPromptRecommendations();

  const handleClear = () => {
    setQuery("");
    if (searchText.current) searchText.current.value = "";
    dispatch(resetGptMovieResuts());
  };

  const handleGptSearchClick = async () => {
    dispatch(startLoading());
    try {
      const prompt = (searchText.current?.value || "").trim();
      if (!prompt) {
        dispatch(addGptMovieResult({ movieNames: null, movieResults: null }));
        return;
      }

      if (AI_MODE === "ollama") {
        let movieNames = [];
        try {
          movieNames = await getMovieNames(prompt);
        } catch (e) {
          movieNames = [prompt];
        }

        const movieResults = await Promise.all(
          movieNames.map((name) => searchMovie(name))
        );
        dispatch(addGptMovieResult({ movieNames, movieResults }));
        return;
      }

      const finalResults = await recommendFromPrompt(prompt);
      dispatch(
        addGptMovieResult({
          movieNames: [`Results for: ${prompt}`],
          movieResults: [finalResults],
        })
      );
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="pt-[35%] md:pt-[10%] flex justify-center">
      <form
        className="w-full md:w-1/2 bg-black flex flex-col md:grid md:grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="md:col-span-10 m-4 relative">
          <input
            ref={searchText}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 pr-12"
            placeholder={lang[langKey].gptSearchPlaceholder}
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-700/70 text-white hover:bg-zinc-600 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
        <button
          className="md:col-span-2 m-4 py-3 px-4 bg-red-700 text-white rounded-lg"
          type="button"
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
};
export default GptSearchBar;

