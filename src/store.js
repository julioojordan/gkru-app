import { combineReducers, legacy_createStore as createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authReducers'
import roleReducer from './reducers/roleReducers'
import themeReducer from './reducers/themeReducers'
const initialState = {
  sidebarShow: true,
  theme: 'light',
}
//

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}
const persistConfig = {
  key: 'root', // Key untuk menyimpan state
  storage, // Storage yang digunakan, bisa diganti ke sessionStorage jika perlu
};

const rootReducer = combineReducers({
  app: changeState, // reducer existing Anda
  auth: authReducer, // reducer untuk autentikasi
  role: roleReducer,
  theme: themeReducer
});

//
const persistedReducer = persistReducer(persistConfig, rootReducer);

//
const store = createStore(persistedReducer);

//
const persistor = persistStore(store); 

export { store, persistor };
