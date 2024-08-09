import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'
import themeReducer from './theme/themeSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({ //instead of having a lot of reducers, we can use a root reducer as a combination of all the reducers
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root', //key is the name being stored
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware( //if we don't use the middleware, we'll get an error
    {serializableCheck: false}
  ),
});

export const persistor = persistStore(store);