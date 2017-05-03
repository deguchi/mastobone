import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';

import App from './App';

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;
// create store...
const store = compose(
  applyMiddleware(thunk)
)(createStore)(reducers);

if (isDebuggingInChrome) {
  window.store = store;
}

console.disableYellowBox = true;

export default class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}