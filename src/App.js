import { Provider } from 'react-redux';
import Body from './components/Body';
import GlobalLoader from './components/GlobalLoader';
import appStore from './store';

function App() {
  return (
    <Provider store={appStore}>
      <Body />
      <GlobalLoader />
    </Provider>
  );
}

export default App;
