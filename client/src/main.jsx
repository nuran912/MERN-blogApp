import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//below 2 imports are used for the redux toolkit
import { store } from './redux/store.js'
import { Provider } from 'react-redux'  //Provider is necessary to use store

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
