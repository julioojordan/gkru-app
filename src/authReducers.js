const initialState = {
  isLoggedIn: false,
  authToken: null,
  id: null,
  username: null,
  ketuaLingkungan: null,
  ketuaWilayah: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        authToken: action.payload.authToken,
        id: action.payload.id,
        username: action.payload.username,
        ketuaLingkungan: action.payload.ketuaLingkungan,
        ketuaWilayah: action.payload.ketuaWilayah,
      };
      case "LOGOUT_SUCCESS":
        return {
          ...state,
          isLoggedIn: false,
          isLoggedIn: false,
          authToken: null,
          id: null,
          username: null,
          ketuaLingkungan: null,
          ketuaWilayah: null,
        };
      case "UPDATE_USER":
        return {
          ...state,
          username: action.payload.username,
          ketuaLingkungan: action.payload.ketuaLingkungan,
          ketuaWilayah: action.payload.ketuaWilayah,
        };
    default:
      return state;
  }
};

export default authReducer;
