import { Provider } from 'react-redux';
import Body from './components/layout/Body';
import GlobalLoader from './components/common/GlobalLoader';
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
