import { combineReducers } from 'redux';

import api from './api';
import token from './token';
import currentUser from './currentUser';

export default combineReducers({
  api,
  token,
  currentUser,
});
