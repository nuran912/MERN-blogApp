import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//below 2 imports are used for the redux toolkit
import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux'  //Provider is necessary to use store
import { PersistGate } from 'redux-persist/integration/react' //this is used to cover everything
import ThemeProvider from './Components/ThemeProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>  
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
