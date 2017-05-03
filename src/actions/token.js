import { AsyncStorage } from 'react-native';

const getToken = (onComplete: ?() => void) => {
  return (dispatch, getState) => {
    return AsyncStorage.getItem('token').then((value)=>{
      dispatch(Success(JSON.parse(value)));
      if (onComplete) onComplete();
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};

const setToken = (value) => {
  return (dispatch, getState) => {
    return AsyncStorage.setItem('token', JSON.stringify(value)).then(()=>{
      dispatch(Success(value));
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};


const removeToken = (value) => {
  return (dispatch, getState) => {
    return AsyncStorage.removeItem('token').then(()=>{
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
