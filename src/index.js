import 'normalize.css'

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './components/App';
import { Provider } from 'react-redux';
import Store, { history } from './store';
import registerServiceWorker from './registerServiceWorker';
import { ConnectedRouter } from 'react-router-redux'
import App from './components/App'

const StoreInstance = Store();

ReactDOM.render(
  <Provider store={StoreInstance}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker(); // AEZ does this still work with redux / react router?
