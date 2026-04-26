const DEFAULT_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.1:8b";

function parseCommaSeparatedList(text, maxItems = 5) {
  if (!text) return [];
  return text
    .replace(/\n/g, ",")
    .split(",")
    .map((s) => s.replace(/^[-\s"']+|[-\s"']+$/g, "").trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

export function useOllamaMovieNames() {
  const baseUrl = process.env.REACT_APP_OLLAMA_URL || DEFAULT_BASE_URL;
  const model = process.env.REACT_APP_OLLAMA_MODEL || DEFAULT_MODEL;

  const getMovieNames = async (prompt) => {
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
    return parseCommaSeparatedList((json?.response || "").toString(), 5);
  };

  return { getMovieNames, model, baseUrl };
}

