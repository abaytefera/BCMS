import { configureStore, combineReducers } from "@reduxjs/toolkit";
import webState from "./WebState.jsx";
import { 
  persistStore, 
  persistReducer, 
  createTransform, // Added this to filter the state
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { APi } from "./CenteralAPI.jsx";
import authReducer from "./auth.jsx";

// This transform ensures isloading is ALWAYS false when saving or loading
const authTransform = createTransform(
  // 1. When saving to localStorage (Inbound)
  (inboundState) => ({ ...inboundState, isloading: false }),
  // 2. When reading from localStorage (Outbound)
  (outboundState) => ({ ...outboundState, isloading: false }),
  // 3. Only apply this to the 'auth' slice
  { whitelist: ['auth'] }
);

const rootReducer = combineReducers({
  'webState': webState,
  'auth': authReducer,
  [APi.reducerPath]: APi.reducer
});

const persisConfig = { 
  key: 'root', 
  storage: storage.default ? storage.default : storage, 
  whitelist: ['webState', 'auth'],
  transforms: [authTransform] // Added the transform here
};

const presisReducer = persistReducer(persisConfig, rootReducer);

export const store = configureStore({
  reducer: presisReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(APi.middleware);
  }
});

export const persistor = persistStore(store);