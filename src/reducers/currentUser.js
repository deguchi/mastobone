function currentUser(state = null, action) {
  // console.log(action);
  switch (action.type) {
    case 'CURRENT_USER_SUCCESS':
      return action.value;

    case 'CURRENT_USER_ERROR':
      alert(action.message);

    default:
      return state;
  }
}

export default currentUser;