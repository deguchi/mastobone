import api from './api.js';
import token from './token.js';
import currentUser from './currentUser.js';

module.exports = {
  ...api,
  ...token,
  ...currentUser,
};
