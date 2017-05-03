import { combineReducers } from 'redux';

import api from './api';
import token from './token';

export default combineReducers({
  api,
  token,
});
