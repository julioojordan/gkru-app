// actions.js
export const login = ({ authToken, id, username, ketuaLingkungan, ketuaWilayah }) => ({
  type: "LOGIN_SUCCESS",
  payload: { authToken, id, username, ketuaLingkungan, ketuaWilayah },
});

export const logout = () => ({
  type: "LOGOUT_SUCCESS",
});

export const updateUser = ({ username, ketuaLingkungan, ketuaWilayah }) => ({
  type: "UPDATE_USER",
  payload: { username, ketuaLingkungan, ketuaWilayah },
});

export const setRole = (role) => ({
  type: role,
});

export const setLocalTheme = (theme) => ({
  type: theme,
});

