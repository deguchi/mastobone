import { AsyncStorage } from 'react-native';

const getToken = () => {
  return async (dispatch, getState) => {
    const state = getState();
    return AsyncStorage.getItem(state.currentUser).then((value)=>{
      dispatch(Success(value));
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};

const setToken = (username, domain, value) => {
  return (dispatch, getState) => {
    const state = getState();
    return AsyncStorage.setItem(state.currentUser, value).then(()=>{
      dispatch(Success(value));
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};


const removeToken = (value) => {
  return async (dispatch, getState) => {
    const state = getState();
    return AsyncStorage.removeItem(state.currentUser).then(()=>{
      dispatch(Success(null));
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};

const Success = (value) =>{
  return {
    type: 'TOKEN_SUCCESS',
    value: value
  }
};

const Error = (error) => {
  return {
    type: 'TOKEN_ERROR',
    code: error.code,
    message: error.message,
  }
};

module.exports = {
  getToken,
  setToken,
  removeToken,
};
