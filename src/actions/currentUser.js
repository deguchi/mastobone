import { AsyncStorage } from 'react-native';

const getCurrentUser = (onComplete: ?() => void) => {
  return async (dispatch, getState) => {
    return AsyncStorage.getItem('current_user').then((value)=>{
      dispatch(Success(value));
      if (onComplete) onComplete();
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};

const setCurrentUser = (username, domain) => {
  return (dispatch, getState) => {
    const value = `${username}@${domain}`;
    return AsyncStorage.setItem('current_user', value).then(()=>{
      dispatch(Success(value));
    }).catch((error)=>{
      console.log('AsyncStorage error: ' + error.message);
      dispatch(Error(error));
    });
  }
};

const Success = (value) =>{
  return {
    type: 'CURRENT_USER_SUCCESS',
    value: value
  }
};

const Error = (error) => {
  return {
    type: 'CURRENT_USER_ERROR',
    code: error.code,
    message: error.message,
  }
};

module.exports = {
  getCurrentUser,
  setCurrentUser,
};
