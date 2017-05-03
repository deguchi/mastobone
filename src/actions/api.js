import MastodonAPI from '../util/mastdon-api';

const initializeAPI = (domain, scopes, clientName) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: 'API_INITIALIZE',
      value: new MastodonAPI(domain, scopes, clientName),
    });
  }
};

module.exports = {
  initializeAPI,
};
