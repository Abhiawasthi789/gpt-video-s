import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../shared/languageConstants";
import { API_OPTIONS } from "../shared/constants";
import { addGptMovieResult } from "../store/slices/gptSlice";
import { startLoading, stopLoading } from "../store/slices/uiSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const AI_MODE = (process.env.REACT_APP_AI_MODE || "tmdb").toLowerCase();

  const searchKeywordTMDB = async (prompt) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/keyword?query=" +
        encodeURIComponent(prompt) +
        "&page=1",
      API_OPTIONS
    );
    return await data.json();
  };

  const discoverMoviesTMDB = async (keywordIds) => {
    const keywordParam = keywordIds.length
      ? "&with_keywords=" + keywordIds.join(",")
      : "";
    const data = await fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=1" +
        keywordParam +
        "&sort_by=popularity.desc&vote_count.gte=200",
      API_OPTIONS
    );
    const json = await data.json();
    return json.results || [];
  };

  const getAiMovieNamesFromOllama = async (prompt) => {
    const model = process.env.REACT_APP_OLLAMA_MODEL || "llama3.1:8b";
    const baseUrl =
      process.env.REACT_APP_OLLAMA_URL || "http://localhost:11434";

    const res = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt:
          `Act as a movie recommendation system. Suggest 5 movies for this prompt: "${prompt}". ` +
          `Return ONLY the movie names, comma-separated. No numbering, no extra text.`,
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Ollama request failed");
    }

    const json = await res.json();
    const raw = (json?.response || "").toString();
    const movies = raw
      .replace(/\n/g, ",")
      .split(",")
      .map((s) => s.replace(/^[-\s"']+|[-\s"']+$/g, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    return movies;
  };

  // search movie in TMDB
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();

    return json.results;
  };

  const handleGptSearchClick = async () => {
    dispatch(startLoading());
    // const gptQuery =
    //   "Act as a Movie Recommendation system and suggest some movies for the query : " +
    //   searchText.current.value +
    //   ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

    // const gptResults = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: gptQuery }],
    //   model: "gpt-3.5-turbo",
    // });

    // if (!gptResults.choices) {
    // }

    // const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");
    try {
      const prompt = (searchText.current?.value || "").trim();
      if (!prompt) {
        dispatch(addGptMovieResult({ movieNames: null, movieResults: null }));
        return;
      }

      // Local demo: AI (Ollama) -> movie names -> TMDB search
      if (AI_MODE === "ollama") {
        let gptMovies = [];
        try {
          gptMovies = await getAiMovieNamesFromOllama(prompt);
        } catch (e) {
          // fallback so UI still works even if Ollama isn't running/CORS blocked
          gptMovies = [prompt];
        }

        const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
        const tmdbResults = await Promise.all(promiseArray);

        dispatch(
          addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
        );
        return;
      }

      // Production-safe: TMDB-only "prompt -> keywords -> discover" recommendations
      const keywordJson = await searchKeywordTMDB(prompt);
      const keywordIds = (keywordJson?.results || [])
        .slice(0, 5)
        .map((k) => k?.id)
        .filter(Boolean);

      const discoverResults = await discoverMoviesTMDB(keywordIds);
      const finalResults = discoverResults.length
        ? discoverResults
        : await searchMovieTMDB(prompt);

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
        className="w-full md:w-1/2 bg-black grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className=" p-4 m-4 col-span-9"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg"
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
};
export default GptSearchBar;
