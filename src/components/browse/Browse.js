import Header from "../layout/Header";
import MainContainer from "../movies/MainContainer";
import SecondaryContainer from "../movies/SecondaryContainer";
import useBrowseMovies from "../../hooks/useBrowseMovies";
import { useSelector } from "react-redux";
import GPTSearch from "../gpt/GptSearch";

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  useBrowseMovies();
  return (
    <div>
      <Header />
      {showGptSearch ? (
        <GPTSearch />
      ) : (
        <>
          <MainContainer />
          <SecondaryContainer />
        </>
      )}
    </div>
  );
};

export default Browse;

