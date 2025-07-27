const initialState = {
    theme: 'light',
  };
  
const themeReducer = (state = initialState, action) => {
switch (action.type) {
    case "light":
    return {
        ...state,
        theme: 'light'
    };
    case "dark":
    return {
        ...state,
        theme: 'dark'
    };
    default:
    return state;
}
};
  
  export default themeReducer;
  