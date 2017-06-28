import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Demo from './Demo';
import registerServiceWorker from './registerServiceWorker';
import store from './configureStore'

ReactDOM.render(
  <Provider store={store}>
    <Demo />
  </Provider>,

  document.getElementById('demo')
);
registerServiceWorker();
