import React from 'react'
import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import { store, persistor } from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App /> 
    </PersistGate>
  </Provider>,
)
