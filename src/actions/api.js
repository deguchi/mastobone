import MastodonAPI from '../util/mastdon-api';

const initializeAPI = (baseUrl, scopes, clientName) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: 'API_INITIALIZE',
      value: new MastodonAPI(baseUrl, scopes, clientName),
    });
  }
};

module.exports = {
  initializeAPI,
};
