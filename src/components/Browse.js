import Header from './Header'
import MainContainer from './MainContainer';
import SecondaryContainer from './SecondaryContainer';
import useBrowseMovies from '../hooks/useBrowseMovies';
import { useSelector } from 'react-redux';
import GPTSearch from './GptSearch';

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
  )
}

export default Browse