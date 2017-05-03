import { AsyncStorage } from 'react-native';

const getToken = (onComplete: ?() => void) => {
  return async (dispatch, getState) => {
    let current_user;
    // AsyncStorage.clear();
    await AsyncStorage.getItem('current_user').then((cu) => {
      current_user = cu;
    });
    // console.log(current_user)
    if (current_user === null) {
      return dispatch(Success(null));
    } else {
      return AsyncStorage.getItem(current_user).then((value)=>{
        dispatch(Success(JSON.parse(value)));
        if (onComplete) onComplete();
      }).catch((error)=>{
        console.log('AsyncStorage error: ' + error.message);
        dispatch(Error(error));
      });
    }
  }
};

const setToken = (username, domain, value) => {
  return (dispatch, getState) => {
    AsyncStorage.setItem('current_user', `${username}@${domain}`);
    return AsyncStorage.setItem(`${username}@${domain}`, JSON.stringify(value)).then(()=>{
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
