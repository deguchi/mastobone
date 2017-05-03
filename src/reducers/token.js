function token(state = null, action) {
  // console.log(action);
  switch (action.type) {
    case 'TOKEN_SUCCESS':
      return action.value;

    case 'TOKEN_ERROR':
      alert(action.message);

    default:
      return state;
  }
}

export default token;