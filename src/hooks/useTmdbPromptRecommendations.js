import { API_OPTIONS } from "../shared/constants";

export function useTmdbPromptRecommendations() {
  const searchMovie = async (query) => {
    const res = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        encodeURIComponent(query) +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await res.json();
    return json.results || [];
  };

  const searchKeyword = async (prompt) => {
    const res = await fetch(
      "https://api.themoviedb.org/3/search/keyword?query=" +
        encodeURIComponent(prompt) +
        "&page=1",
      API_OPTIONS
    );
    return await res.json();
  };

  const discoverMoviesByKeywords = async (keywordIds) => {
    const keywordParam = keywordIds?.length
      ? "&with_keywords=" + keywordIds.join(",")
      : "";
    const res = await fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=1" +
        keywordParam +
        "&sort_by=popularity.desc&vote_count.gte=200",
      API_OPTIONS
    );
    const json = await res.json();
    return json.results || [];
  };

  const recommendFromPrompt = async (prompt) => {
    const keywordJson = await searchKeyword(prompt);
    const keywordIds = (keywordJson?.results || [])
      .slice(0, 5)
      .map((k) => k?.id)
      .filter(Boolean);

    const discoverResults = await discoverMoviesByKeywords(keywordIds);
    if (discoverResults.length) return discoverResults;
    return await searchMovie(prompt);
  };

  return { searchMovie, recommendFromPrompt };
}

