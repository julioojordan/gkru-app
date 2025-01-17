const initialState = {
    role: '',
  };
  
const roleReducer = (state = initialState, action) => {
switch (action.type) {
    case "admin":
    return {
        ...state,
        role: 'admin'
    };
    case "ketuaLingkungan":
    return {
        ...state,
        role: 'ketuaLingkungan'
    };
    case "ketuaWilayah":
    return {
        ...state,
        role: 'ketuaWilayah'
    };
    default:
    return state;
}
};
  
  export default roleReducer;
  