export default (state = null, action) => {
  // console.log(action);
  switch (action.type) {
    case 'API_INITIALIZE':
      return action.value;
    case 'API_INITIALIZE_ERROR':
      alert(action.message);
    default:
      return state;
  }
};
