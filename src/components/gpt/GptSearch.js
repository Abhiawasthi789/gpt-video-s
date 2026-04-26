import { BG_URL } from "../../shared/constants";
import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";

const GPTSearch = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <img className="w-full h-full object-cover" src={BG_URL} alt="bg" />
      </div>
      <div className="">
        <GptSearchBar />
        <GptMovieSuggestions />
      </div>
    </>
  );
};
export default GPTSearch;

